import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('../assets/lottie/pet/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const FPS = 60;
const LOOP_FRAMES = 90;
const TRANSITION_FRAMES = 36;

const colors = {
  body: [0.953, 0.702, 0.361, 1],
  ear: [0.973, 0.824, 0.690, 1],
  eye: [0.149, 0.204, 0.184, 1],
  tail: [0.851, 0.541, 0.231, 1],
  glow: [0.969, 0.906, 0.659, 1],
  heart: [0.910, 0.475, 0.357, 1],
  shadow: [0.149, 0.204, 0.184, 0.12],
};

function kf(frame, start, end) {
  return end === undefined ? { t: frame, s: start } : { t: frame, s: start, e: end };
}

function transform({ position = [80, 102, 0], scale = [100, 100, 100], rotation = 0, opacity = 100 }) {
  return {
    o: Array.isArray(opacity) ? { a: 1, k: opacity } : { a: 0, k: opacity },
    r: Array.isArray(rotation) ? { a: 1, k: rotation } : { a: 0, k: rotation },
    p: Array.isArray(position) && typeof position[0] === 'number' ? { a: 0, k: position } : { a: 1, k: position },
    a: { a: 0, k: [0, 0, 0] },
    s: Array.isArray(scale) && typeof scale[0] === 'number' ? { a: 0, k: scale } : { a: 1, k: scale },
  };
}

function ellipseShape({ size, position, fill, opacity = 100, name }) {
  return {
    ty: 'gr',
    nm: name,
    it: [
      {
        ty: 'el',
        p: { a: 0, k: position },
        s: { a: 0, k: size },
        nm: `${name} Path`,
        mn: 'ADBE Vector Shape - Ellipse',
        hd: false,
      },
      {
        ty: 'fl',
        c: { a: 0, k: fill },
        o: { a: 0, k: opacity },
        r: 1,
        nm: `${name} Fill`,
        mn: 'ADBE Vector Graphic - Fill',
        hd: false,
      },
      {
        ty: 'tr',
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
        nm: `${name} Transform`,
      },
    ],
  };
}

function rectShape({ size, position, fill, opacity = 100, roundness = 2, rotation = 0, name }) {
  return {
    ty: 'gr',
    nm: name,
    it: [
      {
        ty: 'rc',
        p: { a: 0, k: position },
        s: { a: 0, k: size },
        r: { a: 0, k: roundness },
        nm: `${name} Path`,
        mn: 'ADBE Vector Shape - Rect',
        hd: false,
      },
      {
        ty: 'fl',
        c: { a: 0, k: fill },
        o: { a: 0, k: opacity },
        r: 1,
        nm: `${name} Fill`,
        mn: 'ADBE Vector Graphic - Fill',
        hd: false,
      },
      {
        ty: 'tr',
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: position },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: rotation },
        o: { a: 0, k: 100 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
        nm: `${name} Transform`,
      },
    ],
  };
}

function makeLayer({ name, shapes, ks, ip = 0, op = LOOP_FRAMES }) {
  return {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: name,
    sr: 1,
    ks,
    ao: 0,
    shapes,
    ip,
    op,
    st: 0,
    bm: 0,
  };
}

