import { Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { EYE, LINE } from './petColors';

type Props = {
  cx: number;
  cy: SharedValue<number>;
  isOpen: boolean;
  xEyed: boolean;
  blinking?: boolean;
};

export function PetEye({ cx, cy, isOpen, xEyed, blinking }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: cx },
    { translateY: cy.value - 1.5 },
  ]);

  return (
    <Group transform={transform}>
      {xEyed ? (
        <>
          <Line p1={vec(-2, -0.5)} p2={vec(1, 1.5)} color={LINE} strokeWidth={1.5} />
          <Line p1={vec(-2, 1.5)} p2={vec(1, -0.5)} color={LINE} strokeWidth={1.5} />
        </>
      ) : isOpen ? (
        <>
          <Circle cx={0} cy={0} r={1.5} color={EYE} />
          {blinking && (
            <Line p1={vec(-2, 0)} p2={vec(2, 0)} color={LINE} strokeWidth={1.5} />
          )}
        </>
      ) : null}
    </Group>
  );
}
