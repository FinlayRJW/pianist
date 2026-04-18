const MIN_MIDI = 21;
const MAX_MIDI = 96;
const HARMONIC_TOLERANCE_CENTS = 40;
const PEAK_PROMINENCE_DB = 12;
const MAX_NOTES = 4;

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function freqToMidi(freq: number): number {
  return 12 * Math.log2(freq / 440) + 69;
}

function centsDifference(f1: number, f2: number): number {
  return Math.abs(1200 * Math.log2(f1 / f2));
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

  let noiseFloor = -100;
  for (let i = minBin; i <= maxBin; i++) {
    noiseFloor = Math.max(noiseFloor, frequencyData[i]);
  }
  noiseFloor -= 30;

  const peaks: { bin: number; mag: number; freq: number; midi: number }[] = [];

  for (let i = minBin; i <= maxBin; i++) {
    const mag = frequencyData[i];
    if (mag < noiseFloor + PEAK_PROMINENCE_DB) continue;
    if (mag <= frequencyData[i - 1] || mag <= frequencyData[i + 1]) continue;

    const alpha = frequencyData[i - 1];
    const beta = frequencyData[i];
    const gamma = frequencyData[i + 1];
    const correction = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
    const freq = (i + correction) * binWidth;
    const midi = freqToMidi(freq);

    if (midi < MIN_MIDI || midi > MAX_MIDI) continue;

    peaks.push({ bin: i, mag, freq, midi });
  }

  peaks.sort((a, b) => b.mag - a.mag);

  const fundamentals: { freq: number; midi: number; mag: number }[] = [];

  for (const peak of peaks) {
    if (fundamentals.length >= MAX_NOTES) break;

    let isHarmonic = false;
    for (const f of fundamentals) {
      for (let h = 2; h <= 6; h++) {
        const harmonicFreq = f.freq * h;
        if (centsDifference(peak.freq, harmonicFreq) < HARMONIC_TOLERANCE_CENTS) {
          isHarmonic = true;
          break;
        }
      }
      if (isHarmonic) break;
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
