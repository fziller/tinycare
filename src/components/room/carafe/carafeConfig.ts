import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type CarafeStateConfig = {
  fillLevel: number;
  liquidColor: string;
  showGloss: boolean;
  showDrop: boolean;
  showGoldReflection: boolean;
};

const STATE_CONFIGS: CarafeStateConfig[] = [
  { fillLevel: 0, liquidColor: 'transparent', showGloss: false, showDrop: true, showGoldReflection: false },
  { fillLevel: 25, liquidColor: '#E8D8A0', showGloss: false, showDrop: false, showGoldReflection: false },
  { fillLevel: 50, liquidColor: '#D4C040', showGloss: false, showDrop: false, showGoldReflection: false },
  { fillLevel: 50, liquidColor: '#D4C040', showGloss: true, showDrop: false, showGoldReflection: false },
  { fillLevel: 75, liquidColor: '#C0A820', showGloss: false, showDrop: false, showGoldReflection: false },
  { fillLevel: 75, liquidColor: '#C0A820', showGloss: true, showDrop: true, showGoldReflection: false },
  { fillLevel: 100, liquidColor: '#B89810', showGloss: false, showDrop: false, showGoldReflection: false },
  { fillLevel: 100, liquidColor: '#B89810', showGloss: true, showDrop: false, showGoldReflection: true },
];

export function getCarafeState(bathroom: number, glowTier: number): number {
  if (bathroom > 85) return 0;
  if (bathroom > 65) return 1;
  if (bathroom > 45) return glowTier >= 2 ? 3 : 2;
  if (bathroom > 25) return glowTier >= 3 ? 5 : 4;
  return glowTier >= 3 ? 7 : 6;
}

export function getCarafeConfig(state: number): CarafeStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

/* ── Handle Path ──────────────────────────────────────── */

function buildCarafeHandle(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(18, 8);
  p.cubicTo(26, 8, 26, 17, 21, 19);
  p.cubicTo(19, 20, 18, 19, 18, 18);
  return p;
}

/* ── Drop Path (teardrop) ─────────────────────────────── */

function buildDrop(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-1.5, 1.5, -2, 2.5, -1.5, 3.5);
  p.cubicTo(-0.5, 4.5, 1.5, 4.5, 1.5, 3.5);
  p.cubicTo(2, 2.5, 1.5, 1.5, 0, 0);
  p.close();
  return p;
}

/* ── Exports ──────────────────────────────────────────── */

export const CARAFE_HANDLE_PATH = buildCarafeHandle();
export const DROP_PATH = buildDrop();
