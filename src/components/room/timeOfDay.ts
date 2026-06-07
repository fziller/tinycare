import type { TimeOfDay } from './RoomScene.types';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 20) return 'sunset';
  if (hour >= 20 && hour < 21) return 'dusk';
  if (hour >= 21 && hour < 23) return 'night';
  return 'lateNight';
}

export type TimeColors = {
  wallGradientTop: string;
  wallGradientBottom: string;
  windowGlow: string;
  sunColor: string;
  sunRadius: number;
  lampOn: boolean;
  lampIntensity: number;
  ambientBrightness: number;
};

export const TIME_PALETTES: Record<TimeOfDay, TimeColors> = {
  dawn: {
    wallGradientTop: '#FFE8D0',
    wallGradientBottom: '#FFDAB5',
    windowGlow: '#FFB07A',
    sunColor: '#FFB07A',
    sunRadius: 40,
    lampOn: false,
    lampIntensity: 0,
    ambientBrightness: 0.45,
  },
  morning: {
    wallGradientTop: '#FFF6E8',
    wallGradientBottom: '#DDEEE3',
    windowGlow: '#FFD699',
    sunColor: '#F3B35C',
    sunRadius: 38,
    lampOn: false,
    lampIntensity: 0,
    ambientBrightness: 0.7,
  },
  noon: {
    wallGradientTop: '#FFFDF5',
    wallGradientBottom: '#E8F0E0',
    windowGlow: '#FFFFFF',
    sunColor: '#FFE066',
    sunRadius: 34,
    lampOn: false,
    lampIntensity: 0,
    ambientBrightness: 1.0,
  },
  afternoon: {
    wallGradientTop: '#FFF0E0',
    wallGradientBottom: '#E0E8D8',
    windowGlow: '#FFD699',
    sunColor: '#F3B35C',
    sunRadius: 38,
    lampOn: false,
    lampIntensity: 0,
    ambientBrightness: 0.75,
  },
  sunset: {
    wallGradientTop: '#FFD4B0',
    wallGradientBottom: '#DDA08A',
    windowGlow: '#FF8A5C',
    sunColor: '#E8795B',
    sunRadius: 44,
    lampOn: false,
    lampIntensity: 0,
    ambientBrightness: 0.4,
  },
  dusk: {
    wallGradientTop: '#C8B8A8',
    wallGradientBottom: '#9A8A7A',
    windowGlow: '#6B5B4F',
    sunColor: '#4A3A2A',
    sunRadius: 20,
    lampOn: true,
    lampIntensity: 0.25,
    ambientBrightness: 0.2,
  },
  night: {
    wallGradientTop: '#3A3A50',
    wallGradientBottom: '#2A2A3A',
    windowGlow: '#1A1A3A',
    sunColor: '#C8C8E0',
    sunRadius: 16,
    lampOn: true,
    lampIntensity: 0.7,
    ambientBrightness: 0.1,
  },
  lateNight: {
    wallGradientTop: '#1A1A2A',
    wallGradientBottom: '#0A0A1A',
    windowGlow: '#0A0A2A',
    sunColor: '#E0E0F0',
    sunRadius: 14,
    lampOn: true,
    lampIntensity: 0.4,
    ambientBrightness: 0.05,
  },
};
