import { useState, useEffect } from 'react';

let globalTick = 0;
let globalListeners: Set<(v: number) => void> = new Set();
let globalRunning = false;

function startGlobalLoop() {
  if (globalRunning) return;
  globalRunning = true;
  function loop() {
    globalTick++;
    globalListeners.forEach((fn) => fn(globalTick));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function useSwayTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    globalListeners.add(setTick);
    startGlobalLoop();
    return () => {
      globalListeners.delete(setTick);
    };
  }, []);
  return tick;
}

export function useSway(phase: number, speed: number): number {
  const tick = useSwayTick();
  return Math.sin(tick * 0.003 * speed + phase) * 0.12;
}
