import { useRef, useEffect, useCallback, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToMidi, midiToName } from '../utils/note-utils';
import { detectPeakNotes } from '../utils/fft-peak-detector';

const FFT_SIZE = 4096;
const CLARITY_THRESHOLD = 0.7;
const MIN_FREQUENCY = 55;
const MAX_FREQUENCY = 2100;

const FALLBACK_ONSET_THRESHOLD = 0.004;
const FALLBACK_OFFSET_THRESHOLD = 0.002;
const RE_TRIGGER_DIP_RATIO = 0.35;
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

export function useMicInput(enabled: boolean, sensitivityRef?: React.RefObject<number>) {
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
      const timeDomainBuffer = new Float32Array(analyser.fftSize);
      const frequencyBuffer = new Float32Array(analyser.frequencyBinCount);

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
        analyser.getFloatTimeDomainData(timeDomainBuffer);
        const rms = computeRMS(timeDomainBuffer);

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
            releaseAllNotes();
          } else {
            const dipDetected =
              peakRmsRef.current > 0 &&
              rms < peakRmsRef.current * RE_TRIGGER_DIP_RATIO &&
              gapCounterRef.current === 0;

            if (dipDetected) {
              releaseAllNotes();
            } else {
              if (rms > peakRmsRef.current) {
                peakRmsRef.current = rms;
              }
            }
          }
        }

        let curClarity = 0;

        if (!noteActiveRef.current && rms >= onsetThreshold && gapCounterRef.current === 0) {
          const [frequency, clarity] = detector.findPitch(timeDomainBuffer, audioContext.sampleRate);
          curClarity = clarity;

          if (clarity >= CLARITY_THRESHOLD && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const primaryMidi = frequencyToMidi(frequency);

            analyser.getFloatFrequencyData(frequencyBuffer);
            const fftNotes = detectPeakNotes(frequencyBuffer, audioContext.sampleRate, FFT_SIZE);

            const notesToTrigger = new Set<number>();
            notesToTrigger.add(primaryMidi);
            for (const midi of fftNotes) {
              notesToTrigger.add(midi);
            }

            triggerNotes(notesToTrigger, rms);
          }
        } else if (noteActiveRef.current) {
          const [frequency, clarity] = detector.findPitch(timeDomainBuffer, audioContext.sampleRate);
          curClarity = clarity;

          if (clarity >= CLARITY_THRESHOLD && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const newPrimaryMidi = frequencyToMidi(frequency);
            const currentNotes = activeNotesRef.current;
            if (!currentNotes.has(newPrimaryMidi)) {
              releaseAllNotes();

              analyser.getFloatFrequencyData(frequencyBuffer);
              const fftNotes = detectPeakNotes(frequencyBuffer, audioContext.sampleRate, FFT_SIZE);

              const notesToTrigger = new Set<number>();
              notesToTrigger.add(newPrimaryMidi);
              for (const midi of fftNotes) {
                notesToTrigger.add(midi);
              }

              triggerNotes(notesToTrigger, rms);
            }
          }
        }

        setState((prev) => ({ ...prev, rmsLevel: rms, clarity: curClarity }));
        rafRef.current = requestAnimationFrame(detect);
      }

      function triggerNotes(midiNotes: Set<number>, rms: number) {
        noteActiveRef.current = true;
        peakRmsRef.current = rms;

        activeNotesRef.current = new Set(midiNotes);
        for (const midi of midiNotes) {
          onNoteOnRef.current?.(midi);
        }

        const names = [...midiNotes].map(midiToName);
        setState((prev) => ({
          ...prev,
          activeNotes: new Set(midiNotes),
          detectedNote: names.join(' '),
        }));
      }

      function releaseAllNotes() {
        const prev = activeNotesRef.current;
        noteActiveRef.current = false;
        peakRmsRef.current = 0;
        gapCounterRef.current = MIN_NOTE_GAP_FRAMES;

        if (prev.size > 0) {
          for (const midi of prev) {
            onNoteOffRef.current?.(midi);
          }
          activeNotesRef.current = new Set();
          setState((s) => ({
            ...s,
            activeNotes: new Set(),
            detectedNote: null,
          }));
        }
      }

      rafRef.current = requestAnimationFrame(detect);
      setState({ activeNotes: new Set(), isListening: true, calibrated: false, error: null, detectedNote: null, rmsLevel: 0, clarity: 0 });
    } catch (err) {
      setState({ activeNotes: new Set(), isListening: false, calibrated: false, error: (err as Error).message, detectedNote: null, rmsLevel: 0, clarity: 0 });
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
    if (gainNodeRef.current) {
      gainNodeRef.current = null;
    }
    activeNotesRef.current = new Set();
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
