const WINDOW_BASE_SCENE_W = 360;
const WINDOW_BASE_SCENE_H = 240;

const FULL_LAYOUT = {
  left: 45,
  top: 40,
  width: 270,
  height: 60,
};

const COMPACT_LAYOUT = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export function getWindowOverlayLayout(width: number, height: number, compact: boolean) {
  const base = compact ? COMPACT_LAYOUT : FULL_LAYOUT;
  const xScale = width / WINDOW_BASE_SCENE_W;
  const yScale = height / WINDOW_BASE_SCENE_H;

  return {
    left: base.left * xScale,
    top: base.top * yScale,
    width: base.width * xScale,
    height: base.height * yScale,
  };
}
