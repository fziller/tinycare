import { Group, Path } from '@shopify/react-native-skia';
import { MUG_BODY_PATH, MUG_HANDLE_PATH } from './tableConfig';

type Props = {
  x: number;
  y: number;
};

export function TableMug({ x, y }: Props) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Path path={MUG_HANDLE_PATH} color="#E8E0D0" style="stroke" strokeWidth={2} />
      <Path path={MUG_BODY_PATH} color="#E8E0D0" />
      <Path path={MUG_BODY_PATH} color="rgba(0,0,0,0.05)" transform={[{ translateX: 1 }, { translateY: 1 }]} />
      <Path path={MUG_BODY_PATH} color="rgba(255,255,255,0.15)" transform={[{ translateX: -1 }, { translateY: -1 }]} />
    </Group>
  );
}
