import { clampNeed, glowTier } from '../RoomScene.types';

export type WindowState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type WindowLoopClipId =
  | 'window-loop-storm'
  | 'window-loop-rain'
  | 'window-loop-light-rain'
  | 'window-loop-clearing'
  | 'window-loop-partly-cloudy'
  | 'window-loop-sunny'
  | 'window-loop-bright'
  | 'window-loop-perfect-flight';

export type WindowStateMeta = {
  loopClipId: WindowLoopClipId;
  fallbackCrossfadeMs: number;
  description: string;
};

export const WINDOW_STATE_META: Record<WindowState, WindowStateMeta> = {
  0: { loopClipId: 'window-loop-storm', fallbackCrossfadeMs: 220, description: 'storm' },
  1: { loopClipId: 'window-loop-rain', fallbackCrossfadeMs: 220, description: 'rain' },
  2: { loopClipId: 'window-loop-light-rain', fallbackCrossfadeMs: 220, description: 'light-rain' },
  3: { loopClipId: 'window-loop-clearing', fallbackCrossfadeMs: 220, description: 'clearing' },
  4: { loopClipId: 'window-loop-partly-cloudy', fallbackCrossfadeMs: 200, description: 'partly-cloudy' },
  5: { loopClipId: 'window-loop-sunny', fallbackCrossfadeMs: 200, description: 'sunny' },
  6: { loopClipId: 'window-loop-bright', fallbackCrossfadeMs: 180, description: 'bright' },
  7: { loopClipId: 'window-loop-perfect-flight', fallbackCrossfadeMs: 180, description: 'perfect-flight' },
};

export function getWindowState(averageValue: number, glow: number): WindowState {
  const avg = clampNeed(averageValue);
  const tier = glowTier(glow);

  if (avg < 15) return 0;
  if (avg < 35) return 1;
  if (avg < 55) return tier >= 2 ? 3 : 2;
  if (avg < 75) return tier >= 3 ? 5 : 4;
  return tier >= 3 ? 7 : 6;
}
