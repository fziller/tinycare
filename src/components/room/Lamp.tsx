import { useEffect } from 'react';
import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';
import type { TimeOfDay } from './RoomScene.types';
import { TIME_PALETTES } from './timeOfDay';

type Props = {
  timeOfDay: TimeOfDay;
  comfort: number;
  height: number;
};

const LAMP_X = 40;
const LAMP_BASE_Y_OFFSET = 56;
const LAMP_POLE_H = 46;
const LAMP_SHADE_W = 20;
const LAMP_SHADE_H = 14;

export function Lamp({ timeOfDay, comfort, height }: Props) {
  const palette = TIME_PALETTES[timeOfDay];
  const baseY = height - LAMP_BASE_Y_OFFSET;
  const lampBrightness = useSharedValue(0);

  useEffect(() => {
    const target = palette.lampOn ? palette.lampIntensity * (0.7 + comfort / 300) : 0;
    lampBrightness.value = withTiming(target, { duration: 1200 });
  }, [palette.lampOn, palette.lampIntensity, comfort, lampBrightness]);

  const glowR = useDerivedValue(() => 30 + lampBrightness.value * 40, [lampBrightness]);
  const lightY = useDerivedValue(() => baseY - LAMP_POLE_H + LAMP_SHADE_H - 4, [baseY]);
  const glowColor = useDerivedValue(
    () => `rgba(255, 200, 120, ${lampBrightness.value.toFixed(4)})`,
    [lampBrightness],
  );

  return (
    <Group>
      <RoundedRect x={LAMP_X + 8} y={baseY} width={4} height={LAMP_POLE_H} r={2} color="#9B8065" />
      <RoundedRect
        x={LAMP_X + 2}
        y={baseY - LAMP_POLE_H}
        width={LAMP_SHADE_W}
        height={LAMP_SHADE_H}
        r={3}
        color="#E8D3BD"
      />
      <Circle cx={LAMP_X + LAMP_SHADE_W / 2} cy={lightY} r={glowR} color={glowColor} />
    </Group>
  );
}
