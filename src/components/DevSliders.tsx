import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, onChange }: SliderProps) {
  const trackWidth = useRef(1);
  const range = max - min;
  const pct = range > 0 ? (value - min) / range : 0;

  const handlePress = useCallback(
    (evt: { nativeEvent: { locationX: number } }) => {
      const w = trackWidth.current;
      const clamped = Math.max(0, Math.min(w, evt.nativeEvent.locationX));
      const r = max - min;
      const newVal = Math.round(min + (clamped / w) * r);
      onChange(newVal);
    },
    [min, max, onChange],
  );

  return (
    <View style={sliderStyles.row}>
      <Text style={sliderStyles.label}>{label}</Text>
      <Pressable
        onPress={handlePress}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        style={sliderStyles.trackOuter}
      >
        <View style={[sliderStyles.fill, { width: `${pct * 100}%` }]} />
        <View style={[sliderStyles.thumb, { left: `${pct * 100}%` }]} />
      </Pressable>
      <Text style={sliderStyles.value}>{value}</Text>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    width: 80,
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  trackOuter: {
    flex: 1,
    height: 28,
    backgroundColor: colors.line,
    borderRadius: 14,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.teal,
    borderRadius: 14,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.sage,
    position: 'absolute',
    marginLeft: -10,
    top: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    width: 32,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
});

type DevSlidersProps = {
  values: Record<string, number>;
  onChange: (key: string, value: number | null) => void;
  onReset: () => void;
};

export function DevSliders({ values, onChange, onReset }: DevSlidersProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>🧪 Dev Controls</Text>
      <Text style={styles.copy}>Override room parameters to test visuals.</Text>
      {Object.entries(values).map(([key, val]) => (
        <Slider key={key} label={key} value={val} min={0} max={100} onChange={(v) => onChange(key, v)} />
      ))}
      <Pressable onPress={onReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset to defaults</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 13,
  },
  resetButton: {
    minHeight: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  resetText: {
    color: colors.coral,
    fontWeight: '900',
    fontSize: 13,
  },
});
