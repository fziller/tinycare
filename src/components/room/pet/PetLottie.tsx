import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { getPetTransitionClip, PET_HYSTERESIS_MS, PET_STATE_META, type PetState } from './petState';
import { PET_LOTTIE_ASSETS } from './petLottieAssets';

type Props = {
  targetState: PetState;
};

type ActiveClip =
  | { kind: 'loop'; state: PetState; clipId: keyof typeof PET_LOTTIE_ASSETS }
  | { kind: 'transition'; state: PetState; clipId: keyof typeof PET_LOTTIE_ASSETS };

export function PetLottie({ targetState }: Props) {
  const lottieRef = useRef<LottieView>(null);
  const [fade] = useState(() => new Animated.Value(1));
  const lastCommittedAt = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousStableState = useRef(targetState);

  const [stableState, setStableState] = useState<PetState>(targetState);
  const [activeClip, setActiveClip] = useState<ActiveClip>({
    kind: 'loop',
    state: targetState,
    clipId: PET_STATE_META[targetState].loopClipId,
  });

  useEffect(() => {
    lastCommittedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (targetState === stableState) return;

    const elapsed = Date.now() - lastCommittedAt.current;
    const remainingHold = Math.max(0, PET_STATE_META[stableState].minHoldMs - elapsed);
    const delay = Math.max(PET_HYSTERESIS_MS, remainingHold);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStableState(targetState);
      lastCommittedAt.current = Date.now();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [stableState, targetState]);

  useEffect(() => {
    const previous = previousStableState.current;
    const transitionClip = previous === stableState ? undefined : getPetTransitionClip(previous, stableState);

    if (transitionClip) {
      setActiveClip({
        kind: 'transition',
        state: stableState,
        clipId: transitionClip,
      });
    } else {
      fade.setValue(0);
      setActiveClip({
        kind: 'loop',
        state: stableState,
        clipId: PET_STATE_META[stableState].loopClipId,
      });

      Animated.timing(fade, {
        toValue: 1,
        duration: PET_STATE_META[stableState].fallbackCrossfadeMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }

    previousStableState.current = stableState;
  }, [fade, stableState]);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [activeClip]);

  const source = useMemo(() => PET_LOTTIE_ASSETS[activeClip.clipId], [activeClip.clipId]);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.shadow} />
      <LottieView
        ref={lottieRef}
        source={source}
        autoPlay
        loop={activeClip.kind === 'loop'}
        resizeMode="contain"
        style={styles.animation}
        onAnimationFinish={() => {
          if (activeClip.kind !== 'transition') return;
          fade.setValue(0);
          setActiveClip({
            kind: 'loop',
            state: activeClip.state,
            clipId: PET_STATE_META[activeClip.state].loopClipId,
          });

          Animated.timing(fade, {
            toValue: 1,
            duration: PET_STATE_META[activeClip.state].fallbackCrossfadeMs,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 12,
    width: '58%',
    height: '12%',
    borderRadius: 999,
    backgroundColor: 'rgba(38,52,47,0.10)',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
