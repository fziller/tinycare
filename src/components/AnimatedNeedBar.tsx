import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { Need } from '../domain/types';
import { colors, radii } from '../theme';

type Props = {
  need: Need;
  value: number;
  compact?: boolean;
};

export function AnimatedNeedBar({ need, value, compact = false }: Props) {
  const progress = useSharedValue(value);
  const glow = useSharedValue(value <= 40 ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value, {
      duration: 780,
      easing: Easing.out(Easing.cubic),
    });
    glow.value = withTiming(value <= 40 ? 1 : 0, { duration: 560 });
  }, [glow, progress, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    shadowOpacity: 0.18 + glow.value * 0.3,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + glow.value * 0.3,
    transform: [{ scaleX: 1 + glow.value * 0.018 }],
  }));

  return (
    <View style={[styles.wrap, compact && styles.compactWrap]}>
      <Animated.View style={[styles.pulse, { backgroundColor: need.visual.glow }, pulseStyle]} />
      <View style={[styles.track, { backgroundColor: need.visual.base }, compact && styles.compactTrack]}>
        <Animated.View style={[styles.fill, { backgroundColor: need.visual.fill, shadowColor: need.visual.glow }, fillStyle]} />
        <View style={styles.liquidHighlight} />
      </View>
      <Text style={styles.value}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 34,
    justifyContent: 'center',
  },
  compactWrap: {
    minHeight: 24,
  },
  pulse: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.md,
  },
  track: {
    height: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#FFFFFFAA',
    overflow: 'hidden',
  },
  compactTrack: {
    height: 12,
  },
  fill: {
    height: '100%',
    minWidth: 10,
    borderRadius: radii.md,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  liquidHighlight: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 3,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF55',
  },
  value: {
    position: 'absolute',
    right: 9,
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
  },
});
