import { useMemo } from 'react';
import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  hydration: number;
  glow: number;
  food: number;
  baseY: number;
};

const STEM_X = 202;
const STEM_W = 6;

const FOLIAGE: { dx: number; dy: number; baseR: number }[] = [
  { dx: -14, dy: 4, baseR: 14 },
  { dx: 14, dy: -6, baseR: 16 },
  { dx: 0, dy: -18, baseR: 13 },
];

const LEAF: { dy: number; len: number; angle: number }[] = [
  { dy: -10, len: 8, angle: -0.3 },
  { dy: -18, len: 10, angle: 0.25 },
  { dy: -26, len: 7, angle: -0.2 },
];

const FRUIT: { dx: number; dy: number; r: number; color: string }[] = [
  { dx: -8, dy: -10, r: 4, color: '#E8795B' },
  { dx: 10, dy: -14, r: 3, color: '#F3B35C' },
];

export function MainPlant({ hydration, glow, food, baseY }: Props) {
  const hyd = useAnimatedNumeric(clampNeed(hydration) / 100, 1000);
  const growth = useAnimatedNumeric(glowTier(glow) / 3, 1500);

  const stemHeight = 28 + Math.min(70, glow * 3.6) * (0.4 + hyd * 0.6);
  const stemTop = baseY - stemHeight;

  const stemColor = hyd < 0.4 ? '#8B7355' : hyd < 0.7 ? '#7BA060' : '#638E69';

  const foliageColor = hyd < 0.3 ? '#A08060' : hyd < 0.6 ? '#7BB680' : '#6DAA72';

  const hasFruit = glowTier(glow) >= 2 && clampNeed(food) > 60;

  const leaves = useMemo(
    () =>
      LEAF.map((l) => ({
        x: STEM_X + 3 + Math.sin(l.angle) * 2,
        y: stemTop + l.dy,
        len: l.len * (0.3 + hyd * 0.7),
      })),
    [stemTop, hyd],
  );

  const foliage = useMemo(
    () =>
      FOLIAGE.map((f, i) => ({
        cx: STEM_X + f.dx + (i - 1) * 1,
        cy: baseY - 62 + f.dy - stemHeight * (0.5 + i * 0.25),
        r: f.baseR * (0.5 + growth * 0.3) * (0.5 + hyd * 0.5),
      })),
    [baseY, stemHeight, growth, hyd],
  );

  return (
    <Group>
      <RoundedRect x={STEM_X} y={stemTop} width={STEM_W} height={stemHeight} r={STEM_W / 2} color={stemColor} />
      {leaves.map((leaf, i) => (
        <RoundedRect
          key={`leaf-${i}`}
          x={leaf.x}
          y={leaf.y}
          width={leaf.len}
          height={3}
          r={1.5}
          color={stemColor}
        />
      ))}
      {foliage.map((f, i) => (
        <Circle key={`foliage-${i}`} cx={f.cx} cy={f.cy} r={f.r} color={foliageColor} />
      ))}
      {hasFruit &&
        FRUIT.map((fruit, i) => (
          <Circle
            key={`fruit-${i}`}
            cx={STEM_X + fruit.dx}
            cy={baseY - 62 + fruit.dy - stemHeight * 0.6}
            r={fruit.r}
            color={fruit.color}
          />
        ))}
    </Group>
  );
}
