import { Group, Rect, vec, LinearGradient } from '@shopify/react-native-skia';

type Props = {
  tankX: number;
  tankY: number;
  tankW: number;
  tankH: number;
  showReflection: boolean;
  showGold: boolean;
};

export function AquariumReflection({ tankX, tankY, tankW, tankH, showReflection, showGold }: Props) {
  if (!showReflection && !showGold) return null;

  return (
    <Group>
      {showReflection && (
        <Rect x={tankX + 3} y={tankY + 3} width={tankW - 6} height={tankH * 0.3}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, tankH * 0.3)}
            colors={['rgba(255,255,255,0.2)', 'transparent']}
          />
        </Rect>
      )}
      {showGold && (
        <Rect x={tankX + 3} y={tankY + tankH * 0.1} width={tankW - 6} height={tankH * 0.15}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(tankW - 6, 0)}
            colors={['transparent', 'rgba(255,215,0,0.15)', 'transparent']}
          />
        </Rect>
      )}
    </Group>
  );
}
