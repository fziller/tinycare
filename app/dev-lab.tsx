import { useState, useRef, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Canvas } from '@shopify/react-native-skia';
import { colors, radii, spacing } from '../src/theme';
import { getTimeOfDay } from '../src/components/room/timeOfDay';
import { Wall } from '../src/components/room/Wall';
import { Floor } from '../src/components/room/Floor';
import { MainPlant } from '../src/components/room/plant/MainPlant';
import { HangingPlant } from '../src/components/room/hanging/HangingPlant';
import { Pet } from '../src/components/room/pet/Pet';
import { Aquarium } from '../src/components/room/Aquarium';
import { Carafe } from '../src/components/room/Carafe';
import { Lamp } from '../src/components/room/Lamp';
import { Shelf } from '../src/components/room/Shelf';
import { Bookshelf } from '../src/components/room/Bookshelf';
import { PictureFrame } from '../src/components/room/PictureFrame';
import { WellnessBar } from '../src/components/room/WellnessBar';
import { PlantPot } from '../src/components/room/PlantPot';
import { Particles } from '../src/components/room/Particles';

const SCENE_W = 360;
const SCENE_H = 240;

type SliderDef = {
  key: string;
  label: string;
  min: number;
  max: number;
  default: number;
};

type ElementDef = {
  label: string;
  sliders: SliderDef[];
};

