import { Group, Path } from '@shopify/react-native-skia';
import { POT_PATH, LEAF_PATH } from './tableConfig';

type Props = {
  x: number;
  y: number;
};

export function TablePlant({ x, y }: Props) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Group transform={[{ translateY: -8 }]}>
        <Path path={LEAF_PATH} color="#7BA060" transform={[{ rotate: -0.4 }, { translateX: -2 }]} />
        <Path path={LEAF_PATH} color="#5D8A5A" transform={[{ rotate: 0.5 }, { translateX: 3 }, { scaleX: -1 }]} origin={{ x: 0, y: 0 }} />
        <Path path={LEAF_PATH} color="#93BD98" transform={[{ scale: 0.7 }, { translateX: 0 }, { rotate: -2 }]} origin={{ x: 0, y: 0 }} />
      </Group>
      <Path path={POT_PATH} color="#B08050" />
      <Path path={POT_PATH} color="rgba(0,0,0,0.08)" transform={[{ translateX: 1 }, { translateY: 1 }]} />
    </Group>
  );
}