function stateSpec(mode) {
  const isHide = mode === 'hide';
  const isHop = mode === 'hop';
  const isPlay = mode === 'play';
  const isGlow = mode === 'idle-glow';
  const isBlink = mode === 'idle-blink';
  const isSitSmall = mode === 'sit-small';
  const isSitWag = mode === 'sit-wag';
  const showPaws = !isHide;

  return {
    bodyPosition: isHide
      ? [kf(0, [80, 112, 0], [80, 108, 0]), kf(24, [80, 108, 0], [80, 112, 0]), kf(48, [80, 112, 0], [80, 106, 0]), kf(LOOP_FRAMES, [80, 106, 0])]
      : isHop
        ? [kf(0, [80, 102, 0], [80, 88, 0]), kf(24, [80, 88, 0], [80, 102, 0]), kf(54, [80, 102, 0], [80, 90, 0]), kf(LOOP_FRAMES, [80, 90, 0])]
        : isPlay
          ? [kf(0, [80, 100, 0], [80, 96, 0]), kf(30, [80, 96, 0], [80, 100, 0]), kf(60, [80, 100, 0], [80, 96, 0]), kf(LOOP_FRAMES, [80, 96, 0])]
          : [kf(0, [80, 102, 0], [80, 99, 0]), kf(45, [80, 99, 0], [80, 102, 0]), kf(LOOP_FRAMES, [80, 102, 0])],
    bodyScale: isHide
      ? [kf(0, [72, 72, 100]), kf(LOOP_FRAMES, [72, 72, 100])]
      : isHop
        ? [kf(0, [100, 116, 100], [108, 90, 100]), kf(24, [108, 90, 100], [100, 116, 100]), kf(LOOP_FRAMES, [100, 116, 100])]
        : isPlay
          ? [kf(0, [108, 108, 100]), kf(LOOP_FRAMES, [108, 108, 100])]
          : isSitSmall || isSitWag
            ? [kf(0, [88, 88, 100]), kf(LOOP_FRAMES, [88, 88, 100])]
            : [kf(0, [100, 100, 100]), kf(LOOP_FRAMES, [100, 100, 100])],
    tailRotation: isSitWag
      ? [kf(0, -8, 18), kf(20, 18, -12), kf(48, -12, 18), kf(LOOP_FRAMES, 18)]
      : isPlay
        ? [kf(0, -20, 26), kf(18, 26, -24), kf(38, -24, 24), kf(58, 24, -18), kf(LOOP_FRAMES, -18)]
        : [kf(0, -6, 6), kf(45, 6, -6), kf(LOOP_FRAMES, -6)],
    blinkY: isBlink
      ? [kf(0, [100, 100]), kf(32, [100, 100], [100, 16]), kf(36, [100, 16], [100, 100]), kf(LOOP_FRAMES, [100, 100])]
      : [kf(0, [100, 100]), kf(LOOP_FRAMES, [100, 100])],
    blinkOpacity: isBlink
      ? [kf(0, 0), kf(31, 0, 100), kf(36, 100, 0), kf(LOOP_FRAMES, 0)]
      : [kf(0, 0), kf(LOOP_FRAMES, 0)],
    glowOpacity: isGlow || isPlay ? 28 : 0,
    heartOpacity: isPlay ? 100 : 0,
    showPaws,
    showEyes: !isHide,
    showTail: !isHide,
    earY: isHop ? -30 : isSitSmall || isSitWag ? -24 : -27,
  };
}

function makeLoop(name, mode) {
  const spec = stateSpec(mode);
  return {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: LOOP_FRAMES,
    w: 160,
    h: 160,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [
      makeLayer({
        name: 'shadow',
        ks: transform({ position: [80, 136, 0] }),
        shapes: [ellipseShape({ name: 'GroundShadow', size: [54, 12], position: [0, 0], fill: colors.shadow, opacity: 100 })],
      }),
      makeLayer({
        name: 'heart',
        ks: transform({
          position: mode === 'play'
            ? [kf(0, [80, 64, 0], [80, 56, 0]), kf(30, [80, 56, 0], [80, 64, 0]), kf(LOOP_FRAMES, [80, 64, 0])]
            : [80, 64, 0],
          opacity: spec.heartOpacity,
        }),
        shapes: [
          ellipseShape({ name: 'HeartLeft', size: [10, 10], position: [-4, 0], fill: colors.heart }),
          ellipseShape({ name: 'HeartRight', size: [10, 10], position: [4, 0], fill: colors.heart }),
          rectShape({ name: 'HeartBottom', size: [8, 8], position: [0, 6], fill: colors.heart, roundness: 1, rotation: 45 }),
        ],
      }),
      makeLayer({
        name: 'x-eyes',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: spec.showEyes ? 0 : 100,
        }),
        shapes: [
          rectShape({ name: 'LeftX1', size: [9, 2], position: [-10, -4], fill: colors.eye, rotation: 45 }),
          rectShape({ name: 'LeftX2', size: [9, 2], position: [-10, -4], fill: colors.eye, rotation: -45 }),
          rectShape({ name: 'RightX1', size: [9, 2], position: [10, -4], fill: colors.eye, rotation: 45 }),
          rectShape({ name: 'RightX2', size: [9, 2], position: [10, -4], fill: colors.eye, rotation: -45 }),
        ],
      }),
      makeLayer({
        name: 'blink',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: spec.showEyes ? spec.blinkOpacity : 0,
        }),
        shapes: [
          rectShape({ name: 'LeftBlink', size: [8, 2], position: [-10, -4], fill: colors.eye }),
          rectShape({ name: 'RightBlink', size: [8, 2], position: [10, -4], fill: colors.eye }),
        ],
      }),
      makeLayer({
        name: 'eyes',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: spec.showEyes ? 100 : 0,
        }),
        shapes: [
          ellipseShape({ name: 'LeftEye', size: [6, 6], position: [-10, -4], fill: colors.eye }),
          ellipseShape({ name: 'RightEye', size: [6, 6], position: [10, -4], fill: colors.eye }),
        ],
      }),
      makeLayer({
        name: 'nose',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: 100,
        }),
        shapes: [
          ellipseShape({ name: 'Nose', size: [8, 6], position: [0, 5], fill: colors.eye }),
        ],
      }),
      makeLayer({
        name: 'paws',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: spec.showPaws ? 100 : 0,
        }),
        shapes: [
          ellipseShape({ name: 'LeftPaw', size: [10, 7], position: [-14, 24], fill: colors.body }),
          ellipseShape({ name: 'RightPaw', size: [10, 7], position: [14, 24], fill: colors.body }),
        ],
      }),
      makeLayer({
        name: 'tail',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          rotation: spec.tailRotation,
          opacity: spec.showTail ? 100 : 0,
        }),
        shapes: [ellipseShape({ name: 'Tail', size: [22, 10], position: [28, 10], fill: colors.tail })],
      }),
      makeLayer({
        name: 'glow',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
          opacity: spec.glowOpacity,
        }),
        shapes: [ellipseShape({ name: 'Glow', size: [84, 72], position: [0, 0], fill: colors.glow })],
      }),
      makeLayer({
        name: 'ears',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
        }),
        shapes: [
          ellipseShape({ name: 'LeftEar', size: [16, 22], position: [-17, spec.earY], fill: colors.body }),
          ellipseShape({ name: 'RightEar', size: [16, 22], position: [17, spec.earY], fill: colors.body }),
          ellipseShape({ name: 'LeftEarInner', size: [8, 12], position: [-17, spec.earY + 2], fill: colors.ear }),
          ellipseShape({ name: 'RightEarInner', size: [8, 12], position: [17, spec.earY + 2], fill: colors.ear }),
        ],
      }),
      makeLayer({
        name: 'body',
        ks: transform({
          position: spec.bodyPosition,
          scale: spec.bodyScale,
        }),
        shapes: [
          ellipseShape({ name: 'Body', size: [56, 50], position: [0, 0], fill: colors.body }),
        ],
      }),
    ],
    markers: [],
  };
}

