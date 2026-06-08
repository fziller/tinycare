import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type FishPlacement = {
  dx: number;
  dy: number;
  size: number;
  color: string;
  ampX: number;
  ampY: number;
  speed: number;
  phaseX: number;
  phaseY: number;
};

export type DecorConfig = {
  algaeColor: string;
  showSandyBottom: boolean;
  showPebbles: boolean;
  showCoral: boolean;
  showSeahorse: boolean;
  showBlooms: boolean;
  glowCoral: boolean;
};

export type WaterConfig = {
  clear: boolean;
  reflection: boolean;
  goldReflection: boolean;
};

export type AquariumStateConfig = {
  fishLayout: FishPlacement[];
  decor: DecorConfig;
  water: WaterConfig;
  showBubbles: boolean;
  movementTier: number;
};

export function buildFishShape(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(2, -2.5, 5, -3, 8, -1.5);
  p.cubicTo(9.5, -0.8, 10.5, -1.5, 11, -2);
  p.lineTo(11, 2);
  p.cubicTo(10.5, 1.5, 9.5, 0.8, 8, 1.5);
  p.cubicTo(5, 3, 2, 2.5, 0, 0);
  p.close();
  return p;
}

export function buildAlgae(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-2, -3, -4, -5, -3, -8);
  p.cubicTo(-2, -11, 0, -13, -1, -16);
  p.moveTo(0, 0);
  p.cubicTo(1, -3, 3, -5, 2, -8);
  p.cubicTo(1, -11, 0, -14, 1, -17);
  return p;
}

export function buildCoral(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-2, -4, -3, -6, -1, -10);
  p.moveTo(0, 0);
  p.cubicTo(2, -5, 4, -8, 3, -12);
  p.moveTo(0, 0);
  p.cubicTo(0, -4, 0, -8, 2, -11);
  return p;
}

export function buildSeahorse(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(1, -2, 2, -4, 2, -7);
  p.cubicTo(2, -9, 1, -11, 0, -12);
  p.cubicTo(-1, -11, -2, -9, -1, -7);
  p.cubicTo(-1, -5, 0, -3, 0, 0);
  p.cubicTo(0, 2, -1, 4, -1, 6);
  p.cubicTo(0, 6, 1, 5, 1, 4);
  return p;
}

export const FISH_PATH = buildFishShape();
export const ALGAE_PATH = buildAlgae();
export const CORAL_PATH = buildCoral();
export const SEAHORSE_PATH = buildSeahorse();

export const FISH_COLORS = ['#E8795B', '#F3B35C', '#36AFA0', '#559FC9', '#A060C0'];
const ALGAE_GREEN = '#4A8A4A';
const ALGAE_BROWN = '#8B7A50';
const CORAL_PINK = '#D46880';
const CORAL_GLOW = '#FF6B8A';
const SANDY = '#D4C4A0';

/* ── Fish layouts per count ───────────────────────────── */

const FISH_1: FishPlacement[] = [
  { dx: 45, dy: 22, size: 1, color: FISH_COLORS[0], ampX: 0, ampY: 0, speed: 0, phaseX: 0, phaseY: 0 },
];

const FISH_2_STILL: FishPlacement[] = [
  { dx: 24, dy: 16, size: 0.9, color: FISH_COLORS[0], ampX: 0, ampY: 0, speed: 0, phaseX: 0, phaseY: 0 },
  { dx: 66, dy: 28, size: 0.8, color: FISH_COLORS[1], ampX: 0, ampY: 0, speed: 0, phaseX: 0, phaseY: 0 },
];

const FISH_2_SLOW: FishPlacement[] = [
  { dx: 24, dy: 16, size: 0.9, color: FISH_COLORS[0], ampX: 5, ampY: 1.5, speed: 0.5, phaseX: 0, phaseY: 1.2 },
  { dx: 66, dy: 28, size: 0.8, color: FISH_COLORS[1], ampX: 5, ampY: 1.2, speed: 0.6, phaseX: 2, phaseY: 3 },
];

const FISH_3_ACTIVE: FishPlacement[] = [
  { dx: 16, dy: 12, size: 0.9, color: FISH_COLORS[0], ampX: 5, ampY: 2, speed: 0.6, phaseX: 0, phaseY: 1.5 },
  { dx: 45, dy: 22, size: 0.8, color: FISH_COLORS[1], ampX: 6, ampY: 2.5, speed: 0.7, phaseX: 2.5, phaseY: 3.5 },
  { dx: 74, dy: 34, size: 0.7, color: FISH_COLORS[2], ampX: 5, ampY: 2, speed: 0.8, phaseX: 1, phaseY: 0.5 },
];

const FISH_3_ACTIVEPLUS: FishPlacement[] = [
  { dx: 16, dy: 12, size: 0.9, color: FISH_COLORS[0], ampX: 6, ampY: 2.5, speed: 0.7, phaseX: 0, phaseY: 1.5 },
  { dx: 45, dy: 22, size: 0.8, color: FISH_COLORS[1], ampX: 7, ampY: 3, speed: 0.8, phaseX: 2.5, phaseY: 3.5 },
  { dx: 74, dy: 34, size: 0.7, color: FISH_COLORS[2], ampX: 6, ampY: 2.5, speed: 0.9, phaseX: 1, phaseY: 0.5 },
];

