import type { AnimationObject } from 'lottie-react-native';
import type { WindowLoopClipId } from './windowState';

export const WINDOW_LOTTIE_ASSETS: Record<WindowLoopClipId, AnimationObject> = {
  'window-loop-storm': require('../../../../assets/lottie/window/window-loop-storm.json'),
  'window-loop-rain': require('../../../../assets/lottie/window/window-loop-rain.json'),
  'window-loop-light-rain': require('../../../../assets/lottie/window/window-loop-light-rain.json'),
  'window-loop-clearing': require('../../../../assets/lottie/window/window-loop-clearing.json'),
  'window-loop-partly-cloudy': require('../../../../assets/lottie/window/window-loop-partly-cloudy.json'),
  'window-loop-sunny': require('../../../../assets/lottie/window/window-loop-sunny.json'),
  'window-loop-bright': require('../../../../assets/lottie/window/window-loop-bright.json'),
  'window-loop-perfect-flight': require('../../../../assets/lottie/window/window-loop-perfect-flight.json'),
};
