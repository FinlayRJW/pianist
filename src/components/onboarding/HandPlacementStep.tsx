import { useState, useEffect, useCallback, useRef } from 'react';
import { useMidiInput } from '../../hooks/useMidiInput';
import { useWebSocketMidi } from '../../hooks/useWebSocketMidi';
import { useMicInput } from '../../hooks/useMicInput';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface Props {
  hasMidi: boolean;
  onFinish: () => void;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[midi % 12]}${octave}`;
}

function midiToLetter(midi: number): string {
  return NOTE_NAMES[midi % 12];
}

interface FloatingNote {
  id: number;
  letter: string;
  full: string;
  x: number;
  color: string;
}

const KEY_W = 40;
const KEY_H = 140;
const BLACK_H = 85;
const SVG_PAD = 10;

const DISPLAY_KEYS: { note: string; midi: number; finger: string }[] = [
  { note: 'C3', midi: 48, finger: '5' },
  { note: 'D3', midi: 50, finger: '4' },
  { note: 'E3', midi: 52, finger: '3' },
  { note: 'F3', midi: 53, finger: '2' },
  { note: 'G3', midi: 55, finger: '1' },
  { note: 'A3', midi: 57, finger: '' },
  { note: 'B3', midi: 59, finger: '' },
  { note: 'C4', midi: 60, finger: '1' },
  { note: 'D4', midi: 62, finger: '2' },
  { note: 'E4', midi: 64, finger: '3' },
  { note: 'F4', midi: 65, finger: '4' },
  { note: 'G4', midi: 67, finger: '5' },
];

const LEFT_MIDI = new Set([48, 50, 52, 53, 55]);
const RIGHT_MIDI = new Set([60, 62, 64, 65, 67]);

const TOTAL_W = DISPLAY_KEYS.length * KEY_W;
const SVG_W = TOTAL_W + SVG_PAD * 2;
const SVG_H = KEY_H + 60;

function getBlackKeys(): { x: number; midi: number }[] {
  const keys: { x: number; midi: number }[] = [];
  DISPLAY_KEYS.forEach((key, i) => {
    const name = key.note.slice(0, -1);
    if (['C', 'D', 'F', 'G', 'A'].includes(name)) {
      keys.push({ x: SVG_PAD + i * KEY_W + KEY_W * 0.65, midi: key.midi + 1 });
    }
  });
  return keys;
}

const BLACK_KEYS = getBlackKeys();

function keyXCenter(midi: number): number | null {
  const wIdx = DISPLAY_KEYS.findIndex((k) => k.midi === midi);
  if (wIdx >= 0) return SVG_PAD + wIdx * KEY_W + (KEY_W - 2) / 2;
  const bk = BLACK_KEYS.find((k) => k.midi === midi);
  if (bk) return bk.x + (KEY_W * 0.55) / 2;
  return null;
}

function noteColor(midi: number): string {
  if (LEFT_MIDI.has(midi)) return '#f59e0b';
  if (RIGHT_MIDI.has(midi)) return '#6366f1';
  return '#22d3ee';
}

export function HandPlacementStep({ hasMidi, onFinish }: Props) {
  const calibration = useOnboardingStore((s) => s.calibration);
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);
  const midi = useMidiInput(hasMidi);
  const bridge = useWebSocketMidi(hasMidi ? midiBridgeUrl : null);
  const activeMidi = midi.isConnected ? midi : bridge;
  const mic = useMicInput(!hasMidi, undefined, calibration);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const idCounter = useRef(0);
  const notesPlayed = useRef(0);
  const [showContinue, setShowContinue] = useState(false);

  const spawnFloat = useCallback((midiNote: number) => {
    const xCenter = keyXCenter(midiNote);
    const xPx = xCenter != null ? (xCenter / SVG_W) * 100 : 50;
    const color = noteColor(midiNote);

    const note: FloatingNote = {
      id: idCounter.current++,
      letter: midiToLetter(midiNote),
      full: midiToName(midiNote),
      x: xPx,
      color,
    };

    setFloatingNotes((prev) => [...prev.slice(-12), note]);
    notesPlayed.current++;
    if (notesPlayed.current >= 3 && !showContinue) setShowContinue(true);

    setTimeout(() => {
      setFloatingNotes((prev) => prev.filter((n) => n.id !== note.id));
    }, 1500);
  }, [showContinue]);

  useEffect(() => {
    if (!hasMidi) return;
    activeMidi.onNoteOn.current = (midiNote: number) => {
      setActiveKeys((prev) => new Set(prev).add(midiNote));
      spawnFloat(midiNote);
    };
    activeMidi.onNoteOff.current = (midiNote: number) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(midiNote);
        return next;
      });
    };
    return () => {
      activeMidi.onNoteOn.current = null;
      activeMidi.onNoteOff.current = null;
    };
  }, [hasMidi, activeMidi, spawnFloat]);

  useEffect(() => {
    if (hasMidi) return;
    mic.onNoteOn.current = (midiNote: number) => {
      setActiveKeys((prev) => new Set(prev).add(midiNote));
      spawnFloat(midiNote);
    };
    mic.onNoteOff.current = (midiNote: number) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(midiNote);
        return next;
      });
    };
    return () => {
      mic.onNoteOn.current = null;
      mic.onNoteOff.current = null;
    };
  }, [hasMidi, mic, spawnFloat]);

  const tips = [
    'Curve your fingers gently',
    'Thumbs meet at Middle C',
    'Keep your wrists relaxed',
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-5 animate-fadeIn">
      <h2 className="text-2xl font-bold t-text">Try It Out</h2>
      <p className="t-text-secondary text-sm max-w-xs">
        {hasMidi
          ? 'Play some notes on your keyboard!'
          : 'Play some notes on your piano!'}
      </p>

      <div className="relative" style={{ width: SVG_W, maxWidth: '100%' }}>
        {/* Floating note names */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ zIndex: 10, bottom: 0, top: '-80px' }}>
          {floatingNotes.map((note) => (
            <div
              key={note.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${note.x}%`,
                bottom: '55%',
                transform: 'translateX(-50%)',
                animation: 'floatUp 1.5s ease-out forwards',
              }}
            >
              <span
                className="text-5xl font-black"
                style={{
                  color: note.color,
                  textShadow: `0 0 30px ${note.color}88, 0 0 60px ${note.color}44, 0 2px 10px rgba(0,0,0,0.4)`,
                }}
              >
                {note.letter}
              </span>
              <span className="text-xs font-semibold" style={{ color: note.color, opacity: 0.8 }}>
                {note.full}
              </span>
            </div>
          ))}
        </div>

        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
          {DISPLAY_KEYS.map((key, i) => {
            const x = SVG_PAD + i * KEY_W;
            const isActive = activeKeys.has(key.midi);
            const isLeft = LEFT_MIDI.has(key.midi);
            const isRight = RIGHT_MIDI.has(key.midi);
            return (
              <g key={key.midi}>
                <rect
                  x={x}
                  y={10}
                  width={KEY_W - 2}
                  height={KEY_H}
                  rx={4}
                  fill={isActive ? (isLeft ? '#f59e0b' : isRight ? '#6366f1' : '#22d3ee') : '#e8e8e8'}
                  stroke="#999"
                  strokeWidth={0.5}
                  style={{ transition: 'fill 0.1s' }}
                />
                {key.finger && (
                  <text
                    x={x + (KEY_W - 2) / 2}
                    y={KEY_H - 5}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={isActive ? '#fff' : isLeft ? '#b45309' : isRight ? '#4338ca' : '#999'}
                    style={{ transition: 'fill 0.1s' }}
                  >
                    {key.finger}
                  </text>
                )}
                {key.note === 'C4' && (
                  <text x={x + (KEY_W - 2) / 2} y={KEY_H + 25} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                    Middle C
                  </text>
                )}
              </g>
            );
          })}
          {BLACK_KEYS.map(({ x, midi: bm }) => (
            <rect
              key={bm}
              x={x}
              y={10}
              width={KEY_W * 0.55}
              height={BLACK_H}
              rx={3}
              fill={activeKeys.has(bm) ? '#818cf8' : 'var(--key-black)'}
              stroke="var(--key-black-border)"
              strokeWidth={0.5}
              style={{ transition: 'fill 0.1s' }}
            />
          ))}
          <text x={SVG_PAD + 2 * KEY_W} y={SVG_H - 2} textAnchor="middle" fontSize="10" fontWeight="500" fill="#f59e0b" opacity={0.8}>
            Left Hand
          </text>
          <text x={SVG_PAD + 9.5 * KEY_W} y={SVG_H - 2} textAnchor="middle" fontSize="10" fontWeight="500" fill="#6366f1" opacity={0.8}>
            Right Hand
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-1.5">
        {tips.map((tip, i) => (
          <p key={i} className="t-text-tertiary text-xs flex items-center gap-2 justify-center">
            <span className="w-1 h-1 rounded-full bg-accent/50 inline-block" />
            {tip}
          </p>
        ))}
      </div>

      <button
        onClick={onFinish}
        className={`px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-lg ${
          showContinue
            ? 'bg-accent text-white hover:bg-accent-light shadow-accent/30'
            : 't-bg-overlay t-text-secondary'
        }`}
      >
        {showContinue ? 'Continue' : 'Skip'}
      </button>
    </div>
  );
}
