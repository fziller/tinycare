import type { AnimationObject } from 'lottie-react-native';
import type { AquariumLoopClipId } from './aquariumState';

export const AQUARIUM_LOTTIE_ASSETS: Record<AquariumLoopClipId, AnimationObject> = {
  'aquarium-loop-empty-murky': require('../../../../assets/lottie/aquarium/aquarium-loop-empty-murky.json'),
  'aquarium-loop-lonely': require('../../../../assets/lottie/aquarium/aquarium-loop-lonely.json'),
  'aquarium-loop-sandy-pair': require('../../../../assets/lottie/aquarium/aquarium-loop-sandy-pair.json'),
  'aquarium-loop-bubbly-pair': require('../../../../assets/lottie/aquarium/aquarium-loop-bubbly-pair.json'),
  'aquarium-loop-bloom-trio': require('../../../../assets/lottie/aquarium/aquarium-loop-bloom-trio.json'),
  'aquarium-loop-reflective-trio': require('../../../../assets/lottie/aquarium/aquarium-loop-reflective-trio.json'),
  'aquarium-loop-coral-school': require('../../../../assets/lottie/aquarium/aquarium-loop-coral-school.json'),
  'aquarium-loop-golden-school': require('../../../../assets/lottie/aquarium/aquarium-loop-golden-school.json'),
};
