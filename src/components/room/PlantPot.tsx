import { RoundedRect } from '@shopify/react-native-skia';
import { glowTier } from './RoomScene.types';

type Props = {
  glow: number;
  baseY: number;
};

const POT_X = 176;
const POT_W = 56;
const POT_H = 28;
const INNER_W = 32;
const INNER_H = 20;

const TIER_STYLES: Record<number, { outer: string; inner: string }> = {
  0: { outer: '#9B8065', inner: '#7E6048' },
  1: { outer: '#B8956A', inner: '#8A7050' },
  2: { outer: '#C4A5C0', inner: '#A080A0' },
  3: { outer: '#E8C060', inner: '#C8A040' },
};

export function PlantPot({ glow, baseY }: Props) {
  const style = TIER_STYLES[glowTier(glow)] ?? TIER_STYLES[0];

  return (
    <>
      <RoundedRect x={POT_X} y={baseY - POT_H + 2} width={POT_W} height={POT_H} r={8} color={style.outer} />
      <RoundedRect
        x={POT_X + POT_W / 2 - INNER_W / 2}
        y={baseY - POT_H + 12}
        width={INNER_W}
        height={INNER_H}
        r={7}
        color={style.inner}
      />
    </>
  );
}
