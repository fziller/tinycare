import { useEffect } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';
import type { TimeOfDay } from './RoomScene.types';
import { TIME_PALETTES } from './timeOfDay';

type Props = {
  timeOfDay: TimeOfDay;
  energy: number;
};

const SUN_BASE_X = 290;
const SUN_BASE_Y = 38;

export function Sun({ timeOfDay, energy }: Props) {
  const palette = TIME_PALETTES[timeOfDay];
  const energyFactor = useSharedValue(1);

  useEffect(() => {
    energyFactor.value = withTiming(Math.max(0.3, energy / 100), { duration: 800 });
  }, [energy, energyFactor]);

  const r = useDerivedValue(() => {
    const base = palette.ambientBrightness > 0.3 ? palette.sunRadius : 20;
    return base * (0.6 + energyFactor.value * 0.4);
  }, [palette, energyFactor]);

  const opacity = useDerivedValue(() =>
    Math.max(0.05, palette.ambientBrightness * energyFactor.value),
  [palette, energyFactor]);

  const glowR = useDerivedValue(() => r.value * 2.5, [r]);
  const glowColor = useDerivedValue(() => `rgba(243, 179, 92, ${(opacity.value * 0.12).toFixed(4)})`, [opacity]);
  const bodyColor = useDerivedValue(() => `rgba(243, 179, 92, ${opacity.value.toFixed(4)})`, [opacity]);

  const moonGlowColor = useDerivedValue(() => `rgba(200, 200, 240, ${(opacity.value * 0.08).toFixed(4)})`, [opacity]);
  const moonColor = useDerivedValue(() => `rgba(220, 220, 240, ${opacity.value.toFixed(4)})`, [opacity]);

  const crescentR = useDerivedValue(() => r.value * 0.85, [r]);

  const isMoon = timeOfDay === 'night' || timeOfDay === 'lateNight';

  return (
    <Group>
      {isMoon ? (
        <>
          <Circle cx={SUN_BASE_X} cy={SUN_BASE_Y} r={glowR} color={moonGlowColor} />
          <Circle cx={SUN_BASE_X} cy={SUN_BASE_Y} r={r} color={moonColor} />
          <Circle cx={SUN_BASE_X - 4} cy={SUN_BASE_Y - 2} r={crescentR} color="#1A1A2A" />
        </>
      ) : (
        <>
          <Circle cx={SUN_BASE_X} cy={SUN_BASE_Y} r={glowR} color={glowColor} />
          <Circle cx={SUN_BASE_X} cy={SUN_BASE_Y} r={r} color={bodyColor} />
        </>
      )}
    </Group>
  );
}
