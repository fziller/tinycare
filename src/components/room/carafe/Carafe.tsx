import { Group, RoundedRect, Path } from '@shopify/react-native-skia';
import { clampNeed, glowTier } from '../RoomScene.types';
import { useReanimatedSway } from '../hooks/useReanimatedSway';
import { getCarafeState, getCarafeConfig, CARAFE_HANDLE_PATH, DROP_PATH } from './carafeConfig';

type Props = {
  bathroom: number;
  glow: number;
  height: number;
};

const TABLE_Y_OFFSET = 56;
const CARAFE_X = 148;
const CARAFE_W = 18;
const CARAFE_H = 28;

const LIQUID_INSET = 2;
const LIQUID_MAX_H = CARAFE_H - LIQUID_INSET * 2;

export function Carafe({ bathroom, glow, height }: Props) {
  const tableY = height - TABLE_Y_OFFSET;
  const bodyY = tableY - CARAFE_H;
  const bathVal = clampNeed(bathroom);
  const state = getCarafeState(bathVal, glowTier(glow));
  const config = getCarafeConfig(state);

  const liquidH = (config.fillLevel / 100) * LIQUID_MAX_H;
  const liquidY = bodyY + CARAFE_H - LIQUID_INSET - liquidH;

  const dropSway = useReanimatedSway(0, 1.5, 1);

  return (
    <Group>
      {/* Glass body */}
      <RoundedRect x={CARAFE_X} y={bodyY} width={CARAFE_W} height={CARAFE_H} r={4} color="rgba(232,224,208,0.15)" />
      <RoundedRect x={CARAFE_X} y={bodyY} width={CARAFE_W} height={CARAFE_H} r={4} color="#D8D0C0" style="stroke" strokeWidth={1.5} />

      {/* Handle */}
      <Path
        path={CARAFE_HANDLE_PATH}
        color="#D8D0C0"
        style="stroke"
        strokeWidth={1.5}
        transform={[{ translateX: CARAFE_X }, { translateY: bodyY }]}
      />

      {/* Liquid */}
      {liquidH > 0 && (
        <RoundedRect x={CARAFE_X + LIQUID_INSET} y={liquidY} width={CARAFE_W - LIQUID_INSET * 2} height={liquidH} r={2} color={config.liquidColor} />
      )}

      {/* Glass gloss stripe */}
      {config.showGloss && (
        <RoundedRect x={CARAFE_X + 3} y={bodyY + 5} width={3} height={20} r={1} color="rgba(255,255,255,0.2)" />
      )}

      {/* Drop at spout (state 0) */}
      {config.showDrop && state === 0 && (
        <Group transform={[{ translateX: CARAFE_X + 15 }, { translateY: bodyY + 2 + dropSway.value }]}>
          <Path path={DROP_PATH} color="#C8E0F0" />
        </Group>
      )}

      {/* Drop at neck (state 5) */}
      {config.showDrop && state === 5 && (
        <Group transform={[{ translateX: CARAFE_X - 1 }, { translateY: bodyY + 6 }]}>
          <Path path={DROP_PATH} color="#C8E0F0" />
        </Group>
      )}

      {/* Gold reflection on liquid surface (state 7) */}
      {config.showGoldReflection && (
        <RoundedRect x={CARAFE_X + 4} y={liquidY - 2} width={10} height={3} r={1} color="rgba(255,215,0,0.3)" />
      )}
    </Group>
  );
}
