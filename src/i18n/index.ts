import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDeviceLocale } from './locales';
import { resources } from './resources';

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: getDeviceLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export default i18n;
