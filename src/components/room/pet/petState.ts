import { clampNeed, glowTier } from '../RoomScene.types';

export type PetState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PetLoopClipId =
  | 'pet-loop-hide'
  | 'pet-loop-sit-small'
  | 'pet-loop-sit-wag'
  | 'pet-loop-idle'
  | 'pet-loop-idle-glow'
  | 'pet-loop-idle-blink'
  | 'pet-loop-hop'
  | 'pet-loop-play';

export type PetTransitionClipId =
  | 'pet-transition-hide-to-idle'
  | 'pet-transition-idle-to-hide'
  | 'pet-transition-idle-to-hop'
  | 'pet-transition-hop-to-idle'
  | 'pet-transition-idle-to-play'
  | 'pet-transition-play-to-idle';

export type PetStateMeta = {
  loopClipId: PetLoopClipId;
  transitionInClipId?: PetTransitionClipId;
  minHoldMs: number;
  fallbackCrossfadeMs: number;
};

export const PET_HYSTERESIS_MS = 250;

export const PET_STATE_META: Record<PetState, PetStateMeta> = {
  0: { loopClipId: 'pet-loop-hide', transitionInClipId: 'pet-transition-idle-to-hide', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  1: { loopClipId: 'pet-loop-sit-small', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  2: { loopClipId: 'pet-loop-sit-wag', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  3: { loopClipId: 'pet-loop-idle', transitionInClipId: 'pet-transition-hide-to-idle', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  4: { loopClipId: 'pet-loop-idle-glow', transitionInClipId: 'pet-transition-hide-to-idle', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  5: { loopClipId: 'pet-loop-idle-blink', transitionInClipId: 'pet-transition-hide-to-idle', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  6: { loopClipId: 'pet-loop-hop', transitionInClipId: 'pet-transition-idle-to-hop', minHoldMs: 400, fallbackCrossfadeMs: 220 },
  7: { loopClipId: 'pet-loop-play', transitionInClipId: 'pet-transition-idle-to-play', minHoldMs: 700, fallbackCrossfadeMs: 260 },
};

const TRANSITION_MAP: Partial<Record<`${PetState}->${PetState}`, PetTransitionClipId>> = {
  '0->3': 'pet-transition-hide-to-idle',
  '0->4': 'pet-transition-hide-to-idle',
  '0->5': 'pet-transition-hide-to-idle',
  '3->0': 'pet-transition-idle-to-hide',
  '4->0': 'pet-transition-idle-to-hide',
  '5->0': 'pet-transition-idle-to-hide',
  '3->6': 'pet-transition-idle-to-hop',
  '4->6': 'pet-transition-idle-to-hop',
  '5->6': 'pet-transition-idle-to-hop',
  '6->3': 'pet-transition-hop-to-idle',
  '6->4': 'pet-transition-hop-to-idle',
  '6->5': 'pet-transition-hop-to-idle',
  '3->7': 'pet-transition-idle-to-play',
  '4->7': 'pet-transition-idle-to-play',
  '5->7': 'pet-transition-idle-to-play',
  '7->3': 'pet-transition-play-to-idle',
  '7->4': 'pet-transition-play-to-idle',
  '7->5': 'pet-transition-play-to-idle',
};

export function getPetState(social: number, movement: number, glow: number): PetState {
  const s = clampNeed(social);
  const m = clampNeed(movement);
  const tier = glowTier(glow);

  if (s < 20) return 0;
  if (s < 40) return m < 30 ? 1 : 2;
  if (s < 65) {
    if (m < 40) return 3;
    return tier < 2 ? 4 : 5;
  }
  if (m <= 70) return 6;
  return 7;
}

export function getPetTransitionClip(fromState: PetState, toState: PetState): PetTransitionClipId | undefined {
  return TRANSITION_MAP[`${fromState}->${toState}`];
}

