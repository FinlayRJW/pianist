import type { SongDefinition } from './types';

export const rockSongs: SongDefinition[] = [
  {
    id: 'power-up',
    title: 'Power Up',
    composer: 'Original',
    genre: 'rock',
    difficulty: 3,
    bpm: 130,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['driving', 'eighth-notes', 'riff'],
    rightHand: {
      // Driving eighth-note riff in C - power rock feel
      notes: [
        // Bar 1: hammering C riff
        60, 64, 67, 64, 60, 64, 67, 72,
        // Bar 2: shift to F
        65, 69, 72, 69, 65, 69, 72, 69,
        // Bar 3: G power
        67, 71, 74, 71, 67, 71, 74, 76,
        // Bar 4: resolve to C
        72, 67, 64, 60, 64, 67, 72, 60,
        // Bar 5: second phrase - higher octave variation
        72, 76, 79, 76, 72, 76, 79, 84,
        // Bar 6: F area high
        77, 81, 84, 81, 77, 81, 84, 81,
        // Bar 7: G climax
        79, 83, 86, 83, 79, 83, 86, 84,
        // Bar 8: final C resolve
        84, 79, 76, 72, 76, 79, 72, 60,
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
    id: 'thunder-road',
    title: 'Thunder Road',
    composer: 'Original',
    genre: 'rock',
    difficulty: 3,
    bpm: 126,
    timeSignature: [4, 4],
    keySignature: 'G',
    tags: ['heavy', 'rhythmic', 'powerful'],
    rightHand: {
      // Key of G: heavy rhythmic pattern with rests for punch
      // G=67, A=69, B=71, C=72, D=74, E=76, F#=78
      notes: [
        // Bar 1: punchy G riff with rests
        67, 0, 71, 74, 0, 72, 71, 67,
        // Bar 2: C power shift
        72, 0, 76, 74, 0, 72, 74, 72,
        // Bar 3: D power
        74, 0, 78, 76, 0, 74, 76, 74,
        // Bar 4: G resolve - heavy hits
        79, 0, 76, 74, 0, 71, 74, 67,
        // Bar 5: second phrase - intensified
        79, 0, 83, 86, 0, 84, 83, 79,
        // Bar 6: C high
        84, 0, 88, 86, 0, 84, 86, 84,
        // Bar 7: D climax
        86, 0, 90, 88, 0, 86, 88, 86,
        // Bar 8: G final slam
        91, 0, 86, 83, 0, 79, 74, 67,
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
    id: 'electric-storm',
    title: 'Electric Storm',
    composer: 'Original',
    genre: 'rock',
    difficulty: 3,
    bpm: 138,
    timeSignature: [4, 4],
    keySignature: 'Am',
    tags: ['minor', 'intense', 'dark'],
    rightHand: {
      // Am: A=69, B=71, C=72, D=74, E=76, F=77, G=79
      // Intense minor key riff
      notes: [
        // Bar 1: Am aggression
        69, 72, 76, 72, 69, 72, 76, 77,
        // Bar 2: Dm area
        74, 77, 81, 77, 74, 77, 81, 79,
        // Bar 3: E power (dominant)
        76, 79, 83, 79, 76, 72, 71, 69,
        // Bar 4: Am resolve with fury
        69, 76, 72, 69, 77, 76, 72, 69,
        // Bar 5: octave higher - Am rage
        81, 84, 88, 84, 81, 84, 88, 89,
        // Bar 6: Dm high
        86, 89, 93, 89, 86, 89, 93, 91,
        // Bar 7: E dominant fury
        88, 91, 95, 91, 88, 84, 83, 81,
        // Bar 8: Am final crash
        81, 88, 84, 81, 77, 76, 72, 69,
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
    id: 'midnight-run',
    title: 'Midnight Run',
    composer: 'Original',
    genre: 'rock',
    difficulty: 4,
    bpm: 144,
    timeSignature: [4, 4],
    keySignature: 'Em',
    tags: ['fast', 'precision', 'challenging'],
    rightHand: {
      // Em: E=64/76, F#=66/78, G=67/79, A=69/81, B=71/83, C=72, D=74
      // Fast tempo requiring precision - mix of eighths and quarters
      notes: [
        // Bar 1: Em rapid fire
        76, 79, 83, 81, 79, 76,
        // Bar 2: Am shift
        81, 79, 76, 74, 72, 74,
        // Bar 3: B7 tension - chromatic
        71, 75, 78, 83, 81, 78,
        // Bar 4: Em resolve
        79, 76, 74, 72, 74, 76,
        // Bar 5: second phrase - higher
        83, 81, 79, 83, 81, 79,
        // Bar 6: descending fury
        81, 79, 76, 74, 72, 74,
        // Bar 7: building climax
        76, 79, 81, 83, 84, 83,
        // Bar 8: final Em
        81, 79, 76, 74, 72, 76,
      ],
      rhythm: [
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
        0.5, 0.5, 0.5, 0.5, 1, 1,
      ],
    },
  },
  {
    id: 'iron-will',
    title: 'Iron Will',
    composer: 'Original',
    genre: 'rock',
    difficulty: 4,
    bpm: 120,
    timeSignature: [4, 4],
    keySignature: 'C',
    tags: ['chords', 'melody', 'two-hands', 'power-chords'],
    requiresMidi: true,
    rightHand: {
      // Melody over power chords - heroic rock anthem
      notes: [
        // Bar 1: C heroic melody
        72, 74, 76, 79,
        // Bar 2: F area
        77, 76, 74, 72,
        // Bar 3: G power
        79, 76, 74, 76,
        // Bar 4: C resolve
        72, 74, 76, 72,
        // Bar 5: rising intensity
        72, 76, 79, 84,
        // Bar 6: peak
        84, 81, 79, 76,
        // Bar 7: dramatic descent
        79, 77, 76, 74,
        // Bar 8: final resolve
        76, 74, 72, 72,
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
      // Power chords (root + fifth) on half notes
      notes: [
        // C5 power chord roots
        48, 55, 48, 55,
        // F power
        53, 48, 53, 48,
        // G power
        55, 48, 55, 48,
        // C resolve
        48, 55, 48, 48,
        // Second half
        48, 55, 48, 55,
        53, 48, 53, 48,
        55, 48, 55, 48,
        48, 55, 48, 48,
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
