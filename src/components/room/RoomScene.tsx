import { StyleSheet, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { getTimeOfDay } from './timeOfDay';
import { useMemo, useState } from 'react';
import type { RoomSceneProps } from './RoomScene.types';
import { Wall } from './Wall';
import { Floor } from './floor/Floor';
import { Sun } from './Sun';
import { Lamp } from './Lamp';
import { Table } from './table/Table';
import { Bookshelf } from './Bookshelf';
import { Window } from './window/Window';
import { getWindowOverlayLayout } from './window/windowLayout';
import { MainPlant } from './plant/MainPlant';
import { HangingPlant } from './hanging/HangingPlant';
import { PlantPot } from './PlantPot';
import { Pet } from './pet/Pet';
import { getPetOverlayLayout } from './pet/petLayout';
import { getPetState } from './pet/petState';
import { Aquarium } from './aquarium/Aquarium';
import { Carafe } from './carafe/Carafe';
import { Particles } from './Particles';
import { WellnessBar } from './WellnessBar';
import { colors, radii } from '../../theme';

const SCENE_W = 360;
const SCENE_H = 240;

export function RoomScene({ needValues, glow, timeOfDay: _tod, compact = false }: RoomSceneProps) {
  const timeOfDay = _tod ?? getTimeOfDay();
  const height = compact ? 116 : SCENE_H;
  const [frameWidth, setFrameWidth] = useState(SCENE_W);

  const averageValue = useMemo(() => {
    const vals = Object.values(needValues).filter((v) => typeof v === 'number');
    if (vals.length === 0) return 50;
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  }, [needValues]);

  const petLayout = getPetOverlayLayout(frameWidth, height, compact);
  const windowLayout = getWindowOverlayLayout(frameWidth, height, compact);
  const petTargetState = getPetState(needValues.social ?? 72, needValues.movement ?? 72, glow);

  return (
    <View
      style={[styles.frame, compact && styles.compactFrame, { height }]}
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        if (nextWidth > 0 && Math.abs(nextWidth - frameWidth) > 1) setFrameWidth(nextWidth);
      }}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Wall
          timeOfDay={timeOfDay}
          environment={needValues.environment ?? 72}
          width={SCENE_W}
          height={height}
        />
        <Floor
          hygiene={needValues.hygiene ?? 72}
          glow={glow}
          height={height}
        />
      </Canvas>
      {!compact && (
        <View
          pointerEvents="none"
          style={[
            styles.windowOverlay,
            {
              left: windowLayout.left,
              top: windowLayout.top,
              width: windowLayout.width,
              height: windowLayout.height,
            },
          ]}
        >
          <Window
            averageValue={averageValue}
            glow={glow}
            height={height}
          />
        </View>
      )}
      <Canvas style={StyleSheet.absoluteFill}>
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
        <Table
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
        <Carafe
          bathroom={needValues.bathroom ?? 72}
          glow={glow}
          height={height}
        />
      </Canvas>
      {!compact && (
        <View
          pointerEvents="none"
          style={[
            styles.petOverlay,
            {
              left: petLayout.left,
              top: petLayout.top,
              width: petLayout.width,
              height: petLayout.height,
            },
          ]}
        >
          <Pet targetState={petTargetState} />
        </View>
      )}
      <Canvas style={StyleSheet.absoluteFill}>
        {!compact && (
          <Aquarium
            fun={needValues.fun ?? 72}
            glow={glow}
            height={height}
          />
        )}
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
  petOverlay: {
    position: 'absolute',
  },
  windowOverlay: {
    position: 'absolute',
  },
});
