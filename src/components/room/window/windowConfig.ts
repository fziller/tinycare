import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export type WindowStateConfig = {
  rainCount: number;
  cloudCount: number;
  hasLightning: boolean;
  skyColor: string;
  sunOpacity: number;
  sunSize: number;
  showAirplane: boolean;
};

const STATE_CONFIGS: WindowStateConfig[] = [
  // State 0: averageValue <15, any glow - Storm
  { rainCount: 15, cloudCount: 5, hasLightning: true, skyColor: '#4A5A70', sunOpacity: 0, sunSize: 0, showAirplane: false },
  // State 1: averageValue 15-35, any glow - Rain
  { rainCount: 10, cloudCount: 4, hasLightning: false, skyColor: '#6A7A8A', sunOpacity: 0, sunSize: 0, showAirplane: false },
  // State 2: averageValue 35-55, glow 0-1 - Light rain
  { rainCount: 6, cloudCount: 3, hasLightning: false, skyColor: '#7A8AAD', sunOpacity: 0, sunSize: 0, showAirplane: false },
  // State 3: averageValue 35-55, glow 2-3 - Clearing
  { rainCount: 3, cloudCount: 2, hasLightning: false, skyColor: '#8BA0C0', sunOpacity: 0.1, sunSize: 4, showAirplane: false },
  // State 4: averageValue 55-75, glow 0-2 - Partly cloudy
  { rainCount: 0, cloudCount: 2, hasLightning: false, skyColor: '#9BB8D8', sunOpacity: 0.3, sunSize: 6, showAirplane: false },
  // State 5: averageValue 55-75, glow 3 - Sunny
  { rainCount: 0, cloudCount: 1, hasLightning: false, skyColor: '#A8D0F0', sunOpacity: 0.5, sunSize: 8, showAirplane: false },
  // State 6: averageValue >75, glow 0-2 - Bright
  { rainCount: 0, cloudCount: 1, hasLightning: false, skyColor: '#B8E0FF', sunOpacity: 0.8, sunSize: 10, showAirplane: false },
  // State 7: averageValue >75, glow 3+ - Perfect (airplane flies)
  { rainCount: 0, cloudCount: 0, hasLightning: false, skyColor: '#D0F0FF', sunOpacity: 1, sunSize: 12, showAirplane: true },
];

export function getWindowState(averageValue: number, glowTier: number): number {
  if (averageValue < 15) return 0;
  if (averageValue < 35) return 1;
  if (averageValue < 55) return glowTier >= 2 ? 3 : 2;
  if (averageValue < 75) return glowTier >= 3 ? 5 : 4;
  return glowTier >= 3 ? 7 : 6;
}

export function getWindowConfig(state: number): WindowStateConfig {
  return STATE_CONFIGS[state] ?? STATE_CONFIGS[0];
}

/* ── Cloud Path ─────────────────────────────────────────────── */

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

/* ── Rain Drop Path ────────────────────────────────────────── */

function buildRainDrop(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.lineTo(1, 4);
  p.lineTo(0, 3);
  p.lineTo(-1, 4);
  p.close();
  return p;
}

/* ── Sun Ray Path ───────────────────────────────────────────── */

function buildSunRay(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, -8);
  p.lineTo(1, -6);
  p.lineTo(3, -6);
  p.lineTo(1, -4);
  p.lineTo(2, 0);
  p.lineTo(-2, 0);
  p.lineTo(-1, -4);
  p.lineTo(-3, -6);
  p.lineTo(-1, -6);
  p.close();
  return p;
}

/* ── Lightning Path ────────────────────────────────────────── */

function buildLightning(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.lineTo(2, 3);
  p.lineTo(4, 1);
  p.lineTo(1, 5);
  p.lineTo(3, 5);
  p.lineTo(0, 9);
  p.close();
  return p;
}

/* ── Airplane Path ───────────────────────────────────────────── */

function buildAirplane(): SkPath {
  const p = Skia.Path.Make();
  // Simple airplane: rectangle body + triangle wing + cockpit
  p.moveTo(-8, -3);
  p.lineTo(8, -3);
  p.lineTo(6, 3);
  p.lineTo(8, 3);
  p.lineTo(4, 6);
  p.lineTo(-4, 6);
  p.lineTo(-8, 3);
  p.close();
  // Cockpit canopy
  p.moveTo(-6, -3);
  p.lineTo(-6, 1);
  p.lineTo(-4, 2);
  p.lineTo(-2, 1);
  p.lineTo(-2, -3);
  p.close();
  return p;
}

export const CLOUD_PATH = buildCloud();
export const RAIN_DROP_PATH = buildRainDrop();
export const SUN_RAY_PATH = buildSunRay();
export const LIGHTNING_PATH = buildLightning();
export const AIRPLANE_PATH = buildAirplane();