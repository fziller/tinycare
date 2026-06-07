import { describe, expect, it } from 'vitest';
import i18n from '../src/i18n';
import { NEED_CATALOG, FUTURE_NEED_BAR_IDS } from '../src/domain/needs';
import { SUPPORTED_LOCALES } from '../src/i18n/locales';
import { getNotificationActionLabels } from '../src/i18n/notificationText';
import { resources } from '../src/i18n/resources';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe('i18n resources', () => {
  it('keeps English and German translation keys in sync', () => {
    const englishKeys = flattenKeys(resources.en.translation).sort();
    const germanKeys = flattenKeys(resources.de.translation).sort();

    expect(germanKeys).toEqual(englishKeys);
  });

  it('has copy for every configured need and action in every locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      void i18n.changeLanguage(locale);

      for (const need of NEED_CATALOG) {
        expect(i18n.exists(`needs.${need.id}.name`)).toBe(true);
        expect(i18n.exists(`needs.${need.id}.description`)).toBe(true);
        expect(i18n.exists(`needs.${need.id}.tone.stable`)).toBe(true);
        expect(i18n.exists(`needs.${need.id}.tone.low`)).toBe(true);
        expect(i18n.exists(`needs.${need.id}.tone.critical`)).toBe(true);

        for (const action of need.actions) {
          expect(i18n.exists(`needs.${need.id}.actions.${action.id}.label`)).toBe(true);
          if (action.effort === 'tiny') {
            expect(i18n.exists(`needs.${need.id}.actions.${action.id}.reminder`)).toBe(true);
          }
        }
      }

      for (const futureNeedId of FUTURE_NEED_BAR_IDS) {
        expect(i18n.exists(`futureNeedBars.${futureNeedId}`)).toBe(true);
      }
    }
  });

  it('localizes notification actions without mixing languages', async () => {
    await i18n.changeLanguage('en');
    expect(getNotificationActionLabels()).toEqual({
      done: 'Done',
      snooze30: 'Snooze 30m',
      pauseToday: 'Pause today',
      open: 'Open',
    });

    await i18n.changeLanguage('de');
    expect(getNotificationActionLabels()).toEqual({
      done: 'Erledigt',
      snooze30: '30 Min. später',
      pauseToday: 'Heute pausieren',
      open: 'Öffnen',
    });
  });
});
