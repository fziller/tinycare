import { Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { PAW_PATH } from './petShapes';
import { EAR } from './petColors';

type Props = {
  x: SharedValue<number>;
  bodyCy: SharedValue<number>;
  bodyR: SharedValue<number>;
};

export function PetPaw({ x, bodyCy, bodyR }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: x.value },
    { translateY: bodyCy.value + bodyR.value * 0.85 },
    { scale: bodyR.value * 0.0625 },
  ]);

  return (
    <Group transform={transform}>
      <Path path={PAW_PATH} color={EAR} />
    </Group>
  );
}
