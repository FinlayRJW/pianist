import type { Note } from '../types';

const CHORD_TIME_THRESHOLD = 0.030;

export interface ChordGroup {
  noteIndices: number[];
  midiNotes: Set<number>;
  startTime: number;
}

export function buildChordGroups(notes: Note[]): {
  groups: ChordGroup[];
  noteToGroup: Map<number, number>;
} {
  const groups: ChordGroup[] = [];
  const noteToGroup = new Map<number, number>();

  if (notes.length === 0) return { groups, noteToGroup };

  let currentGroup: ChordGroup = {
    noteIndices: [0],
    midiNotes: new Set([notes[0].midi]),
    startTime: notes[0].startTime,
  };

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].startTime - currentGroup.startTime <= CHORD_TIME_THRESHOLD) {
      currentGroup.noteIndices.push(i);
      currentGroup.midiNotes.add(notes[i].midi);
    } else {
      const groupIdx = groups.length;
      for (const ni of currentGroup.noteIndices) {
        noteToGroup.set(ni, groupIdx);
      }
      groups.push(currentGroup);

      currentGroup = {
        noteIndices: [i],
        midiNotes: new Set([notes[i].midi]),
        startTime: notes[i].startTime,
      };
    }
  }

  const groupIdx = groups.length;
  for (const ni of currentGroup.noteIndices) {
    noteToGroup.set(ni, groupIdx);
  }
  groups.push(currentGroup);

  return { groups, noteToGroup };
}
