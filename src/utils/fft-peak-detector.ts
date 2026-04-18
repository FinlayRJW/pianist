const MIN_MIDI = 21;
const MAX_MIDI = 96;
const HARMONIC_TOLERANCE_CENTS = 50;
const PEAK_PROMINENCE_DB = 20;
const MAX_NOTES = 3;
const SECONDARY_DROP_DB = 15;

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function freqToMidi(freq: number): number {
  return 12 * Math.log2(freq / 440) + 69;
}

function centsDifference(f1: number, f2: number): number {
  return Math.abs(1200 * Math.log2(f1 / f2));
}

function isHarmonicOf(candidateFreq: number, fundamentalFreq: number): boolean {
  for (let h = 2; h <= 8; h++) {
    if (centsDifference(candidateFreq, fundamentalFreq * h) < HARMONIC_TOLERANCE_CENTS) {
      return true;
    }
  }
  return false;
}

export function detectPeakNotes(
  frequencyData: Float32Array,
  sampleRate: number,
  fftSize: number,
): number[] {
  const binCount = frequencyData.length;
  const binWidth = sampleRate / fftSize;

  const minBin = Math.max(2, Math.floor(midiToFreq(MIN_MIDI) / binWidth));
  const maxBin = Math.min(binCount - 2, Math.ceil(midiToFreq(MAX_MIDI + 1) / binWidth));

  let globalMax = -Infinity;
  for (let i = minBin; i <= maxBin; i++) {
    if (frequencyData[i] > globalMax) globalMax = frequencyData[i];
  }

  const absoluteFloor = globalMax - 40;

  const peaks: { bin: number; mag: number; freq: number; midi: number }[] = [];

  for (let i = minBin; i <= maxBin; i++) {
    const mag = frequencyData[i];
    if (mag < absoluteFloor) continue;
    if (mag <= frequencyData[i - 1] || mag <= frequencyData[i + 1]) continue;

    const localMin = Math.min(
      ...Array.from({ length: 5 }, (_, k) => frequencyData[Math.max(minBin, i - 8 + k)] ?? -100),
      ...Array.from({ length: 5 }, (_, k) => frequencyData[Math.min(maxBin, i + 4 + k)] ?? -100),
    );
    if (mag - localMin < PEAK_PROMINENCE_DB) continue;

    const alpha = frequencyData[i - 1];
    const beta = frequencyData[i];
    const gamma = frequencyData[i + 1];
    const denom = alpha - 2 * beta + gamma;
    const correction = denom !== 0 ? 0.5 * (alpha - gamma) / denom : 0;
    const freq = (i + correction) * binWidth;
    const midi = freqToMidi(freq);

    if (midi < MIN_MIDI || midi > MAX_MIDI) continue;

    peaks.push({ bin: i, mag, freq, midi });
  }

  peaks.sort((a, b) => b.mag - a.mag);
  if (peaks.length === 0) return [];

  const strongestMag = peaks[0].mag;
  const fundamentals: { freq: number; midi: number; mag: number }[] = [];

  for (const peak of peaks) {
    if (fundamentals.length >= MAX_NOTES) break;
    if (fundamentals.length > 0 && peak.mag < strongestMag - SECONDARY_DROP_DB) break;

    let isHarmonic = false;
    for (const f of fundamentals) {
      if (isHarmonicOf(peak.freq, f.freq)) {
        isHarmonic = true;
        break;
      }
      if (isHarmonicOf(f.freq, peak.freq)) {
        isHarmonic = true;
        break;
      }
    }
    if (isHarmonic) continue;

    let isDuplicate = false;
    for (const f of fundamentals) {
      if (Math.abs(Math.round(peak.midi) - Math.round(f.midi)) <= 1) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      fundamentals.push(peak);
    }
  }

  return fundamentals.map(f => Math.round(f.midi));
}
