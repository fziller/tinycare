import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type PictureStateConfig = {
  frameColor: string;
  frameStyle: 'white' | 'beige' | 'gold';
  hasLightning: boolean;
  hasRain: boolean;
  hasMountain: boolean;
  hasClouds: number;
  hasSun: boolean;
  treeCount: number;
  hasBird: boolean;
  flowerCount: number;
  hasRainbow: boolean;
};

const STATE_CONFIGS: PictureStateConfig[] = [
  // State 0: avg <15, any glow → Sturm
  { frameColor: '#FFFFFF', frameStyle: 'white', hasLightning: true, hasRain: true, hasMountain: false, hasClouds: 0, hasSun: false, treeCount: 0, hasBird: false, flowerCount: 0, hasRainbow: false },
  // State 1: avg 15-35, any glow → Berg grau
  { frameColor: '#FFFFFF', frameStyle: 'white', hasLightning: false, hasRain: true, hasMountain: true, hasClouds: 0, hasSun: false, treeCount: 0, hasBird: false, flowerCount: 0, hasRainbow: false },
  // State 2: avg 35-55, glow 0-1 → Berg grün
  { frameColor: '#B8956A', frameStyle: 'beige', hasLightning: false, hasRain: false, hasMountain: true, hasClouds: 0, hasSun: true, treeCount: 0, hasBird: false, flowerCount: 0, hasRainbow: false },
  // State 3: avg 35-55, glow 2-3 → Berg grün+
  { frameColor: '#B8956A', frameStyle: 'beige', hasLightning: false, hasRain: false, hasMountain: true, hasClouds: 2, hasSun: true, treeCount: 0, hasBird: false, flowerCount: 0, hasRainbow: false },
  // State 4: avg 55-75, glow 0-2 → Wald
  { frameColor: '#B8956A', frameStyle: 'beige', hasLightning: false, hasRain: false, hasMountain: false, hasClouds: 0, hasSun: false, treeCount: 3, hasBird: false, flowerCount: 0, hasRainbow: false },
  // State 5: avg 55-75, glow 3 → Wald+
  { frameColor: '#D4A040', frameStyle: 'gold', hasLightning: false, hasRain: false, hasMountain: false, hasClouds: 0, hasSun: false, treeCount: 3, hasBird: true, flowerCount: 0, hasRainbow: false },
  // State 6: avg >75, glow 0-2 → Blumenwiese
  { frameColor: '#D4A040', frameStyle: 'gold', hasLightning: false, hasRain: false, hasMountain: false, hasClouds: 0, hasSun: false, treeCount: 0, hasBird: false, flowerCount: 5, hasRainbow: false },
  // State 7: avg >75, glow 3 → Regenbogen
  { frameColor: '#D4A040', frameStyle: 'gold', hasLightning: false, hasRain: false, hasMountain: false, hasClouds: 0, hasSun: false, treeCount: 0, hasBird: false, flowerCount: 5, hasRainbow: true },
];

export function getPictureState(averageValue: number, glowTier: number): number {
  if (averageValue < 15) return 0;
  if (averageValue < 35) return 1;
  if (averageValue < 55) return glowTier >= 2 ? 3 : 2;
  if (averageValue < 75) return glowTier >= 3 ? 5 : 4;
  return glowTier >= 3 ? 7 : 6;
}

export function getPictureConfig(state: number): PictureStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

/* ── Scene Paths ─────────────────────────────────────────────── */

function buildMountain(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 20);
  p.lineTo(15, 5);
  p.lineTo(30, 20);
  p.close();
  return p;
}

function buildCloud(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 6);
  p.cubicTo(-3, 2, -4, 6, 0, 8);
  p.cubicTo(4, 10, 6, 14, 10, 12);
  p.cubicTo(12, 10, 16, 12, 16, 6);
  p.cubicTo(14, 2, 10, -2, 6, 0);
  p.close();
  return p;
}

function buildTree(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(8, 20);
  p.lineTo(8, 12);
  p.lineTo(6, 12);
  p.lineTo(10, 6);
  p.lineTo(12, 6);
  p.lineTo(10, 12);
  p.close();
  return p;
}

function buildButterfly(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-2, -2, -4, -1, -3, 1);
  p.cubicTo(-4, 3, -2, 4, 0, 3);
  p.cubicTo(1, 4, 3, 2, 2, 0);
  p.cubicTo(1, -2, -1, -2, 0, 0);
  p.close();
  return p;
}

function buildFlower(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, -4);
  p.lineTo(1, -2);
  p.lineTo(3, -1);
  p.lineTo(1, 0);
  p.lineTo(0, 2);
  p.lineTo(-1, 0);
  p.lineTo(-3, -1);
  p.lineTo(-1, -2);
  p.close();
  return p;
}

function buildRainbowArc(color: string, radius: number): SkPath {
  const p = Skia.Path.Make();
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius * 0.5;
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.close();
  return p;
}

function buildRainLine(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.lineTo(3, 6);
  return p;
}

function buildLightning(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.lineTo(2, 3);
  p.lineTo(4, 1);
  p.lineTo(2, 4);
  p.lineTo(6, 4);
  p.lineTo(2, 8);
  p.lineTo(4, 6);
  p.close();
  return p;
}

export const MOUNTAIN_PATH = buildMountain();
export const CLOUD_PATH = buildCloud();
export const TREE_PATH = buildTree();
export const BUTTERFLY_PATH = buildButterfly();
export const FLOWER_PATH = buildFlower();
export const RAIN_LINE_PATH = buildRainLine();
export const LIGHTNING_PATH = buildLightning();

// Rainbow: 6 colored arcs (ROYGBV)
export const RAINBOW_PATHS = [
  { color: '#FF0000', path: buildRainbowArc('#FF0000', 30) },
  { color: '#FF7F00', path: buildRainbowArc('#FF7F00', 27) },
  { color: '#FFFF00', path: buildRainbowArc('#FFFF00', 24) },
  { color: '#00FF00', path: buildRainbowArc('#00FF00', 21) },
  { color: '#0000FF', path: buildRainbowArc('#0000FF', 18) },
  { color: '#4B0082', path: buildRainbowArc('#4B0082', 15) },
];