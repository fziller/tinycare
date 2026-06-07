import { addHours, endOfDay, formatISO } from 'date-fns';
import type { DayMode, Need, NeedAction } from './types';

export const DAY_MODE_CONFIG: Record<
  DayMode,
  {
    maxActiveNeeds: number;
    decayMultiplier: number;
    maxScheduledReminders: number;
  }
> = {
  survival: {
    maxActiveNeeds: 3,
    decayMultiplier: 0.62,
    maxScheduledReminders: 3,
  },
  normal: {
    maxActiveNeeds: 5,
    decayMultiplier: 1,
    maxScheduledReminders: 5,
  },
  ambitious: {
    maxActiveNeeds: 6,
    decayMultiplier: 1.12,
    maxScheduledReminders: 6,
  },
};

export function clampNeedValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function hoursBetween(from: Date, to: Date): number {
  return Math.max(0, (to.getTime() - from.getTime()) / 1000 / 60 / 60);
}

export function calculateNeedValue(need: Need, now: Date, mode: DayMode = 'normal'): number {
  if (need.isPaused && need.pausedUntil && new Date(need.pausedUntil) > now) {
    return need.value;
  }

  const lastUpdatedAt = new Date(need.lastUpdatedAt);
  const decay = need.decayPerHour * DAY_MODE_CONFIG[mode].decayMultiplier * hoursBetween(lastUpdatedAt, now);

  return clampNeedValue(need.value - decay);
}

export function applyNeedAction(need: Need, action: NeedAction, now: Date, mode: DayMode = 'normal'): Need {
  const currentValue = calculateNeedValue(need, now, mode);

  return {
    ...need,
    value: clampNeedValue(currentValue + action.increaseBy),
    lastUpdatedAt: now.toISOString(),
    isPaused: false,
    pausedUntil: undefined,
    snoozedUntil: undefined,
  };
}

export function snoozeNeed(need: Need, now: Date, hours = 0.5): Need {
  return {
    ...need,
    snoozedUntil: addHours(now, hours).toISOString(),
  };
}

export function pauseNeedForToday(need: Need, now: Date): Need {
  return {
    ...need,
    isPaused: true,
    pausedUntil: endOfDay(now).toISOString(),
  };
}

export function reactivateExpiredPause(need: Need, now: Date): Need {
  if (!need.isPaused || !need.pausedUntil || new Date(need.pausedUntil) > now) {
    return need;
  }

  return {
    ...need,
    isPaused: false,
    pausedUntil: undefined,
  };
}

export function getNeedStatus(value: number): 'stable' | 'low' | 'critical' {
  if (value <= 18) return 'critical';
  if (value <= 40) return 'low';
  return 'stable';
}

export function getSmallestAction(need: Need): NeedAction {
  return need.actions.find((action) => action.effort === 'tiny') ?? need.actions[0];
}

export function hoursUntilReminderThreshold(need: Need, now: Date, mode: DayMode): number {
  if (need.snoozedUntil && new Date(need.snoozedUntil) > now) {
    return hoursBetween(now, new Date(need.snoozedUntil));
  }

  const currentValue = calculateNeedValue(need, now, mode);
  if (currentValue <= need.reminderThreshold) {
    return 0;
  }

  const adjustedDecay = need.decayPerHour * DAY_MODE_CONFIG[mode].decayMultiplier;
  if (adjustedDecay <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return (currentValue - need.reminderThreshold) / adjustedDecay;
}

export function createLogId(now: Date, needId: string, actionId: string): string {
  return `${formatISO(now)}-${needId}-${actionId}`;
}
