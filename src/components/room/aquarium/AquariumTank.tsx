import { RoundedRect, Group } from '@shopify/react-native-skia';

type Props = {
  tankX: number;
  tankY: number;
  tankW: number;
  tankH: number;
  clear: boolean;
};

export function AquariumTank({ tankX, tankY, tankW, tankH, clear }: Props) {
  return (
    <Group>
      <RoundedRect x={tankX} y={tankY} width={tankW} height={tankH} r={4} color="#D9E9F3" />
      <RoundedRect x={tankX + 2} y={tankY + 2} width={tankW - 4} height={tankH - 4} r={3} color="#B0D8E8" />
      {!clear && (
        <RoundedRect x={tankX + 2} y={tankY + 2} width={tankW - 4} height={tankH - 4} r={3} color="rgba(160,150,130,0.35)" />
      )}
    </Group>
  );
}
