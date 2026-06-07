import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { CareScene } from './CareScene';
import { colors } from '../theme';

type Props = {
  onDone: () => void;
};

export function AppIntroSplash({ onDone }: Props) {
  const { t } = useTranslation();
  const progress = useSharedValue(0);
  const barOneProgress = useSharedValue(8);
  const barTwoProgress = useSharedValue(8);
  const barThreeProgress = useSharedValue(8);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    barOneProgress.value = withDelay(120, withTiming(76, { duration: 720 }));
    barTwoProgress.value = withDelay(260, withTiming(58, { duration: 720 }));
    barThreeProgress.value = withDelay(400, withTiming(68, { duration: 720 }));
    const timer = setTimeout(onDone, 1650);
    return () => clearTimeout(timer);
  }, [barOneProgress, barThreeProgress, barTwoProgress, onDone, progress]);

  const brandStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 12 }],
  }));

  const barOne = useAnimatedStyle(() => ({
    width: `${barOneProgress.value}%`,
  }));
  const barTwo = useAnimatedStyle(() => ({
    width: `${barTwoProgress.value}%`,
  }));
  const barThree = useAnimatedStyle(() => ({
    width: `${barThreeProgress.value}%`,
  }));

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.center, brandStyle]}>
        <CareScene averageValue={82} glow={12} compact />
        <View style={styles.brandBlock}>
          <Text style={styles.logo}>{t('appName')}</Text>
          <Text style={styles.claim}>{t('splash.claim')}</Text>
        </View>
        <View style={styles.miniBars}>
          <View style={styles.miniTrack}>
            <Animated.View style={[styles.miniFill, barOne]} />
          </View>
          <View style={styles.miniTrack}>
            <Animated.View style={[styles.miniFill, styles.miniFillSecond, barTwo]} />
          </View>
          <View style={styles.miniTrack}>
            <Animated.View style={[styles.miniFill, styles.miniFillThird, barThree]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cardWarm,
    justifyContent: 'center',
    padding: 28,
  },
  center: {
    gap: 22,
  },
  brandBlock: {
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0,
  },
  claim: {
    color: colors.sage,
    fontSize: 16,
    fontWeight: '700',
  },
  miniBars: {
    gap: 8,
    paddingHorizontal: 24,
  },
  miniTrack: {
    height: 8,
    backgroundColor: '#FFFFFFAA',
    borderRadius: 999,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    width: '76%',
    backgroundColor: colors.teal,
    borderRadius: 999,
  },
  miniFillSecond: {
    width: '58%',
    backgroundColor: colors.amber,
  },
  miniFillThird: {
    width: '68%',
    backgroundColor: colors.coral,
  },
});
