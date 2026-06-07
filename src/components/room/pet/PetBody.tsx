import { Group, Path, RadialGradient, BlurMask, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { buildBodyPath } from './petShapes';
import { BODY } from './petColors';

const BODY_PATH = buildBodyPath();

type Props = {
  x: number;
  bodyCy: SharedValue<number>;
  bodyR: SharedValue<number>;
  bodyScaleY: SharedValue<number>;
  trembleX?: SharedValue<number>;
  trembleY?: SharedValue<number>;
  glowHighlight: boolean;
};

export function PetBody({ x, bodyCy, bodyR, bodyScaleY, trembleX, trembleY, glowHighlight }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: bodyCy.value },
    { scale: bodyR.value / 14 },
    { scaleY: bodyScaleY.value },
  ]);

  const tremor = useDerivedValue(() => [
    { translateX: trembleX?.value ?? 0 },
    { translateY: trembleY?.value ?? 0 },
  ]);

  return (
    <Group>
      <Group transform={tremor}>
        <Group transform={transform}>
          <Path path={BODY_PATH} color="rgba(0,0,0,0.08)" transform={[{ translateX: 2 }, { translateY: 3 }]}>
            <BlurMask blur={4} style="normal" />
          </Path>
          <Path path={BODY_PATH} color={BODY}>
            <RadialGradient
              c={vec(-3, -3)}
              r={16}
              colors={['rgba(255,235,215,0.4)', BODY, BODY]}
            />
          </Path>
          {glowHighlight && (
            <Path path={BODY_PATH} color="rgba(255,255,255,0)">
              <RadialGradient
                c={vec(-3, -5)}
                r={12}
                colors={['rgba(255,255,255,0.2)', 'transparent']}
              />
            </Path>
          )}
        </Group>
      </Group>
    </Group>
  );
}
