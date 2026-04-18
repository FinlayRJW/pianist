import { Stave, StaveNote, Voice, Formatter, Beam, StaveConnector, Dot, type RenderContext } from 'vexflow';
import type { MeasureData, QuantizedNote, RestData } from '../types';
import { durationToVexflow, midiToVexflowPitch } from './midi-to-notation';

export interface RenderedMeasure {
  x: number;
  width: number;
  startBeat: number;
}

const MEASURE_WIDTH = 220;
const STAVE_Y_TREBLE = 10;
const STAVE_Y_BASS = 90;
const STAFF_HEIGHT = 160;
const FIRST_MEASURE_EXTRA = 50;

export function getStaffHeight(): number {
  return STAFF_HEIGHT;
}

function buildStaveNotes(
  notes: QuantizedNote[],
  rests: RestData[],
  clef: string,
): StaveNote[] {
  const events: { beat: number; isRest: boolean; note?: QuantizedNote; rest?: RestData }[] = [];

  for (const n of notes) events.push({ beat: n.beat, isRest: false, note: n });
  for (const r of rests) events.push({ beat: r.beat, isRest: true, rest: r });
  events.sort((a, b) => a.beat - b.beat);

  const chordGroups = new Map<number, QuantizedNote[]>();
  for (const n of notes) {
    const key = Math.round(n.beat * 16);
    const group = chordGroups.get(key) ?? [];
    group.push(n);
    chordGroups.set(key, group);
  }

  const staveNotes: StaveNote[] = [];
  const processedBeats = new Set<number>();

  for (const event of events) {
    const beatKey = Math.round(event.beat * 16);
    if (processedBeats.has(beatKey)) continue;
    processedBeats.add(beatKey);

    if (event.isRest && event.rest) {
      const dur = durationToVexflow(event.rest.durationBeats);
      const isDotted = dur.endsWith('d');
      const baseDur = isDotted ? dur.slice(0, -1) : dur;
      const restKey = clef === 'treble' ? 'b/4' : 'd/3';
      const sn = new StaveNote({ keys: [restKey], duration: `${baseDur}r`, clef });
      if (isDotted) Dot.buildAndAttach([sn]);
      staveNotes.push(sn);
    } else if (!event.isRest && event.note) {
      const chord = chordGroups.get(beatKey) ?? [event.note];
      const dur = durationToVexflow(chord[0].durationBeats);
      const isDotted = dur.endsWith('d');
      const baseDur = isDotted ? dur.slice(0, -1) : dur;
      const keys = chord.map((n) => midiToVexflowPitch(n.midi));
      const sn = new StaveNote({ keys, duration: baseDur, clef });
      if (isDotted) Dot.buildAndAttach([sn]);
      staveNotes.push(sn);
    }
  }

  if (staveNotes.length === 0) {
    staveNotes.push(new StaveNote({
      keys: [clef === 'treble' ? 'b/4' : 'd/3'],
      duration: 'wr',
      clef,
    }));
  }

  return staveNotes;
}

export function renderScore(
  context: RenderContext,
  measures: MeasureData[],
  timeSignature: [number, number] = [4, 4],
  keySignature: string = 'C',
  noteColor: string = '#000000',
  staffColor: string = '#000000',
  activeColor: string = '#6366f1',
  currentBeat?: number,
): RenderedMeasure[] {
  const renderedMeasures: RenderedMeasure[] = [];
  let x = 10;
  const beatsPerMeasure = timeSignature[0] * (4 / timeSignature[1]);

  for (let i = 0; i < measures.length; i++) {
    const measure = measures[i];
    const isFirst = i === 0;
    const width = isFirst ? MEASURE_WIDTH + FIRST_MEASURE_EXTRA : MEASURE_WIDTH;

    const trebleStave = new Stave(x, STAVE_Y_TREBLE, width);
    const bassStave = new Stave(x, STAVE_Y_BASS, width);

    if (isFirst) {
      trebleStave.addClef('treble').addTimeSignature(`${timeSignature[0]}/${timeSignature[1]}`);
      bassStave.addClef('bass').addTimeSignature(`${timeSignature[0]}/${timeSignature[1]}`);
      if (keySignature !== 'C') {
        trebleStave.addKeySignature(keySignature);
        bassStave.addKeySignature(keySignature);
      }
    }

    trebleStave.setStyle({ strokeStyle: staffColor, fillStyle: staffColor });
    bassStave.setStyle({ strokeStyle: staffColor, fillStyle: staffColor });
    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();

    if (isFirst) {
      new StaveConnector(trebleStave, bassStave).setType('brace').setContext(context).draw();
      new StaveConnector(trebleStave, bassStave).setType('singleLeft').setContext(context).draw();
    }
    new StaveConnector(trebleStave, bassStave).setType('singleRight').setContext(context).draw();

    const trebleNotes = buildStaveNotes(measure.trebleNotes, measure.trebleRests, 'treble');
    const bassNotes = buildStaveNotes(measure.bassNotes, measure.bassRests, 'bass');
    const measureStartBeat = (measure.number - 1) * beatsPerMeasure;

    const applyColor = (sn: StaveNote, color: string) => {
      sn.setStyle({ strokeStyle: color, fillStyle: color });
      sn.setStemStyle({ strokeStyle: color, fillStyle: color });
    };

    for (const sn of [...trebleNotes, ...bassNotes]) applyColor(sn, noteColor);

    if (currentBeat !== undefined) {
      const highlight = (staveNotes: StaveNote[], srcNotes: QuantizedNote[]) => {
        let idx = 0;
        for (const sn of staveNotes) {
          if (sn.isRest()) continue;
          if (idx < srcNotes.length) {
            const nb = measureStartBeat + srcNotes[idx].beat;
            const ne = nb + srcNotes[idx].durationBeats;
            if (currentBeat >= nb - 0.1 && currentBeat < ne) applyColor(sn, activeColor);
            idx++;
          }
        }
      };
      highlight(trebleNotes, measure.trebleNotes);
      highlight(bassNotes, measure.bassNotes);
    }

    try {
      const trebleVoice = new Voice({ numBeats: timeSignature[0], beatValue: timeSignature[1] }).setStrict(false);
      trebleVoice.addTickables(trebleNotes);
      const bassVoice = new Voice({ numBeats: timeSignature[0], beatValue: timeSignature[1] }).setStrict(false);
      bassVoice.addTickables(bassNotes);

      new Formatter()
        .joinVoices([trebleVoice])
        .joinVoices([bassVoice])
        .format([trebleVoice, bassVoice], width - (isFirst ? 80 : 30));

      trebleVoice.draw(context, trebleStave);
      bassVoice.draw(context, bassStave);

      const beamable = (arr: StaveNote[]) =>
        arr.filter((n) => !n.isRest() && ['8', '16'].includes(n.getDuration()));

      for (const group of [beamable(trebleNotes), beamable(bassNotes)]) {
        if (group.length >= 2) {
          try { Beam.generateBeams(group).forEach((b) => b.setContext(context).draw()); } catch {}
        }
      }
    } catch {}

    renderedMeasures.push({ x, width, startBeat: measureStartBeat });
    x += width;
  }

  return renderedMeasures;
}

export function getTotalWidth(measureCount: number): number {
  if (measureCount === 0) return 0;
  return 20 + MEASURE_WIDTH + FIRST_MEASURE_EXTRA + (measureCount - 1) * MEASURE_WIDTH;
}