function makeTransition(name, fromMode, toMode) {
  const from = stateSpec(fromMode);
  const to = stateSpec(toMode);
  return {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: TRANSITION_FRAMES,
    w: 160,
    h: 160,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [
      makeLayer({
        name: 'body',
        ks: transform({
          position: [kf(0, from.bodyPosition[0].s, to.bodyPosition[0].s), kf(TRANSITION_FRAMES, to.bodyPosition[0].s)],
          scale: [kf(0, from.bodyScale[0].s, to.bodyScale[0].s), kf(TRANSITION_FRAMES, to.bodyScale[0].s)],
        }),
        op: TRANSITION_FRAMES,
        shapes: [
          ellipseShape({ name: 'Body', size: [56, 50], position: [0, 0], fill: colors.body }),
          ellipseShape({ name: 'Tail', size: [20, 10], position: [28, 10], fill: colors.tail, opacity: to.showTail ? 100 : 0 }),
          ellipseShape({ name: 'Eyes', size: [24, 8], position: [0, -4], fill: colors.eye, opacity: to.showEyes ? 100 : 50 }),
        ],
      }),
    ],
    markers: [],
  };
}

const assets = {
  'pet-loop-hide': makeLoop('pet-loop-hide', 'hide'),
  'pet-loop-sit-small': makeLoop('pet-loop-sit-small', 'sit-small'),
  'pet-loop-sit-wag': makeLoop('pet-loop-sit-wag', 'sit-wag'),
  'pet-loop-idle': makeLoop('pet-loop-idle', 'idle'),
  'pet-loop-idle-glow': makeLoop('pet-loop-idle-glow', 'idle-glow'),
  'pet-loop-idle-blink': makeLoop('pet-loop-idle-blink', 'idle-blink'),
  'pet-loop-hop': makeLoop('pet-loop-hop', 'hop'),
  'pet-loop-play': makeLoop('pet-loop-play', 'play'),
  'pet-transition-hide-to-idle': makeTransition('pet-transition-hide-to-idle', 'hide', 'idle'),
  'pet-transition-idle-to-hide': makeTransition('pet-transition-idle-to-hide', 'idle', 'hide'),
  'pet-transition-idle-to-hop': makeTransition('pet-transition-idle-to-hop', 'idle', 'hop'),
  'pet-transition-hop-to-idle': makeTransition('pet-transition-hop-to-idle', 'hop', 'idle'),
  'pet-transition-idle-to-play': makeTransition('pet-transition-idle-to-play', 'idle', 'play'),
  'pet-transition-play-to-idle': makeTransition('pet-transition-play-to-idle', 'play', 'idle'),
};

for (const [name, json] of Object.entries(assets)) {
  writeFileSync(join(outDir.pathname, `${name}.json`), `${JSON.stringify(json, null, 2)}\n`);
}

console.log(`Generated ${Object.keys(assets).length} visible placeholder pet assets.`);
