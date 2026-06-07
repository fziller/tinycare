import type { SkPath } from '@shopify/react-native-skia';
import { Group, Path, RadialGradient, BlurMask, vec } from '@shopify/react-native-skia';

type Props = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  droop: number;
  sway: number;
  path: SkPath;
  veins?: SkPath;
  colors: string[];
  gradientCenter: { x: number; y: number };
  gradientR: number;
};

export function Leaf({ x, y, scale, rotation, droop, sway, path, veins, colors, gradientCenter, gradientR }: Props) {
  const totalAngle = rotation + droop + sway;
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Group transform={[{ scale }, { rotate: totalAngle }]} origin={vec(0, 0)}>
        <Path path={path} color="rgba(0,20,0,0.1)" transform={[{ translateX: 1.5 }, { translateY: 3 }]}>
          <BlurMask blur={4} style="normal" />
        </Path>
        <Path path={path} color={colors[0]}>
          <RadialGradient c={vec(gradientCenter.x, gradientCenter.y)} r={gradientR} colors={colors} />
        </Path>
        {veins && <Path path={veins} color="rgba(0,40,0,0.15)" style="stroke" strokeWidth={1} />}
      </Group>
    </Group>
  );
}