const ELEMENTS: Record<string, ElementDef> = {
  MainPlant: {
    label: 'Plant',
    sliders: [
      { key: 'hydration', label: 'Hydration', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
      { key: 'food', label: 'Food', min: 0, max: 100, default: 72 },
    ],
  },
  HangingPlant: {
    label: 'Hanging',
    sliders: [
      { key: 'hydration', label: 'Hydration', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Pet: {
    label: 'Pet',
    sliders: [
      { key: 'social', label: 'Social', min: 0, max: 100, default: 72 },
      { key: 'movement', label: 'Movement', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Aquarium: {
    label: 'Aquarium',
    sliders: [
      { key: 'fun', label: 'Fun', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Carafe: {
    label: 'Carafe',
    sliders: [
      { key: 'bathroom', label: 'Bathroom', min: 0, max: 100, default: 72 },
    ],
  },
  Lamp: {
    label: 'Lamp',
    sliders: [
      { key: 'comfort', label: 'Comfort', min: 0, max: 100, default: 72 },
    ],
  },
  Shelf: {
    label: 'Shelf',
    sliders: [
      { key: 'food', label: 'Food', min: 0, max: 100, default: 72 },
      { key: 'comfort', label: 'Comfort', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Bookshelf: {
    label: 'Bookshelf',
    sliders: [
      { key: 'fun', label: 'Fun', min: 0, max: 100, default: 72 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  PictureFrame: {
    label: 'Picture',
    sliders: [
      { key: 'averageValue', label: 'Avg Need', min: 0, max: 100, default: 50 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  WellnessBar: {
    label: 'Wellness',
    sliders: [
      { key: 'averageValue', label: 'Avg Need', min: 0, max: 100, default: 50 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  PlantPot: {
    label: 'Pot',
    sliders: [
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Particles: {
    label: 'Particles',
    sliders: [
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
      { key: 'movement', label: 'Movement', min: 0, max: 100, default: 72 },
    ],
  },
};

type SliderTrackProps = {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

function SliderTrack({ value, min, max, onChange }: SliderTrackProps) {
  const trackW = useRef(1);
  const range = max - min;
  const pct = range > 0 ? (value - min) / range : 0;

  const handlePress = useCallback(
    (evt: { nativeEvent: { locationX: number } }) => {
      const w = trackW.current;
      const clamped = Math.max(0, Math.min(w, evt.nativeEvent.locationX));
      const r = max - min;
      onChange(Math.round(min + (clamped / w) * r));
    },
    [min, max, onChange],
  );

  return (
    <View style={labStyles.sliderRow}>
      <Pressable
        onPress={handlePress}
        onLayout={(e) => { trackW.current = e.nativeEvent.layout.width; }}
        style={labStyles.trackOuter}
      >
        <View style={[labStyles.fill, { width: `${pct * 100}%` }]} />
        <View style={[labStyles.thumb, { left: `${pct * 100}%` }]} />
      </Pressable>
      <Text style={labStyles.sliderValue}>{value}</Text>
    </View>
  );
}

function getDefaultValues(def: ElementDef): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of def.sliders) out[s.key] = s.default;
  return out;
}

function renderElement(
  selected: string,
  values: Record<string, number>,
  height: number,
) {
  const baseY = height - 30;
  const tod = getTimeOfDay();

  switch (selected) {
    case 'MainPlant':
      return (
        <>
          <MainPlant hydration={values.hydration} glow={values.glow} food={values.food} baseY={baseY} />
          <PlantPot glow={values.glow} baseY={baseY} />
        </>
      );
    case 'HangingPlant':
      return <HangingPlant hydration={values.hydration} glow={values.glow} />;
    case 'Pet':
      return <Pet social={values.social} movement={values.movement} glow={values.glow} height={height} />;
    case 'Aquarium':
      return <Aquarium fun={values.fun} glow={values.glow} height={height} />;
    case 'Carafe':
      return <Carafe bathroom={values.bathroom} height={height} />;
    case 'Lamp':
      return <Lamp timeOfDay={tod} comfort={values.comfort} height={height} />;
    case 'Shelf':
      return <Shelf food={values.food} comfort={values.comfort} glow={values.glow} width={SCENE_W} height={height} />;
    case 'Bookshelf':
      return <Bookshelf fun={values.fun} glow={values.glow} height={height} />;
    case 'PictureFrame':
      return <PictureFrame timeOfDay={tod} averageValue={values.averageValue} glow={values.glow} height={height} />;
    case 'WellnessBar':
      return <WellnessBar averageValue={values.averageValue} glow={values.glow} height={height} />;
    case 'PlantPot':
      return <PlantPot glow={values.glow} baseY={baseY} />;
    case 'Particles':
      return <Particles glow={values.glow} movement={values.movement} />;
    default:
      return null;
  }
}

export default function DevLabRoute() {
  const [selected, setSelected] = useState<string>('MainPlant');
  const def = ELEMENTS[selected];
  const [values, setValues] = useState<Record<string, number>>(getDefaultValues(def));

  const handleSelect = (key: string) => {
    setSelected(key);
    setValues(getDefaultValues(ELEMENTS[key]));
  };

  const handleSlider = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const tod = getTimeOfDay();

  return (
    <View style={labStyles.safeArea}>
      <View style={labStyles.header}>
        <Pressable onPress={() => router.back()} style={labStyles.backButton}>
          <Text style={labStyles.backText}>← Back</Text>
        </Pressable>
        <Text style={labStyles.title}>Dev Lab</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={labStyles.pickerContent}
        style={labStyles.picker}
      >
        {Object.entries(ELEMENTS).map(([key, el]) => (
          <Pressable
            key={key}
            onPress={() => handleSelect(key)}
            style={[labStyles.chip, selected === key && labStyles.chipSelected]}
          >
            <Text style={[labStyles.chipText, selected === key && labStyles.chipTextSelected]}>
              {el.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={labStyles.canvasWrap}>
        <Canvas style={{ width: SCENE_W, height: SCENE_H }}>
          <Wall timeOfDay={tod} environment={72} width={SCENE_W} height={SCENE_H} />
          <Floor hygiene={72} width={SCENE_W} height={SCENE_H} />
          {renderElement(selected, values, SCENE_H)}
        </Canvas>
      </View>

      <View style={labStyles.sliderPanel}>
        <Text style={labStyles.sliderTitle}>{def.label} Controls</Text>
        {def.sliders.map((s) => (
          <View key={s.key} style={labStyles.sliderGroup}>
            <Text style={labStyles.sliderLabel}>
              {s.label} <Text style={labStyles.sliderValueInline}>{values[s.key]}</Text>
            </Text>
            <SliderTrack
              value={values[s.key]}
              min={s.min}
              max={s.max}
              onChange={(v) => handleSlider(s.key, v)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const labStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  backText: {
    color: colors.sage,
    fontWeight: '900',
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.ink,
  },
  picker: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  pickerContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    alignItems: 'center',
  },
  chip: {
    minHeight: 32,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  chipText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.muted,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  canvasWrap: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  sliderPanel: {
    flex: 1,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md,
  },
  sliderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },
  sliderGroup: {
    gap: spacing.xs,
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  sliderValueInline: {
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  sliderValue: {
    width: 32,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
});
