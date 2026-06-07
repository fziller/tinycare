import { useMemo } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import { glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  glow: number;
  movement: number;
};

const PARTICLE_COLORS = ['#F3B35C', '#E8795B', '#36AFA0', '#F3E05C', '#A0C8E8'];

const FIXED_POSITIONS = [
  { cx: 60, cy: 50 },
  { cx: 90, cy: 70 },
  { cx: 130, cy: 45 },
  { cx: 160, cy: 80 },
  { cx: 200, cy: 55 },
  { cx: 240, cy: 75 },
  { cx: 280, cy: 50 },
  { cx: 80, cy: 90 },
  { cx: 170, cy: 65 },
  { cx: 310, cy: 85 },
];

export function Particles({ glow, movement }: Props) {
  const density = glowTier(glow);
  const moveFactor = useAnimatedNumeric(movement / 100, 500);

  const activeCount = density * 3 + Math.floor(moveFactor * 2);
  const rScale = 0.5 + moveFactor * 0.5;

  const visible = useMemo(
    () =>
      FIXED_POSITIONS.slice(0, Math.min(activeCount, FIXED_POSITIONS.length)).map((p, i) => ({
        cx: p.cx,
        cy: p.cy,
        r: (2 + (i % 3) * 1.5) * rScale,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length] + '99',
      })),
    [activeCount, rScale],
  );

  return (
    <Group>
      {visible.map((p, i) => (
        <Circle key={`p-${i}`} cx={p.cx} cy={p.cy} r={p.r} color={p.color} />
      ))}
    </Group>
  );
}
