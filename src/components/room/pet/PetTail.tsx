import { Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { TAIL_PATH } from './petShapes';
import { EAR } from './petColors';

type Props = {
  baseX: number;
  bodyCy: SharedValue<number>;
  bodyR: SharedValue<number>;
  wagAngle: SharedValue<number>;
};

export function PetTail({ baseX, bodyCy, bodyR, wagAngle }: Props) {
  const transform = useDerivedValue(() => [
    { translateX: baseX - bodyR.value - 2 },
    { translateY: bodyCy.value + 2 },
    { rotate: wagAngle.value },
  ]);

  return (
    <Group transform={transform}>
      <Path path={TAIL_PATH} color={EAR} style="stroke" strokeWidth={2.5} />
    </Group>
  );
}
