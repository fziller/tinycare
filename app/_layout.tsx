import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppIntroSplash } from '../src/components/AppIntroSplash';
import i18n from '../src/i18n';
import {
  addNotificationResponseListener,
  configureNotificationInfrastructureAsync,
  processLastNotificationResponse,
} from '../src/services/notifications';
import { useCareStore } from '../src/store/useCareStore';

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 450,
  fade: true,
});

export default function RootLayout() {
  const [showIntro, setShowIntro] = useState(true);
  const locale = useCareStore((state) => state.locale);

  useEffect(() => {
    void (async () => {
      await i18n.changeLanguage(locale);
      await configureNotificationInfrastructureAsync();
    })().catch(() => undefined);
    processLastNotificationResponse();
    const subscription = addNotificationResponseListener();
    return () => subscription.remove();
  }, [locale]);

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const finishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (showIntro) {
    return <AppIntroSplash onDone={finishIntro} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFF8EF' },
      }}
    />
  );
}
