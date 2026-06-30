import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { AQUARIUM_LOTTIE_ASSETS } from './aquariumLottieAssets';
import { AQUARIUM_STATE_META, type AquariumState } from './aquariumState';

type Props = {
  targetState: AquariumState;
};

export function AquariumLottie({ targetState }: Props) {
  const lottieRef = useRef<LottieView>(null);
  const [fade] = useState(() => new Animated.Value(1));
  const [activeState, setActiveState] = useState<AquariumState>(targetState);

  useEffect(() => {
    if (targetState === activeState) return;

    fade.setValue(0);
    startTransition(() => {
      setActiveState(targetState);
    });

    Animated.timing(fade, {
      toValue: 1,
      duration: AQUARIUM_STATE_META[targetState].crossfadeMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeState, fade, targetState]);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [activeState]);

  const source = useMemo(() => AQUARIUM_LOTTIE_ASSETS[AQUARIUM_STATE_META[activeState].clipId], [activeState]);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <LottieView
        ref={lottieRef}
        source={source}
        autoPlay
        loop
        resizeMode="contain"
        style={styles.animation}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
