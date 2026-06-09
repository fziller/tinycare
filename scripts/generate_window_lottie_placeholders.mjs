import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('../assets/lottie/window/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const FPS = 60;
const LOOP_FRAMES = 120;

const colors = {
  frame: [0.909, 0.878, 0.815, 1],
  frameInner: [0.973, 0.949, 0.906, 1],
  stormSky: [0.290, 0.353, 0.439, 1],
  rainSky: [0.416, 0.478, 0.541, 1],
  lightRainSky: [0.478, 0.541, 0.678, 1],
  clearingSky: [0.545, 0.627, 0.753, 1],
  partlySky: [0.608, 0.722, 0.847, 1],
  sunnySky: [0.659, 0.816, 0.941, 1],
  brightSky: [0.722, 0.878, 1, 1],
  perfectSky: [0.816, 0.941, 1, 1],
  cloud: [1, 1, 1, 1],
  sun: [1, 0.843, 0.321, 1],
  sunGlow: [1, 0.918, 0.576, 1],
  rain: [0.631, 0.690, 0.847, 1],
  lightning: [1, 0.906, 0.420, 1],
  airplane: [0.251, 0.282, 0.376, 1],
};

function kf(frame, start, end) {
  return end === undefined ? { t: frame, s: start } : { t: frame, s: start, e: end };
}

function transform({ position = [0, 0, 0], scale = [100, 100, 100], rotation = 0, opacity = 100 }) {
  return {
    o: Array.isArray(opacity) ? { a: 1, k: opacity } : { a: 0, k: opacity },
    r: Array.isArray(rotation) ? { a: 1, k: rotation } : { a: 0, k: rotation },
    p: Array.isArray(position) && typeof position[0] === 'number' ? { a: 0, k: position } : { a: 1, k: position },
    a: { a: 0, k: [0, 0, 0] },
    s: Array.isArray(scale) && typeof scale[0] === 'number' ? { a: 0, k: scale } : { a: 1, k: scale },
  };
}

function fill(fillColor, opacity = 100, name = 'Fill') {
  return {
    ty: 'fl',
    c: { a: 0, k: fillColor },
    o: { a: 0, k: opacity },
    r: 1,
    nm: name,
    mn: 'ADBE Vector Graphic - Fill',
    hd: false,
  };
}

function ellipseShape({ size, position, fillColor, opacity = 100, name }) {
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
      fill(fillColor, opacity, `${name} Fill`),
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

function rectShape({ size, position, fillColor, opacity = 100, roundness = 0, rotation = 0, name }) {
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
      fill(fillColor, opacity, `${name} Fill`),
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

function pathShape({ points, closed = true, fillColor, opacity = 100, name }) {
  return {
    ty: 'gr',
    nm: name,
    it: [
      {
        ty: 'sh',
        ks: {
          a: 0,
          k: {
            i: points.map((point) => point.inTan ?? [0, 0]),
            o: points.map((point) => point.outTan ?? [0, 0]),
            v: points.map((point) => point.vertex),
            c: closed,
          },
        },
        nm: `${name} Path`,
        mn: 'ADBE Vector Shape - Group',
        hd: false,
      },
      fill(fillColor, opacity, `${name} Fill`),
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

function makeCloudLayer({ name, x, y, drift, opacity = 100, scale = 100 }) {
  return makeLayer({
    name,
    ks: transform({
      position: [
        kf(0, [x - drift, y, 0], [x + drift, y, 0]),
        kf(LOOP_FRAMES / 2, [x + drift, y, 0], [x - drift, y, 0]),
        kf(LOOP_FRAMES, [x - drift, y, 0]),
      ],
      scale: [scale, scale, 100],
      opacity,
    }),
    shapes: [
      ellipseShape({ name: `${name} A`, size: [28, 14], position: [-10, 0], fillColor: colors.cloud, opacity }),
      ellipseShape({ name: `${name} B`, size: [34, 18], position: [8, -2], fillColor: colors.cloud, opacity }),
      ellipseShape({ name: `${name} C`, size: [20, 12], position: [24, 2], fillColor: colors.cloud, opacity }),
    ],
  });
}

function makeRainLayer(index, total, opacity = 100) {
  const startX = 18 + index * ((234 - 18) / Math.max(1, total - 1));
  const offset = (index * 9) % LOOP_FRAMES;
  return makeLayer({
    name: `rain-${index}`,
    ks: transform({
      position: [
        kf(0, [startX, -24 + offset, 0], [startX - 8, 84 + offset, 0]),
        kf(LOOP_FRAMES, [startX - 8, 84 + offset, 0]),
      ],
      rotation: 12,
      opacity,
    }),
    shapes: [
      rectShape({
        name: `rain-drop-${index}`,
        size: [2, 10],
        position: [0, 0],
        fillColor: colors.rain,
        opacity,
        roundness: 1,
      }),
    ],
  });
}

function makeLightningLayer() {
  return makeLayer({
    name: 'lightning',
    ks: transform({
      position: [78, 21, 0],
      opacity: [
        kf(0, 0),
        kf(18, 0, 100),
        kf(21, 100, 0),
        kf(62, 0, 0),
        kf(64, 0, 100),
        kf(67, 100, 0),
        kf(LOOP_FRAMES, 0),
      ],
    }),
    shapes: [
      pathShape({
        name: 'LightningMain',
        fillColor: colors.lightning,
        points: [
          { vertex: [0, 0] },
          { vertex: [8, 0] },
          { vertex: [4, 10] },
          { vertex: [11, 10] },
          { vertex: [2, 24] },
          { vertex: [5, 14] },
          { vertex: [0, 14] },
        ],
      }),
    ],
  });
}

function makeSunLayer({ x, y, opacity, size, pulse = 0 }) {
  return makeLayer({
    name: 'sun',
    ks: transform({
      position: [x, y, 0],
      opacity,
      scale: pulse > 0
        ? [
            kf(0, [100, 100, 100], [100 + pulse, 100 + pulse, 100]),
            kf(LOOP_FRAMES / 2, [100 + pulse, 100 + pulse, 100], [100, 100, 100]),
            kf(LOOP_FRAMES, [100, 100, 100]),
          ]
        : [100, 100, 100],
    }),
    shapes: [
      ellipseShape({ name: 'SunGlow', size: [size * 3.2, size * 3.2], position: [0, 0], fillColor: colors.sunGlow, opacity: 34 }),
      ellipseShape({ name: 'SunBody', size: [size * 2, size * 2], position: [0, 0], fillColor: colors.sun, opacity: 100 }),
      rectShape({ name: 'RayTop', size: [2, size + 6], position: [0, -size - 4], fillColor: colors.sunGlow, opacity: 80, roundness: 1 }),
      rectShape({ name: 'RayBottom', size: [2, size + 6], position: [0, size + 4], fillColor: colors.sunGlow, opacity: 80, roundness: 1 }),
      rectShape({ name: 'RayLeft', size: [size + 6, 2], position: [-size - 4, 0], fillColor: colors.sunGlow, opacity: 80, roundness: 1 }),
      rectShape({ name: 'RayRight', size: [size + 6, 2], position: [size + 4, 0], fillColor: colors.sunGlow, opacity: 80, roundness: 1 }),
    ],
  });
}

function makeAirplaneLayer() {
  return makeLayer({
    name: 'airplane',
    ks: transform({
      position: [
        kf(0, [-28, 33, 0], [298, 21, 0]),
        kf(LOOP_FRAMES, [298, 21, 0]),
      ],
      rotation: -8,
      opacity: [
        kf(0, 0, 100),
        kf(8, 100, 100),
        kf(108, 100, 100),
        kf(LOOP_FRAMES, 0),
      ],
    }),
    shapes: [
      pathShape({
        name: 'AirplaneBody',
        fillColor: colors.airplane,
        points: [
          { vertex: [-10, -2] },
          { vertex: [10, -2] },
          { vertex: [6, 2] },
          { vertex: [10, 4] },
          { vertex: [3, 4] },
          { vertex: [-1, 8] },
          { vertex: [-4, 4] },
          { vertex: [-10, 4] },
          { vertex: [-6, 1] },
        ],
      }),
    ],
  });
}

function getStateSpec(mode) {
  switch (mode) {
    case 'storm':
      return { sky: colors.stormSky, clouds: 5, rain: 15, lightning: true, sunOpacity: 0, sunSize: 0, sunPulse: 0, airplane: false };
    case 'rain':
      return { sky: colors.rainSky, clouds: 4, rain: 10, lightning: false, sunOpacity: 0, sunSize: 0, sunPulse: 0, airplane: false };
    case 'light-rain':
      return { sky: colors.lightRainSky, clouds: 3, rain: 6, lightning: false, sunOpacity: 0, sunSize: 0, sunPulse: 0, airplane: false };
    case 'clearing':
      return { sky: colors.clearingSky, clouds: 2, rain: 3, lightning: false, sunOpacity: 35, sunSize: 4, sunPulse: 3, airplane: false };
    case 'partly-cloudy':
      return { sky: colors.partlySky, clouds: 2, rain: 0, lightning: false, sunOpacity: 55, sunSize: 6, sunPulse: 5, airplane: false };
    case 'sunny':
      return { sky: colors.sunnySky, clouds: 1, rain: 0, lightning: false, sunOpacity: 70, sunSize: 7, sunPulse: 7, airplane: false };
    case 'bright':
      return { sky: colors.brightSky, clouds: 1, rain: 0, lightning: false, sunOpacity: 86, sunSize: 9, sunPulse: 9, airplane: false };
    case 'perfect-flight':
      return { sky: colors.perfectSky, clouds: 0, rain: 0, lightning: false, sunOpacity: 100, sunSize: 10, sunPulse: 10, airplane: true };
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

function makeWindowLoop(name, mode) {
  const spec = getStateSpec(mode);
  const cloudSlots = [
    { x: 34, y: 16, drift: 6, scale: 86 },
    { x: 112, y: 14, drift: 8, scale: 100 },
    { x: 174, y: 17, drift: 7, scale: 88 },
    { x: 224, y: 13, drift: 9, scale: 94 },
    { x: 82, y: 31, drift: 5, scale: 74 },
  ];

  const layers = [];

  if (spec.airplane) layers.push(makeAirplaneLayer());
  if (spec.lightning) layers.push(makeLightningLayer());

  for (let i = 0; i < spec.rain; i += 1) {
    layers.push(makeRainLayer(i, spec.rain, mode === 'storm' ? 88 : 72));
  }

  if (spec.sunOpacity > 0) {
    layers.push(makeSunLayer({ x: 228, y: 17, opacity: spec.sunOpacity, size: spec.sunSize, pulse: spec.sunPulse }));
  }

  for (let i = 0; i < spec.clouds; i += 1) {
    const cloud = cloudSlots[i];
    layers.push(makeCloudLayer({
      name: `cloud-${i + 1}`,
      x: cloud.x,
      y: cloud.y,
      drift: cloud.drift,
      scale: cloud.scale,
      opacity: mode === 'storm' ? 78 : 88,
    }));
  }

  layers.push(
    makeLayer({
      name: 'inner-sky',
      ks: transform({ position: [135, 30, 0] }),
      shapes: [
        rectShape({
          name: 'Sky',
          size: [262, 52],
          position: [0, 0],
          fillColor: spec.sky,
          roundness: 8,
        }),
      ],
    }),
  );

  layers.push(
    makeLayer({
      name: 'outer-frame',
      ks: transform({ position: [135, 30, 0] }),
      shapes: [
        rectShape({
          name: 'FrameTop',
          size: [270, 8],
          position: [0, -26],
          fillColor: colors.frame,
          roundness: 4,
        }),
        rectShape({
          name: 'FrameBottom',
          size: [270, 8],
          position: [0, 26],
          fillColor: colors.frame,
          roundness: 4,
        }),
        rectShape({
          name: 'FrameLeft',
          size: [8, 60],
          position: [-131, 0],
          fillColor: colors.frame,
          roundness: 4,
        }),
        rectShape({
          name: 'FrameRight',
          size: [8, 60],
          position: [131, 0],
          fillColor: colors.frame,
          roundness: 4,
        }),
        rectShape({
          name: 'CrossbarVertical',
          size: [6, 52],
          position: [0, 0],
          fillColor: colors.frame,
          roundness: 3,
        }),
        rectShape({
          name: 'CrossbarHorizontal',
          size: [254, 4],
          position: [0, 0],
          fillColor: colors.frame,
          roundness: 2,
        }),
      ],
    }),
  );

  return {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: LOOP_FRAMES,
    w: 270,
    h: 60,
    nm: name,
    ddd: 0,
    assets: [],
    layers,
  };
}

const clips = [
  ['window-loop-storm', 'storm'],
  ['window-loop-rain', 'rain'],
  ['window-loop-light-rain', 'light-rain'],
  ['window-loop-clearing', 'clearing'],
  ['window-loop-partly-cloudy', 'partly-cloudy'],
  ['window-loop-sunny', 'sunny'],
  ['window-loop-bright', 'bright'],
  ['window-loop-perfect-flight', 'perfect-flight'],
];

for (const [name, mode] of clips) {
  const json = makeWindowLoop(name, mode);
  writeFileSync(join(outDir.pathname, `${name}.json`), JSON.stringify(json, null, 2));
}

console.log(`Generated ${clips.length} window placeholder assets.`);
