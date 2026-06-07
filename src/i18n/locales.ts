import type { SupportedLocale } from '../domain/types';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'de'];

export function normalizeLocale(languageCode?: string | null): SupportedLocale {
  return languageCode === 'de' ? 'de' : 'en';
}

export function getDeviceLocale(): SupportedLocale {
  if (typeof process !== 'undefined' && process.env.VITEST) {
    return 'en';
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports -- static import pulls react-native into Vitest.
  const localization = require('expo-localization') as typeof import('expo-localization');
  return normalizeLocale(localization.getLocales()[0]?.languageCode);
}
