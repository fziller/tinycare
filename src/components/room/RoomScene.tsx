import { StyleSheet, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { getTimeOfDay } from './timeOfDay';
import { useMemo } from 'react';
import type { RoomSceneProps } from './RoomScene.types';
import { Wall } from './Wall';
import { Floor } from './Floor';
import { Window } from './Window';
import { Sun } from './Sun';
import { Lamp } from './Lamp';
import { Shelf } from './Shelf';
import { Bookshelf } from './Bookshelf';
import { PictureFrame } from './PictureFrame';
import { MainPlant } from './MainPlant';
import { HangingPlant } from './HangingPlant';
import { PlantPot } from './PlantPot';
import { Pet } from './Pet';
import { Aquarium } from './Aquarium';
import { Carafe } from './Carafe';
import { Particles } from './Particles';
import { WellnessBar } from './WellnessBar';
import { colors, radii } from '../../theme';

const SCENE_W = 360;
const SCENE_H = 178;

export function RoomScene({ needValues, glow, timeOfDay: _tod, compact = false }: RoomSceneProps) {
  const timeOfDay = _tod ?? getTimeOfDay();
  const height = compact ? 116 : SCENE_H;

  const averageValue = useMemo(() => {
    const vals = Object.values(needValues).filter((v) => typeof v === 'number');
    if (vals.length === 0) return 50;
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  }, [needValues]);

  return (
    <View style={[styles.frame, compact && styles.compactFrame]}>
      <Canvas style={{ height }}>
        <Wall
          timeOfDay={timeOfDay}
          environment={needValues.environment ?? 72}
          width={SCENE_W}
          height={height}
        />
        <Floor
          hygiene={needValues.hygiene ?? 72}
          width={SCENE_W}
          height={height}
        />
        <Window
          timeOfDay={timeOfDay}
          hygiene={needValues.hygiene ?? 72}
        />
        <Sun
          timeOfDay={timeOfDay}
          energy={needValues.energy ?? 72}
        />
        {!compact && (
          <Lamp
            timeOfDay={timeOfDay}
            comfort={needValues.comfort ?? 72}
            height={height}
          />
        )}
        <Shelf
          food={needValues.food ?? 72}
          comfort={needValues.comfort ?? 72}
          glow={glow}
          width={SCENE_W}
          height={height}
        />
        {!compact && (
          <Bookshelf
            fun={needValues.fun ?? 72}
            glow={glow}
            height={height}
          />
        )}
        <PictureFrame
          timeOfDay={timeOfDay}
          averageValue={averageValue}
          glow={glow}
          height={height}
        />
        <MainPlant
          hydration={needValues.hydration ?? 72}
          glow={glow}
          food={needValues.food ?? 72}
          baseY={height - 30}
        />
        {!compact && (
          <HangingPlant
            hydration={needValues.hydration ?? 72}
            glow={glow}
          />
        )}
        <PlantPot glow={glow} baseY={height - 30} />
        {!compact && (
          <Pet
            social={needValues.social ?? 72}
            movement={needValues.movement ?? 72}
            height={height}
          />
        )}
        {!compact && (
          <Aquarium
            fun={needValues.fun ?? 72}
            glow={glow}
            height={height}
          />
        )}
        <Carafe
          bathroom={needValues.bathroom ?? 72}
          height={height}
        />
        {!compact && (
          <Particles
            glow={glow}
            movement={needValues.movement ?? 72}
          />
        )}
        <WellnessBar
          averageValue={averageValue}
          glow={glow}
          height={height}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFFAA',
    backgroundColor: colors.cardWarm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  compactFrame: {
    borderRadius: radii.md,
  },
});