const FISH_4_SWIM: FishPlacement[] = [
  { dx: 14, dy: 10, size: 0.9, color: FISH_COLORS[0], ampX: 4, ampY: 2.5, speed: 0.7, phaseX: 0, phaseY: 1 },
  { dx: 36, dy: 18, size: 0.8, color: FISH_COLORS[1], ampX: 7, ampY: 3, speed: 0.8, phaseX: 2, phaseY: 3 },
  { dx: 58, dy: 28, size: 0.7, color: FISH_COLORS[2], ampX: 7, ampY: 3, speed: 0.9, phaseX: 3.5, phaseY: 0.5 },
  { dx: 78, dy: 38, size: 0.6, color: FISH_COLORS[3], ampX: 3.5, ampY: 2, speed: 1, phaseX: 1.5, phaseY: 2.5 },
];

const FISH_5_SWIMPLUS: FishPlacement[] = [
  { dx: 14, dy: 8, size: 0.9, color: FISH_COLORS[0], ampX: 3.5, ampY: 2.5, speed: 0.7, phaseX: 0, phaseY: 1 },
  { dx: 36, dy: 16, size: 0.8, color: FISH_COLORS[1], ampX: 7, ampY: 3, speed: 0.8, phaseX: 2, phaseY: 3 },
  { dx: 54, dy: 26, size: 0.7, color: FISH_COLORS[2], ampX: 8, ampY: 3.5, speed: 0.9, phaseX: 3.5, phaseY: 0.5 },
  { dx: 74, dy: 36, size: 0.6, color: FISH_COLORS[3], ampX: 5, ampY: 2.5, speed: 1, phaseX: 1.5, phaseY: 2.5 },
  { dx: 84, dy: 42, size: 0.5, color: FISH_COLORS[4], ampX: 2.5, ampY: 1.5, speed: 1.1, phaseX: 4, phaseY: 5 },
];

/* ── State configs ────────────────────────────────────── */

const STATE_CONFIGS: AquariumStateConfig[] = [
  {
    fishLayout: [],
    decor: { algaeColor: ALGAE_BROWN, showSandyBottom: false, showPebbles: false, showCoral: false, showSeahorse: false, showBlooms: false, glowCoral: false },
    water: { clear: false, reflection: false, goldReflection: false },
    showBubbles: false,
    movementTier: 0,
  },
  {
    fishLayout: FISH_1,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: false, showPebbles: false, showCoral: false, showSeahorse: false, showBlooms: false, glowCoral: false },
    water: { clear: true, reflection: false, goldReflection: false },
    showBubbles: false,
    movementTier: 1,
  },
  {
    fishLayout: FISH_2_STILL,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: false, showCoral: false, showSeahorse: false, showBlooms: false, glowCoral: false },
    water: { clear: true, reflection: false, goldReflection: false },
    showBubbles: false,
    movementTier: 2,
  },
  {
    fishLayout: FISH_2_SLOW,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: false, showCoral: false, showSeahorse: false, showBlooms: false, glowCoral: false },
    water: { clear: true, reflection: false, goldReflection: false },
    showBubbles: true,
    movementTier: 3,
  },
  {
    fishLayout: FISH_3_ACTIVE,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: true, showCoral: false, showSeahorse: false, showBlooms: true, glowCoral: false },
    water: { clear: true, reflection: false, goldReflection: false },
    showBubbles: true,
    movementTier: 4,
  },
  {
    fishLayout: FISH_3_ACTIVEPLUS,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: true, showCoral: false, showSeahorse: false, showBlooms: true, glowCoral: false },
    water: { clear: true, reflection: true, goldReflection: false },
    showBubbles: true,
    movementTier: 5,
  },
  {
    fishLayout: FISH_4_SWIM,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: true, showCoral: true, showSeahorse: true, showBlooms: true, glowCoral: false },
    water: { clear: true, reflection: true, goldReflection: false },
    showBubbles: true,
    movementTier: 6,
  },
  {
    fishLayout: FISH_5_SWIMPLUS,
    decor: { algaeColor: ALGAE_GREEN, showSandyBottom: true, showPebbles: true, showCoral: true, showSeahorse: true, showBlooms: true, glowCoral: true },
    water: { clear: true, reflection: true, goldReflection: true },
    showBubbles: true,
    movementTier: 7,
  },
];

export function getAquariumState(fun: number, glowTier: number): number {
  if (fun < 15) return 0;
  if (fun < 40) return 1;
  if (fun < 60) return glowTier >= 2 ? 3 : 2;
  if (fun < 75) return glowTier >= 3 ? 5 : 4;
  return glowTier >= 3 ? 7 : 6;
}

export function getAquariumConfig(state: number): AquariumStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

export { ALGAE_GREEN, CORAL_PINK, CORAL_GLOW, SANDY };
