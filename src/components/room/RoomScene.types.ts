import { useEffect, useRef, useState } from 'react';
import type { NeedCategory } from '../../domain/types';

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'sunset' | 'dusk' | 'night' | 'lateNight';

export type RoomNeedValues = Record<NeedCategory, number>;

export type RoomSceneProps = {
  needValues: Partial<RoomNeedValues>;
  glow: number;
  timeOfDay?: TimeOfDay;
  compact?: boolean;
};

export const DEFAULT_NEED_VALUES: RoomNeedValues = {
  hydration: 72,
  food: 72,
  energy: 72,
  hygiene: 72,
  bathroom: 72,
  fun: 72,
  social: 72,
  comfort: 72,
  environment: 72,
  movement: 72,
  custom: 72,
};

export function clampNeed(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function lowRemap(value: number): number {
  if (value >= 50) return 0;
  if (value <= 0) return 1;
  return (50 - value) / 50;
}

export function glowTier(glow: number): 0 | 1 | 2 | 3 {
  if (glow >= 80) return 3;
  if (glow >= 50) return 2;
  if (glow >= 20) return 1;
  return 0;
}

export function useAnimatedNumeric(value: number, duration = 800): number {
  const [current, setCurrent] = useState(value);
  const lastTarget = useRef(value);

  useEffect(() => {
    if (value === lastTarget.current) return;
    const from = current;
    const startTime = Date.now();
    lastTarget.current = value;

    let frame: number;
    function tick() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return current;
}
