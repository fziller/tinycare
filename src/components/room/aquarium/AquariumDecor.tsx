import { Circle, Group, Path, RadialGradient, vec } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

type Props = {
  tankX: number;
  tankY: number;
  tankW: number;
  tankH: number;
  decor: {
    algaeColor: string;
    showSandyBottom: boolean;
    showPebbles: boolean;
    showCoral: boolean;
    showSeahorse: boolean;
    showBlooms: boolean;
    glowCoral: boolean;
  };
  algaePath: SkPath;
  coralPath: SkPath;
  seahorsePath: SkPath;
};

const PEBBLE_POSITIONS = [
  { dx: 10, dy: -2, r: 1.5 },
  { dx: 26, dy: -3, r: 1.2 },
  { dx: 46, dy: -1, r: 1.8 },
  { dx: 64, dy: -3, r: 1.2 },
  { dx: 80, dy: -2, r: 1 },
];

const BLOOM_POSITIONS = [
  { dx: -2, dy: -13 },
  { dx: 1, dy: -15 },
];

export function AquariumDecor({
  tankX, tankY, tankW, tankH, decor,
  algaePath, coralPath, seahorsePath,
}: Props) {
  const bottomY = tankY + tankH - 2;

  return (
    <Group>
      {decor.showSandyBottom && (
        <Group>
          <Circle cx={tankX + 8} cy={bottomY - 2} r={0.8} color="#D4C4A0" />
          <Circle cx={tankX + 22} cy={bottomY - 1} r={0.6} color="#D4C4A0" />
          <Circle cx={tankX + 44} cy={bottomY - 2} r={0.9} color="#D4C4A0" />
          <Circle cx={tankX + 62} cy={bottomY - 1} r={0.5} color="#D4C4A0" />
          <Circle cx={tankX + 80} cy={bottomY - 2} r={0.7} color="#D4C4A0" />
        </Group>
      )}

      {/* Algae left */}
      <Group transform={[{ translateX: tankX + 7 }, { translateY: bottomY }]}>
        <Path path={algaePath} color={decor.algaeColor} style="stroke" strokeWidth={1.2} />
        {decor.showBlooms && BLOOM_POSITIONS.map((b, i) => (
          <Circle key={`bloom-${i}`} cx={b.dx} cy={b.dy} r={1.2} color="#E8C0D0" />
        ))}
      </Group>

      {/* Algae center-left */}
      <Group transform={[{ translateX: tankX + 28 }, { translateY: bottomY }]}>
        <Path path={algaePath} color={decor.algaeColor} style="stroke" strokeWidth={1} />
      </Group>

      {/* Algae center-right */}
      <Group transform={[{ translateX: tankX + 54 }, { translateY: bottomY }]}>
        <Path path={algaePath} color={decor.algaeColor} style="stroke" strokeWidth={1} />
      </Group>

      {/* Algae right */}
      <Group transform={[{ translateX: tankX + tankW - 7 }, { translateY: bottomY }]}>
        <Path path={algaePath} color={decor.algaeColor} style="stroke" strokeWidth={1.2} />
        {decor.showBlooms && BLOOM_POSITIONS.map((b, i) => (
          <Circle key={`bloom-r-${i}`} cx={b.dx + 1} cy={b.dy + 1} r={1} color="#E8C0D0" />
        ))}
      </Group>

      {decor.showPebbles && PEBBLE_POSITIONS.map((p, i) => (
        <Circle key={`pebble-${i}`} cx={tankX + p.dx} cy={bottomY + p.dy} r={p.r} color="#B8A888" />
      ))}

      {decor.showCoral && (
        <Group transform={[{ translateX: tankX + tankW - 11 }, { translateY: bottomY }]}>
          <Path path={coralPath} color={decor.glowCoral ? '#FF6B8A' : '#D46880'} style="stroke" strokeWidth={1.5} />
          {decor.glowCoral && (
            <Path path={coralPath} color="rgba(255,100,130,0)">
              <RadialGradient c={vec(0, 0)} r={14} colors={['rgba(255,100,130,0.25)', 'transparent']} />
            </Path>
          )}
        </Group>
      )}

      {decor.showSeahorse && (
        <Group transform={[{ translateX: tankX + 14 }, { translateY: bottomY - 8 }]}>
          <Path path={seahorsePath} color="#E0A060" style="stroke" strokeWidth={1} />
        </Group>
      )}
    </Group>
  );
}
