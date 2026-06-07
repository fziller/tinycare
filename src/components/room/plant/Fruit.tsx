import { Group, Path, RadialGradient, vec } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

type Props = {
  fruits: { dx: number; dy: number; path: SkPath; color: string; r: number }[];
  stemX: number;
  stemTop: number;
};

export function Fruit({ fruits, stemX, stemTop }: Props) {
  return (
    <>
      {fruits.map((f, i) => (
        <Group key={i} transform={[{ translateX: stemX + f.dx }, { translateY: stemTop + 10 + f.dy }]}>
          <Path path={f.path} color={f.color}>
            <RadialGradient c={vec(-0.3 * f.r, -0.3 * f.r)} r={f.r * 1.5} colors={['rgba(255,255,255,0.35)', f.color]} />
          </Path>
        </Group>
      ))}
    </>
  );
}
