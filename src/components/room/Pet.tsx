import { Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { clampNeed, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  social: number;
  movement: number;
  height: number;
};

const PET_X = 240;
const PET_BASE_Y_OFFSET = 52;

type PetState = 'hide' | 'sit' | 'idle' | 'hop' | 'play';

const STATE_CONFIG: Record<PetState, { bodyY: number; bodyR: number; earAngle: number }> = {
  hide: { bodyY: 0, bodyR: 6, earAngle: -0.5 },
  sit: { bodyY: -2, bodyR: 7, earAngle: -0.2 },
  idle: { bodyY: -3, bodyR: 8, earAngle: 0 },
  hop: { bodyY: -5, bodyR: 8, earAngle: 0.2 },
  play: { bodyY: -3, bodyR: 9, earAngle: 0.4 },
};

function getPetState(social: number, movement: number): PetState {
  const s = clampNeed(social);
  const m = clampNeed(movement);
  if (s < 25) return 'hide';
  if (s < 50) return 'sit';
  if (m < 25) return 'idle';
  if (m < 60) return 'hop';
  return 'play';
}

export function Pet({ social, movement, height }: Props) {
  const baseY = height - PET_BASE_Y_OFFSET;
  const state = getPetState(social, movement);
  const cfg = STATE_CONFIG[state];

  const socialPulse = useAnimatedNumeric(clampNeed(social) / 100, 600);
  const movePulse = useAnimatedNumeric(clampNeed(movement) / 100, 400);

  const bodyCy = baseY - cfg.bodyR + cfg.bodyY;
  const bodyR = cfg.bodyR + movePulse * 1;

  const earLx = PET_X - bodyR * 0.5 + Math.sin(cfg.earAngle) * 2;
  const earRx = PET_X + bodyR * 0.5 + Math.sin(-cfg.earAngle) * 2;
  const earTop = bodyCy - bodyR - 3;
  const earW = 3;
  const earH = 5 + socialPulse * 2;

  const eyeColor = state === 'hide' ? '#888888' : state === 'sit' ? '#666666' : '#333333';
  const showEyes = state !== 'hide';

  return (
    <Group>
      {state !== 'hide' && (
        <>
          <Circle cx={PET_X} cy={bodyCy} r={bodyR} color="#D4A574" />
          <RoundedRect x={earLx - earW / 2} y={earTop - earH} width={earW} height={earH} r={1} color="#C49464" />
          <RoundedRect x={earRx - earW / 2} y={earTop - earH} width={earW} height={earH} r={1} color="#C49464" />
          {showEyes && (
            <>
              <Circle cx={PET_X - 2.5} cy={bodyCy - 1.5} r={1.5} color={eyeColor} />
              <Circle cx={PET_X + 2.5} cy={bodyCy - 1.5} r={1.5} color={eyeColor} />
            </>
          )}
          <Circle cx={PET_X} cy={bodyCy + bodyR * 0.3} r={2} color="#E8A0A0" />
        </>
      )}
      {state === 'hide' && (
        <RoundedRect x={PET_X - 4} y={bodyCy - 2} width={8} height={5} r={3} color="#D4A574" />
      )}
    </Group>
  );
}
