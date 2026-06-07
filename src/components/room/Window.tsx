import { useMemo } from 'react';
import { Group, Line, RoundedRect } from '@shopify/react-native-skia';
import type { TimeOfDay } from './RoomScene.types';
import { TIME_PALETTES } from './timeOfDay';
import { lowRemap, clampNeed } from './RoomScene.types';

type Props = {
  timeOfDay: TimeOfDay;
  hygiene: number;
};

const WINDOW_X = 242;
const WINDOW_Y = 24;
const WINDOW_W = 64;
const WINDOW_H = 52;

const RAIN_DROPS = [
  { x: 254, y: 34, len: 12 },
  { x: 263, y: 38, len: 16 },
  { x: 274, y: 36, len: 10 },
  { x: 284, y: 42, len: 14 },
  { x: 294, y: 40, len: 10 },
];

export function Window({ timeOfDay, hygiene }: Props) {
  const palette = TIME_PALETTES[timeOfDay];
  const isRainy = timeOfDay === 'night' || timeOfDay === 'lateNight';
  const smudgeFactor = lowRemap(clampNeed(hygiene));

  const raindrops = useMemo(
    () =>
      isRainy
        ? RAIN_DROPS.map((d, i) => ({
            x1: d.x,
            y1: d.y,
            x2: d.x,
            y2: d.y + d.len,
            opacity: (0.5 - i * 0.08).toFixed(3),
          }))
        : [],
    [isRainy],
  );

  return (
    <Group>
      <RoundedRect x={WINDOW_X} y={WINDOW_Y} width={WINDOW_W} height={WINDOW_H} r={10} color="#FFFFFF99" />
      <RoundedRect
        x={WINDOW_X + 10}
        y={WINDOW_Y + 9}
        width={WINDOW_W - 20}
        height={WINDOW_H - 18}
        r={8}
        color={palette.windowGlow}
      />
      <RoundedRect
        x={WINDOW_X + 10}
        y={WINDOW_Y + 9}
        width={WINDOW_W - 20}
        height={WINDOW_H - 18}
        r={8}
        color={`rgba(200, 200, 200, ${(smudgeFactor * 0.25).toFixed(3)})`}
      />
      {raindrops.map((d, i) => (
        <Line
          key={i}
          p1={{ x: d.x1, y: d.y1 }}
          p2={{ x: d.x2, y: d.y2 }}
          color={`rgba(180, 210, 240, ${d.opacity})`}
          strokeWidth={1}
        />
      ))}
    </Group>
  );
}
