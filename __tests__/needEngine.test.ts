import { describe, expect, it } from 'vitest';
import { applyNeedAction, calculateNeedValue, hoursUntilReminderThreshold, pauseNeedForToday, snoozeNeed } from '../src/domain/needEngine';
import { createNeedFromTemplate, getNeedTemplate } from '../src/domain/needs';

const baseTime = new Date('2026-06-06T08:00:00.000Z');

function makeNeed() {
  const template = getNeedTemplate('food');
  if (!template) {
    throw new Error('food template missing');
  }
  return createNeedFromTemplate(template, baseTime, 100);
}

describe('need engine', () => {
  it('decays needs over elapsed time', () => {
    const need = makeNeed();
    const value = calculateNeedValue(need, new Date('2026-06-06T10:00:00.000Z'), 'normal');

    expect(value).toBe(60);
  });

  it('applies actions after calculating current decay', () => {
    const need = makeNeed();
    const snack = need.actions.find((action) => action.id === 'tiny-snack');
    if (!snack) throw new Error('snack action missing');

    const updated = applyNeedAction(need, snack, new Date('2026-06-06T10:00:00.000Z'), 'normal');

    expect(updated.value).toBe(85);
    expect(updated.isPaused).toBe(false);
  });

  it('does not decay while paused for today', () => {
    const need = pauseNeedForToday(makeNeed(), baseTime);
    const value = calculateNeedValue(need, new Date('2026-06-06T20:00:00.000Z'), 'normal');

    expect(value).toBe(100);
  });

  it('uses snooze time before threshold time', () => {
    const need = snoozeNeed(makeNeed(), baseTime, 0.5);
    const hours = hoursUntilReminderThreshold(need, baseTime, 'normal');

    expect(hours).toBe(0.5);
  });
});
