import type { SongDefinition } from './types';

export const jazzSongs: SongDefinition[] = [
  {
    id: 'blue-note-shuffle',
    title: 'Blue Note Shuffle',
    composer: 'Original',
    genre: 'jazz',
    difficulty: 3,
    bpm: 96,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['blues', 'shuffle', 'blue-notes'],
    rightHand: {
      // 12-bar blues scale in C with blue notes: C, Eb(63), F, F#(66), G, Bb(70)
      // Using Bb4=70, Eb4=63 for blue notes
      // Shuffle feel via dotted-eighth + sixteenth patterns
      notes: [
        // Bar 1-2: C7 area - blues lick
        60, 63, 64, 65, 66, 67, 70, 67,
        // Bar 3-4: still C7
        72, 70, 67, 65, 63, 60, 63, 65,
        // Bar 5-6: F7 area
        65, 68, 69, 70, 72, 70, 69, 65,
        // Bar 7-8: back to C7
        67, 70, 72, 70, 67, 63, 60, 63,
        // Bar 9-10: G7 turnaround
        67, 71, 74, 72, 70, 67, 65, 63,
        // Bar 11-12: C7 resolve with blues ending
        60, 63, 65, 67, 70, 67, 63, 60,
      ],
      rhythm: [
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
      ],
    },
  },
  {
    id: 'smooth-evening',
    title: 'Smooth Evening',
    composer: 'Original',
    genre: 'jazz',
    difficulty: 3,
    bpm: 80,
    timeSignature: [4, 4],
    keySignature: 'F',
    tags: ['ballad', 'slow', 'wide-intervals', 'expressive'],
    rightHand: {
      // Key of F: F=65/77, G=67/79, A=69/81, Bb=70/82, C=72, D=74, E=76
      // Slow jazz ballad with wide intervals and long tones
      notes: [
        // Bar 1: spacious F opening
        65, 72, 69, 77,
        // Bar 2: Bb color
        70, 77, 74, 72,
        // Bar 3: C7 tension
        72, 76, 79, 77,
        // Bar 4: F resolve
        77, 74, 72, 69,
        // Bar 5: second phrase - higher
        77, 81, 84, 82,
        // Bar 6: Dm area
        74, 77, 81, 79,
        // Bar 7: Gm7 - C7
        79, 77, 76, 74,
        // Bar 8: F final
        77, 74, 72, 65,
      ],
      rhythm: [
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
      ],
    },
  },
  {
    id: 'swing-time',
    title: 'Swing Time',
    composer: 'Original',
    genre: 'jazz',
    difficulty: 4,
    bpm: 132,
    timeSignature: [4, 4],
    keySignature: 'Bb',
    tags: ['swing', 'dotted-rhythm', 'upbeat'],
    rightHand: {
      // Key of Bb: Bb=58/70/82, C=60/72, D=62/74, Eb=63/75, F=65/77, G=67/79, A=69/81
      // Swing rhythm - dotted eighth + sixteenth note patterns
      notes: [
        // Bar 1: Bb swing opening
        70, 74, 77, 74, 70, 72, 74, 70,
        // Bar 2: Eb area
        75, 77, 79, 77, 75, 74, 72, 74,
        // Bar 3: F7 - dominant push
        77, 81, 82, 81, 77, 74, 72, 70,
        // Bar 4: Bb resolve
        70, 74, 77, 82, 81, 77, 74, 70,
        // Bar 5: second chorus - higher
        82, 81, 79, 77, 79, 81, 82, 84,
        // Bar 6: Eb high
        87, 84, 82, 81, 79, 77, 79, 81,
        // Bar 7: F7 tension
        77, 79, 81, 82, 84, 82, 81, 79,
        // Bar 8: Bb final
        82, 79, 77, 74, 72, 74, 77, 70,
      ],
      rhythm: [
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
        0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5,
      ],
    },
  },
  {
    id: 'bebop-basics',
    title: 'Bebop Basics',
    composer: 'Original',
    genre: 'jazz',
    difficulty: 4,
    bpm: 160,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['bebop', 'fast', 'chromatic', 'eighth-notes'],
    requiresMidi: true,
    rightHand: {
      // Bebop in C - fast eighth-note lines with chromatic passing tones
      // C bebop scale: C D E F G Ab A Bb B C (chromatic from G up)
      notes: [
        // Bar 1: ascending bebop line
        60, 62, 64, 65, 67, 68, 69, 71,
        // Bar 2: continuing up and turning
        72, 74, 72, 71, 69, 68, 67, 65,
        // Bar 3: F7 area - chromatic approach
        65, 67, 68, 69, 70, 72, 74, 72,
        // Bar 4: back to C
        71, 69, 67, 65, 64, 62, 64, 60,
        // Bar 5: G7 bebop line
        67, 69, 71, 72, 74, 73, 72, 71,
        // Bar 6: chromatic descent
        72, 71, 70, 69, 68, 67, 66, 65,
        // Bar 7: C ascending with enclosures
        64, 66, 67, 69, 68, 70, 71, 72,
        // Bar 8: final C resolution
        74, 72, 71, 69, 67, 65, 64, 60,
      ],
      rhythm: [
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
  {
    id: 'jazz-hands',
    title: 'Jazz Hands',
    composer: 'Original',
    genre: 'jazz',
    difficulty: 5,
    bpm: 120,
    timeSignature: [4, 4],
    keySignature: 'F',
    tags: ['complex', 'two-hands', 'voicings', 'advanced'],
    requiresMidi: true,
    rightHand: {
      // Key of F: complex melody with jazz intervals
      // F=65/77, G=67/79, A=69/81, Bb=70/82, C=72, D=74, E=76
      notes: [
        // Bar 1: FMaj7 melody
        81, 77, 79, 81, 84, 82,
        // Bar 2: Gm7 area
        79, 82, 81, 79, 77, 74,
        // Bar 3: Am7 - D7 (ii-V in G)
        69, 72, 74, 78, 77, 76,
        // Bar 4: Gm7 - C7 (ii-V in F)
        79, 77, 74, 72, 70, 76,
        // Bar 5: FMaj7 - higher register
        77, 81, 84, 86, 84, 81,
        // Bar 6: Bbmaj7 color
        82, 86, 84, 82, 81, 79,
        // Bar 7: Gm7 - C7alt
        79, 77, 76, 74, 73, 72,
        // Bar 8: F resolve with color
        77, 76, 74, 72, 69, 65,
      ],
      rhythm: [
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
        0.75, 0.25, 1, 0.5, 0.5, 1,
      ],
    },
    leftHand: {
      // Jazz chord voicings - rootless or shell voicings
      // Playing on beats 1 and 3 with sustained chords
      notes: [
        // Bar 1: FMaj7 shell (A + E = 3rd + 7th)
        53, 57, 53, 57,
        // Bar 2: Gm7 (Bb + F)
        55, 58, 55, 58,
        // Bar 3: Am7 (C + G) - D7 (F# + C)
        57, 60, 54, 60,
        // Bar 4: Gm7 (Bb + F) - C7 (E + Bb)
        55, 58, 52, 58,
        // Bar 5: FMaj7
        53, 57, 53, 57,
        // Bar 6: BbMaj7 (D + A)
        58, 50, 58, 50,
        // Bar 7: Gm7 - C7
        55, 58, 52, 58,
        // Bar 8: F final
        53, 57, 53, 53,
      ],
      rhythm: [
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
      ],
    },
  },
];
