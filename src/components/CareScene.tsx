import { useMemo } from 'react';
import { DEFAULT_NEED_VALUES } from './room/RoomScene.types';
import { RoomScene } from './room/RoomScene';

type Props = {
  averageValue: number;
  glow: number;
  compact?: boolean;
};

export function CareScene({ averageValue, glow, compact = false }: Props) {
  const needValues = useMemo(
    () => ({
      ...DEFAULT_NEED_VALUES,
      hydration: averageValue,
      food: averageValue,
      energy: averageValue,
      hygiene: averageValue,
      bathroom: averageValue,
      fun: averageValue,
      social: averageValue,
      comfort: averageValue,
      environment: averageValue,
      movement: averageValue,
    }),
    [averageValue],
  );

  return <RoomScene needValues={needValues} glow={glow} compact={compact} />;
}
