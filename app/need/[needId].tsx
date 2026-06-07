import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AnimatedNeedBar } from '../../src/components/AnimatedNeedBar';
import { CareScene } from '../../src/components/CareScene';
import { calculateNeedValue } from '../../src/domain/needEngine';
import { actionLabel, needDescription, needName, needStatusCopy } from '../../src/i18n/needText';
import { useCareStore } from '../../src/store/useCareStore';
import { colors, radii, spacing } from '../../src/theme';

export default function NeedDetailRoute() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ needId: string }>();
  const needId = String(params.needId);
  const need = useCareStore((state) => state.needsById[needId]);
  const dayMode = useCareStore((state) => state.dayMode);
  const logNeedAction = useCareStore((state) => state.logNeedAction);
  const snooze = useCareStore((state) => state.snooze);
  const pauseToday = useCareStore((state) => state.pauseToday);

  const currentNeed = useMemo(() => {
    if (!need) return undefined;
    return {
      ...need,
      value: calculateNeedValue(need, new Date(), dayMode),
    };
  }, [dayMode, need]);

  if (!currentNeed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.empty}>
          <Text style={styles.title}>{t('detail.notFound')}</Text>
          <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{t('common.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const visibleNeed = currentNeed;

  function handleAction(actionId: string) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    logNeedAction(visibleNeed.id, actionId, new Date());
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{t('common.back')}</Text>
          </Pressable>
          <Text style={styles.mode}>{t('detail.dayLabel', { mode: t(`dayModes.${dayMode}.label`) })}</Text>
        </View>

        <CareScene averageValue={visibleNeed.value} glow={visibleNeed.value / 8} compact />

        <View style={styles.hero}>
          <Text style={styles.title}>{needName(t, visibleNeed.id)}</Text>
          <Text style={styles.copy}>{needDescription(t, visibleNeed.id)}</Text>
          <AnimatedNeedBar need={visibleNeed} value={visibleNeed.value} />
          <Text style={styles.status}>{needStatusCopy(t, visibleNeed, visibleNeed.value)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('detail.doableTitle')}</Text>
          {visibleNeed.actions.map((action) => (
            <Pressable key={action.id} onPress={() => handleAction(action.id)} style={styles.actionButton}>
              <View>
                <Text style={styles.actionLabel}>{actionLabel(t, visibleNeed.id, action.id)}</Text>
                <Text style={styles.actionMeta}>{t('detail.effort', { effort: t(`effort.${action.effort}`) })}</Text>
              </View>
              <Text style={styles.actionBoost}>+{action.increaseBy}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sideActions}>
          <Pressable
            onPress={() => {
              snooze(visibleNeed.id, 30, new Date());
              router.back();
            }}
            style={styles.sideButton}
          >
            <Text style={styles.sideButtonText}>{t('detail.snooze')}</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              pauseToday(visibleNeed.id, new Date());
              router.back();
            }}
            style={styles.sideButton}
          >
            <Text style={styles.sideButtonText}>{t('detail.pauseToday')}</Text>
          </Pressable>
        </View>
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
  empty: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  mode: {
    color: colors.muted,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  hero: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0,
  },
  copy: {
    color: colors.muted,
    lineHeight: 21,
  },
  status: {
    color: colors.sage,
    fontWeight: '900',
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.ink,
    fontWeight: '900',
    fontSize: 18,
  },
  actionButton: {
    minHeight: 72,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLabel: {
    color: colors.ink,
    fontWeight: '900',
    fontSize: 16,
  },
  actionMeta: {
    color: colors.muted,
    marginTop: 3,
  },
  actionBoost: {
    color: colors.teal,
    fontWeight: '900',
    fontSize: 18,
  },
  sideActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sideButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radii.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
