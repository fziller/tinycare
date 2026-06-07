import { useMemo } from 'react';
import { Group } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { clampNeed } from '../RoomScene.types';
import { useReanimatedNumeric } from '../hooks/useReanimatedNumeric';
import { useReanimatedSway } from '../hooks/useReanimatedSway';
import { getLeafPaths } from '../plant/leafShapes';
import { getHangingState, getHangingConfig, leafPosition, leafAngle, BLOOM_PATH } from './hangingConfig';
import type { LeafPlacement } from './hangingConfig';
import { HangingPot, HANG_X, POT_TOP, POT_H } from './HangingPot';
import { HangingVine } from './HangingVine';
import { HangingLeaf } from './HangingLeaf';

type Props = {
  hydration: number;
  glow: number;
};

export function HangingPlant({ hydration, glow }: Props) {
  const hyd = clampNeed(hydration);
  const g = clampNeed(glow);
  const state = getHangingState(g, hyd);
  const config = getHangingConfig(state);

  const vineLength = useReanimatedNumeric(config.vineLength, 1200);

  const leaves = useMemo(() => {
    return config.leafLayout.map((pl: LeafPlacement) => {
      const scale = pl.size;
      const { leaf: path, veins } = getLeafPaths(pl.tier, scale);
      return { cfg: pl, path, veins, scale };
    });
  }, [config.leafLayout]);

  return (
    <Group>
      <HangingPot />
      <HangingVine vineLength={vineLength} />
      {leaves.map((l, i) => (
        <LeafInstance
          key={`hl-${i}`}
          cfg={l.cfg}
          path={l.path}
          veins={l.veins}
          scale={l.scale}
          vineLength={vineLength}
          leafColors={config.leafColors}
          showDew={config.showDew}
          showBloom={config.showBloom}
          glowHighlight={config.glowHighlight}
          swayAmplitude={config.swayAmplitude}
        />
      ))}
    </Group>
  );
}

type LeafInstanceProps = {
  cfg: LeafPlacement;
  path: import('@shopify/react-native-skia').SkPath;
  veins?: import('@shopify/react-native-skia').SkPath;
  scale: number;
  vineLength: import('react-native-reanimated').SharedValue<number>;
  leafColors: [string, string];
  showDew: boolean;
  showBloom: boolean;
  glowHighlight: boolean;
  swayAmplitude: number;
};

function LeafInstance({
  cfg, path, veins, scale, vineLength, leafColors,
  showDew, showBloom, glowHighlight, swayAmplitude,
}: LeafInstanceProps) {
  const potBottom = POT_TOP + POT_H;
  const sway = useReanimatedSway(cfg.swayPhase, 1, swayAmplitude);
  const pos = useDerivedValue(() => {
    const rel = leafPosition(cfg.t, vineLength.value);
    return { x: HANG_X + rel.x, y: potBottom + rel.y };
  });
  const rotation = useDerivedValue(() => leafAngle(cfg.t, vineLength.value, cfg.side, sway.value));

  return (
    <HangingLeaf
      pos={pos}
      rotation={rotation}
      scale={scale}
      path={path}
      veins={veins}
      colors={leafColors}
      showDew={showDew}
      showBloom={showBloom}
      bloomPath={showBloom ? BLOOM_PATH : undefined}
      glowHighlight={glowHighlight}
    />
  );
}
