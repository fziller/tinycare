import { RoundedRect } from '@shopify/react-native-skia';
import { useAnimatedNumeric } from './RoomScene.types';
import { colors } from '../../theme';

type Props = {
  averageValue: number;
  glow: number;
  height: number;
};

const BAR_X = 260;
const BAR_Y_OFFSET = 78;
const TRACK_W = 70;
const TRACK_H = 20;

export function WellnessBar({ averageValue, glow, height }: Props) {
  const barY = height - BAR_Y_OFFSET;
  const fillWidth = useAnimatedNumeric(Math.max(4, (averageValue / 100) * TRACK_W), 800);

  const glowLvl = useAnimatedNumeric(glow / 100, 1000);
  const barColor = glowLvl > 0.7 ? colors.amber : glowLvl > 0.3 ? colors.teal : colors.sage;

  return (
    <>
      <RoundedRect x={BAR_X} y={barY} width={TRACK_W} height={TRACK_H} r={10} color="#26342F18" />
      <RoundedRect x={BAR_X + 4} y={barY + 4} width={fillWidth} height={TRACK_H - 8} r={TRACK_H / 2 - 4} color={barColor} />
    </>
  );
}
