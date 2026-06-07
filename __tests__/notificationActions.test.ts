import { describe, expect, it } from 'vitest';
import { ACTION_DONE, ACTION_PAUSE_TODAY, ACTION_SNOOZE_30, mapNotificationAction } from '../src/domain/notificationActions';

describe('notification action mapping', () => {
  it('maps done action', () => {
    expect(mapNotificationAction(ACTION_DONE)).toEqual({ kind: 'done' });
  });

  it('maps snooze action', () => {
    expect(mapNotificationAction(ACTION_SNOOZE_30)).toEqual({ kind: 'snooze', snoozeMinutes: 30 });
  });

  it('maps pause action', () => {
    expect(mapNotificationAction(ACTION_PAUSE_TODAY)).toEqual({ kind: 'pause' });
  });

  it('keeps unknown actions explicit', () => {
    expect(mapNotificationAction('not-real')).toEqual({ kind: 'unknown' });
  });
});
