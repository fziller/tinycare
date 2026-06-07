import { Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { buildEarPath } from './petShapes';
import { EAR } from './petColors';

const EAR_PATH = buildEarPath();

type Props = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  scale: SharedValue<number>;
  rotate: SharedValue<number>;
};

export function PetEar({ x, y, scale, rotate }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: x.value },
    { translateY: y.value },
    { rotate: rotate.value },
    { scale: scale.value },
  ]);

  return (
    <Group transform={transform}>
      <Path path={EAR_PATH} color={EAR} />
    </Group>
  );
}

export function useEarTransform(
  baseX: number,
  earTop: SharedValue<number>,
  earScale: SharedValue<number>,
  earAngle: SharedValue<number>,
  offsetX: number,
) {
  const x = useDerivedValue(() => baseX + offsetX * earScale.value);
  const y = useDerivedValue(() => earTop.value);
  const scale = useDerivedValue(() => earScale.value * 0.6);
  const rotate = useDerivedValue(() => earAngle.value);
  return { x, y, scale, rotate };
}
