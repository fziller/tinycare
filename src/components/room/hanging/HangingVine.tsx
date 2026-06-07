import { usePathValue, Path } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { HANG_X, POT_TOP } from './HangingPot';
import { CP1_X, CP2_X, CP3_X, CP1_Y_RATIO, CP2_Y_RATIO } from './hangingConfig';

type Props = {
  vineLength: SharedValue<number>;
};

export function HangingVine({ vineLength }: Props) {
  const potBottom = POT_TOP + 10;
  const vinePath = usePathValue(
    (builder) => {
      'worklet';
      const len = vineLength.value;
      builder.moveTo(HANG_X, potBottom);
      builder.cubicTo(
        HANG_X + CP1_X, potBottom + len * CP1_Y_RATIO,
        HANG_X + CP2_X, potBottom + len * CP2_Y_RATIO,
        HANG_X + CP3_X, potBottom + len,
      );
    },
  );

  return <Path path={vinePath} color="#5D7A4A" style="stroke" strokeWidth={1.5} />;
}
