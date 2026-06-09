import { WindowLottie } from './WindowLottie';
import { getWindowState } from './windowState';

type Props = {
  averageValue: number;
  glow: number;
  height: number;
};

export function Window({ averageValue, glow, height: _height }: Props) {
  const targetState = getWindowState(averageValue, glow);
  return <WindowLottie targetState={targetState} />;
}
