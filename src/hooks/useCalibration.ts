import { useRef, useCallback, useState, useEffect } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToMidi, midiToName } from '../utils/note-utils';
import type { CalibrationData } from '../stores/onboardingStore';

const FFT_SIZE = 4096;
const AMBIENT_FRAMES = 60;
const CLARITY_THRESHOLD = 0.7;
const MIN_FREQUENCY = 55;
const MAX_FREQUENCY = 2100;

const TARGET_RMS = 0.10;
const MIN_GAIN = 1;
const MAX_GAIN = 50;
const NOISE_FLOOR_ONSET_MULTIPLIER = 6;
const NOISE_FLOOR_OFFSET_MULTIPLIER = 3;
const ABSOLUTE_MIN_ONSET = 0.005;
const ABSOLUTE_MIN_OFFSET = 0.002;

export type CalibrationPhase =
  | 'idle'
  | 'requesting-mic'
  | 'measuring-ambient'
  | 'waiting-for-note'
  | 'note-detected'
  | 'error';

interface CalibrationState {
  phase: CalibrationPhase;
  rmsLevel: number;
  ambientProgress: number;
  detectedNote: string | null;
  result: CalibrationData | null;
  error: string | null;
}

function computeRMS(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

export function useCalibration() {
  const [state, setState] = useState<CalibrationState>({
    phase: 'idle',
    rmsLevel: 0,
    ambientProgress: 0,
    detectedNote: null,
    result: null,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const samplesRef = useRef<number[]>([]);
  const phaseRef = useRef<CalibrationPhase>('idle');
  const calibrationDataRef = useRef<{ gain: number; onset: number; offset: number } | null>(null);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
    analyserRef.current = null;
    samplesRef.current = [];
    calibrationDataRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    cleanup();
    phaseRef.current = 'requesting-mic';
    setState((s) => ({ ...s, phase: 'requesting-mic', rmsLevel: 0, ambientProgress: 0, detectedNote: null, result: null, error: null }));

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (err) {
      phaseRef.current = 'error';
      setState((s) => ({ ...s, phase: 'error', error: (err as Error).message }));
      return;
    }

    streamRef.current = stream;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;
    gainNodeRef.current = gainNode;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyserRef.current = analyser;

    source.connect(gainNode);
    gainNode.connect(analyser);

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    detector.minVolumeAbsolute = 0;
    const buffer = new Float32Array(analyser.fftSize);

    samplesRef.current = [];
    phaseRef.current = 'measuring-ambient';
    setState((s) => ({ ...s, phase: 'measuring-ambient' }));

    function tick() {
      if (!analyserRef.current) return;
      analyser.getFloatTimeDomainData(buffer);
      const rms = computeRMS(buffer);

      if (phaseRef.current === 'measuring-ambient') {
        samplesRef.current.push(rms);
        const progress = samplesRef.current.length / AMBIENT_FRAMES;
        setState((s) => ({ ...s, rmsLevel: rms, ambientProgress: Math.min(progress, 1) }));

        if (samplesRef.current.length >= AMBIENT_FRAMES) {
          const sorted = [...samplesRef.current].sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];
          const estimatedPlayingRms = Math.max(median * 10, 0.001);
          const desiredGain = TARGET_RMS / estimatedPlayingRms;
          const clampedGain = Math.min(Math.max(desiredGain, MIN_GAIN), MAX_GAIN);

          gainNode.gain.setValueAtTime(clampedGain, audioContext.currentTime);

          const postGainNoiseFloor = median * clampedGain;
          const onset = Math.max(postGainNoiseFloor * NOISE_FLOOR_ONSET_MULTIPLIER, ABSOLUTE_MIN_ONSET);
          const offset = Math.max(postGainNoiseFloor * NOISE_FLOOR_OFFSET_MULTIPLIER, ABSOLUTE_MIN_OFFSET);

          calibrationDataRef.current = { gain: clampedGain, onset, offset };
          phaseRef.current = 'waiting-for-note';
          setState((s) => ({ ...s, phase: 'waiting-for-note', ambientProgress: 1 }));
        }
      } else if (phaseRef.current === 'waiting-for-note') {
        const cal = calibrationDataRef.current!;
        setState((s) => ({ ...s, rmsLevel: rms }));

        if (rms >= cal.onset) {
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate);
          if (clarity >= CLARITY_THRESHOLD && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
            const midi = frequencyToMidi(frequency);
            const noteName = midiToName(midi);
            const sorted = [...samplesRef.current].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];

            const result: CalibrationData = {
              gain: cal.gain,
              onsetThreshold: cal.onset,
              offsetThreshold: cal.offset,
              ambientRms: median,
            };

            phaseRef.current = 'note-detected';
            setState((s) => ({
              ...s,
              phase: 'note-detected',
              detectedNote: noteName,
              result,
              rmsLevel: rms,
            }));
            return;
          }
        }
      }

      if (phaseRef.current !== 'note-detected' && phaseRef.current !== 'error' && phaseRef.current !== 'idle') {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    phaseRef.current = 'idle';
    setState({ phase: 'idle', rmsLevel: 0, ambientProgress: 0, detectedNote: null, result: null, error: null });
  }, [cleanup]);

  return {
    phase: state.phase,
    rmsLevel: state.rmsLevel,
    ambientProgress: state.ambientProgress,
    detectedNote: state.detectedNote,
    result: state.result,
    error: state.error,
    start,
    reset,
  };
}
