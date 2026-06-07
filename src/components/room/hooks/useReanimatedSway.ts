import { useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export function useReanimatedSway(
  phase: number,
  speed: number,
  amplitude = 0.12,
): SharedValue<number> {
  const clock = useClock();
  return useDerivedValue(() => {
    const freq = 0.003;
    return Math.sin(clock.value * freq * speed + phase) * amplitude;
  });
}

export function useReanimatedBob(
  speed: number,
  amplitude: number,
): SharedValue<number> {
  const clock = useClock();
  return useDerivedValue(() => {
    return Math.sin(clock.value * 0.003 * speed) * amplitude;
  });
}
