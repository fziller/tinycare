import { create } from 'zustand';

type DevState = {
  enabled: boolean;
  averageValue: number | null;
  glow: number | null;
  hydration: number | null;
  food: number | null;
  energy: number | null;
  hygiene: number | null;
  bathroom: number | null;
  fun: number | null;
  social: number | null;
  comfort: number | null;
  environment: number | null;
  movement: number | null;

  setEnabled: (enabled: boolean) => void;
  setValue: (key: keyof Omit<DevState, 'enabled' | 'setEnabled' | 'setValue' | 'reset'>, value: number | null) => void;
  reset: () => void;
};

const INITIAL = {
  enabled: false,
  averageValue: null as number | null,
  glow: null as number | null,
  hydration: null as number | null,
  food: null as number | null,
  energy: null as number | null,
  hygiene: null as number | null,
  bathroom: null as number | null,
  fun: null as number | null,
  social: null as number | null,
  comfort: null as number | null,
  environment: null as number | null,
  movement: null as number | null,
};

export const useDevStore = create<DevState>((set) => ({
  ...INITIAL,

  setEnabled: (enabled) => set({ enabled }),

  setValue: (key, value) => set({ [key]: value }),

  reset: () => set(INITIAL),
}));
