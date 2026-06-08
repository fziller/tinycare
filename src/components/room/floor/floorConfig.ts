import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type FloorStateConfig = {
  stainCount: number;
  stainOpacity: number;
  hasDust: boolean;
  hasFloorboards: boolean;
  hasGloss: boolean;
  hasWaterGloss: boolean;
  hasReflections: boolean;
  hasSparkles: boolean;
  floorColor: string;
  dustColor: string;
};

const STATE_CONFIGS: FloorStateConfig[] = [
  // State 0: hygiene < 15, any glow
  {
    stainCount: 8,
    stainOpacity: 1,
    hasDust: true,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: false,
    hasSparkles: false,
    floorColor: '#C0B090',
    dustColor: 'rgba(80, 80, 80, 0.3)',
  },
  // State 1: hygiene 15–35, any glow
  {
    stainCount: 5,
    stainOpacity: 0.6,
    hasDust: true,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: false,
    hasSparkles: false,
    floorColor: '#D0C0A0',
    dustColor: 'rgba(60, 60, 60, 0.2)',
  },
  // State 2: hygiene 35–50, any glow
  {
    stainCount: 3,
    stainOpacity: 0.3,
    hasDust: false,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: false,
    hasSparkles: false,
    floorColor: '#E0D0B0',
    dustColor: 'transparent',
  },
  // State 3: hygiene 50–70, glow < 2
  {
    stainCount: 0,
    stainOpacity: 0,
    hasDust: false,
    hasFloorboards: true,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: false,
    hasSparkles: false,
    floorColor: '#F0E0C0',
    dustColor: 'rgba(40, 40, 40, 0.1)',
  },
  // State 4: hygiene 50–70, glow ≥ 2
  {
    stainCount: 0,
    stainOpacity: 0,
    hasDust: false,
    hasFloorboards: true,
    hasGloss: true,
    hasWaterGloss: false,
    hasReflections: false,
    hasSparkles: false,
    floorColor: '#F0E0C0',
    dustColor: 'transparent',
  },
  // State 5: hygiene 70–85, any glow
  {
    stainCount: 0,
    stainOpacity: 0,
    hasDust: false,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: true,
    hasReflections: true,
    hasSparkles: false,
    floorColor: '#F8F0E0',
    dustColor: 'transparent',
  },
  // State 6: hygiene > 85, glow < 3
  {
    stainCount: 0,
    stainOpacity: 0,
    hasDust: false,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: true,
    hasSparkles: false,
    floorColor: '#FFFFFF',
    dustColor: 'transparent',
  },
  // State 7: hygiene > 85, glow ≥ 3
  {
    stainCount: 0,
    stainOpacity: 0,
    hasDust: false,
    hasFloorboards: false,
    hasGloss: false,
    hasWaterGloss: false,
    hasReflections: true,
    hasSparkles: true,
    floorColor: '#FFFFFF',
    dustColor: 'transparent',
  },
];

export function getFloorState(hygiene: number, glowTier: number): number {
  if (hygiene < 15) return 0;
  if (hygiene < 35) return 1;
  if (hygiene < 50) return 2;
  if (hygiene < 70) return glowTier >= 2 ? 4 : 3;
  if (hygiene < 85) return 5;
  return glowTier >= 3 ? 7 : 6;
}

export function getFloorConfig(state: number): FloorStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

/* ── Organic Stain Path ───────────────────────────────── */

function buildStain(): SkPath {
  const p = Skia.Path.Make();
  // Organic shape with 3-4 cubicTo segments
  p.moveTo(0, 0);
  p.cubicTo(-4, 2, -6, -1, -5, -4);
  p.cubicTo(-4, -6, 0, -8, 4, -6);
  p.cubicTo(8, -5, 10, -2, 9, 2);
  p.cubicTo(8, 6, 5, 8, 2, 7);
  p.cubicTo(-1, 6, -3, 4, 0, 0);
  p.close();
  return p;
}

/* ── Floorboard Path ─────────────────────────────────── */

function buildFloorboards(): SkPath {
  const p = Skia.Path.Make();
  // Horizontal lines for floorboards, 10px apart
  for (let y = 0; y <= 60; y += 10) {
    p.moveTo(0, y);
    p.lineTo(360, y);
  }
  return p;
}

/* ─── Sparkle Path ────────────────────────────────────── */

function buildSparkle(): SkPath {
  const p = Skia.Path.Make();
  // Star shape: 5 points
  p.moveTo(0, -5);
  p.lineTo(2, -1);
  p.lineTo(5, 0);
  p.lineTo(2, 1);
  p.lineTo(0, 5);
  p.lineTo(-2, 1);
  p.lineTo(-5, 0);
  p.lineTo(-2, -1);
  p.close();
  return p;
}

/* ─── Exports ─────────────────────────────────────────── */

export const STAIN_PATH = buildStain();
export const FLOORBOARDS_PATH = buildFloorboards();
export const SPARKLE_PATH = buildSparkle();
