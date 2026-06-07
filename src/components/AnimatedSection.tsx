import type { ReactNode } from 'react';
import Animated, { useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { useMounted } from '../hooks/useMounted';

type Props = {
  children: ReactNode;
  delay?: number;
};

export function AnimatedSection({ children, delay = 0 }: Props) {
  const mounted = useMounted();

  const style = useAnimatedStyle(() => {
    const opacity = withDelay(delay, withTiming(mounted.value, { duration: 400 }));
    const translateY = withDelay(delay, withTiming((1 - mounted.value) * 16, { duration: 400 }));
    return { opacity, transform: [{ translateY }] };
  });

  return <Animated.View style={style}>{children}</Animated.View>;
}
