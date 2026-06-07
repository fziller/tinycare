import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import i18n from '../i18n';
import { DAY_MODE_CONFIG, getSmallestAction, hoursUntilReminderThreshold } from '../domain/needEngine';
import {
  ACTION_DONE,
  ACTION_OPEN,
  ACTION_PAUSE_TODAY,
  ACTION_SNOOZE_30,
  REMINDER_CATEGORY_ID,
  mapNotificationAction,
} from '../domain/notificationActions';
import type { DayMode, Need, NotificationPermissionState } from '../domain/types';
import { actionReminderCopy, needName } from '../i18n/needText';
import { getNotificationActionLabels } from '../i18n/notificationText';
import { useCareStore } from '../store/useCareStore';

const CHANNEL_ID = 'tinycare-need-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function configureNotificationInfrastructureAsync(): Promise<void> {
  const labels = getNotificationActionLabels();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: i18n.t('notification.channelName'),
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180, 120, 180],
      lightColor: '#9ED5BA',
    });
  }

  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY_ID, [
    {
      identifier: ACTION_DONE,
      buttonTitle: labels.done,
      options: { opensAppToForeground: true },
    },
    {
      identifier: ACTION_SNOOZE_30,
      buttonTitle: labels.snooze30,
      options: { opensAppToForeground: true },
    },
    {
      identifier: ACTION_PAUSE_TODAY,
      buttonTitle: labels.pauseToday,
      options: { opensAppToForeground: true },
    },
    {
      identifier: ACTION_OPEN,
      buttonTitle: labels.open,
      options: { opensAppToForeground: true },
    },
  ]);
}

export async function registerNotificationInfrastructureAsync(): Promise<NotificationPermissionState> {
  await configureNotificationInfrastructureAsync();

  const existing = await Notifications.getPermissionsAsync();
  const finalStatus = existing.granted ? existing : await Notifications.requestPermissionsAsync();

  if (finalStatus.granted) return 'granted';
  if (finalStatus.canAskAgain === false) return 'denied';
  return 'unknown';
}

export async function syncNeedRemindersAsync(needs: Need[], mode: DayMode): Promise<void> {
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  const candidates = needs
    .filter((need) => !need.isPaused || !need.pausedUntil || new Date(need.pausedUntil) <= now)
    .map((need) => ({
      need,
      hoursUntilReminder: hoursUntilReminderThreshold(need, now, mode),
    }))
    .filter((candidate) => Number.isFinite(candidate.hoursUntilReminder))
    .sort((a, b) => a.hoursUntilReminder - b.hoursUntilReminder)
    .slice(0, DAY_MODE_CONFIG[mode].maxScheduledReminders);

  await Promise.all(
    candidates.map(({ need, hoursUntilReminder }) => {
      const smallestAction = getSmallestAction(need);
      const seconds = Math.max(60, Math.round(hoursUntilReminder * 60 * 60));
      const copy = actionReminderCopy(i18n.t, need, smallestAction);

      return Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notification.title', { need: needName(i18n.t, need.id) }),
          body: i18n.t('notification.body', { copy }),
          categoryIdentifier: REMINDER_CATEGORY_ID,
          data: {
            needId: need.id,
            smallestActionId: smallestAction.id,
            url: `tinycare://need/${need.id}`,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          channelId: CHANNEL_ID,
        },
      });
    }),
  );

  useCareStore.getState().markNotificationSync(now);
}

export function processNotificationResponse(response: Notifications.NotificationResponse | null | undefined): void {
  if (!response) return;

  const action = mapNotificationAction(response.actionIdentifier);
  const data = response.notification.request.content.data as {
    needId?: string;
    smallestActionId?: string;
  };

  if (!data.needId) return;

  const store = useCareStore.getState();

  if (action.kind === 'done') {
    if (data.smallestActionId) {
      store.logNeedAction(data.needId, data.smallestActionId, new Date());
    } else {
      store.logSmallestAction(data.needId, new Date());
    }
  }

  if (action.kind === 'snooze') {
    store.snooze(data.needId, action.snoozeMinutes ?? 30, new Date());
  }

  if (action.kind === 'pause') {
    store.pauseToday(data.needId, new Date());
  }
}

export function addNotificationResponseListener(): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(processNotificationResponse);
}

export function processLastNotificationResponse(): void {
  processNotificationResponse(Notifications.getLastNotificationResponse());
}
