import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import type { ParsedSong, SongScore } from '../../types';
import { FallingNotesCanvas } from './FallingNotesCanvas';
import { SheetMusicDisplay } from './SheetMusicDisplay';
import { PianoKeyboard } from './PianoKeyboard';
import { ScoreOverlay } from './ScoreOverlay';
import { ResultsModal } from './ResultsModal';
import { useSongPlayer } from '../../hooks/useSongPlayer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useAutoPlay } from '../../hooks/useAutoPlay';
import { useSheetMusic } from '../../hooks/useSheetMusic';
import { usePlayerInput, type InputMode } from '../../hooks/usePlayerInput';
import { useScoring } from '../../hooks/useScoring';
import { useProgressStore } from '../../stores/progressStore';
import { CalibrationModal } from '../onboarding/CalibrationModal';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useNavigate } from 'react-router-dom';
import { getNextIncompleteStep } from '../../data/journey';

interface Props {
  song: ParsedSong;
  onBack: () => void;
  journeyMode?: boolean;
}

const KEYBOARD_HEIGHT = 80;
const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

const MIC_WARNING_KEY = 'pianist-mic-warning-dismissed';

export function GameScreen({ song, onBack, journeyMode }: Props) {
  const navigate = useNavigate();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('auto');
  const [showMicWarning, setShowMicWarning] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [sensitivity, setSensitivity] = useState(1);
  const sensitivityRef = useRef(1);
  const [results, setResults] = useState<SongScore | null>(null);
  const [liveScore, setLiveScore] = useState(0);
  const [liveCombo, setLiveCombo] = useState(0);
  const [liveRating, setLiveRating] = useState<{ rating: string; time: number } | null>(null);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const wasPlayingRef = useRef(false);
  const prevScoreRef = useRef(0);
  const prevComboRef = useRef(0);
  const prevRatingTimeRef = useRef<number | null>(null);
  const prevCountdownRef = useRef<number | null>(null);
  const headphonesMode = useOnboardingStore((s) => s.headphonesMode);
  const setHeadphonesMode = useOnboardingStore((s) => s.setHeadphonesMode);
  const viewMode = useOnboardingStore((s) => s.viewMode);
  const setViewMode = useOnboardingStore((s) => s.setViewMode);
  const sheet = useSheetMusic(song.meta);
  const sheetAvailable = !sheet.loading && !sheet.error && sheet.timingMap !== null;

  const { timeRef, gameState, play, resume, pause, reset, tick, setSpeed, speedRef } =
    useSongPlayer(song.totalDuration);
  const autoPlay = useAutoPlay(song.notes, timeRef, gameState === 'playing', autoPlayEnabled);

  const micNotMuted = !autoPlayEnabled || headphonesMode;
  const input = usePlayerInput(inputMode, micNotMuted, sensitivityRef);
  const scoring = useScoring(song.notes, timeRef, input.usingMidi, speedRef);

  const showMicControls = !input.usingMidi && !input.hasBridgeConfig;

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
    return input.onNoteOff((midi) => {
      if (gameState === 'playing') {
        scoring.onNoteReleased(midi);
      }
    });
  }, [input, scoring, gameState]);

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
        scoring.checkSustain(input.activeNotes.current);
      }
      const score = scoring.scoreRef.current;
      const combo = scoring.comboRef.current;
      const rating = scoring.lastRatingRef.current;
      if (score !== prevScoreRef.current) {
        prevScoreRef.current = score;
        setLiveScore(score);
      }
      if (combo !== prevComboRef.current) {
        prevComboRef.current = combo;
        setLiveCombo(combo);
      }
      if (rating && rating.time !== prevRatingTimeRef.current) {
        prevRatingTimeRef.current = rating.time;
        setLiveRating({ ...rating });
      }
      const t = timeRef.current ?? 0;
      if (t < 0) {
        const num = Math.ceil(Math.abs(t));
        if (num !== prevCountdownRef.current) {
          prevCountdownRef.current = num;
          setCountdownNum(num);
        }
      } else if (prevCountdownRef.current !== null) {
        prevCountdownRef.current = null;
        setCountdownNum(null);
      }
    },
    isActive,
  );

  const addScore = useProgressStore((s) => s.addScore);
  const addJourneyScore = useProgressStore((s) => s.addJourneyScore);
  const unlockedNodes = useProgressStore((s) => s.unlockedNodes);

  useEffect(() => {
    if (gameState === 'results' && !results) {
      const r = scoring.getResults();
      r.songId = song.meta.id;
      setResults(r);
      if (journeyMode) {
        addJourneyScore(r);
      } else {
        const songUnlocked = unlockedNodes.includes(song.meta.id);
        addScore(r, songUnlocked);
      }
    }
  }, [gameState, results, scoring, song.meta.id, addScore, addJourneyScore, unlockedNodes, journeyMode]);

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
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        if (sheetAvailable) {
          const cycle = { waterfall: 'sheet', sheet: 'combined', combined: 'waterfall' } as const;
          setViewMode(cycle[viewMode]);
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, doRestart, sheetAvailable, viewMode, setViewMode]);

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

  const handleInputModeChange = useCallback((mode: InputMode) => {
    if (mode === 'mic') {
      const dismissed = localStorage.getItem(MIC_WARNING_KEY);
      if (!dismissed) {
        setShowMicWarning(true);
      }
    }
    setInputMode(mode);
  }, []);

  const dismissMicWarning = useCallback(() => {
    localStorage.setItem(MIC_WARNING_KEY, '1');
    setShowMicWarning(false);
  }, []);

  const openSettings = useCallback(() => {
    if (gameState === 'playing' || gameState === 'countdown') {
      wasPlayingRef.current = true;
      pause();
    } else {
      wasPlayingRef.current = false;
    }
    setShowCalibrationModal(true);
  }, [gameState, pause]);

  const closeSettings = useCallback(() => {
    setShowCalibrationModal(false);
    if (wasPlayingRef.current) {
      resume();
      wasPlayingRef.current = false;
    }
  }, [resume]);

  const canvasHeight = containerSize.height - KEYBOARD_HEIGHT;

  return (
    <div className="flex flex-col h-full bg-midnight relative">
      {/* Header toolbar */}
      <div className="flex items-center px-4 py-2 bg-surface/80 backdrop-blur-sm border-b t-border-light gap-2 min-h-[44px]">
        <button
          onClick={() => { pause(); onBack(); }}
          className="t-text-secondary hover:t-text transition-colors text-sm shrink-0"
        >
          Back
        </button>

        <div className="flex-1 min-w-0 text-center px-2">
          <h2 className="t-text font-medium text-sm truncate">{song.meta.title}</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Input mode selector */}
          <div className="flex items-center gap-0.5 t-bg-overlay rounded-full p-0.5">
            {(input.hasBridgeConfig ? ['auto', 'midi'] as InputMode[] : ['auto', 'midi', 'mic'] as InputMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleInputModeChange(mode)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                  inputMode === mode
                    ? 'bg-accent text-white'
                    : 't-text-secondary'
                }`}
              >
                {mode === 'auto' ? 'Auto' : mode === 'midi' ? 'MIDI' : 'Mic'}
              </button>
            ))}
          </div>

          {/* MIDI status */}
          {(input.usingMidi || input.hasBridgeConfig) && (
            <span className={`text-[9px] max-w-[100px] truncate ${input.isListening ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {input.isListening
                ? (input.midiBridgeConnected ? `Bridge: ${input.midiDeviceName ?? 'Connected'}` : input.midiDeviceName ?? 'MIDI')
                : 'Reconnecting...'}
            </span>
          )}

          {/* Mic controls — only when using mic */}
          {showMicControls && (
            <>
              <div className="flex items-center gap-1" title={`Mic sensitivity: ${sensitivity.toFixed(1)}x`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="t-text-secondary">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={sensitivity}
                  onChange={(e) => handleSensitivityChange(Number(e.target.value))}
                  className="w-14 h-1 accent-accent cursor-pointer"
                />
              </div>
            </>
          )}

          <ToggleSwitch
            label="Sound"
            enabled={autoPlayEnabled}
            onToggle={() => { Tone.start(); setAutoPlayEnabled((v) => !v); }}
          />

          {showMicControls && (
            <ToggleSwitch
              label="🎧"
              enabled={headphonesMode}
              onToggle={() => setHeadphonesMode(!headphonesMode)}
            />
          )}

          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="t-bg-overlay t-text-secondary text-xs rounded px-1.5 py-1 border-none outline-none cursor-pointer"
          >
            {SPEED_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface t-text">
                {s === 1 ? '1x' : `${s}x`}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="relative group">
            <button
              onClick={() => {
                if (!sheetAvailable) return;
                const cycle = { waterfall: 'sheet', sheet: 'combined', combined: 'waterfall' } as const;
                setViewMode(cycle[viewMode]);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode !== 'waterfall' && sheetAvailable
                  ? 'bg-accent/20 text-accent-light'
                  : 't-bg-overlay t-text-secondary hover:t-bg-overlay-hover'
              } ${!sheetAvailable ? 'opacity-40' : ''}`}
            >
              {viewMode === 'sheet' && sheetAvailable ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              ) : viewMode === 'combined' && sheetAvailable ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="8" rx="1" />
                  <rect x="3" y="14" width="18" height="7" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
              )}
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-black/90 text-xs text-white/70 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
              {sheetAvailable ? `View: ${viewMode} (V)` : 'No sheet music available'}
            </div>
          </div>

          <button
            onClick={doRestart}
            className="p-1.5 rounded-full t-bg-overlay t-text-secondary hover:t-bg-overlay-hover transition-colors"
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

          <button
            onClick={openSettings}
            className="p-1.5 rounded-full t-bg-overlay t-text-secondary hover:t-bg-overlay-hover transition-colors"
            title="Settings"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* MIDI not connected warning when in MIDI-only mode */}
      {inputMode === 'midi' && !input.midiConnected && !input.midiBridgeConnected && (
        <div className="px-4 py-1.5 t-caution-bg border-b t-caution-border t-caution text-xs text-center">
          {input.hasBridgeConfig
            ? 'Reconnecting to MIDI Bridge...'
            : 'No MIDI device detected. Connect a MIDI keyboard, or set up a MIDI Bridge in Settings.'}
        </div>
      )}

      {/* Mic warning banner */}
      {showMicWarning && (
        <div className="px-4 py-2 t-warning-bg border-b t-warning-border t-warning text-xs text-center flex items-center justify-center gap-3">
          <span>
            Mic mode is limited: single notes only, no chord support, and detection varies by device.
            For the best experience, connect a MIDI keyboard.
          </span>
          <button
            onClick={dismissMicWarning}
            className="t-warning-strong font-medium shrink-0 underline"
          >
            Got it
          </button>
        </div>
      )}

      {autoPlayEnabled && showMicControls && !headphonesMode && (
        <div className="px-4 py-1.5 t-caution-bg border-b t-caution-border t-caution text-xs text-center">
          Mic paused while sound is on. Toggle 🎧 to use both with headphones.
        </div>
      )}

      {input.error && (
        <div className="px-4 py-1.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs text-center">
          {input.usingMidi ? 'MIDI' : 'Mic'} error: {input.error}
        </div>
      )}

      {/* Game area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {containerSize.width > 0 && (
          <>
            {(() => {
              const effectiveMode = sheetAvailable ? viewMode : 'waterfall';
              const showSheet = effectiveMode === 'sheet' || effectiveMode === 'combined';
              const showWaterfall = effectiveMode === 'waterfall' || effectiveMode === 'combined';
              return (
                <>
                  {sheetAvailable && showSheet && (
                    <div
                      className="absolute inset-0"
                      style={{
                        bottom: KEYBOARD_HEIGHT,
                        zIndex: 0,
                      }}
                    >
                      <SheetMusicDisplay
                        key={song.meta.id}
                        songMeta={song.meta}
                        timeRef={timeRef}
                        playing={isActive}
                        width={containerSize.width}
                        height={canvasHeight}
                      />
                    </div>
                  )}
                  {showWaterfall && (
                    <div
                      className="absolute left-0 right-0"
                      style={effectiveMode === 'combined' ? {
                        bottom: KEYBOARD_HEIGHT,
                        height: Math.round(canvasHeight * 0.4),
                        opacity: 0.6,
                        maskImage: 'linear-gradient(to bottom, transparent, black 40%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)',
                        pointerEvents: 'none' as const,
                        zIndex: 1,
                      } : {
                        top: 0,
                        height: canvasHeight,
                      }}
                    >
                      <FallingNotesCanvas
                        notes={song.notes}
                        timeRef={timeRef}
                        playing={isActive}
                        width={containerSize.width}
                        height={effectiveMode === 'combined' ? Math.round(canvasHeight * 0.4) : (canvasHeight > 0 ? canvasHeight : 0)}
                        activeNotes={input.activeNotes.current}
                        hitNotes={scoring.hitNotes.current}
                        missedNotes={scoring.missedNotes.current}
                      />
                    </div>
                  )}
                </>
              );
            })()}
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
          <div className="text-8xl font-bold t-text opacity-80 animate-pulse tabular-nums">
            {countdownNum}
          </div>
        </div>
      )}

      {/* Results overlay */}
      {gameState === 'results' && results && (
        <ResultsModal
          results={results}
          onRetry={doRestart}
          onBack={onBack}
          journeyMode={journeyMode}
          onNextStep={journeyMode ? () => {
            const journeyStars = useProgressStore.getState().journeyBestStars;
            const next = getNextIncompleteStep(journeyStars);
            if (next) {
              const nextSongId = next.type === 'branch' ? next.songChoices[0] : next.songId;
              navigate(`/play/${nextSongId}`, { state: { from: '/', journeyMode: true }, replace: true });
            } else {
              navigate('/');
            }
          } : undefined}
        />
      )}

      {/* Idle overlay */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="flex flex-col items-center pointer-events-auto">
            <button
              onClick={() => { Tone.start(); play(); }}
              className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 hover:bg-accent-light transition-all hover:scale-105 border-2 border-white/30"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="text-sm mt-4 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm t-text-secondary font-medium">
              {input.usingMidi ? 'Play any key' : 'Play any note'}, press Space, or click to start
            </p>
          </div>
        </div>
      )}

      {/* Calibration modal */}
      {showCalibrationModal && (
        <CalibrationModal onClose={closeSettings} />
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
      <span className="t-text-secondary text-xs">{label}</span>
      <div
        className={`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${
          enabled ? activeColor : 't-bg-overlay-active'
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
