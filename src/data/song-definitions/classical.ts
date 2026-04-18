import type { SongDefinition } from './types';

export const classicalSongs: SongDefinition[] = [
  // 1. Minuet in G — Bach (attr. Christian Petzold)
  // First 8 bars of BWV Anh. 114 in G major, 3/4 time
  {
    id: 'minuet-in-g',
    title: 'Minuet in G',
    composer: 'J.S. Bach (attr.)',
    genre: 'classical',
    difficulty: 2,
    bpm: 108,
    timeSignature: [3, 4],
    keySignature: 'G',
    tags: ['baroque', 'bach', 'minuet', 'dance'],
    rightHand: {
      // G major: G4=67, A4=69, B4=71, C5=72, D5=74, E5=76, F#5=78, G5=79
      notes: [
        // Bar 1: D5, G4 A4 B4 C5
        74, 67, 69, 71, 72,
        // Bar 2: D5, D5 (half + quarter)
        74, 74,
        // Bar 3: E5, C5 D5 E5 F#5
        76, 72, 74, 76, 78,
        // Bar 4: G5 (dotted half)
        79,
        // Bar 5: C5, D5 C5 B4 A4
        72, 74, 72, 71, 69,
        // Bar 6: B4, C5 B4 A4 G4
        71, 72, 71, 69, 67,
        // Bar 7: A4, B4 A4 G4 F#4
        69, 71, 69, 67, 66,
        // Bar 8: G4 (dotted half)
        67,
      ],
      rhythm: [
        // Bar 1
        1, 0.5, 0.5, 0.5, 0.5,
        // Bar 2
        2, 1,
        // Bar 3
        1, 0.5, 0.5, 0.5, 0.5,
        // Bar 4
        3,
        // Bar 5
        1, 0.5, 0.5, 0.5, 0.5,
        // Bar 6
        1, 0.5, 0.5, 0.5, 0.5,
        // Bar 7
        1, 0.5, 0.5, 0.5, 0.5,
        // Bar 8
        3,
      ],
    },
  },

  // 2. Prelude in C — Bach (BWV 846)
  // Simplified arpeggiated chords, first 8 bars
  {
    id: 'prelude-in-c',
    title: 'Prelude in C Major',
    composer: 'J.S. Bach',
    genre: 'classical',
    difficulty: 2,
    bpm: 70,
    keySignature: 'C',
    tags: ['baroque', 'bach', 'prelude', 'arpeggiated'],
    rightHand: {
      notes: [
        // Bar 1: C major — C4 E4 G4 C5 E5, G4 C5 E5 (pattern repeats)
        60, 64, 67, 72, 76, 67, 72, 76,
        // Bar 2: Dm7 — C4 D4 A4 D5 F5, A4 D5 F5
        60, 62, 69, 74, 77, 69, 74, 77,
        // Bar 3: G7 — B3 D4 G4 D5 F5, G4 D5 F5
        59, 62, 67, 74, 77, 67, 74, 77,
        // Bar 4: C major — C4 E4 G4 C5 E5, G4 C5 E5
        60, 64, 67, 72, 76, 67, 72, 76,
        // Bar 5: Am — C4 E4 A4 E5 A5, A4 E5 A5 (A5=81)
        60, 64, 69, 76, 81, 69, 76, 81,
        // Bar 6: D7 — C4 D4 F#4 A4 D5, F#4 A4 D5
        60, 62, 66, 69, 74, 66, 69, 74,
        // Bar 7: G major — B3 D4 G4 D5 G5, G4 D5 G5 (G5=79)
        59, 62, 67, 74, 79, 67, 74, 79,
        // Bar 8: C major — C4 E4 G4 C5 E5, G4 C5 E5
        60, 64, 67, 72, 76, 67, 72, 76,
      ],
      rhythm: [
        // Each bar: 8 sixteenth-note groupings in 4/4
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
      ],
    },
  },

  // 3. Canon in D — Pachelbel (simplified melody)
  {
    id: 'canon-in-d',
    title: 'Canon in D',
    composer: 'Johann Pachelbel',
    genre: 'classical',
    difficulty: 3,
    bpm: 72,
    keySignature: 'D',
    tags: ['baroque', 'pachelbel', 'canon', 'wedding'],
    rightHand: {
      // D major: D4=62, E4=64, F#4=66, G4=67, A4=69, B4=71, C#5=73, D5=74, E5=76, F#5=78, G5=79, A5=81
      notes: [
        // The famous descending melody over the chord progression D-A-Bm-F#m-G-D-G-A
        // Phrase 1: long notes outlining chords
        78, 76, 74, 73, 71, 69, 71, 73,
        // Phrase 2: elaborated melody
        74, 73, 74, 69, 71, 69, 71, 74, 73, 74, 73, 69,
        // Phrase 3: eighth note movement
        78, 76, 78, 74, 76, 74, 71, 74,
        67, 71, 69, 67, 69, 71, 69, 66,
        // Phrase 4: the soaring melody
        74, 76, 78, 79, 78, 76, 74, 73,
        71, 73, 74, 71, 67, 69, 71, 69,
        67, 66, 67, 69, 71, 73, 74, 76,
        78, 74, 71, 74, 73, 69, 73, 74,
      ],
      rhythm: [
        // Phrase 1: half notes
        2, 2, 2, 2, 2, 2, 2, 2,
        // Phrase 2: quarter + eighth patterns
        1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 1,
        // Phrase 3: steady eighth notes
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        // Phrase 4: quarter notes
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 2,
      ],
    },
  },

  // 4. Fur Elise — Beethoven (WoO 59)
  // The famous opening A section
  {
    id: 'fur-elise',
    title: 'Fur Elise',
    composer: 'Ludwig van Beethoven',
    genre: 'classical',
    difficulty: 3,
    bpm: 130,
    keySignature: 'Am',
    tags: ['romantic', 'beethoven', 'bagatelle'],
    rightHand: {
      // The iconic opening theme
      // E5=76, D#5=75, B4=71, D5=74, C5=72, A4=69, E4=64, A4=69, C5=72, E5=76
      notes: [
        // A section (first time)
        // "da-da-da-da-da" motif
        76, 75, 76, 75, 76, 71, 74, 72,
        // Resolution to Am
        69, 60, 64, 69,
        // B4 to E5
        71, 64, 68, 71,
        // Back to C5
        72, 64, 76, 75,
        // Repeat motif
        76, 75, 76, 71, 74, 72,
        // Resolution
        69, 60, 64, 69,
        // B4 resolution
        71, 64, 72, 71,
        // A4 (landing)
        69,

        // A section (second time)
        76, 75, 76, 75, 76, 71, 74, 72,
        69, 60, 64, 69,
        71, 64, 68, 71,
        72, 64, 76, 75,
        76, 75, 76, 71, 74, 72,
        69, 60, 64, 69,
        71, 64, 72, 71,
        69,
      ],
      rhythm: [
        // A section (first time)
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 1,
        2,

        // A section (second time)
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 1,
        2,
      ],
    },
  },

  // 5. Gymnopedie No. 1 — Erik Satie
  // The famous melody line
  {
    id: 'gymnopedie-no1',
    title: 'Gymnopedie No. 1',
    composer: 'Erik Satie',
    genre: 'classical',
    difficulty: 3,
    bpm: 66,
    keySignature: 'D',
    tags: ['impressionist', 'satie', 'gentle', 'meditative'],
    rightHand: {
      // D major context but with modal feel. The melody uses F#, B, etc.
      // F#5=78, G5=79, A5=81, B5=83, C#5=73, D5=74, E5=76
      notes: [
        // The melody enters after 2 bars of accompaniment, starting simply
        // Phrase 1 (bars 3-6): the iconic descending melody
        78, 74, 76, 71, 74, 69,
        // Phrase 2: echoes and answers
        78, 74, 76, 71, 74, 69,
        // Phrase 3: rising
        66, 69, 71, 74, 76, 78,
        // Phrase 4: descending resolution
        76, 74, 71, 69, 66, 69,
        // Phrase 5: repeat of opening melody with variation
        78, 74, 76, 71, 74, 69,
        // Phrase 6: gentle rise and fall
        71, 74, 76, 74, 71, 69,
        // Phrase 7: approaching cadence
        66, 69, 71, 74, 76, 74,
        // Phrase 8: final resolution
        71, 69, 66, 62, 66, 74,
      ],
      rhythm: [
        // Phrase 1: slow, spacious half notes
        2, 2, 2, 2, 2, 2,
        // Phrase 2
        2, 2, 2, 2, 2, 2,
        // Phrase 3
        2, 2, 2, 2, 2, 2,
        // Phrase 4
        2, 2, 2, 2, 2, 2,
        // Phrase 5
        2, 2, 2, 2, 2, 2,
        // Phrase 6
        2, 2, 2, 2, 2, 2,
        // Phrase 7
        2, 2, 2, 2, 2, 2,
        // Phrase 8
        2, 2, 2, 2, 2, 4,
      ],
    },
  },

  // 6. Moonlight Sonata — Beethoven (Op. 27, No. 2)
  // Simplified first movement arpeggiated triplet pattern
  {
    id: 'moonlight-sonata',
    title: 'Moonlight Sonata',
    composer: 'Ludwig van Beethoven',
    genre: 'classical',
    difficulty: 4,
    bpm: 60,
    keySignature: 'C',
    tags: ['romantic', 'beethoven', 'sonata', 'arpeggiated'],
    rightHand: {
      // Simplified C# minor mapped to notes. The famous triplet arpeggio pattern.
      // Using the actual C# minor: C#4=61, D#4=63, E4=64, F#4=66, G#4=68, A4=69, B4=71
      // The RH plays repeating triplet arpeggios over changing harmonics
      notes: [
        // Bar 1-2: C#m — G#4 C#5 E5 repeated (G#4=68, C#5=73, E5=76)
        68, 73, 76, 68, 73, 76, 68, 73, 76, 68, 73, 76,
        68, 73, 76, 68, 73, 76, 68, 73, 76, 68, 73, 76,
        // Bar 3-4: A major / F#m — A4 C#5 E5 then F#4 A4 D5
        69, 73, 76, 69, 73, 76, 69, 73, 76, 69, 73, 76,
        66, 71, 74, 66, 71, 74, 66, 71, 74, 66, 71, 74,
        // Bar 5-6: G#7 — G#4 B#4 E5 (B#4=72), then resolve to C#m
        68, 72, 76, 68, 72, 76, 68, 72, 76, 68, 72, 76,
        68, 73, 76, 68, 73, 76, 68, 73, 76, 68, 73, 76,
        // Bar 7-8: F#m — F#4 A4 C#5, then G# — G#4 B4 D5
        66, 69, 73, 66, 69, 73, 66, 69, 73, 66, 69, 73,
        68, 71, 74, 68, 71, 74, 68, 71, 74, 68, 71, 74,
      ],
      rhythm: [
        // Triplet eighths over 4/4: each group of 3 fills one beat
        // Using 1/3 beat = ~0.33, but since the system uses numeric rhythm,
        // we approximate triplets as groups of 3 notes per beat
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
        0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.33, 0.33, 0.34,
      ],
    },
  },
];
