import type { TFunction } from 'i18next';
import type { Need, NeedAction, NeedCategory } from '../domain/types';
import { getNeedStatus } from '../domain/needEngine';

export function needName(t: TFunction, needId: string): string {
  return t(`needs.${needId}.name`);
}

export function needDescription(t: TFunction, needId: string): string {
  return t(`needs.${needId}.description`);
}

export function needStatusCopy(t: TFunction, need: Need, value: number): string {
  return t(`needs.${need.id}.tone.${getNeedStatus(value)}`);
}

export function actionLabel(t: TFunction, needId: string, actionId: string): string {
  return t(`needs.${needId}.actions.${actionId}.label`);
}

export function actionReminderCopy(t: TFunction, need: Need, action: NeedAction): string {
  const reminderKey = `needs.${need.id}.actions.${action.id}.reminder`;
  const reminder = t(reminderKey, { defaultValue: '' });
  return reminder || needStatusCopy(t, need, need.value);
}

export function categoryLabel(t: TFunction, category: NeedCategory): string {
  return t(`categories.${category}`);
}
