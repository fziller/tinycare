import { useMemo } from 'react';
import { Circle, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, lowRemap } from './RoomScene.types';

type Props = {
  hygiene: number;
  width: number;
  height: number;
};

const FLOOR_Y_OFFSET = 5;

const STAIN_CONFIG = [
  { cx: 60, cy: 0, baseR: 3, weight: 0.35 },
  { cx: 108, cy: 1, baseR: 2, weight: 0.30 },
  { cx: 156, cy: 0, baseR: 4, weight: 0.25 },
  { cx: 204, cy: 2, baseR: 2, weight: 0.20 },
  { cx: 252, cy: 0, baseR: 3, weight: 0.15 },
  { cx: 300, cy: 1, baseR: 2, weight: 0.10 },
];

export function Floor({ hygiene, width, height }: Props) {
  const floorY = height - FLOOR_Y_OFFSET;
  const intensity = lowRemap(clampNeed(hygiene));

  const stains = useMemo(
    () =>
      STAIN_CONFIG.map((s) => ({
        cx: s.cx,
        cy: floorY + s.cy,
        r: s.baseR + intensity * 5,
        opacity: intensity * s.weight,
      })),
    [intensity, floorY],
  );

  return (
    <>
      <RoundedRect x={24} y={floorY} width={width - 48} height={FLOOR_Y_OFFSET} r={4} color="#E8D3BD" />
      {stains.map((s, i) => (
        <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} color={`rgba(139, 115, 85, ${s.opacity.toFixed(3)})`} />
      ))}
    </>
  );
}
