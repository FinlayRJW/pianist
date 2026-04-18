import { useEffect, useRef } from 'react';

export function useAnimationFrame(callback: (deltaMs: number) => void, active: boolean) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    let frameId: number;
    let lastTime = performance.now();

    function loop(now: number) {
      const delta = now - lastTime;
      lastTime = now;
      callbackRef.current(delta);
      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [active]);
}
