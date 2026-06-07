import { useMemo } from 'react';
import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  fun: number;
  glow: number;
  height: number;
};

const TANK_X = 324;
const TANK_Y_OFFSET = 52;
const TANK_W = 22;
const TANK_H = 30;

const FISH_COLORS = ['#E8795B', '#F3B35C', '#36AFA0', '#559FC9', '#A060C0'];

const FISH_POSITIONS = [
  { dx: 8, dy: 12 },
  { dx: 12, dy: 18 },
  { dx: 6, dy: 22 },
  { dx: 14, dy: 14 },
  { dx: 10, dy: 20 },
];

const BUBBLE_POSITIONS = [
  { dx: 10, dy: 6 },
  { dx: 14, dy: 12 },
  { dx: 8, dy: 18 },
];

export function Aquarium({ fun, glow, height }: Props) {
  const tankY = height - TANK_Y_OFFSET - TANK_H;
  const funFactor = useAnimatedNumeric(clampNeed(fun) / 100, 800);
  const growth = useAnimatedNumeric(glowTier(glow) / 3, 1000);

  const fishCount = Math.min(Math.max(0, Math.floor(funFactor * 4 + growth * 2)), 5);

  const fish = useMemo(
    () =>
      FISH_POSITIONS.slice(0, fishCount).map((pos, i) => ({
        cx: TANK_X + pos.dx,
        cy: tankY + pos.dy,
        r: 3 - i * 0.3,
        color: FISH_COLORS[i % FISH_COLORS.length],
      })),
    [fishCount, tankY],
  );

  const showBubbles = funFactor > 0.5;

  return (
    <Group>
      <RoundedRect x={TANK_X} y={tankY} width={TANK_W} height={TANK_H} r={4} color="#D9E9F3" />
      <RoundedRect
        x={TANK_X + 2}
        y={tankY + 2}
        width={TANK_W - 4}
        height={TANK_H - 4}
        r={3}
        color="#B0D8E8"
      />
      {fish.map((f, i) => (
        <Circle key={`fish-${i}`} cx={f.cx} cy={f.cy} r={f.r} color={f.color} />
      ))}
      {showBubbles &&
        BUBBLE_POSITIONS.map((b, i) => (
          <Circle
            key={`bubble-${i}`}
            cx={TANK_X + b.dx}
            cy={tankY + b.dy}
            r={1.5 - i * 0.3}
            color="#FFFFFF99"
          />
        ))}
    </Group>
  );
}
