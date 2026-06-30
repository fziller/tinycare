const AQUARIUM_BASE_SCENE_W = 360;
const AQUARIUM_BASE_SCENE_H = 240;

export const TANK_X = 250;
export const TANK_Y_OFFSET = 56;
export const TANK_W = 90;
export const TANK_H = 45;

const FULL_LAYOUT = {
  left: TANK_X,
  top: AQUARIUM_BASE_SCENE_H - TANK_Y_OFFSET - TANK_H,
  width: TANK_W,
  height: TANK_H,
};

const COMPACT_LAYOUT = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export function getAquariumOverlayLayout(width: number, height: number, compact: boolean) {
  const base = compact ? COMPACT_LAYOUT : FULL_LAYOUT;
  const xScale = width / AQUARIUM_BASE_SCENE_W;
  const yScale = height / AQUARIUM_BASE_SCENE_H;

  return {
    left: base.left * xScale,
    top: base.top * yScale,
    width: base.width * xScale,
    height: base.height * yScale,
  };
}
