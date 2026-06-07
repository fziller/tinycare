import { Circle, Group, Path, RadialGradient, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { buildMouthPath } from './petShapes';
import { NOSE } from './petColors';

const MOUTH_NEUTRAL = buildMouthPath('neutral');
const MOUTH_SMILE = buildMouthPath('smile');
const MOUTH_SAD = buildMouthPath('sad');

type Props = {
  x: number;
  y: SharedValue<number>;
  noseGlow: boolean;
};

export function PetNose({ x, y, noseGlow }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: y.value },
  ]);

  const r = noseGlow ? 3 : 2;

  return (
    <Group transform={transform}>
      <Circle cx={0} cy={0} r={r} color={NOSE}>
        <RadialGradient
          c={vec(0, 0)}
          r={r}
          colors={['rgba(255,220,220,0.6)', NOSE]}
        />
      </Circle>
      {noseGlow && (
        <Circle cx={0} cy={0} r={5} color="transparent">
          <RadialGradient
            c={vec(0, 0)}
            r={5}
            colors={['rgba(232,160,160,0.4)', 'transparent']}
          />
        </Circle>
      )}
    </Group>
  );
}

type MouthProps = {
  x: number;
  y: SharedValue<number>;
  state: SharedValue<number>;
};

export function PetMouth({ x, y, state }: MouthProps) {
  const path = useDerivedValue(() => {
    const s = Math.round(state.value);
    if (s >= 6) return MOUTH_SMILE;
    if (s <= 1) return MOUTH_SAD;
    return MOUTH_NEUTRAL;
  });

  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: y.value + 4 },
  ]);

  return (
    <Group transform={transform}>
      <Path path={path} color="#666" style="stroke" strokeWidth={1} />
    </Group>
  );
}
