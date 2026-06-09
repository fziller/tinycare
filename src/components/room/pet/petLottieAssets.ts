import type { AnimationObject } from 'lottie-react-native';
import type { PetLoopClipId, PetTransitionClipId } from './petState';

type PetClipId = PetLoopClipId | PetTransitionClipId;

export const PET_LOTTIE_ASSETS: Record<PetClipId, AnimationObject> = {
  'pet-loop-hide': require('../../../../assets/lottie/pet/pet-loop-hide.json'),
  'pet-loop-sit-small': require('../../../../assets/lottie/pet/pet-loop-sit-small.json'),
  'pet-loop-sit-wag': require('../../../../assets/lottie/pet/pet-loop-sit-wag.json'),
  'pet-loop-idle': require('../../../../assets/lottie/pet/pet-loop-idle.json'),
  'pet-loop-idle-glow': require('../../../../assets/lottie/pet/pet-loop-idle-glow.json'),
  'pet-loop-idle-blink': require('../../../../assets/lottie/pet/pet-loop-idle-blink.json'),
  'pet-loop-hop': require('../../../../assets/lottie/pet/pet-loop-hop.json'),
  'pet-loop-play': require('../../../../assets/lottie/pet/pet-loop-play.json'),
  'pet-transition-hide-to-idle': require('../../../../assets/lottie/pet/pet-transition-hide-to-idle.json'),
  'pet-transition-idle-to-hide': require('../../../../assets/lottie/pet/pet-transition-idle-to-hide.json'),
  'pet-transition-idle-to-hop': require('../../../../assets/lottie/pet/pet-transition-idle-to-hop.json'),
  'pet-transition-hop-to-idle': require('../../../../assets/lottie/pet/pet-transition-hop-to-idle.json'),
  'pet-transition-idle-to-play': require('../../../../assets/lottie/pet/pet-transition-idle-to-play.json'),
  'pet-transition-play-to-idle': require('../../../../assets/lottie/pet/pet-transition-play-to-idle.json'),
};
