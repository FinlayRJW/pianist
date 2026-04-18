import { useRef, useEffect, useCallback, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToMidi, midiToName } from '../utils/note-utils';

const FFT_SIZE = 4096;
const CLARITY_THRESHOLD = 0.88;
const MIN_FREQUENCY = 55;
const MAX_FREQUENCY = 2100;

const ONSET_RMS_THRESHOLD = 0.015;
const OFFSET_RMS_THRESHOLD = 0.006;
const RE_TRIGGER_DIP_RATIO = 0.35;

const STABLE_FRAMES_REQUIRED = 2;
const MIN_NOTE_GAP_FRAMES = 3;

interface MicInputState {
  activeNotes: Set<number>;
  isListening: boolean;
  error: string | null;
  detectedNote: string | null;
  rmsLevel: number;
}

function computeRMS(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

export function useMicInput(enabled: boolean, sensitivityRef?: React.RefObject<number>) {
  const [state, setState] = useState<MicInputState>({
    activeNotes: new Set(),
    isListening: false,
    error: null,
    detectedNote: null,
    rmsLevel: 0,
  });

  const activeNotesRef = useRef<Set<number>>(new Set());
  const onNoteOnRef = useRef<((midi: number) => void) | null>(null);
  const onNoteOffRef = useRef<((midi: number) => void) | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const currentNoteRef = useRef<number | null>(null);
  const candidateNoteRef = useRef<number | null>(null);
  const stableCountRef = useRef(0);
  const noteActiveRef = useRef(false);
  const peakRmsRef = useRef(0);
  const gapCounterRef = useRef(0);
  const rmsHistoryRef = useRef<number[]>([]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      source.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const buffer = new Float32Array(analyser.fftSize);

      function detect() {
        analyser.getFloatTimeDomainData(buffer);
        const rms = computeRMS(buffer);
        const sensitivity = sensitivityRef?.current ?? 1;
        const onsetThreshold = ONSET_RMS_THRESHOLD / sensitivity;
        const offsetThreshold = OFFSET_RMS_THRESHOLD / sensitivity;

        const history = rmsHistoryRef.current;
        history.push(rms);
        if (history.length > 6) history.shift();

        if (gapCounterRef.current > 0) {
          gapCounterRef.current--;
        }

        if (noteActiveRef.current) {
          if (rms < offsetThreshold) {
            releaseNote();
          } else {
            const dipDetected =
              peakRmsRef.current > 0 &&
              rms < peakRmsRef.current * RE_TRIGGER_DIP_RATIO &&
              gapCounterRef.current === 0;

            if (dipDetected) {
              releaseNote();
            } else {
              if (rms > peakRmsRef.current) {
                peakRmsRef.current = rms;
              }
            }
          }
        }

        if (!noteActiveRef.current && rms >= onsetThreshold && gapCounterRef.current === 0) {
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate);

          if (clarity >= CLARITY_THRESHOLD && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const midi = frequencyToMidi(frequency);

            if (midi === candidateNoteRef.current) {
              stableCountRef.current++;
            } else {
              candidateNoteRef.current = midi;
              stableCountRef.current = 1;
            }

            if (stableCountRef.current >= STABLE_FRAMES_REQUIRED) {
              triggerNote(midi, rms);
            }
          }
        } else if (noteActiveRef.current) {
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate);
          if (clarity >= CLARITY_THRESHOLD && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const midi = frequencyToMidi(frequency);
            if (midi !== currentNoteRef.current) {
              releaseNote();
              triggerNote(midi, rms);
            }
          }
        }

        setState((prev) => ({ ...prev, rmsLevel: rms }));
        rafRef.current = requestAnimationFrame(detect);
      }

      function triggerNote(midi: number, rms: number) {
        currentNoteRef.current = midi;
        noteActiveRef.current = true;
        peakRmsRef.current = rms;
        stableCountRef.current = 0;
        candidateNoteRef.current = null;

        activeNotesRef.current.clear();
        activeNotesRef.current.add(midi);
        onNoteOnRef.current?.(midi);
        setState((prev) => ({
          ...prev,
          activeNotes: new Set(activeNotesRef.current),
          detectedNote: midiToName(midi),
        }));
      }

      function releaseNote() {
        const prev = currentNoteRef.current;
        noteActiveRef.current = false;
        currentNoteRef.current = null;
        peakRmsRef.current = 0;
        gapCounterRef.current = MIN_NOTE_GAP_FRAMES;

        if (prev !== null) {
          activeNotesRef.current.delete(prev);
          onNoteOffRef.current?.(prev);
          setState((s) => ({
            ...s,
            activeNotes: new Set(activeNotesRef.current),
            detectedNote: null,
          }));
        }
      }

      rafRef.current = requestAnimationFrame(detect);
      setState({ activeNotes: new Set(), isListening: true, error: null, detectedNote: null, rmsLevel: 0 });
    } catch (err) {
      setState({ activeNotes: new Set(), isListening: false, error: (err as Error).message, detectedNote: null, rmsLevel: 0 });
    }
  }, [sensitivityRef]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    activeNotesRef.current.clear();
    currentNoteRef.current = null;
    candidateNoteRef.current = null;
    stableCountRef.current = 0;
    noteActiveRef.current = false;
    peakRmsRef.current = 0;
    gapCounterRef.current = 0;
    rmsHistoryRef.current = [];
    setState({ activeNotes: new Set(), isListening: false, error: null, detectedNote: null, rmsLevel: 0 });
  }, []);

  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      stopListening();
    }
    return stopListening;
  }, [enabled, startListening, stopListening]);

  return {
    activeNotes: activeNotesRef,
    activeNotesState: state.activeNotes,
    isListening: state.isListening,
    error: state.error,
    detectedNote: state.detectedNote,
    rmsLevel: state.rmsLevel,
    onNoteOn: onNoteOnRef,
    onNoteOff: onNoteOffRef,
  };
}
