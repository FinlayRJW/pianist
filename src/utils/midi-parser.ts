import { Midi } from '@tonejs/midi';
import type { Note, ParsedSong, SongMeta } from '../types';

export async function parseMidiFile(url: string, meta: SongMeta): Promise<ParsedSong> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const midi = new Midi(arrayBuffer);

  const tracks: { name: string; notes: Note[] }[] = [];
  const allNotes: Note[] = [];

  midi.tracks.forEach((track, trackIndex) => {
    const trackNotes: Note[] = track.notes.map((n) => ({
      midi: n.midi,
      name: n.name + n.octave,
      startTime: n.time,
      duration: n.duration,
      velocity: Math.round(n.velocity * 127),
      track: trackIndex,
    }));
    tracks.push({ name: track.name || `Track ${trackIndex + 1}`, notes: trackNotes });
    allNotes.push(...trackNotes);
  });

  allNotes.sort((a, b) => a.startTime - b.startTime);

  const lastNote = allNotes[allNotes.length - 1];
  const totalDuration = lastNote ? lastNote.startTime + lastNote.duration + 1 : 0;

  return { meta, notes: allNotes, tracks, totalDuration };
}
