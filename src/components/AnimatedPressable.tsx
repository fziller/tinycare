import { useEffect, type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  breathe?: boolean;
  style?: any;
};

export function AnimatedPressable({ children, breathe = false, style, onPressIn, onPressOut, ...props }: Props) {
  const scale = useSharedValue(1);
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    if (breathe) {
      breatheScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 }),
        ),
        -1,
        true,
      );
    }
  }, [breathe, breatheScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * breatheScale.value }],
  }));

  return (
    <AnimatedPressableComponent
      onPressIn={(e) => {
        scale.value = withSpring(0.97);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1);
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
      {...props}
    >
      {children}
    </AnimatedPressableComponent>
  );
}
