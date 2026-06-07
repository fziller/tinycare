import type { SkPath } from '@shopify/react-native-skia';
import { Group, Path, RadialGradient, BlurMask, vec, Circle } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

type Props = {
  pos: SharedValue<{ x: number; y: number }>;
  rotation: SharedValue<number>;
  scale: number;
  path: SkPath;
  veins?: SkPath;
  colors: string[];
  showDew?: boolean;
  showBloom?: boolean;
  bloomPath?: SkPath;
  glowHighlight?: boolean;
};

const DEW_SPOTS = [
  { x: -4, y: -8, r: 1.2 },
  { x: 5, y: -14, r: 1 },
  { x: -3, y: -22, r: 0.8 },
];

export function HangingLeaf({
  pos, rotation, scale, path, veins, colors,
  showDew, showBloom, bloomPath, glowHighlight,
}: Props) {
  const transform = useDerivedValue(() => [
    { translateX: pos.value.x },
    { translateY: pos.value.y },
    { scale },
    { rotate: rotation.value },
  ]);

  return (
    <Group transform={transform} origin={vec(0, 0)}>
      <Path path={path} color="rgba(0,20,0,0.1)" transform={[{ translateX: 1.5 }, { translateY: 3 }]}>
        <BlurMask blur={4} style="normal" />
      </Path>
      <Path path={path} color={colors[0]}>
        <RadialGradient c={vec(-4, -8)} r={24} colors={colors} />
      </Path>
      {veins && <Path path={veins} color="rgba(0,40,0,0.15)" style="stroke" strokeWidth={1} />}
      {showDew && DEW_SPOTS.map((d, i) => (
        <Circle key={`dew-${i}`} cx={d.x} cy={d.y} r={d.r} color="rgba(180,220,255,0.5)" />
      ))}
      {showBloom && bloomPath && (
        <Group transform={[{ translateX: 0 }, { translateY: -scale * 22 }]}>
          <Path path={bloomPath} color="#E8A0B0" />
          <Path path={bloomPath} color="rgba(255,200,210,0.5)" transform={[{ scale: 0.6 }]} origin={vec(0, 0)} />
        </Group>
      )}
      {glowHighlight && (
        <Path path={path} color="rgba(255,255,255,0)">
          <RadialGradient c={vec(-3, -10)} r={16} colors={['rgba(255,255,255,0.15)', 'transparent']} />
        </Path>
      )}
    </Group>
  );
}
