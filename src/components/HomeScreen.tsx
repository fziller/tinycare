import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getSmallestAction } from '../domain/needEngine';
import { NEED_CATALOG } from '../domain/needs';
import type { DayMode } from '../domain/types';
import { syncNeedRemindersAsync, registerNotificationInfrastructureAsync } from '../services/notifications';
import { selectActiveNeeds, useCareStore } from '../store/useCareStore';
import { useDevStore } from '../store/useDevStore';
import { colors, radii, spacing } from '../theme';
import { actionLabel, categoryLabel, needName, needStatusCopy } from '../i18n/needText';
import { AnimatedPressable } from './AnimatedPressable';
import { AnimatedSection } from './AnimatedSection';
import { CareScene } from './CareScene';
import { RoomScene } from './room/RoomScene';
import { NeedCard } from './NeedCard';

const modeOrder: DayMode[] = ['survival', 'normal', 'ambitious'];

type ModeChipProps = {
  mode: DayMode;
  selected: boolean;
  label: string;
  onPress: () => void;
};

function ModeChip({ mode, selected, label, onPress }: ModeChipProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, [selected, progress]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.card, colors.sage]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.line, colors.sage]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.muted, '#FFFFFF']),
  }));

  return (
    <AnimatedPressable style={[styles.modeChip, chipStyle]} onPress={onPress}>
      <Animated.Text style={[styles.modeChipText, textStyle]}>{label}</Animated.Text>
    </AnimatedPressable>
  );
}

