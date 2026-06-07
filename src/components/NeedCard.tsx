import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Need } from '../domain/types';
import { needName, needStatusCopy } from '../i18n/needText';
import { AnimatedNeedBar } from './AnimatedNeedBar';
import { AnimatedPressable } from './AnimatedPressable';
import { colors, radii, spacing } from '../theme';

type Props = {
  need: Need;
};

export function NeedCard({ need }: Props) {
  const { t } = useTranslation();
  const paused = need.isPaused && need.pausedUntil && new Date(need.pausedUntil) > new Date();

  return (
    <AnimatedPressable style={styles.card} onPress={() => router.push(`/need/${need.id}`)}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{needName(t, need.id)}</Text>
          <Text style={styles.copy}>{paused ? t('detail.pausedForToday') : needStatusCopy(t, need, need.value)}</Text>
        </View>
        <Text style={styles.chevron}>{t('common.open')}</Text>
      </View>
      <AnimatedNeedBar need={need} value={need.value} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },
  copy: {
    marginTop: 2,
    color: colors.muted,
    fontWeight: '700',
  },
  chevron: {
    color: colors.sage,
    fontWeight: '900',
  },
});
