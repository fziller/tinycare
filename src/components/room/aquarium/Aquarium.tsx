import { Group, useClock } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { clampNeed, glowTier } from '../RoomScene.types';
import { getAquariumState, getAquariumConfig, FISH_PATH, ALGAE_PATH, CORAL_PATH, SEAHORSE_PATH } from './aquariumConfig';
import { AquariumTank } from './AquariumTank';
import { AquariumFish } from './AquariumFish';
import { AquariumBubbles } from './AquariumBubbles';
import { AquariumDecor } from './AquariumDecor';
import { AquariumReflection } from './AquariumReflection';

type Props = {
  fun: number;
  glow: number;
  height: number;
};

export const TANK_X = 250;
export const TANK_Y_OFFSET = 56;
export const TANK_W = 90;
export const TANK_H = 45;

export function Aquarium({ fun, glow, height }: Props) {
  const tankY = height - TANK_Y_OFFSET - TANK_H;

  const funVal = clampNeed(fun);
  const glowT = glowTier(glow);
  const state = getAquariumState(funVal, glowT);
  const config = getAquariumConfig(state);

  const clock = useClock();

  const bubbleCount = useMemo(() => {
    if (!config.showBubbles) return 0;
    if (config.movementTier >= 6) return 5;
    if (config.movementTier >= 4) return 4;
    return 3;
  }, [config.showBubbles, config.movementTier]);

  return (
    <Group>
      <AquariumTank
        tankX={TANK_X}
        tankY={tankY}
        tankW={TANK_W}
        tankH={TANK_H}
        clear={config.water.clear}
      />
      <AquariumDecor
        tankX={TANK_X}
        tankY={tankY}
        tankW={TANK_W}
        tankH={TANK_H}
        decor={config.decor}
        algaePath={ALGAE_PATH}
        coralPath={CORAL_PATH}
        seahorsePath={SEAHORSE_PATH}
      />
      {config.fishLayout.map((f, i) => (
        <AquariumFish
          key={`fish-${i}`}
          baseX={TANK_X + f.dx}
          baseY={tankY + f.dy}
          size={f.size}
          color={f.color}
          ampX={f.ampX}
          ampY={f.ampY}
          speed={f.speed}
          phaseX={f.phaseX}
          phaseY={f.phaseY}
          clock={clock}
          fishPath={FISH_PATH}
        />
      ))}
      <AquariumBubbles
        tankX={TANK_X}
        tankY={tankY}
        tankW={TANK_W}
        tankH={TANK_H}
        clock={clock}
        count={bubbleCount}
      />
      <AquariumReflection
        tankX={TANK_X}
        tankY={tankY}
        tankW={TANK_W}
        tankH={TANK_H}
        showReflection={config.water.reflection}
        showGold={config.water.goldReflection}
      />
    </Group>
  );
}
