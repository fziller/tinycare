import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { DAY_MODE_CONFIG } from '../domain/needEngine';
import { NEED_CATALOG } from '../domain/needs';
import type { DayMode } from '../domain/types';
import { categoryLabel, needName } from '../i18n/needText';
import { useCareStore } from '../store/useCareStore';
import { colors, radii, spacing } from '../theme';

const modeOrder: DayMode[] = ['survival', 'normal', 'ambitious'];

export function Onboarding() {
  const { t } = useTranslation();
  const completeOnboarding = useCareStore((state) => state.completeOnboarding);
  const [dayMode, setDayMode] = useState<DayMode>('normal');
  const [selectedNeedIds, setSelectedNeedIds] = useState<string[]>(['hydration', 'food', 'energy']);
  const canContinue = selectedNeedIds.length >= 3;

  const needs = useMemo(() => NEED_CATALOG.filter((need) => need.isDefault || need.isOptionalMvp), []);

  function toggleNeed(needId: string) {
    void Haptics.selectionAsync().catch(() => undefined);
    setSelectedNeedIds((current) => {
      if (current.includes(needId)) {
        return current.filter((id) => id !== needId);
      }
      if (current.length >= DAY_MODE_CONFIG.ambitious.maxActiveNeeds) {
        return current;
      }
      return [...current, needId];
    });
  }

  function finish() {
    if (!canContinue) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    completeOnboarding(selectedNeedIds, dayMode);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.logo}>{t('appName')}</Text>
        <Text style={styles.title}>{t('onboarding.title')}</Text>
        <Text style={styles.copy}>{t('onboarding.copy')}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>{t('onboarding.modeTitle')}</Text>
        <View style={styles.modeGrid}>
          {modeOrder.map((mode) => {
            const selected = dayMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => {
                  setDayMode(mode);
                  void Haptics.selectionAsync().catch(() => undefined);
                }}
                style={[styles.modeButton, selected && styles.modeButtonSelected]}
              >
                <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>{t(`dayModes.${mode}.label`)}</Text>
                <Text style={[styles.modeCopy, selected && styles.modeCopySelected]}>{t(`dayModes.${mode}.description`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>{t('onboarding.needsTitle')}</Text>
        <Text style={styles.hint}>{t('onboarding.needsHint')}</Text>
        <View style={styles.needGrid}>
          {needs.map((need) => {
            const selected = selectedNeedIds.includes(need.id);
            return (
              <Pressable
                key={need.id}
                onPress={() => toggleNeed(need.id)}
                style={[
                  styles.needButton,
                  selected && { borderColor: need.visual.fill, backgroundColor: need.visual.base },
                ]}
              >
                <Text style={styles.needName}>{needName(t, need.id)}</Text>
                <Text style={styles.needMeta}>
                  {need.simsInspiredBy
                    ? t('onboarding.simsMeta', { motive: t(`simsMotives.${need.simsInspiredBy}`) })
                    : categoryLabel(t, need.category)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>{t('onboarding.disclaimer')}</Text>
      </View>

      <Pressable disabled={!canContinue} onPress={finish} style={[styles.primaryButton, !canContinue && styles.disabled]}>
        <Text style={styles.primaryText}>{t('onboarding.start')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: '100%',
    backgroundColor: colors.page,
    padding: spacing.lg,
    paddingTop: 64,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0,
  },
  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    color: colors.sage,
  },
  copy: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.muted,
  },
  panel: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },
  hint: {
    color: colors.muted,
    lineHeight: 20,
  },
  modeGrid: {
    gap: spacing.sm,
  },
  modeButton: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  modeButtonSelected: {
    borderColor: colors.sage,
    backgroundColor: colors.sageSoft,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },
  modeLabelSelected: {
    color: colors.sage,
  },
  modeCopy: {
    marginTop: 4,
    color: colors.muted,
    lineHeight: 19,
  },
  modeCopySelected: {
    color: colors.ink,
  },
  needGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  needButton: {
    width: '48%',
    minHeight: 82,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    justifyContent: 'space-between',
  },
  needName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },
  needMeta: {
    fontSize: 12,
    color: colors.muted,
  },
  disclaimer: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#FFFFFF99',
  },
  disclaimerText: {
    color: colors.muted,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: radii.md,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
});
