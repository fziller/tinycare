import { AquariumLottie } from './AquariumLottie';
import { getAquariumState } from './aquariumState';

type Props = {
  fun: number;
  glow: number;
  height: number;
};

export function Aquarium({ fun, glow, height: _height }: Props) {
  const targetState = getAquariumState(fun, glow);
  return <AquariumLottie targetState={targetState} />;
}
