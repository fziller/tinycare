import type { SkPath } from '@shopify/react-native-skia';
import { Path } from '@shopify/react-native-skia';

type Props = {
  path: SkPath;
  color: string;
};

export function Stem({ path, color }: Props) {
  return <Path path={path} color={color} style="stroke" strokeWidth={4} strokeCap="round" />;
}
