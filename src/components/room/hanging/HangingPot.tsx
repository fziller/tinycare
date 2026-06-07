import { RoundedRect } from '@shopify/react-native-skia';

export const HANG_X = 120;
export const POT_TOP = 10;
export const POT_W = 18;
export const POT_H = 10;

export function HangingPot() {
  return (
    <>
      <RoundedRect x={HANG_X - 2} y={0} width={4} height={POT_TOP} r={2} color="#9B8065" />
      <RoundedRect x={HANG_X - POT_W / 2} y={POT_TOP} width={POT_W} height={POT_H} r={3} color="#9B8065" />
      <RoundedRect
        x={HANG_X - POT_W / 2 + 2}
        y={POT_TOP + 2}
        width={POT_W - 4}
        height={POT_H - 3}
        r={2}
        color="#7E6048"
      />
    </>
  );
}