export function HomeScreen() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  const activeNeedIds = useCareStore((state) => state.activeNeedIds);
  const needsById = useCareStore((state) => state.needsById);
  const dayMode = useCareStore((state) => state.dayMode);
  const glow = useCareStore((state) => state.glow);
  const logs = useCareStore((state) => state.logs);
  const notificationPermission = useCareStore((state) => state.notificationPermission);
  const setDayMode = useCareStore((state) => state.setDayMode);
  const setNotificationPermission = useCareStore((state) => state.setNotificationPermission);
  const refreshExpiredPauses = useCareStore((state) => state.refreshExpiredPauses);
  const logSmallestAction = useCareStore((state) => state.logSmallestAction);
  const toggleNeed = useCareStore((state) => state.toggleNeed);

  useEffect(() => {
    refreshExpiredPauses(now);
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [now, refreshExpiredPauses]);

  const devEnabled = useDevStore((state) => state.enabled);
  const devGlowOverride = useDevStore((state) => state.glow);
  const devAvgOverride = useDevStore((state) => state.averageValue);
  const devHydration = useDevStore((state) => state.hydration);
  const devFood = useDevStore((state) => state.food);
  const devEnergy = useDevStore((state) => state.energy);
  const devHygiene = useDevStore((state) => state.hygiene);
  const devBathroom = useDevStore((state) => state.bathroom);
  const devFun = useDevStore((state) => state.fun);
  const devSocial = useDevStore((state) => state.social);
  const devComfort = useDevStore((state) => state.comfort);
  const devEnvironment = useDevStore((state) => state.environment);
  const devMovement = useDevStore((state) => state.movement);

  const activeNeeds = selectActiveNeeds(now);
  const averageValue = activeNeeds.length
    ? Math.round(activeNeeds.reduce((sum, need) => sum + need.value, 0) / activeNeeds.length)
    : 0;
  const lowestNeed = [...activeNeeds].sort((a, b) => a.value - b.value)[0];

  const needValues: Record<string, number> = {};
  for (const need of activeNeeds) {
    needValues[need.category] = need.value;
  }

  const devGlow = devEnabled && devGlowOverride != null ? devGlowOverride : glow;
  const devAvg = devEnabled && devAvgOverride != null ? devAvgOverride : averageValue;
  const devNeedValues: Record<string, number> = { ...needValues };
  if (devEnabled) {
    const devMap: Record<string, number | null> = {
      hydration: devHydration,
      food: devFood,
      energy: devEnergy,
      hygiene: devHygiene,
      bathroom: devBathroom,
      fun: devFun,
      social: devSocial,
      comfort: devComfort,
      environment: devEnvironment,
      movement: devMovement,
    };
    for (const [key, val] of Object.entries(devMap)) {
      if (val != null) devNeedValues[key] = val;
    }
  }

  useEffect(() => {
    if (notificationPermission !== 'granted' || !activeNeeds.length) {
      return;
    }

    void syncNeedRemindersAsync(activeNeeds, dayMode).catch(() => undefined);
  }, [activeNeeds, dayMode, notificationPermission]);

  async function enableNotifications() {
    const permission = await registerNotificationInfrastructureAsync();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      await syncNeedRemindersAsync(activeNeeds, dayMode);
    }
  }

  function handleTinyAction() {
    if (!lowestNeed) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    logSmallestAction(lowestNeed.id, new Date());
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AnimatedSection delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>TinyCare</Text>
              <Text style={styles.title}>{t('home.title')}</Text>
            </View>
            <Pressable style={styles.settingsButton} onPress={() => router.push('/settings')}>
              <Text style={styles.settingsText}>{t('settings.title')}</Text>
            </Pressable>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <View style={styles.modeRow}>
            {modeOrder.map((mode) => {
              const selected = dayMode === mode;
              return (
                <ModeChip
                  key={mode}
                  mode={mode}
                  selected={selected}
                  label={t(`dayModes.${mode}.label`)}
                  onPress={() => {
                    setDayMode(mode);
                    void Haptics.selectionAsync().catch(() => undefined);
                  }}
                />
              );
            })}
          </View>
        </AnimatedSection>

        <AnimatedSection delay={160}>
          {devEnabled ? (
            <RoomScene needValues={devNeedValues as any} glow={devGlow} />
          ) : (
            <CareScene averageValue={devAvg} glow={devGlow} />
          )}
        </AnimatedSection>

        <AnimatedSection delay={240}>
          {lowestNeed ? (
            <AnimatedPressable style={styles.nextStep} onPress={handleTinyAction} breathe>
              <View>
                <Text style={styles.nextLabel}>{t('home.smallestNextStep')}</Text>
                <Text style={styles.nextTitle}>
                  {needName(t, lowestNeed.id)}: {actionLabel(t, lowestNeed.id, getSmallestAction(lowestNeed).id)}
                </Text>
                <Text style={styles.nextCopy}>{needStatusCopy(t, lowestNeed, lowestNeed.value)}</Text>
              </View>
              <Text style={styles.nextAction}>{t('home.doIt')}</Text>
            </AnimatedPressable>
          ) : null}
        </AnimatedSection>

        <AnimatedSection delay={320}>
          {notificationPermission !== 'granted' ? (
            <Pressable style={styles.notificationPanel} onPress={enableNotifications}>
              <Text style={styles.notificationTitle}>{t('home.enableRemindersTitle')}</Text>
              <Text style={styles.notificationCopy}>{t('home.enableRemindersCopy')}</Text>
            </Pressable>
          ) : null}
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.needBars')}</Text>
            <View style={styles.cardList}>
              {activeNeeds.map((need, index) => (
                <AnimatedSection key={need.id} delay={index * 80}>
                  <NeedCard need={need} />
                </AnimatedSection>
              ))}
            </View>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={700}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.optionalBars')}</Text>
            <View style={styles.optionalGrid}>
              {NEED_CATALOG.filter((need) => need.isOptionalMvp).map((need) => {
                const selected = activeNeedIds.includes(need.id);
                return (
                  <Pressable
                    key={need.id}
                    onPress={() => toggleNeed(need.id)}
                    style={[styles.optionalButton, selected && { backgroundColor: need.visual.base, borderColor: need.visual.fill }]}
                  >
                    <Text style={styles.optionalName}>{needName(t, need.id)}</Text>
                    <Text style={styles.optionalMeta}>
                      {selected
                        ? t('common.active')
                        : need.simsInspiredBy
                          ? t(`simsMotive.${need.simsInspiredBy}`)
                          : categoryLabel(t, need.category)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.reflectionTitle')}</Text>
            <View style={styles.reflection}>
              <Text style={styles.reflectionCopy}>
                {logs[0]
                  ? t('home.lastHelped', {
                      action: actionLabel(t, logs[0].needId, logs[0].actionId),
                      need: needsById[logs[0].needId] ? needName(t, logs[0].needId) : t('home.needBars'),
                    })
                  : t('home.noLogs')}
              </Text>
            </View>
          </View>
        </AnimatedSection>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.sage,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    fontSize: 33,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0,
  },
  settingsButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  settingsText: {
    color: colors.sage,
    fontWeight: '900',
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeChip: {
    flex: 1,
    minHeight: 42,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  modeChipSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  modeChipText: {
    color: colors.muted,
    fontWeight: '900',
  },
  modeChipTextSelected: {
    color: '#FFFFFF',
  },
  nextStep: {
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.ink,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'center',
  },
  nextLabel: {
    color: '#FFFFFFA8',
    fontWeight: '800',
    fontSize: 12,
  },
  nextTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    marginTop: 3,
  },
  nextCopy: {
    color: '#FFFFFFCC',
    marginTop: 4,
  },
  nextAction: {
    color: colors.amber,
    fontWeight: '900',
  },
  notificationPanel: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.sageSoft,
    borderWidth: 1,
    borderColor: '#A4CBC1',
  },
  notificationTitle: {
    color: colors.ink,
    fontWeight: '900',
    fontSize: 16,
  },
  notificationCopy: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 20,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.ink,
    fontWeight: '900',
    fontSize: 18,
  },
  cardList: {
    gap: spacing.md,
  },
  optionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionalButton: {
    width: '48%',
    minHeight: 74,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    justifyContent: 'space-between',
  },
  optionalName: {
    color: colors.ink,
    fontWeight: '900',
  },
  optionalMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  reflection: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.cardWarm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reflectionCopy: {
    color: colors.muted,
    lineHeight: 20,
  },
});
