import { useMemo } from 'react';
import { Group, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  bathroom: number;
  height: number;
};

const CARAFE_X = 148;
const CARAFE_BASE_Y_OFFSET = 44;
const CARAFE_W = 18;
const CARAFE_H = 28;

export function Carafe({ bathroom, height }: Props) {
  const baseY = height - CARAFE_BASE_Y_OFFSET;
  const fill = useAnimatedNumeric(100 - clampNeed(bathroom), 800);

  const liquidH = (fill / 100) * (CARAFE_H - 6);
  const liquidTop = baseY - CARAFE_H + 4 + (CARAFE_H - 6 - liquidH);

  const liquidColor = useMemo(() => {
    const f = fill;
    if (f < 20) return '#E8D8A0';
    if (f < 50) return '#D4C040';
    if (f < 80) return '#C0A820';
    return '#B89810';
  }, [fill]);

  return (
    <Group>
      <RoundedRect x={CARAFE_X} y={baseY - CARAFE_H} width={CARAFE_W} height={CARAFE_H} r={4} color="#E8E0D0" />
      <RoundedRect
        x={CARAFE_X + 5}
        y={baseY - CARAFE_H - 4}
        width={CARAFE_W - 10}
        height={6}
        r={2}
        color="#D8D0C0"
      />
      {fill > 2 && (
        <RoundedRect
          x={CARAFE_X + 3}
          y={liquidTop}
          width={CARAFE_W - 6}
          height={liquidH}
          r={2}
          color={liquidColor}
        />
      )}
    </Group>
  );
}
