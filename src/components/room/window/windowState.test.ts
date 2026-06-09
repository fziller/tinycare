import { describe, expect, it } from 'vitest';
import { getWindowState, WINDOW_STATE_META } from './windowState';

describe('getWindowState', () => {
  it('keeps the storm and rain thresholds stable', () => {
    expect(getWindowState(14, 80)).toBe(0);
    expect(getWindowState(15, 10)).toBe(1);
    expect(getWindowState(34, 90)).toBe(1);
    expect(getWindowState(35, 0)).toBe(2);
  });

  it('splits the mid-band by glow threshold', () => {
    expect(getWindowState(54, 19)).toBe(2);
    expect(getWindowState(54, 20)).toBe(3);
  });

  it('splits the upper-mid band by max glow tier only', () => {
    expect(getWindowState(55, 79)).toBe(4);
    expect(getWindowState(55, 80)).toBe(5);
    expect(getWindowState(74, 100)).toBe(5);
  });

  it('splits the top band into bright and perfect-flight', () => {
    expect(getWindowState(75, 79)).toBe(6);
    expect(getWindowState(75, 80)).toBe(7);
  });
});

describe('window clip metadata', () => {
  it('provides stable clip ids for all states', () => {
    expect(WINDOW_STATE_META[0].loopClipId).toBe('window-loop-storm');
    expect(WINDOW_STATE_META[7].loopClipId).toBe('window-loop-perfect-flight');
  });

  it('keeps the top states snappier than the storm states', () => {
    expect(WINDOW_STATE_META[7].fallbackCrossfadeMs).toBeLessThanOrEqual(WINDOW_STATE_META[0].fallbackCrossfadeMs);
  });
});
