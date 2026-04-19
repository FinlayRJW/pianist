import { useRef, useEffect, useCallback, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToMidi, midiToName } from '../utils/note-utils';
import type { CalibrationData } from '../stores/onboardingStore';

const FFT_SIZE = 4096;
const MIN_FREQUENCY = 27.5;
const MAX_FREQUENCY = 4200;

function getMinClarity(frequency: number): number {
  if (frequency < 60 || frequency > 2000) return 0.5;
  return 0.7;
}

const FALLBACK_ONSET_THRESHOLD = 0.004;
const FALLBACK_OFFSET_THRESHOLD = 0.002;
const RE_TRIGGER_DIP_RATIO = 0.35;

const STABLE_FRAMES_REQUIRED = 1;
const MIN_NOTE_GAP_FRAMES = 3;

const CALIBRATION_FRAMES = 30;
const TARGET_RMS = 0.10;
const MIN_GAIN = 1;
const MAX_GAIN = 50;
const NOISE_FLOOR_ONSET_MULTIPLIER = 6;
const NOISE_FLOOR_OFFSET_MULTIPLIER = 3;
const ABSOLUTE_MIN_ONSET = 0.005;
const ABSOLUTE_MIN_OFFSET = 0.002;

interface MicInputState {
  activeNotes: Set<number>;
  isListening: boolean;
  calibrated: boolean;
  error: string | null;
  detectedNote: string | null;
  rmsLevel: number;
  clarity: number;
}

function computeRMS(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

export function useMicInput(
  enabled: boolean,
  sensitivityRef?: React.RefObject<number>,
  preCalibration?: CalibrationData | null,
) {
  const [state, setState] = useState<MicInputState>({
    activeNotes: new Set(),
    isListening: false,
    calibrated: false,
    error: null,
    detectedNote: null,
    rmsLevel: 0,
    clarity: 0,
  });

  const activeNotesRef = useRef<Set<number>>(new Set());
  const onNoteOnRef = useRef<((midi: number) => void) | null>(null);
  const onNoteOffRef = useRef<((midi: number) => void) | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number>(0);

  const currentNoteRef = useRef<number | null>(null);
  const candidateNoteRef = useRef<number | null>(null);
  const stableCountRef = useRef(0);
  const noteActiveRef = useRef(false);
  const peakRmsRef = useRef(0);
  const gapCounterRef = useRef(0);

  const calibrationSamplesRef = useRef<number[]>([]);
  const calibratedRef = useRef(false);
  const adaptiveOnsetRef = useRef(FALLBACK_ONSET_THRESHOLD);
  const adaptiveOffsetRef = useRef(FALLBACK_OFFSET_THRESHOLD);

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
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      gainNodeRef.current = gainNode;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;

      source.connect(gainNode);
      gainNode.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      detector.minVolumeAbsolute = 0;
      const buffer = new Float32Array(analyser.fftSize);

      function finishCalibration() {
        const samples = calibrationSamplesRef.current;
        const sorted = [...samples].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];

        const estimatedPlayingRms = Math.max(median * 10, 0.001);
        const desiredGain = TARGET_RMS / estimatedPlayingRms;
        const clampedGain = Math.min(Math.max(desiredGain, MIN_GAIN), MAX_GAIN);

        gainNode.gain.setValueAtTime(clampedGain, audioContext.currentTime);

        const postGainNoiseFloor = median * clampedGain;
        adaptiveOnsetRef.current = Math.max(
          postGainNoiseFloor * NOISE_FLOOR_ONSET_MULTIPLIER,
          ABSOLUTE_MIN_ONSET,
        );
        adaptiveOffsetRef.current = Math.max(
          postGainNoiseFloor * NOISE_FLOOR_OFFSET_MULTIPLIER,
          ABSOLUTE_MIN_OFFSET,
        );

        calibratedRef.current = true;
        setState((prev) => ({ ...prev, calibrated: true }));
      }

      function detect() {
        analyser.getFloatTimeDomainData(buffer);
        const rms = computeRMS(buffer);

        if (!calibratedRef.current) {
          calibrationSamplesRef.current.push(rms);
          if (calibrationSamplesRef.current.length >= CALIBRATION_FRAMES) {
            finishCalibration();
          }
          setState((prev) => ({ ...prev, rmsLevel: rms, clarity: 0 }));
          rafRef.current = requestAnimationFrame(detect);
          return;
        }

        const sensitivity = sensitivityRef?.current ?? 1;
        const onsetThreshold = adaptiveOnsetRef.current / sensitivity;
        const offsetThreshold = adaptiveOffsetRef.current / sensitivity;

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

        const [frequency, curClarity] = detector.findPitch(buffer, audioContext.sampleRate);

        if (!noteActiveRef.current && rms >= onsetThreshold && gapCounterRef.current === 0) {
          if (curClarity >= getMinClarity(frequency) && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
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
          if (curClarity >= getMinClarity(frequency) && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const midi = frequencyToMidi(frequency);
            if (midi !== currentNoteRef.current) {
              releaseNote();
              triggerNote(midi, rms);
            }
          }
        }

        setState((prev) => ({ ...prev, rmsLevel: rms, clarity: curClarity }));
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

      if (preCalibration) {
        gainNode.gain.setValueAtTime(preCalibration.gain, audioContext.currentTime);
        adaptiveOnsetRef.current = preCalibration.onsetThreshold;
        adaptiveOffsetRef.current = preCalibration.offsetThreshold;
        calibratedRef.current = true;
        setState({ activeNotes: new Set(), isListening: true, calibrated: true, error: null, detectedNote: null, rmsLevel: 0, clarity: 0 });
      } else {
        setState({ activeNotes: new Set(), isListening: true, calibrated: false, error: null, detectedNote: null, rmsLevel: 0, clarity: 0 });
      }

      rafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      setState({ activeNotes: new Set(), isListening: false, calibrated: false, error: (err as Error).message, detectedNote: null, rmsLevel: 0, clarity: 0 });
    }
  }, [sensitivityRef, preCalibration]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      setTimeout(() => ctx.close(), 0);
    }
    if (gainNodeRef.current) {
      gainNodeRef.current = null;
    }
    activeNotesRef.current.clear();
    currentNoteRef.current = null;
    candidateNoteRef.current = null;
    stableCountRef.current = 0;
    noteActiveRef.current = false;
    peakRmsRef.current = 0;
    gapCounterRef.current = 0;
    calibrationSamplesRef.current = [];
    calibratedRef.current = false;
    adaptiveOnsetRef.current = FALLBACK_ONSET_THRESHOLD;
    adaptiveOffsetRef.current = FALLBACK_OFFSET_THRESHOLD;
    setState({ activeNotes: new Set(), isListening: false, calibrated: false, error: null, detectedNote: null, rmsLevel: 0, clarity: 0 });
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
    calibrated: state.calibrated,
    error: state.error,
    detectedNote: state.detectedNote,
    rmsLevel: state.rmsLevel,
    clarity: state.clarity,
    onNoteOn: onNoteOnRef,
    onNoteOff: onNoteOffRef,
  };
}
