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
import { Floor } from '../src/components/room/floor/Floor';
import { MainPlant } from '../src/components/room/plant/MainPlant';
import { HangingPlant } from '../src/components/room/hanging/HangingPlant';
import { Aquarium } from '../src/components/room/aquarium/Aquarium';
import { Carafe } from '../src/components/room/carafe/Carafe';
import { Lamp } from '../src/components/room/Lamp';
import { Table } from '../src/components/room/table/Table';
import { Bookshelf } from '../src/components/room/Bookshelf';
import { WindowLottie } from '../src/components/room/window/WindowLottie';
import { getWindowState, type WindowState } from '../src/components/room/window/windowState';
import { WellnessBar } from '../src/components/room/WellnessBar';
import { PlantPot } from '../src/components/room/PlantPot';
import { Particles } from '../src/components/room/Particles';
import { Pet, getPetState, type PetState } from '../src/components/room/pet/Pet';

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
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Lamp: {
    label: 'Lamp',
    sliders: [
      { key: 'comfort', label: 'Comfort', min: 0, max: 100, default: 72 },
    ],
  },
  Table: {
    label: 'Table',
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
  Window: {
    label: 'Window',
    sliders: [
      { key: 'averageValue', label: 'Avg Need', min: 0, max: 100, default: 50 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, default: 50 },
    ],
  },
  Floor: {
    label: 'Floor',
    sliders: [
      { key: 'hygiene', label: 'Hygiene', min: 0, max: 100, default: 50 },
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
  forcedPetState: PetState | null,
  forcedWindowState: WindowState | null,
) {
  const baseY = height - 30;
  const tod = getTimeOfDay();
  const petState = forcedPetState ?? getPetState(values.social ?? 72, values.movement ?? 72, values.glow ?? 50);
  const windowState = forcedWindowState ?? getWindowState(values.averageValue ?? 50, values.glow ?? 50);

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
      return <Pet targetState={petState} />;
    case 'Aquarium':
      return <Aquarium fun={values.fun} glow={values.glow} height={height} />;
    case 'Carafe':
      return <Carafe bathroom={values.bathroom} glow={values.glow} height={height} />;
    case 'Lamp':
      return <Lamp timeOfDay={tod} comfort={values.comfort} height={height} />;
    case 'Table':
      return <Table food={values.food} comfort={values.comfort} glow={values.glow} width={SCENE_W} height={height} />;
    case 'Bookshelf':
      return <Bookshelf fun={values.fun} glow={values.glow} height={height} />;
    case 'Window':
      return <WindowLottie targetState={windowState} />;
    case 'Floor':
      return <Floor hygiene={values.hygiene} glow={values.glow} height={height} />;
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
  const [forcedPetState, setForcedPetState] = useState<PetState | null>(null);
  const [forcedWindowState, setForcedWindowState] = useState<WindowState | null>(null);

  const handleSelect = (key: string) => {
    setSelected(key);
    setValues(getDefaultValues(ELEMENTS[key]));
    if (key !== 'Pet') setForcedPetState(null);
    if (key !== 'Window') setForcedWindowState(null);
  };

  const handleSlider = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const tod = getTimeOfDay();
  const computedPetState = getPetState(values.social ?? 72, values.movement ?? 72, values.glow ?? 50);
  const computedWindowState = getWindowState(values.averageValue ?? 50, values.glow ?? 50);
  const isPetPreview = selected === 'Pet';
  const isWindowPreview = selected === 'Window';

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
        {selected === 'Pet' ? (
          <View style={labStyles.petPreviewStage}>
            <View style={labStyles.petLottieWrap}>
              {renderElement(selected, values, SCENE_H, forcedPetState, forcedWindowState)}
            </View>
          </View>
        ) : selected === 'Window' ? (
          <View style={labStyles.windowPreviewStage}>
            <View style={labStyles.windowLottieWrap}>
              {renderElement(selected, values, SCENE_H, forcedPetState, forcedWindowState)}
            </View>
          </View>
        ) : (
          <Canvas style={{ width: SCENE_W, height: SCENE_H }}>
            {!isPetPreview && !isWindowPreview && <Wall timeOfDay={tod} environment={72} width={SCENE_W} height={SCENE_H} />}
            {!isPetPreview && !isWindowPreview && <Floor hygiene={72} glow={values.glow} height={SCENE_H} />}
            {renderElement(selected, values, SCENE_H, forcedPetState, forcedWindowState)}
          </Canvas>
        )}
      </View>

      <View style={labStyles.sliderPanel}>
        <Text style={labStyles.sliderTitle}>{def.label} Controls</Text>
        {isPetPreview && (
          <View style={labStyles.petStatePanel}>
            <Text style={labStyles.sliderLabel}>
              State <Text style={labStyles.sliderValueInline}>{forcedPetState ?? computedPetState}</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={labStyles.petStateRow}>
              <Pressable
                onPress={() => setForcedPetState(null)}
                style={[labStyles.stateChip, forcedPetState == null && labStyles.stateChipSelected]}
              >
                <Text style={[labStyles.stateChipText, forcedPetState == null && labStyles.stateChipTextSelected]}>auto</Text>
              </Pressable>
              {Array.from({ length: 8 }, (_, index) => index as PetState).map((state) => (
                <Pressable
                  key={state}
                  onPress={() => setForcedPetState(state)}
                  style={[labStyles.stateChip, forcedPetState === state && labStyles.stateChipSelected]}
                >
                  <Text style={[labStyles.stateChipText, forcedPetState === state && labStyles.stateChipTextSelected]}>{state}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        {isWindowPreview && (
          <View style={labStyles.petStatePanel}>
            <Text style={labStyles.sliderLabel}>
              State <Text style={labStyles.sliderValueInline}>{forcedWindowState ?? computedWindowState}</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={labStyles.petStateRow}>
              <Pressable
                onPress={() => setForcedWindowState(null)}
                style={[labStyles.stateChip, forcedWindowState == null && labStyles.stateChipSelected]}
              >
                <Text style={[labStyles.stateChipText, forcedWindowState == null && labStyles.stateChipTextSelected]}>auto</Text>
              </Pressable>
              {Array.from({ length: 8 }, (_, index) => index as WindowState).map((state) => (
                <Pressable
                  key={state}
                  onPress={() => setForcedWindowState(state)}
                  style={[labStyles.stateChip, forcedWindowState === state && labStyles.stateChipSelected]}
                >
                  <Text style={[labStyles.stateChipText, forcedWindowState === state && labStyles.stateChipTextSelected]}>{state}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
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
  windowPreviewStage: {
    width: SCENE_W,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowLottieWrap: {
    width: 270,
    height: 60,
  },
  petPreviewStage: {
    width: SCENE_W,
    height: SCENE_H,
    position: 'relative',
    backgroundColor: colors.cardWarm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  petLottieWrap: {
    position: 'absolute',
    left: 125,
    top: 58,
    width: 110,
    height: 110,
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
  petStatePanel: {
    gap: spacing.xs,
  },
  petStateRow: {
    gap: spacing.xs,
  },
  stateChip: {
    minHeight: 30,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.page,
    justifyContent: 'center',
  },
  stateChipSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  stateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  stateChipTextSelected: {
    color: '#FFFFFF',
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
