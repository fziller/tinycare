import { useMemo } from 'react';
import { LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import type { TimeOfDay } from './RoomScene.types';
import { TIME_PALETTES } from './timeOfDay';

type Props = {
  timeOfDay: TimeOfDay;
  environment: number;
  width: number;
  height: number;
};

const UNSATURATED_TOP = '#E8E0D8';
const UNSATURATED_BOTTOM = '#C8C0B8';

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${rr.toString(16).padStart(2, '0')}${rg.toString(16).padStart(2, '0')}${rb.toString(16).padStart(2, '0')}`;
}

export function Wall({ timeOfDay, environment, width, height }: Props) {
  const palette = TIME_PALETTES[timeOfDay];
  const envFactor = Math.max(0, Math.min(1, environment / 50));

  const [top, bottom] = useMemo(() => {
    if (envFactor >= 1) return [palette.wallGradientTop, palette.wallGradientBottom];
    return [
      lerpColor(UNSATURATED_TOP, palette.wallGradientTop, envFactor),
      lerpColor(UNSATURATED_BOTTOM, palette.wallGradientBottom, envFactor),
    ];
  }, [envFactor, palette]);

  return (
    <RoundedRect x={0} y={0} width={width} height={height} r={18}>
      <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={[top, bottom]} />
    </RoundedRect>
  );
}
