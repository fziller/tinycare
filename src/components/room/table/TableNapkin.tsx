import { Group, Path } from '@shopify/react-native-skia';
import { NAPKIN_PATH } from './tableConfig';

type Props = {
  x: number;
  y: number;
};

export function TableNapkin({ x, y }: Props) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Path path={NAPKIN_PATH} color="#FFFFFF" />
      <Path path={NAPKIN_PATH} color="rgba(0,0,0,0.04)" transform={[{ translateX: 1 }, { translateY: 1 }]} />
      <Path path={NAPKIN_PATH} color="#E8E0D0" style="stroke" strokeWidth={0.5} />
    </Group>
  );
}
