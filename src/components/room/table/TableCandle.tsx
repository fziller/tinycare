import { Group, Path, RoundedRect, BlurMask, vec } from '@shopify/react-native-skia';
import { useReanimatedSway } from '../hooks/useReanimatedSway';
import { useDerivedValue } from 'react-native-reanimated';
import { FLAME_PATH } from './tableConfig';

type Props = {
  x: number;
  y: number;
  lit: boolean;
};

export function TableCandle({ x, y, lit }: Props) {
  return (
    <Group>
      <RoundedRect x={x - 4} y={y - 14} width={8} height={14} r={2} color="#F5E6C8" />
      <RoundedRect x={x - 3} y={y - 13} width={6} height={12} r={1.5} color="#F0E0C0" />
      {lit && <CandleFlame x={x} y={y - 14} />}
    </Group>
  );
}

function CandleFlame({ x, y }: { x: number; y: number }) {
  const flicker = useReanimatedSway(0, 2.5, 0.08);
  const drift = useReanimatedSway(1.2, 1.8, 0.04);

  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: y },
    { scaleX: 1 + drift.value },
    { scaleY: 1 + flicker.value },
  ]);

  return (
    <Group transform={transform} origin={vec(0, 0)}>
      <Path path={FLAME_PATH} color="rgba(255,180,50,0.3)">
        <BlurMask blur={5} style="normal" />
      </Path>
      <Path path={FLAME_PATH} color="#F3B35C" />
      <Path path={FLAME_PATH} color="rgba(255,255,200,0.5)" transform={[{ scale: 0.5 }]} origin={vec(0, -4)} />
    </Group>
  );
}
