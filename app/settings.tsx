import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '../src/i18n';
import { FUTURE_NEED_BAR_IDS } from '../src/domain/needs';
import type { SupportedLocale } from '../src/domain/types';
import { SUPPORTED_LOCALES } from '../src/i18n/locales';
import { configureNotificationInfrastructureAsync, syncNeedRemindersAsync } from '../src/services/notifications';
import { selectActiveNeeds, useCareStore } from '../src/store/useCareStore';
import { useDevStore } from '../src/store/useDevStore';
import { DevSliders } from '../src/components/DevSliders';
import { colors, radii, spacing } from '../src/theme';

const splashConcept = require('../assets/design/tinycare-splash-concept.png');

export default function SettingsRoute() {
  const { t } = useTranslation();
  const locale = useCareStore((state) => state.locale);
  const dayMode = useCareStore((state) => state.dayMode);
  const notificationPermission = useCareStore((state) => state.notificationPermission);
  const lastNotificationSyncAt = useCareStore((state) => state.lastNotificationSyncAt);
  const setLocale = useCareStore((state) => state.setLocale);
  const resetApp = useCareStore((state) => state.resetApp);

  const devEnabled = useDevStore((state) => state.enabled);
  const setDevEnabled = useDevStore((state) => state.setEnabled);
  const setDevValue = useDevStore((state) => state.setValue);
  const resetDev = useDevStore((state) => state.reset);

  const devSliderValues: Record<string, number> = {
    hydration: useDevStore((state) => state.hydration ?? 72),
    food: useDevStore((state) => state.food ?? 72),
    energy: useDevStore((state) => state.energy ?? 72),
    hygiene: useDevStore((state) => state.hygiene ?? 72),
    bathroom: useDevStore((state) => state.bathroom ?? 72),
    fun: useDevStore((state) => state.fun ?? 72),
    social: useDevStore((state) => state.social ?? 72),
    comfort: useDevStore((state) => state.comfort ?? 72),
    environment: useDevStore((state) => state.environment ?? 72),
    movement: useDevStore((state) => state.movement ?? 72),
    averageValue: useDevStore((state) => state.averageValue ?? 50),
    glow: useDevStore((state) => state.glow ?? 0),
  };

  async function changeLocale(nextLocale: SupportedLocale) {
    setLocale(nextLocale);
    await i18n.changeLanguage(nextLocale);
    await configureNotificationInfrastructureAsync();
    if (notificationPermission === 'granted') {
      await syncNeedRemindersAsync(selectActiveNeeds(), dayMode);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{t('common.back')}</Text>
          </Pressable>
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.languageTitle')}</Text>
          <Text style={styles.copy}>{t('settings.languageCopy')}</Text>
          <View style={styles.languageRow}>
            {SUPPORTED_LOCALES.map((candidate) => {
              const selected = locale === candidate;
              return (
                <Pressable
                  key={candidate}
                  onPress={() => {
                    void changeLocale(candidate);
                  }}
                  style={[styles.languageButton, selected && styles.languageButtonSelected]}
                >
                  <Text style={[styles.languageText, selected && styles.languageTextSelected]}>
                    {candidate === 'en' ? 'English' : 'Deutsch'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.privacyTitle')}</Text>
          <Text style={styles.copy}>{t('settings.privacyCopy')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.notificationsTitle')}</Text>
          <Text style={styles.copy}>{t('common.permission')}: {notificationPermission}</Text>
          <Text style={styles.copy}>
            {t('common.lastSync')}: {lastNotificationSyncAt ? new Date(lastNotificationSyncAt).toLocaleString(locale) : t('common.notSyncedYet')}
          </Text>
          <Text style={styles.copy}>{t('settings.notificationsCopy')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.splashTitle')}</Text>
          <Image source={splashConcept} style={styles.conceptImage} resizeMode="cover" />
          <Text style={styles.copy}>{t('settings.splashCopy')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.futureBarsTitle')}</Text>
          <Text style={styles.copy}>{FUTURE_NEED_BAR_IDS.map((id) => t(`futureNeedBars.${id}`)).join(', ')}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{t('settings.crisisTitle')}</Text>
          <Text style={styles.copy}>{t('settings.crisisCopy')}</Text>
        </View>

        {__DEV__ && (
          <>
            <View style={styles.panel}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>🧪 Dev Controls</Text>
                <Pressable
                  onPress={() => setDevEnabled(!devEnabled)}
                  style={[
                    {
                      minHeight: 32,
                      paddingHorizontal: spacing.sm,
                      borderRadius: radii.sm,
                      borderWidth: 1,
                      borderColor: devEnabled ? colors.sage : colors.line,
                      backgroundColor: devEnabled ? colors.sage : colors.card,
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <Text style={{ fontWeight: '900', fontSize: 12, color: devEnabled ? '#FFFFFF' : colors.muted }}>
                    {devEnabled ? 'ON' : 'OFF'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.copy}>Override room parameters to test visuals.</Text>
            </View>
            {devEnabled && (
              <DevSliders values={devSliderValues} onChange={(key, value) => setDevValue(key as any, value)} onReset={resetDev} />
            )}
          </>
        )}

        <Pressable onPress={resetApp} style={styles.dangerButton}>
          <Text style={styles.dangerText}>{t('settings.reset')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  title: {
    fontSize: 33,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0,
  },
  secondaryButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  secondaryText: {
    color: colors.sage,
    fontWeight: '900',
  },
  panel: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontWeight: '900',
    fontSize: 17,
  },
  copy: {
    color: colors.muted,
    lineHeight: 21,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cardWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  languageText: {
    color: colors.muted,
    fontWeight: '900',
  },
  languageTextSelected: {
    color: '#FFFFFF',
  },
  conceptImage: {
    width: '100%',
    height: 220,
    borderRadius: radii.md,
    backgroundColor: colors.cardWarm,
  },
  dangerButton: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
