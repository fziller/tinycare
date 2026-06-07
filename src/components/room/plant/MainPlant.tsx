import { useMemo } from 'react';
import { Group, Skia } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';
import { clampNeed, glowTier, useAnimatedNumeric } from '../RoomScene.types';
import { useSway } from './useSway';
import { Stem } from './Stem';
import { Leaf } from './Leaf';
import { Fruit } from './Fruit';
import { getLeafPaths, getFruitPath, safeBounds } from './leafShapes';

type Props = {
  hydration: number;
  glow: number;
  food: number;
  baseY: number;
};

const STEM_X = 204;

type LeafConfig = {
  angle: number;
  dist: number;
  size: number;
  phase: number;
};

const LEAF_CONFIGS: LeafConfig[] = [
  { angle: -0.55, dist: 18, size: 1.0, phase: 0 },
  { angle: 0.5, dist: 22, size: 1.1, phase: 1.5 },
  { angle: 0, dist: 26, size: 1.0, phase: 3 },
  { angle: 0.85, dist: 16, size: 0.85, phase: 4.5 },
  { angle: -0.9, dist: 14, size: 0.75, phase: 6 },
];

const TIER_MAP: { count: number; types: number[] }[] = [
  { count: 1, types: [0] },
  { count: 2, types: [1, 1] },
  { count: 4, types: [1, 1, 2, 2] },
  { count: 5, types: [2, 2, 2, 2, 2] },
];

const FRUIT_CONFIG = [
  { dx: -8, dy: -10, r: 4, color: '#E8795B' },
  { dx: 10, dy: -14, r: 3, color: '#F3B35C' },
];

type FruitRender = {
  dx: number;
  dy: number;
  path: SkPath;
  color: string;
  r: number;
};

function leafColors(hyd: number): string[] {
  if (hyd < 0.3) return ['#C4A860', '#8B7040'];
  if (hyd < 0.6) return ['#93C490', '#6DAA72'];
  return ['#93BD98', '#5D8A5A'];
}

function stemColor(hyd: number): string {
  if (hyd < 0.4) return '#8B7355';
  if (hyd < 0.7) return '#7BA060';
  return '#638E69';
}

export function MainPlant({ hydration, glow, food, baseY }: Props) {
  const hyd = useAnimatedNumeric(clampNeed(hydration) / 100, 1000);
  const growth = useAnimatedNumeric(glowTier(glow) / 3, 1500);
  const tier = glowTier(glow);

  const stemHeight = 40 + Math.min(80, glow * 3.2) * (0.5 + hyd * 0.5);
  const stemTop = baseY - stemHeight;
  const droop = -(1 - hyd) * 0.12;
  const sizeMul = 0.6 + growth * 0.4;

  const sway0 = useSway(0, 1);
  const sway1 = useSway(1.5, 1.1);
  const sway2 = useSway(3, 1.3);
  const sway3 = useSway(4.5, 0.8);
  const sway4 = useSway(6, 0.7);

  const sways = [sway0, sway1, sway2, sway3, sway4];

  const stemPath = useMemo(() => {
    const p = Skia.Path.Make();
    const sw = stemHeight * 0.06;
    p.moveTo(STEM_X, baseY);
    p.cubicTo(STEM_X - sw, baseY - stemHeight * 0.3, STEM_X + sw, baseY - stemHeight * 0.6, STEM_X, stemTop);
    return p;
  }, [baseY, stemTop, stemHeight]);

  const activeConfig = TIER_MAP[tier];
  const hColors = leafColors(hyd);
  const sColor = stemColor(hyd);

  // Leaf paths and gradient params — NUR bei Tier-Wechsel (activeConfig)
  const leafGeometry = useMemo(() => {
    const result: {
      path: SkPath;
      veins?: SkPath;
      gradientCenter: { x: number; y: number };
      gradientR: number;
    }[] = [];

    for (let i = 0; i < activeConfig.count; i++) {
      const cfg = LEAF_CONFIGS[i];
      const type = activeConfig.types[i];
      const { leaf, veins } = getLeafPaths(type, cfg.size);
      const bbox = safeBounds(leaf);
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height * 0.35;
      const gradR = Math.max(bbox.width, bbox.height) * 0.6;

      result.push({ path: leaf, veins, gradientCenter: { x: cx, y: cy }, gradientR: gradR });
    }

    return result;
  }, [activeConfig]);

  // Leaf position und angle — hängt von hyd ab, aber ohne Skia-Objekte
  const leafPositions = useMemo(() => {
    return LEAF_CONFIGS.slice(0, activeConfig.count).map((cfg) => {
      const exitRatio = Math.max(0.1, Math.abs(Math.cos(cfg.angle)));
      const exitY = stemTop + stemHeight * 0.4 * (1 - exitRatio);
      const lx = STEM_X + Math.sin(cfg.angle) * cfg.dist * (0.7 + hyd * 0.3);
      const ly = exitY - Math.cos(cfg.angle) * cfg.dist * (0.7 + hyd * 0.3) - 2;
      return { x: lx, y: ly, angle: cfg.angle };
    });
  }, [activeConfig, stemTop, stemHeight, hyd]);

  const fruitData = useMemo((): FruitRender[] => {
    return FRUIT_CONFIG.map((f) => ({
      dx: f.dx,
      dy: f.dy,
      path: getFruitPath(f.r),
      color: f.color,
      r: f.r,
    }));
  }, []);

  const hasFruit = tier >= 2 && clampNeed(food) > 60;

  return (
    <Group>
      <Stem path={stemPath} color={sColor} />
      {leafGeometry.map((geo, i) => {
        const pos = leafPositions[i] ?? { x: 0, y: 0, angle: 0 };
        return (
          <Leaf
            key={i}
            x={pos.x}
            y={pos.y}
            scale={sizeMul}
            rotation={pos.angle}
            droop={droop}
            sway={sways[i]}
            path={geo.path}
            veins={geo.veins}
            colors={hColors}
            gradientCenter={geo.gradientCenter}
            gradientR={geo.gradientR}
          />
        );
      })}
      {hasFruit && <Fruit fruits={fruitData} stemX={STEM_X} stemTop={stemTop} />}
    </Group>
  );
}
