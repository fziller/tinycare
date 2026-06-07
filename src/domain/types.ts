export type DayMode = 'survival' | 'normal' | 'ambitious';

export type SupportedLocale = 'en' | 'de';

export type NeedCategory =
  | 'hydration'
  | 'food'
  | 'energy'
  | 'hygiene'
  | 'bathroom'
  | 'fun'
  | 'social'
  | 'comfort'
  | 'environment'
  | 'movement'
  | 'custom';

export type NeedEffort = 'tiny' | 'small' | 'normal';

export type NeedAction = {
  id: string;
  increaseBy: number;
  effort: NeedEffort;
};

export type NeedVisual = {
  base: string;
  fill: string;
  glow: string;
};

export type NeedTemplate = {
  id: string;
  category: NeedCategory;
  simsInspiredBy?: string;
  isDefault: boolean;
  isOptionalMvp: boolean;
  decayPerHour: number;
  reminderThreshold: number;
  actions: NeedAction[];
  visual: NeedVisual;
};

export type Need = NeedTemplate & {
  value: number;
  lastUpdatedAt: string;
  isPaused: boolean;
  pausedUntil?: string;
  snoozedUntil?: string;
};

export type NeedLog = {
  id: string;
  needId: string;
  actionId: string;
  actionLabel?: string;
  increaseBy: number;
  createdAt: string;
  mode: DayMode;
};

export type NotificationPermissionState = 'unknown' | 'granted' | 'denied';

export type NotificationActionKind = 'done' | 'snooze' | 'pause' | 'open' | 'unknown';
