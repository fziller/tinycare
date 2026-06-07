import type { Need, NeedTemplate } from './types';

export const NEED_CATALOG: NeedTemplate[] = [
  {
    id: 'hydration',
    category: 'hydration',
    isDefault: true,
    isOptionalMvp: false,
    decayPerHour: 34,
    reminderThreshold: 30,
    actions: [
      { id: 'sip-water', increaseBy: 15, effort: 'tiny' },
      { id: 'glass-water', increaseBy: 35, effort: 'small' },
      { id: 'fill-bottle', increaseBy: 45, effort: 'normal' },
    ],
    visual: { base: '#D8EFEA', fill: '#36AFA0', glow: '#82D7CA' },
  },
  {
    id: 'food',
    category: 'food',
    simsInspiredBy: 'Hunger',
    isDefault: true,
    isOptionalMvp: false,
    decayPerHour: 20,
    reminderThreshold: 35,
    actions: [
      { id: 'tiny-snack', increaseBy: 25, effort: 'tiny' },
      { id: 'snack', increaseBy: 40, effort: 'small' },
      { id: 'meal', increaseBy: 75, effort: 'normal' },
    ],
    visual: { base: '#F7E5CD', fill: '#E98B45', glow: '#F4B06F' },
  },
  {
    id: 'energy',
    category: 'energy',
    simsInspiredBy: 'Energy',
    isDefault: true,
    isOptionalMvp: false,
    decayPerHour: 12,
    reminderThreshold: 28,
    actions: [
      { id: 'eyes-off', increaseBy: 12, effort: 'tiny' },
      { id: 'five-minute-pause', increaseBy: 28, effort: 'small' },
      { id: 'nap-or-reset', increaseBy: 65, effort: 'normal' },
    ],
    visual: { base: '#E9E0F2', fill: '#8D79C8', glow: '#B7A8DE' },
  },
  {
    id: 'hygiene',
    category: 'hygiene',
    simsInspiredBy: 'Hygiene',
    isDefault: true,
    isOptionalMvp: false,
    decayPerHour: 6,
    reminderThreshold: 32,
    actions: [
      { id: 'wash-hands-face', increaseBy: 15, effort: 'tiny' },
      { id: 'brush-teeth', increaseBy: 35, effort: 'small' },
      { id: 'shower', increaseBy: 80, effort: 'normal' },
    ],
    visual: { base: '#D9E9F3', fill: '#559FC9', glow: '#8DC8E5' },
  },
  {
    id: 'bathroom',
    category: 'bathroom',
    simsInspiredBy: 'Bladder',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 26,
    reminderThreshold: 35,
    actions: [
      { id: 'body-scan', increaseBy: 15, effort: 'tiny' },
      { id: 'bathroom-break', increaseBy: 70, effort: 'small' },
    ],
    visual: { base: '#DCEEE0', fill: '#6AAD72', glow: '#A0D6A6' },
  },
  {
    id: 'fun',
    category: 'fun',
    simsInspiredBy: 'Fun',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 4,
    reminderThreshold: 22,
    actions: [
      { id: 'one-song', increaseBy: 15, effort: 'tiny' },
      { id: 'ten-minutes-fun', increaseBy: 35, effort: 'small' },
      { id: 'hobby-block', increaseBy: 65, effort: 'normal' },
    ],
    visual: { base: '#F4DDF0', fill: '#C45C98', glow: '#E59AC5' },
  },
  {
    id: 'social',
    category: 'social',
    simsInspiredBy: 'Social',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 2.2,
    reminderThreshold: 25,
    actions: [
      { id: 'send-emoji', increaseBy: 12, effort: 'tiny' },
      { id: 'send-message', increaseBy: 30, effort: 'small' },
      { id: 'voice-or-meet', increaseBy: 70, effort: 'normal' },
    ],
    visual: { base: '#F1DCD2', fill: '#D8735F', glow: '#EAA091' },
  },
  {
    id: 'comfort',
    category: 'comfort',
    simsInspiredBy: 'Comfort',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 9,
    reminderThreshold: 35,
    actions: [
      { id: 'adjust-posture', increaseBy: 12, effort: 'tiny' },
      { id: 'change-comfort', increaseBy: 28, effort: 'small' },
      { id: 'full-reset', increaseBy: 55, effort: 'normal' },
    ],
    visual: { base: '#E9E3D7', fill: '#9B8065', glow: '#C9AE8D' },
  },
  {
    id: 'environment',
    category: 'environment',
    simsInspiredBy: 'Room',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 4.5,
    reminderThreshold: 22,
    actions: [
      { id: 'one-item', increaseBy: 12, effort: 'tiny' },
      { id: 'air-or-trash', increaseBy: 30, effort: 'small' },
      { id: 'five-minute-room', increaseBy: 55, effort: 'normal' },
    ],
    visual: { base: '#DDE7DD', fill: '#638E69', glow: '#93BD98' },
  },
  {
    id: 'movement',
    category: 'movement',
    isDefault: false,
    isOptionalMvp: true,
    decayPerHour: 4.2,
    reminderThreshold: 22,
    actions: [
      { id: 'stand-up', increaseBy: 12, effort: 'tiny' },
      { id: 'three-min-stretch', increaseBy: 32, effort: 'small' },
      { id: 'walk-workout', increaseBy: 70, effort: 'normal' },
    ],
    visual: { base: '#DFE8F0', fill: '#4F7FA6', glow: '#8BB2D1' },
  },
];

export const DEFAULT_NEED_IDS = NEED_CATALOG.filter((need) => need.isDefault).map((need) => need.id);

export const FUTURE_NEED_BAR_IDS = [
  'mindMood',
  'medication',
  'sunlight',
  'sleepPrep',
  'recovery',
  'focusBreak',
  'foodPrep',
  'chores',
  'outsideTime',
] as const;

export function getNeedTemplate(needId: string): NeedTemplate | undefined {
  return NEED_CATALOG.find((need) => need.id === needId);
}

export function createNeedFromTemplate(template: NeedTemplate, now: Date, value = 82): Need {
  return {
    ...template,
    value,
    lastUpdatedAt: now.toISOString(),
    isPaused: false,
  };
}
