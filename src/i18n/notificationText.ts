import i18n from '.';

export function getNotificationActionLabels() {
  return {
    done: i18n.t('notification.actions.done'),
    snooze30: i18n.t('notification.actions.snooze30'),
    pauseToday: i18n.t('notification.actions.pauseToday'),
    open: i18n.t('notification.actions.open'),
  };
}
