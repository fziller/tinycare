import { Circle, Group, Path, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { SkPath } from '@shopify/react-native-skia';

type Props = {
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  ampX: number;
  ampY: number;
  speed: number;
  phaseX: number;
  phaseY: number;
  clock: SharedValue<number>;
  fishPath: SkPath;
};

export function AquariumFish({
  baseX, baseY, size, color,
  ampX, ampY, speed, phaseX, phaseY,
  clock, fishPath,
}: Props) {
  const transform = useDerivedValue(() => {
    const t = clock.value * 0.002 * Math.max(0.3, speed);
    const dx = Math.sin(t + phaseX) * ampX;
    const dy = Math.sin(t * 0.7 + phaseY) * ampY;
    return [
      { translateX: baseX + dx },
      { translateY: baseY + dy },
      { scale: size },
    ];
  });

  const flip = useDerivedValue(() => {
    const t = clock.value * 0.002 * Math.max(0.3, speed);
    const dx = Math.sin(t + phaseX) * ampX;
    return dx;
  });

  return (
    <Group transform={transform} origin={vec(0, 0)}>
      {ampX > 0 && (
        <Group transform={[{ scaleX: flip.value < 0 ? -1 : 1 }]} origin={vec(5.5, 0)}>
          <Path path={fishPath} color={color} />
          <Circle cx={3} cy={-0.8} r={0.5} color="rgba(0,0,0,0.4)" />
        </Group>
      )}
      {ampX <= 0 && (
        <Group>
          <Path path={fishPath} color={color} />
          <Circle cx={3} cy={-0.8} r={0.5} color="rgba(0,0,0,0.4)" />
        </Group>
      )}
    </Group>
  );
}
