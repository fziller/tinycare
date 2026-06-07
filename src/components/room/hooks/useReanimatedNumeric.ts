import { useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';

export function useReanimatedNumeric(
  value: number,
  duration = 600,
): SharedValue<number> {
  const sv = useSharedValue(value);

  useEffect(() => {
    sv.value = withTiming(value, { duration });
  }, [value, duration, sv]);

  return sv;
}
