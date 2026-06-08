import { Circle, Group, Path } from '@shopify/react-native-skia';
import { BOWL_PATH, PELLET_LAYOUTS } from './tableConfig';

type Props = {
  x: number;
  y: number;
  pelletCount: number;
};

export function TableBowl({ x, y, pelletCount }: Props) {
  const pellets = PELLET_LAYOUTS[pelletCount] ?? [];

  return (
    <Group>
      <Group transform={[{ translateX: x }, { translateY: y }]}>
        <Path path={BOWL_PATH} color="#DCC4A8" />
        <Path path={BOWL_PATH} color="rgba(0,0,0,0.06)" transform={[{ translateX: 1 }, { translateY: 1 }]} />
      </Group>
      {pellets.map((p, i) => (
        <Circle key={`pellet-${i}`} cx={x + p.dx} cy={y + p.dy} r={p.r} color="#E8795B" />
      ))}
    </Group>
  );
}
