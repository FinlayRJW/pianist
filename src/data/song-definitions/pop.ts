import type { SongDefinition } from './types';

export const popSongs: SongDefinition[] = [
  {
    id: 'morning-dew',
    title: 'Morning Dew',
    composer: 'Original',
    genre: 'pop',
    difficulty: 2,
    bpm: 100,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['gentle', 'flowing', 'beginner-friendly'],
    rightHand: {
      // I-V-vi-IV pattern: C-G-Am-F, gentle flowing melody
      notes: [
        // Bar 1: C major area - ascending gentle opening
        60, 64, 67, 72,
        // Bar 2: G major area - stepping down
        71, 72, 67, 64,
        // Bar 3: Am area - minor color
        69, 67, 64, 60,
        // Bar 4: F major area - resolution
        65, 67, 69, 67,
        // Bar 5: C - rising again
        60, 62, 64, 67,
        // Bar 6: G - floating high
        72, 71, 67, 72,
        // Bar 7: Am - gentle descent
        69, 72, 69, 67,
        // Bar 8: F - C - resolve
        65, 64, 62, 60,
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
    id: 'sunset-walk',
    title: 'Sunset Walk',
    composer: 'Original',
    genre: 'pop',
    difficulty: 2,
    bpm: 96,
    timeSignature: [4, 4],
    keySignature: 'F',
    tags: ['warm', 'relaxing', 'stepwise'],
    rightHand: {
      // Key of F: F=65, G=67, A=69, Bb=70, C5=72, D5=74, E5=76, F5=77
      // Warm stepwise melody
      notes: [
        // Bar 1: gentle F major opening
        65, 67, 69, 70,
        // Bar 2: reaching up to C
        72, 70, 69, 67,
        // Bar 3: stepping up further
        69, 70, 72, 74,
        // Bar 4: resolving back
        72, 70, 69, 65,
        // Bar 5: second phrase - higher register
        72, 74, 76, 77,
        // Bar 6: gentle descent
        76, 74, 72, 70,
        // Bar 7: building to end
        69, 70, 72, 74,
        // Bar 8: final resolution
        72, 70, 67, 65,
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
    id: 'city-lights',
    title: 'City Lights',
    composer: 'Original',
    genre: 'pop',
    difficulty: 2,
    bpm: 112,
    timeSignature: [4, 4],
    keySignature: 'G',
    tags: ['upbeat', 'syncopated', 'energetic'],
    rightHand: {
      // Key of G: G=55/67, A=57/69, B=59/71, C=60/72, D=62/74, E=64/76, F#=66/78
      // Upbeat with some syncopation via eighth notes
      notes: [
        // Bar 1: punchy G opening
        67, 71, 74, 72, 71,
        // Bar 2: bouncy pattern
        69, 71, 72, 74,
        // Bar 3: syncopated hits
        76, 74, 72, 74, 71,
        // Bar 4: stepping down
        72, 69, 67, 69,
        // Bar 5: second phrase
        67, 71, 74, 76, 74,
        // Bar 6: peak and down
        79, 76, 74, 72,
        // Bar 7: rhythmic push
        71, 72, 74, 72, 71,
        // Bar 8: resolve to G
        72, 71, 69, 67,
      ],
      rhythm: [
        0.5, 0.5, 1, 1, 1,
        1, 1, 1, 1,
        0.5, 0.5, 1, 1, 1,
        1, 1, 1, 1,
        0.5, 0.5, 1, 1, 1,
        1, 1, 1, 1,
        0.5, 0.5, 1, 1, 1,
        1, 1, 1, 1,
      ],
    },
  },
  {
    id: 'ocean-breeze',
    title: 'Ocean Breeze',
    composer: 'Original',
    genre: 'pop',
    difficulty: 3,
    bpm: 88,
    timeSignature: [4, 4],
    keySignature: 'D',
    tags: ['expressive', 'wide-intervals', 'two-hands'],
    rightHand: {
      // Key of D: D=62/74, E=64/76, F#=66/78, G=67/79, A=69/81, B=71
      // Wider intervals, more expressive leaps
      notes: [
        // Bar 1: opening with leaps
        74, 78, 81, 79,
        // Bar 2: descending expressively
        78, 74, 71, 74,
        // Bar 3: soaring up
        76, 79, 81, 83,
        // Bar 4: gentle resolve
        81, 78, 76, 74,
        // Bar 5: second phrase - emotional peak
        74, 79, 83, 81,
        // Bar 6: floating descent
        79, 76, 78, 74,
        // Bar 7: building to close
        71, 74, 78, 81,
        // Bar 8: final resolution
        79, 78, 76, 74,
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
    leftHand: {
      // Simple bass pattern: root notes and fifths
      notes: [
        // D bass pattern
        50, 57, 50, 57,
        // G bass
        55, 50, 55, 50,
        // A bass
        57, 50, 57, 50,
        // D resolve
        50, 57, 50, 57,
        // Second half
        50, 57, 50, 57,
        55, 50, 55, 50,
        57, 50, 57, 50,
        50, 57, 50, 50,
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
    id: 'starlight',
    title: 'Starlight',
    composer: 'Original',
    genre: 'pop',
    difficulty: 3,
    bpm: 104,
    timeSignature: [4, 4],
    keySignature: 'Eb',
    tags: ['sophisticated', 'harmonic', 'two-hands'],
    rightHand: {
      // Key of Eb: Eb=63/75, F=65/77, G=67/79, Ab=68/80, Bb=70/82, C=72, D=74
      // More sophisticated harmony with chromatic touches
      notes: [
        // Bar 1: Eb major - shimmering opening
        75, 79, 82, 80,
        // Bar 2: Ab area
        80, 79, 77, 75,
        // Bar 3: Bb - rising
        70, 74, 77, 79,
        // Bar 4: back to Eb
        80, 79, 77, 75,
        // Bar 5: second phrase - more colorful
        75, 77, 80, 82,
        // Bar 6: chromatic touch
        82, 80, 79, 77,
        // Bar 7: climax
        79, 80, 82, 84,
        // Bar 8: resolve to Eb
        82, 80, 77, 75,
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
    leftHand: {
      // Eb bass with harmonic movement
      notes: [
        // Eb bass
        51, 58, 51, 58,
        // Ab bass
        56, 51, 56, 51,
        // Bb bass
        58, 51, 58, 51,
        // Eb resolve
        51, 58, 51, 58,
        // Second half
        51, 58, 51, 58,
        56, 51, 56, 51,
        58, 51, 58, 51,
        51, 58, 51, 51,
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
