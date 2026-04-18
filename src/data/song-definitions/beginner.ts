import type { SongDefinition } from './types';

export const beginnerSongs: SongDefinition[] = [
  // 1. Middle C March — Tutorial
  {
    id: 'middle-c-march',
    title: 'Middle C March',
    composer: 'Tutorial',
    genre: 'beginner',
    difficulty: 1,
    bpm: 90,
    keySignature: 'C',
    tags: ['tutorial', 'single-note', 'rhythm'],
    rightHand: {
      notes: [
        // Section 1: steady quarter notes (4)
        60, 60, 60, 60,
        // Section 2: quarters + half (3)
        60, 60, 60,
        // Section 3: repeat steady quarters (4)
        60, 60, 60, 60,
        // Section 4: quarters + half (3)
        60, 60, 60,
        // Section 5: half notes (8)
        60, 60, 60, 60, 60, 60, 60, 60,
        // Section 6: mixed (6)
        60, 60, 60, 60, 60, 60,
        // Section 7: eighth notes (8)
        60, 60, 60, 60, 60, 60, 60, 60,
        // Section 8: half notes (2)
        60, 60,
        // Section 9: quarter notes (4)
        60, 60, 60, 60,
        // Section 10: half + quarters (3)
        60, 60, 60,
        // Section 11: quarters + half (3)
        60, 60, 60,
        // Section 12: final (2)
        60, 60,
      ],
      rhythm: [
        1, 1, 1, 1,
        1, 1, 2,
        1, 1, 1, 1,
        1, 1, 2,
        2, 2, 2, 2, 2, 2, 2, 2,
        1, 1, 2, 1, 1, 2,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        2, 2,
        1, 1, 1, 1,
        2, 1, 1,
        1, 1, 2,
        1, 3,
      ],
    },
  },

  // 2. C Scale Climb — Tutorial
  {
    id: 'c-scale-climb',
    title: 'C Scale Climb',
    composer: 'Tutorial',
    genre: 'beginner',
    difficulty: 1,
    bpm: 80,
    keySignature: 'C',
    tags: ['tutorial', 'scale', 'c-major'],
    rightHand: {
      notes: [
        // Up in quarter notes
        60, 62, 64, 65, 67, 69, 71, 72,
        // Down in quarter notes
        72, 71, 69, 67, 65, 64, 62, 60,
        // Up in half notes
        60, 62, 64, 65, 67, 69, 71, 72,
        // Down in half notes
        72, 71, 69, 67, 65, 64, 62, 60,
        // Quick up
        60, 62, 64, 65, 67, 69, 71, 72,
        // Quick down
        72, 71, 69, 67, 65, 64, 62, 60,
      ],
      rhythm: [
        1, 1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 1, 2,
        2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 3,
      ],
    },
  },

  // 3. Hot Cross Buns — Traditional
  {
    id: 'hot-cross-buns',
    title: 'Hot Cross Buns',
    composer: 'Traditional',
    genre: 'beginner',
    difficulty: 1,
    bpm: 100,
    keySignature: 'C',
    tags: ['traditional', 'easy', 'three-notes'],
    rightHand: {
      notes: [
        // Phrase 1: "Hot cross buns"
        64, 62, 60,
        // Phrase 2: "Hot cross buns"
        64, 62, 60,
        // Phrase 3: "One a penny, two a penny"
        60, 60, 60, 60, 62, 62, 62, 62,
        // Phrase 4: "Hot cross buns"
        64, 62, 60,
        // Repeat the whole thing
        64, 62, 60,
        64, 62, 60,
        60, 60, 60, 60, 62, 62, 62, 62,
        64, 62, 60,
      ],
      rhythm: [
        1, 1, 2,
        1, 1, 2,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 1, 2,
        // Repeat
        1, 1, 2,
        1, 1, 2,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        1, 1, 2,
      ],
    },
  },

  // 4. Mary Had a Little Lamb — Traditional (repeated 3 times)
  {
    id: 'mary-had-a-little-lamb',
    title: 'Mary Had a Little Lamb',
    composer: 'Traditional',
    genre: 'beginner',
    difficulty: 1,
    bpm: 100,
    keySignature: 'C',
    tags: ['traditional', 'nursery-rhyme', 'easy'],
    rightHand: {
      notes: [
        // Pass 1
        64, 62, 60, 62, 64, 64, 64,
        62, 62, 62,
        64, 67, 67,
        64, 62, 60, 62, 64, 64, 64, 64,
        62, 62, 64, 62, 60,
        // Pass 2
        64, 62, 60, 62, 64, 64, 64,
        62, 62, 62,
        64, 67, 67,
        64, 62, 60, 62, 64, 64, 64, 64,
        62, 62, 64, 62, 60,
        // Pass 3
        64, 62, 60, 62, 64, 64, 64,
        62, 62, 62,
        64, 67, 67,
        64, 62, 60, 62, 64, 64, 64, 64,
        62, 62, 64, 62, 60,
      ],
      rhythm: [
        // Pass 1
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 2,
        1, 1, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 2,
        // Pass 2
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 2,
        1, 1, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 2,
        // Pass 3
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 2,
        1, 1, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 2,
      ],
    },
  },

  // 5. London Bridge — Traditional
  {
    id: 'london-bridge',
    title: 'London Bridge',
    composer: 'Traditional',
    genre: 'beginner',
    difficulty: 1,
    bpm: 110,
    keySignature: 'C',
    tags: ['traditional', 'nursery-rhyme', 'easy'],
    rightHand: {
      notes: [
        // "London bridge is falling down" — G A G F E F G
        67, 69, 67, 65, 64, 65, 67,
        // "my fair lady" — D E F
        62, 64, 65,
        // "falling down" — E F G
        64, 65, 67,
        // "London bridge is falling down" — G A G F E F G
        67, 69, 67, 65, 64, 65, 67,
        // "my fair lady" — D G E C
        62, 67, 64, 60,
        // Repeat
        67, 69, 67, 65, 64, 65, 67,
        62, 64, 65,
        64, 65, 67,
        67, 69, 67, 65, 64, 65, 67,
        62, 67, 64, 60,
      ],
      rhythm: [
        1.5, 0.5, 1, 1, 1, 1, 2,
        1, 1, 2,
        1, 1, 2,
        1.5, 0.5, 1, 1, 1, 1, 2,
        1, 1, 1, 2,
        // Repeat
        1.5, 0.5, 1, 1, 1, 1, 2,
        1, 1, 2,
        1, 1, 2,
        1.5, 0.5, 1, 1, 1, 1, 2,
        1, 1, 1, 2,
      ],
    },
  },

  // 6. Twinkle Twinkle — Traditional (repeated 2 times)
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    composer: 'Traditional',
    genre: 'beginner',
    difficulty: 1,
    bpm: 100,
    keySignature: 'C',
    tags: ['traditional', 'nursery-rhyme', 'easy'],
    rightHand: {
      notes: [
        // Pass 1
        // "Twinkle twinkle little star" — C C G G A A G
        60, 60, 67, 67, 69, 69, 67,
        // "How I wonder what you are" — F F E E D D C
        65, 65, 64, 64, 62, 62, 60,
        // "Up above the world so high" — G G F F E E D
        67, 67, 65, 65, 64, 64, 62,
        // "Like a diamond in the sky" — G G F F E E D
        67, 67, 65, 65, 64, 64, 62,
        // "Twinkle twinkle little star" — C C G G A A G
        60, 60, 67, 67, 69, 69, 67,
        // "How I wonder what you are" — F F E E D D C
        65, 65, 64, 64, 62, 62, 60,
        // Pass 2
        60, 60, 67, 67, 69, 69, 67,
        65, 65, 64, 64, 62, 62, 60,
        67, 67, 65, 65, 64, 64, 62,
        67, 67, 65, 65, 64, 64, 62,
        60, 60, 67, 67, 69, 69, 67,
        65, 65, 64, 64, 62, 62, 60,
      ],
      rhythm: [
        // Pass 1
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        // Pass 2
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 2,
      ],
    },
  },

  // 7. G Scale Exercise — Tutorial
  {
    id: 'g-scale-exercise',
    title: 'G Scale Exercise',
    composer: 'Tutorial',
    genre: 'beginner',
    difficulty: 2,
    bpm: 90,
    keySignature: 'G',
    tags: ['tutorial', 'scale', 'g-major'],
    rightHand: {
      // G major scale: G4, A4, B4, C5, D5, E5, F#5, G5
      // MIDI: 67, 69, 71, 72, 74, 76, 78, 79
      notes: [
        // Up in quarter notes
        67, 69, 71, 72, 74, 76, 78, 79,
        // Down in quarter notes
        79, 78, 76, 74, 72, 71, 69, 67,
        // Up in half notes
        67, 69, 71, 72, 74, 76, 78, 79,
        // Down in half notes
        79, 78, 76, 74, 72, 71, 69, 67,
        // Quick up
        67, 69, 71, 72, 74, 76, 78, 79,
        // Quick down
        79, 78, 76, 74, 72, 71, 69, 67,
      ],
      rhythm: [
        1, 1, 1, 1, 1, 1, 1, 2,
        1, 1, 1, 1, 1, 1, 1, 2,
        2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 3,
      ],
    },
  },

  // 8. Ode to Joy — Beethoven (AABA' repeated twice)
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    genre: 'beginner',
    difficulty: 2,
    bpm: 108,
    keySignature: 'C',
    tags: ['classical', 'beethoven', 'theme'],
    rightHand: {
      notes: [
        // === Pass 1 ===
        // A section
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62,
        // A section (repeat)
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62,
        // B section
        62, 62, 64, 60, 62, 64, 65, 64, 60, 62, 64, 65, 64, 62, 60, 62, 55,
        // A' section
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 62, 60, 60,
        // === Pass 2 ===
        // A section
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62,
        // A section (repeat)
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62,
        // B section
        62, 62, 64, 60, 62, 64, 65, 64, 60, 62, 64, 65, 64, 62, 60, 62, 55,
        // A' section
        64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 62, 60, 60,
      ],
      rhythm: [
        // === Pass 1 ===
        // A section
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
        // A section (repeat)
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
        // B section
        1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2,
        // A' section
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
        // === Pass 2 ===
        // A section
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
        // A section (repeat)
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
        // B section
        1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2,
        // A' section
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
      ],
    },
  },
];
