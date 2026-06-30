import { mkdirSync, writeFileSync } from 'node:fs';

const outDir = new URL('../assets/lottie/aquarium/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const FPS = 60;
const LOOP_FRAMES = 120;
const WIDTH = 90;
const HEIGHT = 45;

const palette = {
  glass: [0.945, 0.984, 1, 0.62],
  glassStroke: [0.75, 0.9, 0.98, 0.95],
  murkyWater: [0.38, 0.52, 0.46, 0.85],
  clearWater: [0.45, 0.78, 0.9, 0.6],
  brightWater: [0.54, 0.84, 0.95, 0.58],
  goldWater: [0.61, 0.87, 0.93, 0.58],
  algaeBrown: [0.54, 0.45, 0.28, 0.95],
  algaeGreen: [0.31, 0.62, 0.38, 0.95],
  sand: [0.87, 0.79, 0.62, 1],
  pebbles: [0.75, 0.72, 0.69, 1],
  coral: [0.84, 0.44, 0.56, 1],
  coralGlow: [1, 0.67, 0.74, 1],
  bubble: [0.92, 0.98, 1, 0.78],
  reflection: [1, 1, 1, 0.22],
  goldReflection: [1, 0.9, 0.58, 0.28],
  fishA: [0.93, 0.48, 0.32, 1],
  fishB: [0.95, 0.74, 0.36, 1],
  fishC: [0.24, 0.69, 0.63, 1],
  fishD: [0.33, 0.62, 0.82, 1],
  fishE: [0.67, 0.44, 0.81, 1],
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

function stroke(strokeColor, width, opacity = 100, name = 'Stroke') {
  return {
    ty: 'st',
    c: { a: 0, k: strokeColor },
    o: { a: 0, k: opacity },
    w: { a: 0, k: width },
    lc: 2,
    lj: 2,
    ml: 4,
    bm: 0,
    nm: name,
    mn: 'ADBE Vector Graphic - Stroke',
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

function rectShape({ size, position, fillColor, opacity = 100, roundness = 0, strokeColor, strokeWidth = 0, name }) {
  const items = [
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
  ];

  if (strokeColor && strokeWidth > 0) {
    items.push(stroke(strokeColor, strokeWidth, opacity, `${name} Stroke`));
  }

  items.push({
    ty: 'tr',
    p: { a: 0, k: [0, 0] },
    a: { a: 0, k: [0, 0] },
    s: { a: 0, k: [100, 100] },
    r: { a: 0, k: 0 },
    o: { a: 0, k: 100 },
    sk: { a: 0, k: 0 },
    sa: { a: 0, k: 0 },
    nm: `${name} Transform`,
  });

  return {
    ty: 'gr',
    nm: name,
    it: items,
  };
}

function pathShape({ points, closed = true, fillColor, opacity = 100, strokeColor, strokeWidth = 0, name }) {
  const items = [
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
  ];

  if (strokeColor && strokeWidth > 0) {
    items.push(stroke(strokeColor, strokeWidth, opacity, `${name} Stroke`));
  }

  items.push({
    ty: 'tr',
    p: { a: 0, k: [0, 0] },
    a: { a: 0, k: [0, 0] },
    s: { a: 0, k: [100, 100] },
    r: { a: 0, k: 0 },
    o: { a: 0, k: 100 },
    sk: { a: 0, k: 0 },
    sa: { a: 0, k: 0 },
    nm: `${name} Transform`,
  });

  return {
    ty: 'gr',
    nm: name,
    it: items,
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

function fishBody(fillColor) {
  return pathShape({
    name: 'FishBody',
    fillColor,
    points: [
      { vertex: [-7, 0], inTan: [0, 0], outTan: [0, 0] },
      { vertex: [-1, -4], inTan: [-2, 0], outTan: [2, -1] },
      { vertex: [6, -1], inTan: [-1, -1], outTan: [1, 0] },
      { vertex: [10, -4], inTan: [-1, 1], outTan: [0, 0] },
      { vertex: [10, 4], inTan: [0, 0], outTan: [-1, -1] },
      { vertex: [6, 1], inTan: [1, 0], outTan: [-1, 1] },
      { vertex: [-1, 4], inTan: [2, 1], outTan: [-2, 0] },
    ],
  });
}

function fishLayer({ name, color, x, y, scale = 100, driftX = 0, driftY = 0, delay = 0 }) {
  const path = [kf(0, [x - driftX, y - driftY + delay, 0], [x + driftX, y + driftY + delay, 0]), kf(LOOP_FRAMES / 2, [x + driftX, y + driftY + delay, 0], [x - driftX, y - driftY + delay, 0]), kf(LOOP_FRAMES, [x - driftX, y - driftY + delay, 0])];
  const tail = [kf(0, -6, 7), kf(LOOP_FRAMES / 2, 7, -6), kf(LOOP_FRAMES, -6)];

  return makeLayer({
    name,
    ks: transform({ position: path, scale: [scale, scale, 100] }),
    shapes: [
      rectShape({ name: 'Tail', size: [6, 6], position: [10, 0], fillColor: color, roundness: 1 }),
      fishBody(color),
      ellipseShape({ name: 'Eye', size: [1.6, 1.6], position: [-2, -0.8], fillColor: [0.13, 0.18, 0.2, 1] }),
      {
        ty: 'gr',
        nm: 'TailMotion',
        it: [
          rectShape({ name: 'TailTip', size: [5, 2], position: [13, 0], fillColor: color, roundness: 1 }),
          {
            ty: 'tr',
            p: { a: 0, k: [10, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 1, k: tail },
            o: { a: 0, k: 100 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
            nm: 'TailMotion Transform',
          },
        ],
      },
    ],
  });
}

function bubbleLayer(index, x, fromY, toY, scale = 100, opacity = 60) {
  const offset = (index * 14) % LOOP_FRAMES;

  return makeLayer({
    name: `Bubble-${index}`,
    ks: transform({
      position: [
        kf(0, [x, fromY + offset, 0], [x + 2, toY + offset, 0]),
        kf(LOOP_FRAMES, [x + 2, toY + offset, 0]),
      ],
      scale: [scale, scale, 100],
      opacity: [
        kf(0, 0, opacity),
        kf(20, opacity, opacity),
        kf(LOOP_FRAMES, opacity, 0),
      ],
    }),
    shapes: [ellipseShape({ name: `BubbleShape-${index}`, size: [4, 4], position: [0, 0], fillColor: palette.bubble, opacity: 100 })],
  });
}

function algaeLayer({ name, x, y, color, height = 14, sway = 3 }) {
  return makeLayer({
    name,
    ks: transform({
      position: [x, y, 0],
      rotation: [kf(0, -sway, sway), kf(LOOP_FRAMES / 2, sway, -sway), kf(LOOP_FRAMES, -sway)],
    }),
    shapes: [
      pathShape({
        name: `${name} Path`,
        fillColor: color,
        points: [
          { vertex: [-2, 0], inTan: [0, 0], outTan: [0, 0] },
          { vertex: [-4, -height * 0.35], inTan: [1, 3], outTan: [-1, -3] },
          { vertex: [-1, -height], inTan: [-2, 3], outTan: [1, -2] },
          { vertex: [2, -height * 0.55], inTan: [-1, -2], outTan: [1, 2] },
          { vertex: [2, 0], inTan: [0, 0], outTan: [0, 0] },
        ],
      }),
    ],
  });
}

function reflectionLayer(name, color, y, width, opacity) {
  return makeLayer({
    name,
    ks: transform({
      position: [
        kf(0, [WIDTH * 0.25, y, 0], [WIDTH * 0.72, y, 0]),
        kf(LOOP_FRAMES, [WIDTH * 0.72, y, 0]),
      ],
      rotation: -7,
      opacity,
    }),
    shapes: [
      rectShape({
        name: `${name} Bar`,
        size: [width, 4],
        position: [0, 0],
        fillColor: color,
        roundness: 2,
      }),
    ],
  });
}

function seahorseLayer() {
  return makeLayer({
    name: 'Seahorse',
    ks: transform({
      position: [kf(0, [66, 22, 0], [66, 20, 0]), kf(LOOP_FRAMES / 2, [66, 20, 0], [66, 22, 0]), kf(LOOP_FRAMES, [66, 22, 0])],
      scale: [92, 92, 100],
      rotation: [kf(0, -4, 4), kf(LOOP_FRAMES / 2, 4, -4), kf(LOOP_FRAMES, -4)],
    }),
    shapes: [
      pathShape({
        name: 'SeahorseBody',
        fillColor: [0.98, 0.74, 0.5, 1],
        points: [
          { vertex: [0, -7], inTan: [0, 0], outTan: [2, 0] },
          { vertex: [3, -3], inTan: [-1, -2], outTan: [1, 2] },
          { vertex: [2, 2], inTan: [0, -1], outTan: [0, 1] },
          { vertex: [0, 6], inTan: [1, -1], outTan: [-1, 1] },
          { vertex: [-2, 2], inTan: [0, 1], outTan: [0, -1] },
          { vertex: [-2, -3], inTan: [1, 2], outTan: [-1, -2] },
        ],
      }),
      ellipseShape({ name: 'SeahorseEye', size: [1.4, 1.4], position: [0.8, -5], fillColor: [0.13, 0.18, 0.2, 1] }),
    ],
  });
}

function coralLayer(glow = false) {
  const color = glow ? palette.coralGlow : palette.coral;
  const baseOpacity = glow ? 92 : 100;

  return makeLayer({
    name: 'Coral',
    ks: transform({
      position: [21, 35, 0],
      opacity: glow
        ? [kf(0, baseOpacity, 100), kf(LOOP_FRAMES / 2, 100, baseOpacity), kf(LOOP_FRAMES, baseOpacity)]
        : baseOpacity,
    }),
    shapes: [
      pathShape({
        name: 'CoralMain',
        fillColor: color,
        points: [
          { vertex: [-5, 8], inTan: [0, 0], outTan: [0, 0] },
          { vertex: [-7, -2], inTan: [1, 3], outTan: [-1, -3] },
          { vertex: [-3, -9], inTan: [-1, 2], outTan: [1, -2] },
          { vertex: [0, -3], inTan: [-1, -2], outTan: [1, 2] },
          { vertex: [3, -11], inTan: [-1, 2], outTan: [1, -2] },
          { vertex: [7, -2], inTan: [1, -3], outTan: [-1, 3] },
          { vertex: [5, 8], inTan: [0, 0], outTan: [0, 0] },
        ],
      }),
    ],
  });
}

function pebbleLayer() {
  return makeLayer({
    name: 'Pebbles',
    ks: transform({ position: [0, 0, 0] }),
    shapes: [
      ellipseShape({ name: 'PebbleA', size: [8, 4], position: [26, 38], fillColor: palette.pebbles }),
      ellipseShape({ name: 'PebbleB', size: [10, 5], position: [39, 39], fillColor: palette.pebbles }),
      ellipseShape({ name: 'PebbleC', size: [7, 4], position: [55, 38], fillColor: palette.pebbles }),
      ellipseShape({ name: 'PebbleD', size: [9, 5], position: [70, 39], fillColor: palette.pebbles }),
    ],
  });
}

function tankLayers({ waterColor, murky = false, sand = false, pebbles = false, coral = false, coralGlow = false, seahorse = false, bubbles = 0, reflection = false, goldReflection = false, fish = [] }) {
  const layers = [];

  if (goldReflection) layers.push(reflectionLayer('GoldReflection', palette.goldReflection, 9, 28, [kf(0, 0, 74), kf(LOOP_FRAMES / 2, 74, 0), kf(LOOP_FRAMES, 0)]));
  if (reflection) layers.push(reflectionLayer('WaterReflection', palette.reflection, 11, 24, [kf(0, 18, 48), kf(LOOP_FRAMES / 2, 48, 18), kf(LOOP_FRAMES, 18)]));

  for (let index = 0; index < bubbles; index += 1) {
    layers.push(bubbleLayer(index, 20 + index * 11, 42, -36, 72 + index * 5, 46 + index * 7));
  }

  if (seahorse) layers.push(seahorseLayer());
  if (coral) layers.push(coralLayer(coralGlow));

  for (const fishSpec of fish) {
    layers.push(fishLayer(fishSpec));
  }

  layers.push(algaeLayer({ name: 'AlgaeLeft', x: 15, y: 39, color: murky ? palette.algaeBrown : palette.algaeGreen, height: murky ? 10 : 14, sway: murky ? 1 : 3 }));
  layers.push(algaeLayer({ name: 'AlgaeRight', x: 77, y: 39, color: murky ? palette.algaeBrown : palette.algaeGreen, height: murky ? 12 : 16, sway: murky ? 1 : 4 }));

  if (pebbles) layers.push(pebbleLayer());

  if (sand) {
    layers.push(
      makeLayer({
        name: 'Sand',
        ks: transform({ position: [0, 0, 0] }),
        shapes: [rectShape({ name: 'SandBase', size: [82, 10], position: [45, 40], fillColor: palette.sand, roundness: 4 })],
      }),
    );
  }

  layers.push(
    makeLayer({
      name: 'Water',
      ks: transform({
        position: [45, 22.5, 0],
        scale: [kf(0, [100, 98, 100], [100, 100, 100]), kf(LOOP_FRAMES / 2, [100, 100, 100], [100, 98, 100]), kf(LOOP_FRAMES, [100, 98, 100])],
      }),
      shapes: [
        rectShape({
          name: 'WaterRect',
          size: [82, 36],
          position: [0, 0],
          fillColor: waterColor,
          opacity: murky ? 100 : 92,
          roundness: 8,
        }),
      ],
    }),
  );

  layers.push(
    makeLayer({
      name: 'Glass',
      ks: transform({ position: [45, 22.5, 0] }),
      shapes: [
        rectShape({
          name: 'GlassTank',
          size: [88, 43],
          position: [0, 0],
          fillColor: palette.glass,
          opacity: 100,
          roundness: 9,
          strokeColor: palette.glassStroke,
          strokeWidth: 1.6,
        }),
      ],
    }),
  );

  return layers;
}

const specs = [
  {
    name: 'aquarium-loop-empty-murky',
    waterColor: palette.murkyWater,
    murky: true,
    sand: false,
    pebbles: false,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 0,
    reflection: false,
    goldReflection: false,
    fish: [],
  },
  {
    name: 'aquarium-loop-lonely',
    waterColor: palette.clearWater,
    murky: false,
    sand: false,
    pebbles: false,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 0,
    reflection: false,
    goldReflection: false,
    fish: [{ name: 'Fish-1', color: palette.fishA, x: 46, y: 24, scale: 82, driftX: 2, driftY: 1, delay: 0 }],
  },
  {
    name: 'aquarium-loop-sandy-pair',
    waterColor: palette.clearWater,
    murky: false,
    sand: true,
    pebbles: false,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 0,
    reflection: false,
    goldReflection: false,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 26, y: 18, scale: 78, driftX: 3, driftY: 1, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 64, y: 28, scale: 72, driftX: 3, driftY: 1, delay: 1 },
    ],
  },
  {
    name: 'aquarium-loop-bubbly-pair',
    waterColor: palette.clearWater,
    murky: false,
    sand: true,
    pebbles: false,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 3,
    reflection: false,
    goldReflection: false,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 26, y: 18, scale: 78, driftX: 5, driftY: 1, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 64, y: 28, scale: 72, driftX: 5, driftY: 2, delay: 1 },
    ],
  },
  {
    name: 'aquarium-loop-bloom-trio',
    waterColor: palette.brightWater,
    murky: false,
    sand: true,
    pebbles: true,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 4,
    reflection: false,
    goldReflection: false,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 18, y: 15, scale: 80, driftX: 5, driftY: 1, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 45, y: 23, scale: 72, driftX: 6, driftY: 2, delay: 1 },
      { name: 'Fish-3', color: palette.fishC, x: 72, y: 31, scale: 66, driftX: 5, driftY: 2, delay: 2 },
    ],
  },
  {
    name: 'aquarium-loop-reflective-trio',
    waterColor: palette.brightWater,
    murky: false,
    sand: true,
    pebbles: true,
    coral: false,
    coralGlow: false,
    seahorse: false,
    bubbles: 4,
    reflection: true,
    goldReflection: false,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 18, y: 15, scale: 80, driftX: 6, driftY: 2, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 45, y: 23, scale: 72, driftX: 7, driftY: 2, delay: 1 },
      { name: 'Fish-3', color: palette.fishC, x: 72, y: 31, scale: 66, driftX: 6, driftY: 2, delay: 2 },
    ],
  },
  {
    name: 'aquarium-loop-coral-school',
    waterColor: palette.brightWater,
    murky: false,
    sand: true,
    pebbles: true,
    coral: true,
    coralGlow: false,
    seahorse: true,
    bubbles: 5,
    reflection: true,
    goldReflection: false,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 16, y: 13, scale: 80, driftX: 4, driftY: 2, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 35, y: 18, scale: 72, driftX: 7, driftY: 2, delay: 1 },
      { name: 'Fish-3', color: palette.fishC, x: 56, y: 27, scale: 66, driftX: 7, driftY: 2, delay: 2 },
      { name: 'Fish-4', color: palette.fishD, x: 76, y: 35, scale: 60, driftX: 4, driftY: 2, delay: 3 },
    ],
  },
  {
    name: 'aquarium-loop-golden-school',
    waterColor: palette.goldWater,
    murky: false,
    sand: true,
    pebbles: true,
    coral: true,
    coralGlow: true,
    seahorse: true,
    bubbles: 5,
    reflection: true,
    goldReflection: true,
    fish: [
      { name: 'Fish-1', color: palette.fishA, x: 15, y: 11, scale: 80, driftX: 4, driftY: 2, delay: 0 },
      { name: 'Fish-2', color: palette.fishB, x: 35, y: 17, scale: 72, driftX: 7, driftY: 2, delay: 1 },
      { name: 'Fish-3', color: palette.fishC, x: 54, y: 25, scale: 66, driftX: 8, driftY: 3, delay: 2 },
      { name: 'Fish-4', color: palette.fishD, x: 74, y: 34, scale: 60, driftX: 5, driftY: 2, delay: 3 },
      { name: 'Fish-5', color: palette.fishE, x: 83, y: 39, scale: 54, driftX: 3, driftY: 1, delay: 4 },
    ],
  },
];

for (const spec of specs) {
  const animation = {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: LOOP_FRAMES,
    w: WIDTH,
    h: HEIGHT,
    nm: spec.name,
    ddd: 0,
    assets: [],
    layers: tankLayers(spec),
  };

  writeFileSync(new URL(`./${spec.name}.json`, outDir), `${JSON.stringify(animation, null, 2)}\n`);
}
