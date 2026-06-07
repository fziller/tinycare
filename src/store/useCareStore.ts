import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  applyNeedAction,
  calculateNeedValue,
  createLogId,
  pauseNeedForToday,
  reactivateExpiredPause,
  snoozeNeed,
} from '../domain/needEngine';
import { DEFAULT_NEED_IDS, NEED_CATALOG, createNeedFromTemplate, getNeedTemplate } from '../domain/needs';
import type { DayMode, Need, NeedLog, NotificationPermissionState, SupportedLocale } from '../domain/types';
import { getDeviceLocale } from '../i18n/locales';
import { mmkvZustandStorage } from './mmkvStorage';

type CareState = {
  onboardingComplete: boolean;
  dayMode: DayMode;
  locale: SupportedLocale;
  activeNeedIds: string[];
  needsById: Record<string, Need>;
  logs: NeedLog[];
  glow: number;
  notificationPermission: NotificationPermissionState;
  lastNotificationSyncAt?: string;
  completeOnboarding: (needIds: string[], dayMode: DayMode) => void;
  setDayMode: (dayMode: DayMode) => void;
  setLocale: (locale: SupportedLocale) => void;
  setNotificationPermission: (permission: NotificationPermissionState) => void;
  markNotificationSync: (now?: Date) => void;
  logNeedAction: (needId: string, actionId: string, now?: Date) => void;
  logSmallestAction: (needId: string, now?: Date) => void;
  snooze: (needId: string, minutes?: number, now?: Date) => void;
  pauseToday: (needId: string, now?: Date) => void;
  toggleNeed: (needId: string) => void;
  refreshExpiredPauses: (now?: Date) => void;
  resetApp: () => void;
};

function buildInitialNeeds(now: Date): Record<string, Need> {
  return Object.fromEntries(
    NEED_CATALOG.map((template) => [template.id, createNeedFromTemplate(template, now, template.isDefault ? 78 : 72)]),
  );
}

function ensureNeedExists(needsById: Record<string, Need>, needId: string, now: Date): Record<string, Need> {
  if (needsById[needId]) {
    return needsById;
  }

  const template = getNeedTemplate(needId);
  if (!template) {
    return needsById;
  }

  return {
    ...needsById,
    [needId]: createNeedFromTemplate(template, now),
  };
}

const initialNow = new Date();

export const useCareStore = create<CareState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      dayMode: 'normal',
      locale: getDeviceLocale(),
      activeNeedIds: DEFAULT_NEED_IDS.slice(0, 3),
      needsById: buildInitialNeeds(initialNow),
      logs: [],
      glow: 0,
      notificationPermission: 'unknown',
      completeOnboarding: (needIds, dayMode) => {
        const now = new Date();
        const selectedIds = needIds.length >= 3 ? needIds.slice(0, 6) : DEFAULT_NEED_IDS.slice(0, 3);
        const needsById = selectedIds.reduce(
          (needs, needId) => ensureNeedExists(needs, needId, now),
          buildInitialNeeds(now),
        );

        set({
          onboardingComplete: true,
          dayMode,
          activeNeedIds: selectedIds,
          needsById,
        });
      },
      setDayMode: (dayMode) => set({ dayMode }),
      setLocale: (locale) => set({ locale }),
      setNotificationPermission: (notificationPermission) => set({ notificationPermission }),
      markNotificationSync: (now = new Date()) => set({ lastNotificationSyncAt: now.toISOString() }),
      logNeedAction: (needId, actionId, now = new Date()) => {
        const state = get();
        const need = state.needsById[needId];
        const action = need?.actions.find((candidate) => candidate.id === actionId);
        if (!need || !action) return;

        const updatedNeed = applyNeedAction(need, action, now, state.dayMode);
        const log: NeedLog = {
          id: createLogId(now, needId, actionId),
          needId,
          actionId,
          increaseBy: action.increaseBy,
          createdAt: now.toISOString(),
          mode: state.dayMode,
        };

        set({
          needsById: {
            ...state.needsById,
            [needId]: updatedNeed,
          },
          logs: [log, ...state.logs].slice(0, 80),
          glow: state.glow + (action.effort === 'tiny' ? 1 : action.effort === 'small' ? 2 : 3),
        });
      },
      logSmallestAction: (needId, now = new Date()) => {
        const need = get().needsById[needId];
        const action = need?.actions.find((candidate) => candidate.effort === 'tiny') ?? need?.actions[0];
        if (!action) return;

        get().logNeedAction(needId, action.id, now);
      },
      snooze: (needId, minutes = 30, now = new Date()) => {
        const state = get();
        const need = state.needsById[needId];
        if (!need) return;

        set({
          needsById: {
            ...state.needsById,
            [needId]: snoozeNeed(need, now, minutes / 60),
          },
        });
      },
      pauseToday: (needId, now = new Date()) => {
        const state = get();
        const need = state.needsById[needId];
        if (!need) return;

        set({
          needsById: {
            ...state.needsById,
            [needId]: pauseNeedForToday(need, now),
          },
        });
      },
      toggleNeed: (needId) => {
        const state = get();
        const now = new Date();
        const exists = state.activeNeedIds.includes(needId);
        const activeNeedIds = exists
          ? state.activeNeedIds.filter((id) => id !== needId)
          : [...state.activeNeedIds, needId].slice(0, 6);

        set({
          activeNeedIds,
          needsById: ensureNeedExists(state.needsById, needId, now),
        });
      },
      refreshExpiredPauses: (now = new Date()) => {
        const state = get();
        const needsById = Object.fromEntries(
          Object.entries(state.needsById).map(([needId, need]) => [needId, reactivateExpiredPause(need, now)]),
        );

        set({ needsById });
      },
      resetApp: () => {
        const now = new Date();
        const locale = get().locale;
        set({
          onboardingComplete: false,
          dayMode: 'normal',
          locale,
          activeNeedIds: DEFAULT_NEED_IDS.slice(0, 3),
          needsById: buildInitialNeeds(now),
          logs: [],
          glow: 0,
          notificationPermission: 'unknown',
          lastNotificationSyncAt: undefined,
        });
      },
    }),
    {
      name: 'tinycare-care-state',
      storage: createJSONStorage(() => mmkvZustandStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<CareState> | undefined;
        return {
          ...state,
          locale: state?.locale ?? getDeviceLocale(),
        };
      },
    },
  ),
);

export function selectActiveNeeds(now = new Date()): Need[] {
  const state = useCareStore.getState();
  return state.activeNeedIds
    .map((needId) => state.needsById[needId])
    .filter(Boolean)
    .map((need) => ({
      ...need,
      value: calculateNeedValue(need, now, state.dayMode),
    }));
}
