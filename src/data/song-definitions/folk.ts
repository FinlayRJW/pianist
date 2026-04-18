import type { SongDefinition } from './types';

export const folkSongs: SongDefinition[] = [
  // 1. Oh! Susanna — Stephen Foster
  {
    id: 'oh-susanna',
    title: 'Oh! Susanna',
    composer: 'Stephen Foster',
    genre: 'folk',
    difficulty: 2,
    bpm: 120,
    keySignature: 'C',
    tags: ['american', 'folk', 'stephen-foster'],
    rightHand: {
      notes: [
        // Verse: "I come from Alabama with my banjo on my knee"
        60, 62, 64, 67, 67, 69, 67, 64, 60, 62, 64, 64, 62, 60, 62,
        // "I'm going to Louisiana, my true love for to see"
        60, 62, 64, 67, 67, 69, 67, 64, 60, 62, 64, 64, 62, 62, 60,
        // Chorus: "Oh! Susanna, oh don't you cry for me"
        65, 69, 69, 67, 64, 60, 62, 64, 64, 62, 60, 62, 64, 67,
        // "For I come from Alabama with my banjo on my knee"
        65, 69, 69, 67, 64, 60, 62, 64, 64, 62, 62, 60,
      ],
      rhythm: [
        // Verse 1
        0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 2,
        // Verse 2
        0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 2,
        // Chorus 1
        2, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 1, 1, 2,
        // Chorus 2
        2, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 2,
      ],
    },
  },

  // 2. When the Saints Go Marching In — Traditional
  {
    id: 'when-the-saints',
    title: 'When the Saints Go Marching In',
    composer: 'Traditional',
    genre: 'folk',
    difficulty: 2,
    bpm: 110,
    keySignature: 'C',
    tags: ['traditional', 'spiritual', 'american'],
    rightHand: {
      notes: [
        // "Oh when the saints go marching in" (phrase 1)
        60, 64, 65, 67,
        // (repeat)
        60, 64, 65, 67,
        // "Oh when the saints go marching in"
        60, 64, 65, 67, 64, 60, 64, 62,
        // "Oh when the saints go marching in"
        64, 64, 62, 60, 60, 64, 67, 67, 65,
        // "Oh lord I want to be in that number"
        65, 64, 65, 67, 64, 60, 62, 60,
      ],
      rhythm: [
        // Phrase 1
        1, 1, 1, 4,
        // Phrase 2
        1, 1, 1, 4,
        // Phrase 3
        1, 1, 1, 2, 1, 1, 1, 4,
        // Phrase 4
        1, 1, 1, 1, 2, 1, 1, 1.5, 0.5,
        // Phrase 5
        1, 1, 1, 2, 1, 1, 1, 4,
      ],
    },
  },

  // 3. Amazing Grace — Traditional (3/4 time, key of G)
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    composer: 'Traditional',
    genre: 'folk',
    difficulty: 2,
    bpm: 80,
    timeSignature: [3, 4],
    keySignature: 'G',
    tags: ['hymn', 'traditional', 'spiritual'],
    rightHand: {
      // In G major: G4=67, A4=69, B4=71, C5=72, D5=74, E5=76
      notes: [
        // Pickup: "A-"
        62,
        // "maz-ing grace, how sweet the sound"
        67, 71, 67, 71, 69, 67, 64, 62,
        // "that saved a wretch like me"
        62, 67, 71, 67, 71, 69, 74,
        // "I once was lost, but now am found"
        74, 71, 74, 71, 67, 69, 71, 69, 67, 64, 62,
        // "was blind, but now I see"
        62, 67, 71, 67, 69, 67,
      ],
      rhythm: [
        // Pickup
        1,
        // "maz-ing grace, how sweet the sound"
        2, 1, 2, 1, 2, 2, 1, 2,
        // "that saved a wretch like me"
        1, 2, 1, 2, 1, 2, 3,
        // "I once was lost, but now am found"
        1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2,
        // "was blind, but now I see"
        1, 2, 1, 2, 1, 3,
      ],
    },
  },

  // 4. Auld Lang Syne — Traditional
  {
    id: 'auld-lang-syne',
    title: 'Auld Lang Syne',
    composer: 'Traditional',
    genre: 'folk',
    difficulty: 2,
    bpm: 100,
    keySignature: 'C',
    tags: ['traditional', 'scottish', 'new-year'],
    rightHand: {
      notes: [
        // Pickup: "Should"
        60,
        // "auld acquaintance be forgot"
        60, 64, 60, 64, 67,
        // "and never brought to mind"
        65, 64, 65, 67, 64,
        // "Should auld acquaintance be forgot"
        64, 60, 64, 67, 72,
        // "and auld lang syne"
        69, 67, 67, 64,
        // Chorus: "For auld lang syne, my dear"
        67, 72, 69, 67, 67, 64,
        // "for auld lang syne"
        65, 64, 65, 67,
        // "We'll take a cup of kindness yet"
        72, 69, 67, 67, 72,
        // "for auld lang syne"
        69, 67, 65, 64, 60,
      ],
      rhythm: [
        // Pickup
        1,
        // "auld acquaintance be forgot"
        1.5, 0.5, 1, 1.5, 0.5,
        // "and never brought to mind"
        1.5, 0.5, 1, 1, 2,
        // "Should auld acquaintance be forgot"
        1, 1.5, 0.5, 1, 1.5,
        // "and auld lang syne"
        0.5, 1.5, 1, 2,
        // Chorus
        1.5, 0.5, 1, 1.5, 0.5, 1.5,
        0.5, 1, 1, 2,
        1.5, 0.5, 1, 1.5, 0.5,
        1.5, 0.5, 1.5, 0.5, 2,
      ],
    },
  },

  // 5. Scarborough Fair — Traditional (3/4 time, key Am)
  {
    id: 'scarborough-fair',
    title: 'Scarborough Fair',
    composer: 'Traditional',
    genre: 'folk',
    difficulty: 3,
    bpm: 90,
    timeSignature: [3, 4],
    keySignature: 'Am',
    tags: ['traditional', 'english', 'ballad'],
    rightHand: {
      // A minor: A4=69, B4=71, C5=72, D5=74, E5=76, F5=77, G5=79
      notes: [
        // "Are you going to Scarborough Fair?"
        69, 69, 69, 76, 76, 76, 77, 76, 74, 76, 72, 69,
        // "Parsley, sage, rosemary and thyme"
        69, 72, 71, 69, 67, 69, 71, 72, 69,
        // "Remember me to one who lives there"
        69, 69, 76, 76, 79, 77, 76, 74, 76,
        // "She once was a true love of mine"
        72, 74, 72, 71, 69, 67, 69, 71, 69,
      ],
      rhythm: [
        // "Are you going to Scarborough Fair?"
        3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3,
        // "Parsley, sage, rosemary and thyme"
        3, 2, 1, 2, 1, 2, 1, 2, 4,
        // "Remember me to one who lives there"
        3, 2, 1, 2, 1, 2, 1, 2, 4,
        // "She once was a true love of mine"
        2, 1, 2, 1, 2, 1, 2, 1, 6,
      ],
    },
  },

  // 6. Greensleeves — Traditional (3/4 time, key Am)
  {
    id: 'greensleeves',
    title: 'Greensleeves',
    composer: 'Traditional',
    genre: 'folk',
    difficulty: 3,
    bpm: 100,
    timeSignature: [3, 4],
    keySignature: 'Am',
    tags: ['traditional', 'english', 'renaissance'],
    rightHand: {
      // A minor: A4=69, B4=71, C5=72, D5=74, E5=76, F5=77, G5=79, G#4=68
      notes: [
        // Verse: "Alas, my love, you do me wrong"
        69, 72, 74,
        76, 77, 76,
        74, 71, 67, 69, 71,
        72, 69, 69, 68, 69,
        71, 67,
        // "to cast me off discourteously"
        69, 72, 74,
        76, 77, 76,
        74, 71, 67, 69, 71,
        72, 71, 68, 66, 68,
        69, 69,
        // Chorus: "Greensleeves was all my joy"
        79, 79, 77, 76,
        74, 71, 67, 69, 71,
        72, 69, 69, 68, 69,
        71, 67,
        // "Greensleeves was my delight"
        79, 79, 77, 76,
        74, 71, 67, 69, 71,
        72, 71, 68, 66, 68,
        69, 69,
      ],
      rhythm: [
        // Verse part 1
        1, 2, 1,
        1.5, 0.5, 1,
        2, 1, 1, 0.5, 0.5,
        1, 2, 1, 0.5, 0.5,
        2, 3,
        // Verse part 2
        1, 2, 1,
        1.5, 0.5, 1,
        2, 1, 1, 0.5, 0.5,
        1, 1, 1, 0.5, 0.5,
        2, 3,
        // Chorus part 1
        3, 1.5, 0.5, 1,
        2, 1, 1, 0.5, 0.5,
        1, 2, 1, 0.5, 0.5,
        2, 3,
        // Chorus part 2
        3, 1.5, 0.5, 1,
        2, 1, 1, 0.5, 0.5,
        1, 1, 1, 0.5, 0.5,
        2, 3,
      ],
    },
  },
];
