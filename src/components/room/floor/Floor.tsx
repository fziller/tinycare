import { Group, RoundedRect, Path } from '@shopify/react-native-skia';
import { clampNeed, glowTier } from '../RoomScene.types';
import { getFloorState, getFloorConfig, STAIN_PATH, FLOORBOARDS_PATH, SPARKLE_PATH } from './floorConfig';

type Props = {
  hygiene: number;
  glow: number;
  height: number;
};

const FLOOR_X = 24;
const FLOOR_Y_OFFSET = 20;
const FLOOR_W = 312;
const FLOOR_H = 26;

// Stain positions for each count level (pre-defined layouts)
const STAIN_LAYOUTS: Record<number, { x: number; y: number }[]> = {
  0: [],
  1: [{ x: 80, y: 12 }, { x: 160, y: 18 }, { x: 240, y: 10 }, { x: 280, y: 16 }, { x: 120, y: 8 }],
  2: [{ x: 60, y: 14 }, { x: 110, y: 16 }, { x: 145, y: 10 }, { x: 190, y: 17 }, { x: 230, y: 12 }, { x: 270, y: 8 }],
  3: [{ x: 50, y: 10 }, { x: 90, y: 14 }, { x: 130, y: 8 }, { x: 170, y: 16 }, { x: 210, y: 12 }, { x: 250, y: 18 }],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [{ x: 40, y: 12 }, { x: 60, y: 16 }, { x: 90, y: 10 }, { x: 120, y: 18 }, { x: 150, y: 8 }, { x: 180, y: 14 }, { x: 210, y: 16 }, { x: 240, y: 12 }],
};

// Sparkle positions
const SPARKLE_POSITIONS = [
  { x: 50, y: 18 },
  { x: 90, y: 22 },
  { x: 130, y: 18 },
  { x: 170, y: 20 },
  { x: 210, y: 16 },
  { x: 250, y: 22 },
];

export function Floor({ hygiene, glow, height }: Props) {
  const floorY = height - FLOOR_Y_OFFSET;
  const hyg = clampNeed(hygiene);
  const state = getFloorState(hyg, glowTier(glow));
  const config = getFloorConfig(state);

  const stains = STAIN_LAYOUTS[config.stainCount] ?? [];

  return (
    <Group>
      {/* Floor base */}
      <RoundedRect x={FLOOR_X} y={floorY} width={FLOOR_W} height={FLOOR_H} r={4} color={config.floorColor} />

      {/* Stains */}
      {stains.map((pos, i) => (
        <Path
          key={`stain-${i}`}
          path={STAIN_PATH}
          color={config.dustColor}
          opacity={config.stainOpacity}
          transform={[{ translateX: FLOOR_X + pos.x }, { translateY: floorY + pos.y }]}
        />
      ))}

      {/* Dust points (state 0,1) */}
      {config.hasDust && (
        <>
          {state <= 1 && Array.from({ length: 12 }).map((_, i) => (
            <RoundedRect
              key={`dust-${i}`}
              x={FLOOR_X + 20 + i * 28}
              y={floorY + 6}
              width={1}
              height={1}
              r={0.5}
              color="#606060"
              opacity={0.3}
            />
          ))}
        </>
      )}

      {/* Floorboards with structure (state 3-4) */}
      {config.hasFloorboards && (
        <Path
          path={FLOORBOARDS_PATH}
          color="#A09070"
          opacity={0.1}
          transform={[{ translateX: FLOOR_X }, { translateY: floorY }]}
        />
      )}

      {/* Gloss stripe (state 4) */}
      {config.hasGloss && (
        <RoundedRect x={FLOOR_X + 80} y={floorY + 8} width={40} height={6} r={3} color="rgba(255,255,255,0.4)" />
      )}

      {/* Wet gloss (state 5) */}
      {config.hasWaterGloss && (
        <>
          <RoundedRect x={FLOOR_X + 60} y={floorY + 12} width={6} height={10} r={2} color="rgba(200,220,255,0.2)" />
          <RoundedRect x={FLOOR_X + 100} y={floorY + 14} width={4} height={6} r={1} color="rgba(255,255,255,0.3)" />
        </>
      )}

      {/* Light reflections (state 6-7) */}
      {config.hasReflections && Array.from({ length: 3 }).map((_, i) => (
        <RoundedRect
          key={`refl-${i}`}
          x={FLOOR_X + 120 + i * 60}
          y={floorY + 6}
          width={8}
          height={10}
          r={2}
          color="rgba(255,255,255,0.3)"
        />
      ))}

      {/* Sparkles (state 7) */}
      {config.hasSparkles && SPARKLE_POSITIONS.map((pos, i) => (
        <Path
          key={`sparkle-${i}`}
          path={SPARKLE_PATH}
          color="#FFD700"
          opacity={0.7}
          transform={[{ translateX: FLOOR_X + pos.x }, { translateY: floorY + pos.y }]}
        />
      ))}
    </Group>
  );
}