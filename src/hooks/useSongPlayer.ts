import { useRef, useCallback, useState } from 'react';

export type GameState = 'idle' | 'countdown' | 'playing' | 'paused' | 'results';

const COUNTDOWN_SECONDS = 3;

export function useSongPlayer(totalDuration: number) {
  const timeRef = useRef(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const speedRef = useRef(1);

  const play = useCallback(() => {
    timeRef.current = -COUNTDOWN_SECONDS;
    setGameState('countdown');
  }, []);

  const resume = useCallback(() => {
    setGameState(timeRef.current < 0 ? 'countdown' : 'playing');
  }, []);

  const pause = useCallback(() => {
    setGameState('paused');
  }, []);

  const reset = useCallback(() => {
    timeRef.current = 0;
    setGameState('idle');
  }, []);

  const tick = useCallback(
    (deltaMs: number) => {
      const advance = (deltaMs / 1000) * speedRef.current;
      timeRef.current += advance;

      if (timeRef.current >= 0 && timeRef.current - advance < 0) {
        setGameState('playing');
      }

      if (timeRef.current >= totalDuration) {
        setGameState('results');
      }
    },
    [totalDuration],
  );

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
  }, []);

  return {
    timeRef,
    gameState,
    setGameState,
    play,
    resume,
    pause,
    reset,
    tick,
    speedRef,
    setSpeed,
    countdownSeconds: COUNTDOWN_SECONDS,
  };
}
