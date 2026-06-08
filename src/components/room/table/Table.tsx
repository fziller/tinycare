import { RoundedRect, Group, BlurMask } from '@shopify/react-native-skia';
import { clampNeed, glowTier } from '../RoomScene.types';
import { getTableState, getTableConfig } from './tableConfig';
import { TableBowl } from './TableBowl';
import { TablePillow } from './TablePillow';
import { TableCandle } from './TableCandle';
import { TableMug } from './TableMug';
import { TableNapkin } from './TableNapkin';
import { TablePlant } from './TablePlant';

type Props = {
  food: number;
  comfort: number;
  glow: number;
  width: number;
  height: number;
};

const TABLE_X = 24;
const TABLE_Y_OFFSET = 56;
const TABLE_W = 312;
const TABLE_H = 34;

const BOWL_X = 50;
const PILLOW_X = 100;
const PLANT_X = 140;
const CANDLE_X = 175;
const MUG_X = 220;
const NAPKIN_X = 235;

/* ── Contact shadow helper ─────────────────────────────── */
type ShadowDef = { w: number; h: number; r: number };
function ContactShadow({ x, def, tableY }: { x: number; def: ShadowDef; tableY: number }) {
  return (
    <RoundedRect x={x - def.w / 2} y={tableY - def.h / 2} width={def.w} height={def.h} r={def.r} color="rgba(0,0,0,0.08)">
      <BlurMask blur={3} style="normal" />
    </RoundedRect>
  );
}

const BOWL_SHADOW: ShadowDef = { w: 22, h: 5, r: 2.5 };
const PILLOW_SHADOW: ShadowDef = { w: 28, h: 5, r: 2.5 };
const CANDLE_SHADOW: ShadowDef = { w: 14, h: 4, r: 2 };
const MUG_SHADOW: ShadowDef = { w: 20, h: 5, r: 2.5 };
const NAPKIN_SHADOW: ShadowDef = { w: 16, h: 4, r: 2 };
const PLANT_SHADOW: ShadowDef = { w: 16, h: 5, r: 2.5 };

export function Table({ food, comfort: _c, glow, width: _w, height }: Props) {
  const tableY = height - TABLE_Y_OFFSET;
  const foodVal = clampNeed(food);
  const glowT = glowTier(glow);
  const state = getTableState(foodVal, glowT);
  const config = getTableConfig(state);

  return (
    <Group>
      <RoundedRect x={TABLE_X} y={tableY} width={TABLE_W} height={TABLE_H} r={12} color="#E8D3BD" />

      <RoundedRect x={TABLE_X} y={tableY} width={TABLE_W} height={5} r={2.5} color="rgba(255,255,255,0.12)" />

      <RoundedRect x={TABLE_X} y={tableY + TABLE_H - 3} width={TABLE_W} height={3} r={1.5} color="rgba(0,0,0,0.06)" />

      <ContactShadow x={BOWL_X} def={BOWL_SHADOW} tableY={tableY} />
      <TableBowl x={BOWL_X} y={tableY - 12} pelletCount={config.pelletCount} />

      {config.showPillow && (
        <Group>
          <ContactShadow x={PILLOW_X} def={PILLOW_SHADOW} tableY={tableY} />
          <TablePillow x={PILLOW_X} y={tableY - 7} style={config.pillowStyle} />
        </Group>
      )}

      {config.showCandle && (
        <Group>
          <ContactShadow x={CANDLE_X} def={CANDLE_SHADOW} tableY={tableY} />
          <TableCandle x={CANDLE_X} y={tableY} lit={config.candleLit} />
        </Group>
      )}

      {config.showMug && (
        <Group>
          <ContactShadow x={MUG_X} def={MUG_SHADOW} tableY={tableY} />
          <TableMug x={MUG_X} y={tableY - 5} />
        </Group>
      )}

      {config.showNapkin && (
        <Group>
          <ContactShadow x={NAPKIN_X} def={NAPKIN_SHADOW} tableY={tableY} />
          <TableNapkin x={NAPKIN_X} y={tableY} />
        </Group>
      )}

      {config.showPlant && (
        <Group>
          <ContactShadow x={PLANT_X} def={PLANT_SHADOW} tableY={tableY} />
          <TablePlant x={PLANT_X} y={tableY - 7} />
        </Group>
      )}
    </Group>
  );
}
