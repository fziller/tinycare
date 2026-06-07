import { useState, useEffect, useRef } from 'react';
import { Group } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { clampNeed, glowTier } from '../RoomScene.types';
import { useReanimatedSway } from '../hooks/useReanimatedSway';
import { useReanimatedNumeric } from '../hooks/useReanimatedNumeric';
import { PetBody } from './PetBody';
import { PetEar } from './PetEar';
import { PetEye } from './PetEye';
import { PetNose, PetMouth } from './PetNose';
import { PetTail } from './PetTail';
import { PetPaw } from './PetPaw';
import { PetHeart } from './PetHeart';

type Props = {
  social: number;
  movement: number;
  glow?: number;
  height: number;
};

const PET_X = 240;
const PET_BASE_Y_OFFSET = 52;

type PetState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type StateCfg = {
  bodyR: number;
  bodyScaleY: number;
  earH: number;
  earAngle: number;
  showTail: boolean;
  showPaws: boolean;
  showHeart: boolean;
  glowHighlight: boolean;
  blinkEnabled: boolean;
  noseGlow: boolean;
};

const STATE_CFG: Record<PetState, StateCfg> = {
  0: { bodyR: 6, bodyScaleY: 1, earH: 0, earAngle: 0, showTail: false, showPaws: false, showHeart: false, glowHighlight: false, blinkEnabled: false, noseGlow: false },
  1: { bodyR: 7, bodyScaleY: 1, earH: 3, earAngle: -0.3, showTail: false, showPaws: false, showHeart: false, glowHighlight: false, blinkEnabled: false, noseGlow: false },
  2: { bodyR: 7, bodyScaleY: 1, earH: 3, earAngle: -0.1, showTail: true, showPaws: false, showHeart: false, glowHighlight: false, blinkEnabled: false, noseGlow: false },
  3: { bodyR: 8, bodyScaleY: 1, earH: 5, earAngle: 0, showTail: true, showPaws: true, showHeart: false, glowHighlight: false, blinkEnabled: false, noseGlow: false },
  4: { bodyR: 8, bodyScaleY: 1, earH: 5, earAngle: 0, showTail: true, showPaws: true, showHeart: false, glowHighlight: true, blinkEnabled: false, noseGlow: false },
  5: { bodyR: 8, bodyScaleY: 1, earH: 5, earAngle: 0, showTail: true, showPaws: true, showHeart: false, glowHighlight: true, blinkEnabled: true, noseGlow: false },
  6: { bodyR: 8, bodyScaleY: 1.3, earH: 7, earAngle: 0.2, showTail: true, showPaws: false, showHeart: false, glowHighlight: false, blinkEnabled: false, noseGlow: false },
  7: { bodyR: 9, bodyScaleY: 1, earH: 6, earAngle: 0.4, showTail: true, showPaws: false, showHeart: true, glowHighlight: false, blinkEnabled: false, noseGlow: true },
};

function getPetState(social: number, movement: number, glow: number): PetState {
  const s = clampNeed(social);
  const m = clampNeed(movement);
  const tier = glowTier(glow);

  if (s < 20) return 0;
  if (s < 40) return m < 30 ? 1 : 2;
  if (s < 65) {
    if (m < 40) return 3;
    return tier < 2 ? 4 : 5;
  }
  if (m <= 70) return 6;
  return 7;
}

function useBlink(enabled: boolean): boolean {
  const [blinking, setBlinking] = useState(false);
  const closeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const delay = 3000 + Math.random() * 4000;
    const openId = setTimeout(() => {
      setBlinking(true);
      closeRef.current = setTimeout(() => {
        setBlinking(false);
      }, 150);
    }, delay);

    return () => {
      clearTimeout(openId);
      if (closeRef.current) clearTimeout(closeRef.current);
    };
  }, [blinking, enabled]);

  return blinking;
}

export function Pet({ social, movement, glow = 50, height }: Props) {
  const baseY = height - PET_BASE_Y_OFFSET;
  const state = getPetState(social, movement, glow);
  const cfg = STATE_CFG[state];

  const bodyR = useReanimatedNumeric(cfg.bodyR, 400);
  const bodyScaleY = useReanimatedNumeric(cfg.bodyScaleY, 400);
  const earH = useReanimatedNumeric(cfg.earH, 300);
  const earAngle = useReanimatedNumeric(cfg.earAngle, 300);

  // Per-frame UI-thread animation
  const wagAngle = useReanimatedSway(0, 1.5, 0.24);
  const trembleX = useReanimatedSway(0, 2.5, 1.0);
  const trembleY = useReanimatedSway(1.2, 1.8, 0.5);
  const heartFloat = useReanimatedSway(0, 2, 1.8);
  const heartDrift = useReanimatedSway(2, 1.5, 0.6);

  // Derived positions from animated SharedValues
  const bodyCy = useDerivedValue(() => baseY - bodyR.value);
  const earTop = useDerivedValue(() => bodyCy.value - bodyR.value - 2);
  const earLx = useDerivedValue(() => PET_X - bodyR.value * 0.5 + Math.sin(earAngle.value) * 2);
  const earRx = useDerivedValue(() => PET_X + bodyR.value * 0.5 + Math.sin(-earAngle.value) * 2);
  const earScale = useDerivedValue(() => earH.value / 13);
  const noseY = useDerivedValue(() => bodyCy.value + bodyR.value * 0.3);
  const pawLX = useDerivedValue(() => PET_X - bodyR.value * 0.35);
  const pawRX = useDerivedValue(() => PET_X + bodyR.value * 0.35);

  // State SharedValue for PetMouth
  const stateSV = useSharedValue<number>(state);
  useEffect(() => {
    stateSV.value = state;
  }, [state, stateSV]);

  const blinking = useBlink(cfg.blinkEnabled);

  return (
    <Group>
      {cfg.showTail && (
        <PetTail baseX={PET_X} bodyCy={bodyCy} bodyR={bodyR} wagAngle={wagAngle} />
      )}

      <PetBody
        x={PET_X}
        bodyCy={bodyCy}
        bodyR={bodyR}
        bodyScaleY={bodyScaleY}
        trembleX={state === 0 ? trembleX : undefined}
        trembleY={state === 0 ? trembleY : undefined}
        glowHighlight={cfg.glowHighlight}
      />

      {cfg.showPaws && (
        <>
          <PetPaw x={pawLX} bodyCy={bodyCy} bodyR={bodyR} />
          <PetPaw x={pawRX} bodyCy={bodyCy} bodyR={bodyR} />
        </>
      )}

      {cfg.earH > 0 && (
        <>
          <PetEar x={earLx} y={earTop} scale={earScale} rotate={earAngle} />
          <PetEar x={earRx} y={earTop} scale={earScale} rotate={earAngle} />
        </>
      )}

      <PetEye cx={PET_X - 2.5} cy={bodyCy} isOpen={state !== 0} xEyed={state === 0} blinking={blinking} />
      <PetEye cx={PET_X + 2.5} cy={bodyCy} isOpen={state !== 0} xEyed={state === 0} blinking={blinking} />

      <PetNose x={PET_X} y={noseY} noseGlow={cfg.noseGlow} />
      <PetMouth x={PET_X} y={noseY} state={stateSV} />

      {cfg.showHeart && (
        <PetHeart x={PET_X} bodyCy={bodyCy} bodyR={bodyR} heartFloat={heartFloat} heartDrift={heartDrift} />
      )}
    </Group>
  );
}
