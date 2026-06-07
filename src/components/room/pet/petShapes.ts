import { Skia } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

export type Mood = 'neutral' | 'smile' | 'sad';

export function buildBodyPath(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(0, -14);
  p.cubicTo(6, -14, 10, -6, 10, 0);
  p.cubicTo(10, 8, 8, 14, 0, 14);
  p.cubicTo(-8, 14, -10, 8, -10, 0);
  p.cubicTo(-10, -6, -6, -14, 0, -14);
  p.close();
  return p;
}

const BODY_HALF_H = 14;

export function bodyScaleFactor(targetR: number): number {
  return targetR / BODY_HALF_H;
}

export function buildEarPath(): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-4, 0);
  p.cubicTo(-5, -6, -3, -11, 0, -13);
  p.cubicTo(3, -11, 5, -6, 4, 0);
  p.close();
  return p;
}

export function buildMouthPath(mood: Mood): SkPath {
  const p = Skia.Path.Make();
  p.moveTo(-3, 0);
  if (mood === 'smile') {
    p.cubicTo(-1, 2, 1, 2, 3, 0);
  } else if (mood === 'sad') {
    p.cubicTo(-1, -2, 1, -2, 3, 0);
  } else {
    p.lineTo(3, 0);
  }
  return p;
}

export function moodFromState(state: number): Mood {
  if (state >= 6) return 'smile';
  if (state <= 1) return 'sad';
  return 'neutral';
}

export const TAIL_PATH = (() => {
  const p = Skia.Path.Make();
  p.moveTo(0, 0);
  p.cubicTo(-6, -3, -10, -6, -8, -12);
  return p;
})();

export const HEART_PATH = (() => {
  const p = Skia.Path.Make();
  p.moveTo(0, -6);
  p.cubicTo(-4, -14, -14, -10, -14, -2);
  p.cubicTo(-14, 4, -6, 10, 0, 16);
  p.cubicTo(6, 10, 14, 4, 14, -2);
  p.cubicTo(14, -10, 4, -14, 0, -6);
  p.close();
  return p;
})();

export const PAW_PATH = (() => {
  const p = Skia.Path.Make();
  p.moveTo(-4, 0);
  p.cubicTo(-4, -4, 4, -4, 4, 0);
  p.cubicTo(4, 4, -4, 4, -4, 0);
  p.close();
  return p;
})();
