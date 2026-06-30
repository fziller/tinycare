import { clampNeed, glowTier } from '../RoomScene.types';

export type AquariumState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AquariumLoopClipId =
  | 'aquarium-loop-empty-murky'
  | 'aquarium-loop-lonely'
  | 'aquarium-loop-sandy-pair'
  | 'aquarium-loop-bubbly-pair'
  | 'aquarium-loop-bloom-trio'
  | 'aquarium-loop-reflective-trio'
  | 'aquarium-loop-coral-school'
  | 'aquarium-loop-golden-school';

export type AquariumStateMeta = {
  clipId: AquariumLoopClipId;
  crossfadeMs: number;
  description: string;
};

export const AQUARIUM_STATE_META: Record<AquariumState, AquariumStateMeta> = {
  0: { clipId: 'aquarium-loop-empty-murky', crossfadeMs: 260, description: 'murky-empty' },
  1: { clipId: 'aquarium-loop-lonely', crossfadeMs: 240, description: 'lonely-fish' },
  2: { clipId: 'aquarium-loop-sandy-pair', crossfadeMs: 220, description: 'sandy-pair' },
  3: { clipId: 'aquarium-loop-bubbly-pair', crossfadeMs: 220, description: 'bubbly-pair' },
  4: { clipId: 'aquarium-loop-bloom-trio', crossfadeMs: 200, description: 'bloom-trio' },
  5: { clipId: 'aquarium-loop-reflective-trio', crossfadeMs: 200, description: 'reflective-trio' },
  6: { clipId: 'aquarium-loop-coral-school', crossfadeMs: 180, description: 'coral-school' },
  7: { clipId: 'aquarium-loop-golden-school', crossfadeMs: 180, description: 'golden-school' },
};

export function getAquariumState(fun: number, glow: number): AquariumState {
  const funValue = clampNeed(fun);
  const tier = glowTier(glow);

  if (funValue < 15) return 0;
  if (funValue < 40) return 1;
  if (funValue < 60) return tier >= 2 ? 3 : 2;
  if (funValue < 75) return tier >= 3 ? 5 : 4;
  return tier >= 3 ? 7 : 6;
}
