import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type LeafTier = 0 | 1 | 2;

export type LeafPlacement = {
  t: number;
  side: -1 | 1;
  size: number;
  tier: LeafTier;
  swayPhase: number;
};

export type HangingStateConfig = {
  leafLayout: LeafPlacement[];
  vineLength: number;
  leafColors: [string, string];
  showDew: boolean;
  showBloom: boolean;
  glowHighlight: boolean;
  swayAmplitude: number;
};

const STATE_CONFIGS: HangingStateConfig[] = [
  { leafLayout: [{ t: 0.5, side: 1, size: 0.6, tier: 0, swayPhase: 0 }], vineLength: 20, leafColors: ['#C4A860', '#8B7040'], showDew: false, showBloom: false, glowHighlight: false, swayAmplitude: 0 },
  { leafLayout: [{ t: 0.5, side: 1, size: 0.6, tier: 0, swayPhase: 0 }], vineLength: 20, leafColors: ['#93BD98', '#5D8A5A'], showDew: false, showBloom: false, glowHighlight: false, swayAmplitude: 0 },
  { leafLayout: [{ t: 0.3, side: -1, size: 0.7, tier: 1, swayPhase: 0 }, { t: 0.7, side: 1, size: 0.8, tier: 1, swayPhase: 2 }], vineLength: 30, leafColors: ['#93C490', '#6DAA72'], showDew: false, showBloom: false, glowHighlight: false, swayAmplitude: 0 },
  { leafLayout: [{ t: 0.3, side: -1, size: 0.7, tier: 1, swayPhase: 0 }, { t: 0.7, side: 1, size: 0.8, tier: 1, swayPhase: 2 }], vineLength: 30, leafColors: ['#7BA060', '#4A7A4E'], showDew: false, showBloom: false, glowHighlight: false, swayAmplitude: 0.08 },
  { leafLayout: [{ t: 0.2, side: -1, size: 0.7, tier: 1, swayPhase: 0 }, { t: 0.4, side: 1, size: 0.8, tier: 1, swayPhase: 2 }, { t: 0.6, side: -1, size: 0.8, tier: 2, swayPhase: 3 }, { t: 0.85, side: 1, size: 1.0, tier: 2, swayPhase: 4 }], vineLength: 45, leafColors: ['#6DAA72', '#4A7A4E'], showDew: false, showBloom: false, glowHighlight: false, swayAmplitude: 0 },
  { leafLayout: [{ t: 0.2, side: -1, size: 0.7, tier: 1, swayPhase: 0 }, { t: 0.4, side: 1, size: 0.8, tier: 1, swayPhase: 2 }, { t: 0.6, side: -1, size: 0.8, tier: 2, swayPhase: 3 }, { t: 0.85, side: 1, size: 1.0, tier: 2, swayPhase: 4 }], vineLength: 45, leafColors: ['#5D8A5A', '#3A6A3E'], showDew: true, showBloom: false, glowHighlight: false, swayAmplitude: 0.1 },
  { leafLayout: [{ t: 0.1, side: -1, size: 0.8, tier: 2, swayPhase: 0 }, { t: 0.25, side: 1, size: 0.9, tier: 2, swayPhase: 1.5 }, { t: 0.4, side: -1, size: 1.0, tier: 2, swayPhase: 3 }, { t: 0.55, side: 1, size: 1.0, tier: 2, swayPhase: 4.5 }, { t: 0.7, side: -1, size: 0.9, tier: 2, swayPhase: 6 }, { t: 0.85, side: 1, size: 0.8, tier: 2, swayPhase: 7.5 }], vineLength: 50, leafColors: ['#3A6A3E', '#2A5A2E'], showDew: false, showBloom: true, glowHighlight: false, swayAmplitude: 0 },
  { leafLayout: [{ t: 0.1, side: -1, size: 0.8, tier: 2, swayPhase: 0 }, { t: 0.25, side: 1, size: 0.9, tier: 2, swayPhase: 1.5 }, { t: 0.4, side: -1, size: 1.0, tier: 2, swayPhase: 3 }, { t: 0.55, side: 1, size: 1.0, tier: 2, swayPhase: 4.5 }, { t: 0.7, side: -1, size: 0.9, tier: 2, swayPhase: 6 }, { t: 0.85, side: 1, size: 0.8, tier: 2, swayPhase: 7.5 }], vineLength: 50, leafColors: ['#2A5A2E', '#1A4A1E'], showDew: true, showBloom: true, glowHighlight: true, swayAmplitude: 0.12 },
];

export function getHangingState(glow: number, hydration: number): number {
  if (glow < 20) return hydration < 50 ? 0 : 1;
  if (glow < 50) return hydration < 50 ? 2 : 3;
  if (glow < 80) return hydration < 50 ? 4 : 5;
  return hydration < 50 ? 6 : 7;
}

export function getHangingConfig(state: number): HangingStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

/* ── Cubic bezier math (worklet-safe) ──────────────────── */

export function cbz(t: number, p0: number, p1: number, p2: number, p3: number): number {
  'worklet';
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export function cbzTan(t: number, p0: number, p1: number, p2: number, p3: number): number {
  'worklet';
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}

export const CP1_X = 10;
export const CP2_X = -8;
export const CP3_X = 4;
export const CP1_Y_RATIO = 0.2;
export const CP2_Y_RATIO = 0.7;

export function leafPosition(t: number, vineLen: number): { x: number; y: number } {
  'worklet';
  return {
    x: cbz(t, 0, CP1_X, CP2_X, CP3_X),
    y: cbz(t, 0, vineLen * CP1_Y_RATIO, vineLen * CP2_Y_RATIO, vineLen),
  };
}

export function leafAngle(t: number, vineLen: number, side: number, sway: number): number {
  'worklet';
  const dx = cbzTan(t, 0, CP1_X, CP2_X, CP3_X);
  const dy = cbzTan(t, 0, vineLen * CP1_Y_RATIO, vineLen * CP2_Y_RATIO, vineLen);
  const tangentAngle = Math.atan2(dy, dx);
  return Math.PI / 2 + tangentAngle + side * 0.25 + sway;
}

/* ── Bloom path ────────────────────────────────────────── */

function buildBloom(): SkPath {
  const p = Skia.Path.Make();
  const n = 5;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const cx = Math.cos(a) * 3.5;
    const cy = Math.sin(a) * 3.5;
    p.addCircle(cx, cy, 1.8);
  }
  p.addCircle(0, 0, 1.2);
  return p;
}

export const BLOOM_PATH: SkPath = buildBloom();
