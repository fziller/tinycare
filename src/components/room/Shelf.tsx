import { useMemo } from 'react';
import { Circle, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  food: number;
  comfort: number;
  glow: number;
  width: number;
  height: number;
};

const SHELF_Y_OFFSET = 56;
const SHELF_H = 34;
const SHELF_X = 24;
const SHELF_W = 312;

const BOWL_X = 60;
const BOWL_Y_OFFSET = 20;
const BOWL_R = 12;

const PILLOW_X = 110;
const PILLOW_Y_OFFSET = 22;
const PILLOW_W = 28;
const PILLOW_H = 12;

const CANDLE_X = 300;
const CANDLE_Y_OFFSET = 24;
const CANDLE_W = 8;
const CANDLE_H = 14;

export function Shelf({ food, comfort, glow, width: _w, height }: Props) {
  const shelfY = height - SHELF_Y_OFFSET;
  const glowLvl = glowTier(glow);
  const foodFactor = useAnimatedNumeric(clampNeed(food) / 100, 800);
  const comfFactor = useAnimatedNumeric(clampNeed(comfort) / 100, 800);

  const bowlFill = useMemo(() => {
    const count = foodFactor > 0.7 ? 6 : foodFactor > 0.4 ? 3 : foodFactor > 0.1 ? 1 : 0;
    return Array.from({ length: count }, (_, i) => ({
      cx: BOWL_X - 4 + i * 3,
      cy: shelfY - BOWL_Y_OFFSET + 2 + (i % 2) * 2,
      r: 2.5,
      color: '#E8795B',
    }));
  }, [foodFactor, shelfY]);

  const showPillow = glowLvl >= 1 && comfFactor > 0.3;
  const pillowColor = comfFactor > 0.7 ? '#D4A574' : comfFactor > 0.3 ? '#C49564' : '#B48454';

  const showCandle = glowLvl >= 2;

  return (
    <>
      <RoundedRect x={SHELF_X} y={shelfY} width={SHELF_W} height={SHELF_H} r={12} color="#E8D3BD" />
      {glowLvl >= 0 && (
        <>
          <RoundedRect
            x={BOWL_X - BOWL_R}
            y={shelfY - BOWL_Y_OFFSET}
            width={BOWL_R * 2}
            height={BOWL_R}
            r={BOWL_R / 2}
            color="#DCC4A8"
          />
          {bowlFill.map((b, i) => (
            <Circle key={`bowl-${i}`} cx={b.cx} cy={b.cy} r={b.r} color={b.color} />
          ))}
        </>
      )}
      {showPillow && (
        <RoundedRect
          x={PILLOW_X}
          y={shelfY - PILLOW_Y_OFFSET}
          width={PILLOW_W}
          height={PILLOW_H}
          r={6}
          color={pillowColor}
        />
      )}
      {showCandle && (
        <>
          <RoundedRect
            x={CANDLE_X}
            y={shelfY - CANDLE_Y_OFFSET}
            width={CANDLE_W}
            height={CANDLE_H}
            r={2}
            color="#F5E6C8"
          />
          <Circle cx={CANDLE_X + CANDLE_W / 2} cy={shelfY - CANDLE_Y_OFFSET - 4} r={3} color="#F3B35C99" />
        </>
      )}
    </>
  );
}
