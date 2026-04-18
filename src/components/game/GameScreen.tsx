import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import type { ParsedSong, SongScore } from '../../types';
import { FallingNotesCanvas } from './FallingNotesCanvas';
import { PianoKeyboard } from './PianoKeyboard';
import { ScoreOverlay } from './ScoreOverlay';
import { ResultsModal } from './ResultsModal';
import { useSongPlayer } from '../../hooks/useSongPlayer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useAutoPlay } from '../../hooks/useAutoPlay';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useScoring } from '../../hooks/useScoring';
import { useProgressStore } from '../../stores/progressStore';

interface Props {
  song: ParsedSong;
  onBack: () => void;
}

const KEYBOARD_HEIGHT = 80;
const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

export function GameScreen({ song, onBack }: Props) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speed, setSpeedState] = useState(1);
  const [sensitivity, setSensitivity] = useState(2);
  const sensitivityRef = useRef(1);
  const [results, setResults] = useState<SongScore | null>(null);
  const [liveScore, setLiveScore] = useState(0);
  const [liveCombo, setLiveCombo] = useState(0);
  const [liveRating, setLiveRating] = useState<{ rating: string; time: number } | null>(null);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [rmsLevel, setRmsLevel] = useState(0);

  const { timeRef, gameState, play, resume, pause, reset, tick, setSpeed } =
    useSongPlayer(song.totalDuration);
  const autoPlay = useAutoPlay(song.notes, timeRef, gameState === 'playing', autoPlayEnabled);
  const effectiveMicEnabled = micEnabled && !autoPlayEnabled;
  const input = usePlayerInput(effectiveMicEnabled, sensitivityRef);
  const scoring = useScoring(song.notes, timeRef);

  useEffect(() => {
    return input.onNoteOn((midi) => {
      if (gameState === 'playing') {
        scoring.onNoteDetected(midi);
      }
      if (gameState === 'idle') {
        Tone.start();
        play();
      }
    });
  }, [input, scoring, gameState, play]);

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const isActive = gameState === 'playing' || gameState === 'countdown';

  useAnimationFrame(
    (deltaMs) => {
      tick(deltaMs);
      autoPlay.tick();
      if (gameState === 'playing') {
        scoring.checkMisses();
      }
      setLiveScore(scoring.scoreRef.current);
      setLiveCombo(scoring.comboRef.current);
      if (scoring.lastRatingRef.current) {
        setLiveRating({ ...scoring.lastRatingRef.current });
      }
      setRmsLevel(input.rmsLevel);
      const t = timeRef.current ?? 0;
      if (t < 0) {
        setCountdownNum(Math.ceil(Math.abs(t)));
      } else {
        setCountdownNum(null);
      }
    },
    isActive,
  );

  useAnimationFrame(
    () => { setRmsLevel(input.rmsLevel); },
    !isActive && effectiveMicEnabled,
  );

  const addScore = useProgressStore((s) => s.addScore);

  useEffect(() => {
    if (gameState === 'results' && !results) {
      const r = scoring.getResults();
      r.songId = song.meta.id;
      setResults(r);
      addScore(r);
    }
  }, [gameState, results, scoring, song.meta.id, addScore]);

  const togglePlay = useCallback(() => {
    if (gameState === 'playing' || gameState === 'countdown') {
      pause();
    } else if (gameState === 'idle') {
      Tone.start();
      play();
    } else if (gameState === 'paused') {
      Tone.start();
      resume();
    } else if (gameState === 'results') {
      doRestart();
    }
  }, [gameState, play, pause, resume]);

  const doRestart = useCallback(() => {
    scoring.reset();
    setResults(null);
    setLiveScore(0);
    setLiveCombo(0);
    setLiveRating(null);
    setCountdownNum(null);
    reset();
    setTimeout(() => {
      Tone.start();
      play();
    }, 50);
  }, [reset, play, scoring]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        doRestart();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, doRestart]);

  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      setSpeedState(newSpeed);
      setSpeed(newSpeed);
    },
    [setSpeed],
  );

  const handleSensitivityChange = useCallback((value: number) => {
    setSensitivity(value);
    sensitivityRef.current = value;
  }, []);

  const canvasHeight = containerSize.height - KEYBOARD_HEIGHT;

  return (
    <div className="flex flex-col h-full bg-midnight relative">
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/80 backdrop-blur-sm border-b border-white/5 gap-2 min-h-[44px]">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors text-sm shrink-0"
        >
          Back
        </button>

        <div className="text-center min-w-0 shrink">
          <h2 className="text-white font-medium text-sm truncate">{song.meta.title}</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ToggleSwitch
            label="Mic"
            enabled={micEnabled}
            onToggle={() => setMicEnabled((v) => !v)}
            activeColor={!micEnabled ? 'bg-white/20' : autoPlayEnabled ? 'bg-yellow-500' : input.isListening ? 'bg-emerald-500' : 'bg-yellow-500'}
          />

          {effectiveMicEnabled && (
            <VolumeIndicator rms={rmsLevel} detectedNote={input.detectedNote} />
          )}

          <ToggleSwitch
            label="Sound"
            enabled={autoPlayEnabled}
            onToggle={() => { Tone.start(); setAutoPlayEnabled((v) => !v); }}
          />

          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="bg-white/10 text-white/70 text-xs rounded px-1.5 py-1 border-none outline-none cursor-pointer"
          >
            {SPEED_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface text-white">
                {s === 1 ? '1x' : `${s}x`}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1" title={`Mic sensitivity: ${sensitivity.toFixed(1)}x`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            <input
              type="range"
              min="0.3"
              max="5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => handleSensitivityChange(Number(e.target.value))}
              className="w-14 h-1 accent-accent cursor-pointer"
            />
          </div>

          <button
            onClick={doRestart}
            className="p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            title="Restart (R)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="px-3 py-1 rounded-full bg-accent/20 text-accent-light hover:bg-accent/30 transition-colors text-sm font-medium"
          >
            {isActive ? 'Pause' : gameState === 'results' ? 'Retry' : 'Play'}
          </button>
        </div>
      </div>

      {autoPlayEnabled && micEnabled && (
        <div className="px-4 py-1.5 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400 text-xs text-center">
          Mic paused while sound is on. Use headphones to use both.
        </div>
      )}

      {input.error && (
        <div className="px-4 py-1.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs text-center">
          Mic error: {input.error}
        </div>
      )}

      {/* Game area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {containerSize.width > 0 && (
          <>
            <FallingNotesCanvas
              notes={song.notes}
              timeRef={timeRef}
              playing={isActive}
              width={containerSize.width}
              height={canvasHeight > 0 ? canvasHeight : 0}
              activeNotes={input.activeNotes.current}
              hitNotes={scoring.hitNotes.current}
              missedNotes={scoring.missedNotes.current}
            />
            {gameState === 'playing' && (
              <ScoreOverlay score={liveScore} combo={liveCombo} lastRating={liveRating} />
            )}
            <div className="absolute bottom-0 left-0 right-0">
              <PianoKeyboard
                width={containerSize.width}
                height={KEYBOARD_HEIGHT}
                activeNotes={input.activeNotesState}
              />
            </div>
          </>
        )}
      </div>

      {/* Countdown overlay */}
      {gameState === 'countdown' && countdownNum !== null && countdownNum > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-8xl font-bold text-white/80 animate-pulse tabular-nums">
            {countdownNum}
          </div>
        </div>
      )}

      {/* Results overlay */}
      {gameState === 'results' && results && (
        <ResultsModal results={results} onRetry={doRestart} onBack={onBack} />
      )}

      {/* Idle overlay */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-5 pointer-events-none">
          <div className="flex flex-col items-center pointer-events-auto">
            <button
              onClick={() => { Tone.start(); play(); }}
              className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 hover:bg-accent-light transition-all hover:scale-105"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="text-white/40 text-sm mt-4">
              Play any note, press Space, or click to start
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeIndicator({ rms, detectedNote }: { rms: number; detectedNote: string | null }) {
  const level = Math.min(rms * 40, 1);
  const barCount = 5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-end gap-px h-[14px]">
        {Array.from({ length: barCount }, (_, i) => {
          const threshold = (i + 1) / barCount;
          const active = level >= threshold;
          return (
            <div
              key={i}
              className={`w-[3px] rounded-sm transition-colors ${active ? 'bg-emerald-400' : 'bg-white/15'}`}
              style={{ height: `${4 + i * 2}px` }}
            />
          );
        })}
      </div>
      {detectedNote && (
        <span className="text-xs font-mono text-accent-light min-w-[28px]">
          {detectedNote}
        </span>
      )}
    </div>
  );
}

function ToggleSwitch({
  label,
  enabled,
  onToggle,
  activeColor = 'bg-accent',
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  activeColor?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={onToggle}>
      <span className="text-white/50 text-xs">{label}</span>
      <div
        className={`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${
          enabled ? activeColor : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-[15px]' : 'translate-x-[2px]'
          }`}
        />
      </div>
    </div>
  );
}
