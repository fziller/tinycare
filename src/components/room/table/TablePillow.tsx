import { RoundedRect, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import type { PillowStyle } from './tableConfig';

type Props = {
  x: number;
  y: number;
  style: PillowStyle;
};

const STYLE_PROPS: Record<PillowStyle, { w: number; h: number; r: number; color: string }> = {
  none: { w: 0, h: 0, r: 0, color: 'transparent' },
  simple: { w: 26, h: 11, r: 5, color: '#B48454' },
  plump: { w: 28, h: 13, r: 7, color: '#C49564' },
  gold: { w: 30, h: 14, r: 7, color: '#D4A574' },
};

export function TablePillow({ x, y, style }: Props) {
  if (style === 'none') return null;
  const s = STYLE_PROPS[style];

  return (
    <Group>
      <RoundedRect x={x - s.w / 2} y={y - s.h / 2} width={s.w} height={s.h} r={s.r} color={s.color}>
        <RadialGradient c={vec(0, -s.h * 0.3)} r={s.w * 0.6} colors={[`${s.color}CC`, s.color, `${s.color}99`]} />
      </RoundedRect>
      {style === 'gold' && (
        <RoundedRect x={x - s.w / 2} y={y - s.h / 2} width={s.w} height={s.h} r={s.r} color="rgba(255,215,0,0)">
          <RadialGradient c={vec(0, -s.h * 0.4)} r={s.w * 0.5} colors={['rgba(255,215,0,0.2)', 'transparent']} />
        </RoundedRect>
      )}
    </Group>
  );
}
