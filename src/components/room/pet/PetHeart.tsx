import { Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { HEART_PATH } from './petShapes';
import { HEART } from './petColors';

type Props = {
  x: number;
  bodyCy: SharedValue<number>;
  bodyR: SharedValue<number>;
  heartFloat: SharedValue<number>;
  heartDrift: SharedValue<number>;
};

export function PetHeart({ x, bodyCy, bodyR, heartFloat, heartDrift }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: x + 12 + heartDrift.value },
    { translateY: bodyCy.value - bodyR.value - 12 + heartFloat.value },
    { scale: 0.27 },
  ]);

  return (
    <Group transform={transform}>
      <Path path={HEART_PATH} color={HEART} style="fill" />
    </Group>
  );
}
