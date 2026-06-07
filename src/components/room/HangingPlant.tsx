import { useMemo } from 'react';
import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  hydration: number;
  glow: number;
};

const HANG_X = 120;
const POT_TOP = 10;
const POT_W = 18;
const POT_H = 10;

const VINE_OFFSETS = [-5, 2, -3, 5, -1];

export function HangingPlant({ hydration, glow }: Props) {
  const hyd = useAnimatedNumeric(clampNeed(hydration) / 100, 1000);
  const growth = useAnimatedNumeric(glowTier(glow) / 3, 1500);

  const vineColor = hyd < 0.4 ? '#8B8B60' : hyd < 0.7 ? '#7BA060' : '#638E69';

  const leaves = useMemo(
    () => {
      const potBottom = POT_TOP + POT_H;
      return VINE_OFFSETS.map((dx, i) => {
        const vineLen = (12 + growth * 20) * (0.3 + hyd * 0.7);
        return {
          x: HANG_X + dx,
          y: potBottom + 4 + (i / VINE_OFFSETS.length) * vineLen,
          r: (3 - i * 0.4) * (0.5 + hyd * 0.5),
          opacity: hyd * (0.4 - i * 0.06),
        };
      });
    },
    [hyd, growth],
  );

  return (
    <Group>
      <RoundedRect x={HANG_X - 2} y={0} width={4} height={POT_TOP} r={2} color="#9B8065" />
      <RoundedRect x={HANG_X - POT_W / 2} y={POT_TOP} width={POT_W} height={POT_H} r={3} color="#9B8065" />
      <RoundedRect
        x={HANG_X - POT_W / 2 + 2}
        y={POT_TOP + 2}
        width={POT_W - 4}
        height={POT_H - 3}
        r={2}
        color="#7E6048"
      />
      {leaves.map((dot, i) => (
        <Circle
          key={`leaf-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={Math.max(0.5, dot.r)}
          color={vineColor}
        />
      ))}
    </Group>
  );
}
