import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export function useMounted() {
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withTiming(1, { duration: 400 });
  }, [mounted]);

  return mounted;
}
