import { useMemo } from 'react';
import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import type { TimeOfDay } from './RoomScene.types';
import { glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  timeOfDay: TimeOfDay;
  averageValue: number;
  glow: number;
  height: number;
};

const FRAME_X = 44;
const FRAME_Y_OFFSET = 76;
const FRAME_W = 86;
const FRAME_H = 44;

const SCENES: { colors: string[]; detail: { x: number; y: number; r: number; color: string }[] }[] = [
  {
    colors: ['#BFD8D1', '#E9B17F'],
    detail: [],
  },
  {
    colors: ['#A0C8D8', '#E8C060'],
    detail: [{ x: 80, y: 34, r: 6, color: '#F3B35C' }],
  },
  {
    colors: ['#88B878', '#D4A060'],
    detail: [
      { x: 80, y: 34, r: 6, color: '#F3B35C' },
      { x: 110, y: 40, r: 3, color: '#36AFA0' },
    ],
  },
  {
    colors: ['#6DAA72', '#E8C060'],
    detail: [
      { x: 80, y: 30, r: 8, color: '#F3B35C' },
      { x: 110, y: 38, r: 4, color: '#36AFA0' },
      { x: 92, y: 44, r: 3, color: '#E8795B' },
    ],
  },
];

export function PictureFrame({ timeOfDay: _tod, averageValue, glow, height }: Props) {
  const frameY = height - FRAME_Y_OFFSET;
  const sceneIndex = Math.min(
    Math.floor(useAnimatedNumeric(averageValue, 1000) / 25),
    SCENES.length - 1,
  );
  const tier = glowTier(glow);

  const frameColor = tier >= 2 ? '#D4A040' : tier >= 1 ? '#B8956A' : '#FFFFFFB8';

  const scene = useMemo(() => {
    const s = SCENES[Math.min(sceneIndex, SCENES.length - 1)];
    return s;
  }, [sceneIndex]);

  return (
    <Group>
      <RoundedRect x={FRAME_X} y={frameY} width={FRAME_W} height={FRAME_H} r={12} color={frameColor} />
      <RoundedRect
        x={FRAME_X + 6}
        y={frameY + 6}
        width={FRAME_W - 12}
        height={FRAME_H - 12}
        r={8}
        color={scene.colors[0]}
      />
      <RoundedRect
        x={FRAME_X + 6}
        y={frameY + FRAME_H - 14}
        width={FRAME_W - 12}
        height={8}
        r={4}
        color={scene.colors[1]}
      />
      {scene.detail.map((d, i) => (
        <Circle key={`detail-${i}`} cx={FRAME_X + d.x - FRAME_X} cy={frameY + d.y} r={d.r} color={d.color} />
      ))}
    </Group>
  );
}
