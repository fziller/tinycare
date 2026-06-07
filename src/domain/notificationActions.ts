import type { NotificationActionKind } from './types';

export const REMINDER_CATEGORY_ID = 'tinycare_need_reminder';
export const ACTION_DONE = 'tinycare_done';
export const ACTION_SNOOZE_30 = 'tinycare_snooze_30';
export const ACTION_PAUSE_TODAY = 'tinycare_pause_today';
export const ACTION_OPEN = 'tinycare_open';

export type NotificationActionResult = {
  kind: NotificationActionKind;
  snoozeMinutes?: number;
};

export function mapNotificationAction(actionIdentifier: string): NotificationActionResult {
  switch (actionIdentifier) {
    case ACTION_DONE:
      return { kind: 'done' };
    case ACTION_SNOOZE_30:
      return { kind: 'snooze', snoozeMinutes: 30 };
    case ACTION_PAUSE_TODAY:
      return { kind: 'pause' };
    case ACTION_OPEN:
    case 'expo.modules.notifications.actions.DEFAULT':
    case 'default':
      return { kind: 'open' };
    default:
      return { kind: 'unknown' };
  }
}
