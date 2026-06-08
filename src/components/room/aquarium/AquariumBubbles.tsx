import { Circle, Group } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

type BubbleDef = {
  dx: number;
  speed: number;
  r: number;
  phaseOffset: number;
};

const BUBBLES: BubbleDef[] = [
  { dx: 12, speed: 0.6, r: 1.2, phaseOffset: 0 },
  { dx: 30, speed: 0.8, r: 1, phaseOffset: 1.5 },
  { dx: 50, speed: 0.5, r: 0.8, phaseOffset: 3 },
  { dx: 68, speed: 0.9, r: 0.7, phaseOffset: 0.8 },
  { dx: 82, speed: 0.4, r: 0.9, phaseOffset: 2.2 },
];

type Props = {
  tankX: number;
  tankY: number;
  tankW: number;
  tankH: number;
  clock: SharedValue<number>;
  count: number;
};

export function AquariumBubbles({ tankX, tankY, tankW, tankH, clock, count }: Props) {
  const visible = BUBBLES.slice(0, count);

  return (
    <Group>
      {visible.map((b, i) => (
        <BubbleItem
          key={`bubble-${i}`}
          tankX={tankX}
          tankY={tankY}
          tankH={tankH}
          clock={clock}
          def={b}
        />
      ))}
    </Group>
  );
}

type BubbleItemProps = {
  tankX: number;
  tankY: number;
  tankH: number;
  clock: SharedValue<number>;
  def: BubbleDef;
};

function BubbleItem({ tankX, tankY, tankH, clock, def }: BubbleItemProps) {
  const cy = useDerivedValue(() => {
    const cycleMs = 4000 / def.speed;
    const t = ((clock.value * 0.5 + def.phaseOffset * 1000) % cycleMs) / cycleMs;
    return tankY + tankH - 4 - (t * (tankH - 6));
  });

  return (
    <Circle
      cx={tankX + def.dx}
      cy={cy}
      r={def.r}
      color="rgba(255,255,255,0.5)"
    />
  );
}
