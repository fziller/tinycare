const PET_BASE_SCENE_W = 360;
const PET_BASE_SCENE_H = 240;

const FULL_LAYOUT = {
  left: 186,
  top: 86,
  width: 110,
  height: 110,
};

const COMPACT_LAYOUT = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export function getPetOverlayLayout(width: number, height: number, compact: boolean) {
  const base = compact ? COMPACT_LAYOUT : FULL_LAYOUT;
  const xScale = width / PET_BASE_SCENE_W;
  const yScale = height / PET_BASE_SCENE_H;

  return {
    left: base.left * xScale,
    top: base.top * yScale,
    width: base.width * xScale,
    height: base.height * yScale,
  };
}

