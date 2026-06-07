import { Skia } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

const scalePath = (path: SkPath, s: number) => {
  const m = Skia.Matrix();
  m.scale(s, s);
  const c = path.copy();
  c.transform(m);
  return c;
};

/** computeTightBounds mit NaN-Guard */
export function safeBounds(path: SkPath): { x: number; y: number; width: number; height: number } {
  const b = path.computeTightBounds();
  return {
    x: isFinite(b.x) ? b.x : 0,
    y: isFinite(b.y) ? b.y : 0,
    width: isFinite(b.width) && b.width >= 0 ? b.width : 0,
    height: isFinite(b.height) && b.height >= 0 ? b.height : 0,
  };
}

/* ── Baby leaf ─────────────────────────────────────────── */
function buildBaby(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-6, -2, -10, -6, -9, -10);
  p.cubicTo(-8, -14, -4, -18, 0, -19);
  p.cubicTo(4, -18, 8, -14, 9, -10);
  p.cubicTo(10, -6, 6, -2, 0, 0);
  p.close();
  return p;
}

/* ── Small Monstera ────────────────────────────────────── */
function buildSmall(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-8, -3, -15, -8, -17, -14);
  p.cubicTo(-19, -20, -15, -26, -10, -29);
  p.cubicTo(-6, -32, -3, -34, 0, -34);
  p.cubicTo(3, -34, 6, -32, 10, -29);
  p.cubicTo(15, -26, 19, -20, 17, -14);
  p.cubicTo(15, -8, 8, -3, 0, 0);
  p.close();
  return p;
}

/* ── Full Monstera ─────────────────────────────────────── */
function buildFull(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-10, -4, -20, -10, -24, -18);
  p.cubicTo(-25, -22, -22, -26, -20, -30);
  p.cubicTo(-18, -34, -14, -38, -8, -41);
  p.cubicTo(-4, -43, -2, -44, 0, -44);
  p.cubicTo(2, -44, 4, -43, 8, -41);
  p.cubicTo(14, -38, 18, -34, 20, -30);
  p.cubicTo(22, -26, 25, -22, 24, -18);
  p.cubicTo(20, -10, 10, -4, 0, 0);
  p.close();
  return p;
}

/* ── Veins ─────────────────────────────────────────────── */
function buildVeins(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, -1);
  p.lineTo(0, -38);
  p.moveTo(0, -8);
  p.lineTo(-9, -12);
  p.moveTo(0, -14);
  p.lineTo(-13, -20);
  p.moveTo(0, -22);
  p.lineTo(-9, -26);
  p.moveTo(0, -8);
  p.lineTo(9, -12);
  p.moveTo(0, -14);
  p.lineTo(13, -20);
  p.moveTo(0, -22);
  p.lineTo(9, -26);
  return p;
}

/* ── Berry fruit ───────────────────────────────────────── */
function buildBerry(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, -1);
  p.cubicTo(0.55, -1, 1, -0.55, 1, 0);
  p.cubicTo(1, 0.55, 0.55, 1, 0, 1);
  p.cubicTo(-0.55, 1, -1, 0.55, -1, 0);
  p.cubicTo(-1, -0.55, -0.55, -1, 0, -1);
  p.close();
  return p;
}

/* ── Exported constants ────────────────────────────────── */
export const BABY_LEAF: SkPath = buildBaby();
export const SMALL_MONSTERA: SkPath = buildSmall();
export const FULL_MONSTERA: SkPath = buildFull();
export const FULL_MONSTERA_VEINS: SkPath = buildVeins();
export const BERRY_PATH: SkPath = buildBerry();

export const getLeafPaths = (tier: number, size: number) => {
  const base: SkPath = tier === 0 ? BABY_LEAF : tier === 1 ? SMALL_MONSTERA : FULL_MONSTERA;
  const leaf = scalePath(base, size);
  const veins = tier >= 2 ? FULL_MONSTERA_VEINS : undefined;
  if (veins) {
    return { leaf, veins: scalePath(veins, size) };
  }
  return { leaf, veins: undefined as SkPath | undefined };
};

export const getFruitPath = (size: number) => scalePath(BERRY_PATH, size);
