import {
  Group,
  RoundedRect,
  Path,
  Circle,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue, SharedValue } from "react-native-reanimated";
import { clampNeed, glowTier } from "../RoomScene.types";
import {
  getWindowState,
  getWindowConfig,
  CLOUD_PATH,
  RAIN_DROP_PATH,
  SUN_RAY_PATH,
  LIGHTNING_PATH,
  AIRPLANE_PATH,
} from "./windowConfig";

type Props = {
  averageValue: number;
  glow: number;
  height: number;
};

const FRAME_X = 45;
const FRAME_Y_OFFSET = 200;
const FRAME_W = 270;
const FRAME_H = 60;

const CLOUD_POSITIONS = [
  { x: 20, y: 10 },
  { x: 80, y: 10 },
  { x: 140, y: 8 },
  { x: 200, y: 12 },
  { x: 260, y: 10 },
  { x: 40, y: 28 },
  { x: 120, y: 28 },
  { x: 220, y: 26 },
];

const SUN_X = 230;
const SUN_Y = 15;

const RAIN_SPEED = 0.05;

function RainDrop({ index, rainOffset }: { index: number; rainOffset: SharedValue<number> }) {
  const dropX = FRAME_X + 20 + (index * 25) % (FRAME_W - 50);
  const transform = useDerivedValue(() => [
    { translateX: dropX },
    { translateY: rainOffset.value + index * 30 },
  ]);

  return (
    <Path
      path={RAIN_DROP_PATH}
      color="#A0B0D8"
      opacity={0.7}
      transform={transform}
    />
  );
}

export function Window({ averageValue, glow, height }: Props) {
  const frameY = height - FRAME_Y_OFFSET;
  const avg = clampNeed(averageValue);
  const state = getWindowState(avg, glowTier(glow));
  const config = getWindowConfig(state);

  const clock = useClock();
  const rainOffset = useDerivedValue(() => {
    return (clock.value * RAIN_SPEED) % FRAME_H;
  });

  return (
    <Group>
      <RoundedRect
        x={FRAME_X}
        y={frameY}
        width={FRAME_W}
        height={FRAME_H}
        r={12}
        color="#E8E0D0"
      />
      <RoundedRect
        x={FRAME_X + 4}
        y={frameY + 4}
        width={FRAME_W - 8}
        height={FRAME_H - 8}
        r={8}
        color={config.skyColor}
      />

      {config.sunOpacity > 0 && (
        <Group>
          <Circle
            cx={FRAME_X + SUN_X}
            cy={frameY + SUN_Y}
            r={config.sunSize}
            color="#FFD700"
            opacity={config.sunOpacity}
          />
          {config.sunSize > 6 && (
            <Path
              path={SUN_RAY_PATH}
              color="#FFD700"
              opacity={config.sunOpacity * 0.7}
              transform={[
                { translateX: FRAME_X + SUN_X },
                { translateY: frameY + SUN_Y },
              ]}
            />
          )}
        </Group>
      )}

      {config.cloudCount > 0 &&
        CLOUD_POSITIONS.slice(0, config.cloudCount).map((pos, i) => (
          <Path
            key={`cloud-${i}`}
            path={CLOUD_PATH}
            color="#FFFFFF"
            opacity={0.8 - state * 0.1}
            transform={[
              { translateX: FRAME_X + pos.x },
              { translateY: frameY + pos.y },
            ]}
          />
        ))}

{config.rainCount > 0 && (
        <Group>
          {Array.from({ length: config.rainCount }).map((_, i) => (
            <RainDrop key={`rain-${i}`} index={i} rainOffset={rainOffset} />
          ))}
        </Group>
      )}

      {config.hasLightning && (
        <Group>
          <Path
            path={LIGHTNING_PATH}
            color="#FFD700"
            opacity={1}
            transform={[
              { translateX: FRAME_X + 40 },
              { translateY: frameY + 20 },
            ]}
          />
          <Path
            path={LIGHTNING_PATH}
            color="#FFFFFF"
            opacity={0.5}
            transform={[
              { translateX: FRAME_X + 42 },
              { translateY: frameY + 22 },
            ]}
          />
        </Group>
      )}

      {config.showAirplane && (
        <Group transform={[{ translateX: FRAME_X + 30 }, { translateY: frameY + 30 }]}>
          <Path path={AIRPLANE_PATH} color="#404050" opacity={0.8} />
        </Group>
      )}
    </Group>
  );
}
