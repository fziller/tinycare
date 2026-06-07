import { useState, useEffect } from 'react';

export function useSway(phase: number, speed: number): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let rafId: number;
    function loop() {
      setElapsed(Date.now() - start);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const freq = 0.003;
  return Math.sin(elapsed * freq * speed + phase) * 0.12;
}
