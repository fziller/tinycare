import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type PillowStyle = 'none' | 'simple' | 'plump' | 'gold';

export type TableStateConfig = {
  pelletCount: number;
  showPillow: boolean;
  pillowStyle: PillowStyle;
  showCandle: boolean;
  candleLit: boolean;
  showMug: boolean;
  showNapkin: boolean;
  showPlant: boolean;
};

const STATE_CONFIGS: TableStateConfig[] = [
  { pelletCount: 0, showPillow: false, pillowStyle: 'none', showCandle: false, candleLit: false, showMug: false, showNapkin: false, showPlant: false },
  { pelletCount: 1, showPillow: false, pillowStyle: 'none', showCandle: false, candleLit: false, showMug: false, showNapkin: false, showPlant: false },
  { pelletCount: 2, showPillow: true, pillowStyle: 'simple', showCandle: false, candleLit: false, showMug: false, showNapkin: false, showPlant: false },
  { pelletCount: 3, showPillow: true, pillowStyle: 'simple', showCandle: true, candleLit: false, showMug: false, showNapkin: false, showPlant: false },
  { pelletCount: 4, showPillow: true, pillowStyle: 'plump', showCandle: true, candleLit: true, showMug: false, showNapkin: false, showPlant: false },
  { pelletCount: 5, showPillow: true, pillowStyle: 'gold', showCandle: true, candleLit: true, showMug: true, showNapkin: false, showPlant: false },
  { pelletCount: 6, showPillow: true, pillowStyle: 'gold', showCandle: true, candleLit: true, showMug: true, showNapkin: true, showPlant: false },
  { pelletCount: 7, showPillow: true, pillowStyle: 'gold', showCandle: true, candleLit: true, showMug: true, showNapkin: true, showPlant: true },
];

export function getTableState(food: number, glowTier: number): number {
  if (food < 15) return 0;
  if (food < 40) return 1;
  if (food < 60) return glowTier >= 2 ? 3 : 2;
  if (food < 80) return glowTier >= 3 ? 5 : 4;
  return glowTier >= 3 ? 7 : 6;
}

export function getTableConfig(state: number): TableStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

export const PELLET_LAYOUTS: Record<number, { dx: number; dy: number; r: number }[]> = {
  1: [{ dx: 0, dy: 0, r: 2 }],
  2: [{ dx: -3, dy: -1, r: 2 }, { dx: 3, dy: 1, r: 2 }],
  3: [{ dx: -4, dy: -1, r: 2 }, { dx: 0, dy: -2, r: 2 }, { dx: 4, dy: 1, r: 1.8 }],
  4: [{ dx: -4, dy: -1, r: 2 }, { dx: -1, dy: 2, r: 2 }, { dx: 3, dy: -2, r: 1.8 }, { dx: 5, dy: 1, r: 1.8 }],
  5: [{ dx: -5, dy: -2, r: 2 }, { dx: -2, dy: 1, r: 2 }, { dx: 2, dy: -2, r: 2 }, { dx: 5, dy: 0, r: 1.8 }, { dx: 0, dy: 3, r: 1.8 }],
  6: [{ dx: -5, dy: -2, r: 2 }, { dx: -2, dy: 1, r: 2 }, { dx: 2, dy: -2, r: 2 }, { dx: 5, dy: 0, r: 1.8 }, { dx: -3, dy: 3, r: 1.8 }, { dx: 4, dy: 2, r: 1.8 }],
  7: [{ dx: -5, dy: -2, r: 2 }, { dx: -2, dy: 1, r: 2 }, { dx: 2, dy: -2, r: 2 }, { dx: 5, dy: 0, r: 1.8 }, { dx: -4, dy: 3, r: 1.8 }, { dx: 0, dy: 3, r: 1.8 }, { dx: 4, dy: 2, r: 1.8 }],
};

/* ── Paths ─────────────────────────────────────────────── */

function buildBowl(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-12, 0);
  p.cubicTo(-12, 8, -8, 12, 0, 12);
  p.cubicTo(8, 12, 12, 8, 12, 0);
  p.close();
  return p;
}

function buildFlame(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-2, -2, -3.5, -4, -1.5, -5.5);
  p.cubicTo(-0.5, -6.5, 0.5, -7.5, 0, -8.5);
  p.cubicTo(-0.5, -7.5, 0.5, -6.5, 1.5, -5.5);
  p.cubicTo(3.5, -4, 2, -2, 0, 0);
  p.close();
  return p;
}

function buildMugBody(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-7, -9);
  p.lineTo(-7, 1);
  p.cubicTo(-7, 3.5, -5.5, 5, -3, 5);
  p.lineTo(7, 5);
  p.cubicTo(9.5, 5, 11, 3.5, 11, 1);
  p.lineTo(11, -9);
  p.close();
  return p;
}

function buildMugHandle(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(11, -6);
  p.cubicTo(14, -6, 15, -1, 11, -1);
  return p;
}

function buildNapkin(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-5, 0);
  p.lineTo(5, 0);
  p.lineTo(0, -7);
  p.close();
  p.moveTo(-5, 0);
  p.lineTo(0, -7);
  p.lineTo(2, -3);
  p.close();
  return p;
}

function buildPot(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-5, 0);
  p.lineTo(-4, 7);
  p.lineTo(4, 7);
  p.lineTo(5, 0);
  p.close();
  return p;
}

function buildLeaf(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-2, -2.5, -3, -5, -1.5, -7);
  p.cubicTo(0, -9, 1.5, -9, 2.5, -7);
  p.cubicTo(3.5, -5, 2.5, -2.5, 0, 0);
  p.close();
  return p;
}

export const BOWL_PATH = buildBowl();
export const FLAME_PATH = buildFlame();
export const MUG_BODY_PATH = buildMugBody();
export const MUG_HANDLE_PATH = buildMugHandle();
export const NAPKIN_PATH = buildNapkin();
export const POT_PATH = buildPot();
export const LEAF_PATH = buildLeaf();
