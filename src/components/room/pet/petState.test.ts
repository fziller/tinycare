import { describe, expect, it } from 'vitest';
import { getPetState, getPetTransitionClip, PET_STATE_META } from './petState';

describe('getPetState', () => {
  it('keeps the low-social hide threshold stable', () => {
    expect(getPetState(19, 80, 90)).toBe(0);
    expect(getPetState(20, 20, 90)).toBe(1);
  });

  it('switches between sit-small and sit-wag at movement 30', () => {
    expect(getPetState(30, 29, 50)).toBe(1);
    expect(getPetState(30, 30, 50)).toBe(2);
  });

  it('switches into mid-band idle states at social 40', () => {
    expect(getPetState(39, 50, 50)).toBe(2);
    expect(getPetState(40, 39, 50)).toBe(3);
  });

  it('uses glow to split idle glow and idle blink states', () => {
    expect(getPetState(50, 40, 19)).toBe(4);
    expect(getPetState(50, 40, 20)).toBe(4);
    expect(getPetState(50, 40, 50)).toBe(5);
  });

  it('switches to high-social hop and play states at the expected thresholds', () => {
    expect(getPetState(64, 90, 80)).toBe(5);
    expect(getPetState(65, 70, 80)).toBe(6);
    expect(getPetState(65, 71, 80)).toBe(7);
  });
});

describe('pet clip metadata', () => {
  it('provides the explicit priority transition clips', () => {
    expect(getPetTransitionClip(0, 3)).toBe('pet-transition-hide-to-idle');
    expect(getPetTransitionClip(3, 0)).toBe('pet-transition-idle-to-hide');
    expect(getPetTransitionClip(3, 6)).toBe('pet-transition-idle-to-hop');
    expect(getPetTransitionClip(7, 3)).toBe('pet-transition-play-to-idle');
  });

  it('falls back to direct loops for non-prioritized transitions', () => {
    expect(getPetTransitionClip(1, 2)).toBeUndefined();
    expect(getPetTransitionClip(2, 4)).toBeUndefined();
  });

  it('keeps play state hold time longer than the rest', () => {
    expect(PET_STATE_META[7].minHoldMs).toBeGreaterThan(PET_STATE_META[3].minHoldMs);
  });
});
