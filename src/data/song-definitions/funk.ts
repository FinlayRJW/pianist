import type { SongDefinition } from './types';

export const funkSongs: SongDefinition[] = [
  {
    id: 'funky-chicken',
    title: 'Funky Chicken',
    composer: 'Original',
    genre: 'funk',
    difficulty: 3,
    bpm: 108,
    timeSignature: [4, 4],
    keySignature: 'Bb',
    tags: ['syncopated', 'offbeat', 'groovy'],
    rightHand: {
      // Key of Bb: Bb=70/82, C=72, D=74, Eb=75, F=77, G=79, A=81
      // Syncopated funk - lots of offbeat hits and rests
      notes: [
        // Bar 1: funky Bb stabs
        70, 0, 74, 0, 70, 74, 77, 0,
        // Bar 2: Eb groove
        75, 0, 77, 0, 75, 79, 77, 0,
        // Bar 3: F funk
        77, 0, 81, 0, 77, 81, 82, 0,
        // Bar 4: back to Bb
        82, 0, 79, 0, 77, 74, 70, 0,
        // Bar 5: second verse - higher energy
        82, 0, 79, 77, 0, 74, 77, 79,
        // Bar 6: Eb push
        75, 0, 77, 79, 0, 77, 75, 0,
        // Bar 7: F climax
        77, 0, 79, 81, 82, 0, 81, 79,
        // Bar 8: Bb resolve
        77, 0, 74, 0, 70, 0, 70, 0,
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
    id: 'groove-machine',
    title: 'Groove Machine',
    composer: 'Original',
    genre: 'funk',
    difficulty: 3,
    bpm: 100,
    timeSignature: [4, 4],
    keySignature: 'Eb',
    tags: ['steady', 'groove', 'ghost-notes'],
    rightHand: {
      // Key of Eb: Eb=63/75, F=65/77, G=67/79, Ab=68/80, Bb=70/82, C=72, D=74
      // Steady groove with repeated notes for ghost-note feel
      notes: [
        // Bar 1: Eb groove - repeated notes create machine-like feel
        75, 75, 79, 77, 75, 75, 79, 80,
        // Bar 2: Ab shift
        80, 80, 79, 77, 80, 80, 79, 77,
        // Bar 3: Bb groove
        82, 82, 80, 79, 82, 82, 80, 79,
        // Bar 4: Eb return
        77, 75, 77, 79, 77, 75, 74, 75,
        // Bar 5: variation - more movement
        75, 77, 79, 80, 82, 80, 79, 77,
        // Bar 6: Ab variation
        80, 79, 77, 75, 77, 79, 80, 82,
        // Bar 7: building
        82, 84, 82, 80, 79, 80, 82, 80,
        // Bar 8: resolve
        79, 77, 75, 77, 75, 74, 72, 75,
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
    id: 'bass-face',
    title: 'Bass Face',
    composer: 'Original',
    genre: 'funk',
    difficulty: 3,
    bpm: 96,
    timeSignature: [4, 4],
    keySignature: 'F',
    tags: ['bass-heavy', 'sparse', 'two-hands'],
    rightHand: {
      // Key of F: sparse right hand stabs over heavy bass
      // F=65/77, G=67/79, A=69/81, Bb=70/82, C=72, D=74, E=76
      notes: [
        // Bar 1: sparse stabs
        77, 0, 0, 81,
        // Bar 2:
        0, 79, 0, 77,
        // Bar 3:
        82, 0, 0, 79,
        // Bar 4:
        0, 77, 0, 0,
        // Bar 5: more active
        77, 79, 0, 81,
        // Bar 6:
        82, 0, 81, 79,
        // Bar 7:
        77, 0, 79, 81,
        // Bar 8: resolve
        82, 81, 79, 77,
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
      // Heavy funk bass line - syncopated and driving
      // F=41/53, G=43/55, A=45/57, Bb=46/58, C=48/60, D=50/62, E=52/64
      notes: [
        // Bar 1: F bass groove
        53, 53, 0, 53, 57, 53, 0, 60,
        // Bar 2: Bb bass
        58, 58, 0, 58, 60, 58, 0, 55,
        // Bar 3: C bass
        60, 60, 0, 60, 62, 60, 0, 58,
        // Bar 4: F resolve
        53, 55, 0, 53, 0, 53, 55, 53,
        // Bar 5: variation
        53, 0, 55, 53, 57, 53, 0, 60,
        // Bar 6: Bb
        58, 0, 60, 58, 60, 58, 0, 55,
        // Bar 7: C
        60, 0, 62, 60, 62, 60, 0, 58,
        // Bar 8: F end
        53, 55, 57, 53, 0, 53, 55, 53,
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
    id: 'slap-happy',
    title: 'Slap Happy',
    composer: 'Original',
    genre: 'funk',
    difficulty: 4,
    bpm: 112,
    timeSignature: [4, 4],
    keySignature: 'G',
    tags: ['two-hands', 'funk-pattern', 'rhythmic'],
    requiresMidi: true,
    rightHand: {
      // Key of G: two-hand funk coordination
      // G=67/79, A=69/81, B=71/83, C=72, D=74, E=76, F#=78
      notes: [
        // Bar 1: right hand chord stabs on offbeats
        0, 79, 0, 83, 0, 81, 0, 79,
        // Bar 2: C area
        0, 72, 0, 76, 0, 74, 0, 72,
        // Bar 3: D stabs
        0, 74, 0, 78, 0, 76, 0, 74,
        // Bar 4: G resolve
        0, 79, 0, 83, 0, 81, 79, 0,
        // Bar 5: variation with more notes
        79, 0, 81, 83, 0, 81, 0, 79,
        // Bar 6: C push
        72, 0, 74, 76, 0, 74, 0, 72,
        // Bar 7: D climax
        74, 0, 76, 78, 0, 81, 0, 79,
        // Bar 8: G end
        79, 0, 83, 81, 79, 0, 79, 0,
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
      // Funk bass - hits on the beats, complements right hand
      notes: [
        // Bar 1: G bass on beats
        55, 0, 55, 0, 57, 0, 55, 0,
        // Bar 2: C bass
        48, 0, 48, 0, 50, 0, 48, 0,
        // Bar 3: D bass
        50, 0, 50, 0, 52, 0, 50, 0,
        // Bar 4: G
        55, 0, 57, 0, 55, 0, 0, 55,
        // Bar 5: variation
        55, 57, 0, 55, 0, 57, 55, 0,
        // Bar 6: C
        48, 50, 0, 48, 0, 50, 48, 0,
        // Bar 7: D
        50, 52, 0, 50, 0, 52, 50, 0,
        // Bar 8: G end
        55, 0, 57, 55, 0, 55, 0, 55,
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
    id: 'disco-inferno',
    title: 'Disco Inferno',
    composer: 'Original',
    genre: 'funk',
    difficulty: 4,
    bpm: 120,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['disco', 'octaves', 'driving', 'two-hands'],
    requiresMidi: true,
    rightHand: {
      // Driving disco pattern with octave hits
      notes: [
        // Bar 1: C disco - octave jumps and scalar runs
        60, 72, 67, 72, 64, 72, 67, 72,
        // Bar 2: F disco
        65, 77, 69, 77, 67, 77, 69, 77,
        // Bar 3: G disco
        67, 79, 71, 79, 69, 79, 71, 79,
        // Bar 4: C resolve
        60, 72, 64, 72, 67, 72, 64, 60,
        // Bar 5: higher energy
        72, 84, 79, 84, 76, 84, 79, 84,
        // Bar 6: F high
        77, 89, 81, 89, 79, 89, 81, 89,
        // Bar 7: G climax
        79, 91, 83, 91, 81, 91, 83, 91,
        // Bar 8: C finale
        72, 84, 79, 84, 76, 84, 72, 60,
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
      // Steady disco bass - pumping quarter notes with passing tones
      notes: [
        // Bar 1: C pump
        48, 48, 48, 48,
        // Bar 2: F pump
        53, 53, 53, 53,
        // Bar 3: G pump
        55, 55, 55, 55,
        // Bar 4: C
        48, 48, 48, 48,
        // Bar 5: octave bass
        48, 60, 48, 60,
        // Bar 6: F octave
        53, 65, 53, 65,
        // Bar 7: G octave
        55, 67, 55, 67,
        // Bar 8: C final
        48, 60, 48, 48,
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
