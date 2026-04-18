import type { SongDefinition } from './types';

export const advancedSongs: SongDefinition[] = [
  {
    id: 'velocity',
    title: 'Velocity',
    composer: 'Original',
    genre: 'advanced',
    difficulty: 4,
    bpm: 152,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['fast', 'scales', 'arpeggios', 'technical'],
    requiresMidi: true,
    rightHand: {
      // Fast scale runs and arpeggios in C
      notes: [
        // Bar 1: C major scale run up
        60, 62, 64, 65, 67, 69, 71, 72,
        // Bar 2: arpeggio down - C, Am, F
        72, 67, 64, 60, 69, 65, 60, 57,
        // Bar 3: G major scale fragment up
        67, 69, 71, 72, 74, 76, 77, 79,
        // Bar 4: cascading arpeggios down
        79, 76, 72, 67, 77, 72, 69, 65,
        // Bar 5: rapid scale in thirds
        60, 64, 62, 65, 64, 67, 65, 69,
        // Bar 6: continuing up
        67, 71, 69, 72, 71, 74, 72, 76,
        // Bar 7: descending run
        79, 77, 76, 74, 72, 71, 69, 67,
        // Bar 8: final arpeggio and resolve
        72, 67, 64, 60, 64, 67, 72, 60,
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
    id: 'chromatic-run',
    title: 'Chromatic Run',
    composer: 'Original',
    genre: 'advanced',
    difficulty: 4,
    bpm: 140,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['chromatic', 'half-steps', 'technical', 'finger-independence'],
    requiresMidi: true,
    rightHand: {
      // All chromatic (half-step) passages
      notes: [
        // Bar 1: chromatic ascent from C4
        60, 61, 62, 63, 64, 65, 66, 67,
        // Bar 2: continuing up
        68, 69, 70, 71, 72, 73, 74, 75,
        // Bar 3: chromatic descent from Eb5
        75, 74, 73, 72, 71, 70, 69, 68,
        // Bar 4: continuing down
        67, 66, 65, 64, 63, 62, 61, 60,
        // Bar 5: chromatic in groups of 4, shifting up
        60, 61, 62, 63, 64, 65, 66, 67,
        // Bar 6: zigzag chromatic
        72, 71, 73, 72, 74, 73, 75, 74,
        // Bar 7: rapid chromatic turns
        67, 68, 67, 66, 69, 70, 69, 68,
        // Bar 8: final chromatic rush to C
        60, 62, 61, 63, 62, 64, 63, 60,
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
    id: 'octave-storm',
    title: 'Octave Storm',
    composer: 'Original',
    genre: 'advanced',
    difficulty: 4,
    bpm: 132,
    timeSignature: [4, 4],
    keySignature: 'G',
    tags: ['octaves', 'wide-jumps', 'two-hands', 'dramatic'],
    requiresMidi: true,
    rightHand: {
      // Wide octave jumps in the right hand - G key
      // G=55/67/79/91, A=57/69/81, B=59/71/83, C=60/72/84, D=62/74/86
      notes: [
        // Bar 1: G octave jumps
        67, 79, 71, 83, 74, 86, 79, 67,
        // Bar 2: C area octaves
        72, 84, 76, 88, 79, 67, 72, 84,
        // Bar 3: D area
        74, 86, 78, 66, 74, 86, 81, 69,
        // Bar 4: G resolve
        79, 67, 83, 71, 79, 67, 74, 67,
        // Bar 5: more dramatic leaps
        67, 91, 79, 67, 83, 71, 86, 74,
        // Bar 6: C power octaves
        72, 84, 60, 72, 76, 88, 64, 76,
        // Bar 7: D climax
        74, 86, 62, 74, 78, 90, 66, 78,
        // Bar 8: final G
        79, 91, 67, 79, 71, 83, 67, 79,
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
    leftHand: {
      // Octave bass pattern - root notes with octave jumps
      notes: [
        // Bar 1-2: G pedal octaves
        43, 55, 43, 55, 43, 55, 43, 55,
        // Bar 3-4: C bass octaves
        48, 60, 48, 60, 48, 60, 48, 60,
        // Bar 5-6: D bass octaves
        50, 62, 50, 62, 50, 62, 50, 62,
        // Bar 7-8: G resolve octaves
        43, 55, 43, 55, 43, 55, 43, 55,
        // Repeat pattern for second half
        43, 55, 43, 55, 43, 55, 43, 55,
        48, 60, 48, 60, 48, 60, 48, 60,
        50, 62, 50, 62, 50, 62, 50, 62,
        43, 55, 43, 55, 43, 55, 43, 55,
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
    id: 'polyrhythm',
    title: 'Polyrhythm',
    composer: 'Original',
    genre: 'advanced',
    difficulty: 5,
    bpm: 108,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['polyrhythm', '3-against-4', 'two-hands', 'independence'],
    requiresMidi: true,
    rightHand: {
      // Right hand plays in groups of 4 (sixteenth-note feel) - 4 notes per beat
      // Melodic pattern over C harmony, 8 bars = 32 beats = 128 sixteenths
      notes: [
        // Bar 1: C ascending arpeggio pattern
        60, 64, 67, 72, 71, 67, 64, 60,
        64, 67, 72, 76, 72, 67, 64, 60,
        // Bar 2: F pattern
        65, 69, 72, 77, 76, 72, 69, 65,
        69, 72, 77, 81, 77, 72, 69, 65,
        // Bar 3: G pattern
        67, 71, 74, 79, 76, 74, 71, 67,
        71, 74, 79, 83, 79, 74, 71, 67,
        // Bar 4: Am pattern
        69, 72, 76, 81, 76, 72, 69, 64,
        69, 72, 76, 81, 76, 72, 69, 64,
        // Bar 5: C variation - wider leaps
        60, 67, 72, 79, 76, 72, 67, 60,
        64, 72, 76, 84, 76, 72, 64, 60,
        // Bar 6: F variation
        65, 72, 77, 84, 81, 77, 72, 65,
        69, 77, 81, 84, 81, 77, 69, 65,
        // Bar 7: G climax
        67, 74, 79, 86, 83, 79, 74, 67,
        71, 79, 83, 86, 83, 79, 71, 67,
        // Bar 8: C resolve
        60, 64, 67, 72, 76, 72, 67, 64,
        72, 67, 64, 60, 64, 67, 72, 60,
      ],
      rhythm: [
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
        0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
      ],
    },
    leftHand: {
      // Left hand in 3 against the right hand's 4
      // Triplet feel: 3 notes per beat, each = 1/3 of a beat
      // 8 bars * 4 beats * 3 notes = 96 triplet notes over 32 beats
      notes: [
        // Bar 1: C bass triplet pattern
        48, 55, 60, 48, 55, 60, 48, 55, 60, 48, 55, 60,
        // Bar 2: F bass
        53, 60, 65, 53, 60, 65, 53, 60, 65, 53, 60, 65,
        // Bar 3: G bass
        55, 59, 67, 55, 59, 67, 55, 59, 67, 55, 59, 67,
        // Bar 4: Am bass
        57, 60, 64, 57, 60, 64, 57, 60, 64, 57, 60, 64,
        // Bar 5: C variation
        48, 60, 55, 48, 60, 55, 48, 60, 55, 48, 60, 55,
        // Bar 6: F variation
        53, 65, 60, 53, 65, 60, 53, 65, 60, 53, 65, 60,
        // Bar 7: G climax
        55, 67, 59, 55, 67, 59, 55, 67, 59, 55, 67, 59,
        // Bar 8: C resolve
        48, 55, 60, 48, 55, 60, 48, 55, 60, 48, 55, 48,
      ],
      rhythm: [
        // 12 notes per bar, each 1/3 beat = 4 beats per bar
        // Bar 1
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 2
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 3
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 4
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 5
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 6
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 7
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        // Bar 8
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
        1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3,
      ],
    },
  },
  {
    id: 'grand-finale',
    title: 'Grand Finale',
    composer: 'Original',
    genre: 'advanced',
    difficulty: 5,
    bpm: 144,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['virtuosic', 'fast-runs', 'chords', 'wide-leaps', 'two-hands'],
    requiresMidi: true,
    rightHand: {
      // Everything combined: fast runs, chord hits, wide leaps
      notes: [
        // Bar 1: fast ascending scale run
        60, 62, 64, 65, 67, 69, 71, 72,
        // Bar 2: wide leap pattern
        84, 60, 79, 64, 84, 67, 79, 72,
        // Bar 3: descending chromatic rush
        84, 83, 82, 81, 80, 79, 78, 77,
        // Bar 4: arpeggio burst
        60, 64, 67, 72, 76, 79, 84, 79,
        // Bar 5: syncopated octave hits
        72, 60, 74, 62, 76, 64, 77, 65,
        // Bar 6: rapid scale descent
        84, 83, 81, 79, 77, 76, 74, 72,
        // Bar 7: dramatic leaps with turns
        60, 79, 67, 84, 72, 91, 84, 72,
        // Bar 8: final flourish to C
        76, 74, 72, 71, 69, 67, 64, 60,
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
    leftHand: {
      // Powerful left hand: chords, bass runs, and octaves
      notes: [
        // Bar 1: C power bass driving
        48, 55, 60, 55, 48, 55, 60, 55,
        // Bar 2: F power with leaps
        53, 60, 65, 60, 53, 60, 65, 60,
        // Bar 3: G dominant push
        55, 62, 67, 62, 55, 62, 67, 62,
        // Bar 4: Am - dramatic
        57, 60, 64, 60, 57, 60, 64, 60,
        // Bar 5: F bass run
        53, 55, 57, 60, 53, 55, 57, 60,
        // Bar 6: G7 tension
        55, 59, 62, 65, 67, 65, 62, 55,
        // Bar 7: building bass octaves
        48, 60, 48, 60, 48, 60, 48, 60,
        // Bar 8: final C chord bass
        48, 55, 60, 55, 48, 55, 60, 48,
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
];
