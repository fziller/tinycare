import { describe, expect, it } from 'vitest';
import { AQUARIUM_STATE_META, getAquariumState } from './aquariumState';

describe('getAquariumState', () => {
  it('keeps the empty and lonely thresholds stable', () => {
    expect(getAquariumState(14, 90)).toBe(0);
    expect(getAquariumState(15, 0)).toBe(1);
    expect(getAquariumState(39, 100)).toBe(1);
    expect(getAquariumState(40, 0)).toBe(2);
  });

  it('splits the 40-59 fun band by glow tier >= 2', () => {
    expect(getAquariumState(59, 49)).toBe(2);
    expect(getAquariumState(59, 50)).toBe(3);
  });

  it('splits the 60-74 fun band by glow tier >= 3', () => {
    expect(getAquariumState(60, 79)).toBe(4);
    expect(getAquariumState(60, 80)).toBe(5);
    expect(getAquariumState(74, 100)).toBe(5);
  });

  it('splits the top fun band into coral-school and golden-school', () => {
    expect(getAquariumState(75, 79)).toBe(6);
    expect(getAquariumState(75, 80)).toBe(7);
  });
});

describe('aquarium clip metadata', () => {
  it('maps every state to the expected clip id', () => {
    expect(AQUARIUM_STATE_META[0].clipId).toBe('aquarium-loop-empty-murky');
    expect(AQUARIUM_STATE_META[1].clipId).toBe('aquarium-loop-lonely');
    expect(AQUARIUM_STATE_META[2].clipId).toBe('aquarium-loop-sandy-pair');
    expect(AQUARIUM_STATE_META[3].clipId).toBe('aquarium-loop-bubbly-pair');
    expect(AQUARIUM_STATE_META[4].clipId).toBe('aquarium-loop-bloom-trio');
    expect(AQUARIUM_STATE_META[5].clipId).toBe('aquarium-loop-reflective-trio');
    expect(AQUARIUM_STATE_META[6].clipId).toBe('aquarium-loop-coral-school');
    expect(AQUARIUM_STATE_META[7].clipId).toBe('aquarium-loop-golden-school');
  });

  it('keeps high-state transitions tighter than the murky fallback', () => {
    expect(AQUARIUM_STATE_META[7].crossfadeMs).toBeLessThanOrEqual(AQUARIUM_STATE_META[0].crossfadeMs);
  });
});
