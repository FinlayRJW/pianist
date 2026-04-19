import type { JourneyChapter, JourneyStep } from '../types';

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  { id: 'first-notes', number: 1, title: 'First Notes', subtitle: 'Your first piano pieces', color: '#22d3ee' },
  { id: 'growing-confidence', number: 2, title: 'Growing Confidence', subtitle: 'Building musicality and technique', color: '#34d399' },
  { id: 'bach-notebook', number: 3, title: 'The Bach Notebook', subtitle: 'Baroque foundations', color: '#c084fc' },
  { id: 'classical-masters', number: 4, title: 'Classical Masters', subtitle: 'Sonatina form and classical style', color: '#a78bfa' },
  { id: 'building-artistry', number: 5, title: 'Building Artistry', subtitle: 'Expression, speed, and depth', color: '#f472b6' },
  { id: 'the-summit', number: 6, title: 'The Summit', subtitle: 'Concert-ready pieces', color: '#fbbf24' },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  // Chapter 1: First Notes
  { type: 'linear', id: 'step-1', chapterId: 'first-notes', order: 1, songId: 'schumann-melody-op68-1',
    teaches: 'Simple melody, both hands from day one',
    description: 'Schumann wrote his Album for the Young as teaching pieces. This opening melody uses both hands gently, introducing you to reading and playing at the same time.' },
  { type: 'linear', id: 'step-2', chapterId: 'first-notes', order: 2, songId: 'schumann-march-op68-2',
    teaches: 'Steady rhythm, march tempo',
    description: 'A crisp little march that teaches you to keep a steady beat. Focus on even timing between your left and right hands.' },
  { type: 'linear', id: 'step-3', chapterId: 'first-notes', order: 3, songId: 'schumann-humming-op68-3',
    teaches: 'Gentle dynamics, phrasing',
    description: 'A quiet, lyrical piece that introduces musical phrasing — the art of shaping a melody like a spoken sentence.' },
  { type: 'linear', id: 'step-4', chapterId: 'first-notes', order: 4, songId: 'bach-applicatio-bwv994',
    teaches: 'Finger placement, ornaments',
    description: 'Bach wrote this as his son\'s very first keyboard lesson. It introduces basic finger placement and simple ornaments.' },

  // Chapter 2: Growing Confidence
  { type: 'linear', id: 'step-5', chapterId: 'growing-confidence', order: 5, songId: 'schumann-wild-rider-op68-8',
    teaches: 'Speed, energy, accents',
    description: 'The famous "Wild Horseman" — a fast, exciting piece that builds speed and finger confidence. Feel the galloping rhythm!' },
  { type: 'linear', id: 'step-6', chapterId: 'growing-confidence', order: 6, songId: 'schumann-happy-farmer-op68-10',
    teaches: 'Syncopation, melody in left hand',
    description: 'The "Happy Farmer" places the melody in the left hand while the right accompanies — a great exercise in hand independence.' },
  { type: 'linear', id: 'step-7', chapterId: 'growing-confidence', order: 7, songId: 'burgmuller-candeur-op100-1',
    teaches: 'Flowing melody, first étude',
    description: 'Your first étude (study piece). Burgmüller\'s études disguise technical exercises as beautiful music. This one builds a smooth, singing tone.' },
  { type: 'linear', id: 'step-8', chapterId: 'growing-confidence', order: 8, songId: 'handel-sonatina-hwv585',
    teaches: 'Classical form, baroque style',
    description: 'A short sonatina by Handel that introduces baroque keyboard style — clarity, elegance, and the dance-like quality of 18th-century music.' },

  // Chapter 3: The Bach Notebook
  { type: 'linear', id: 'step-9', chapterId: 'bach-notebook', order: 9, songId: 'bach-menuet-g-bwv-anh114',
    teaches: 'Dance form, elegant phrasing',
    description: 'The most famous beginner piano piece in the world. Originally attributed to Bach, now known to be by Petzold. A graceful dance in 3/4 time.' },
  { type: 'linear', id: 'step-10', chapterId: 'bach-notebook', order: 10, songId: 'bach-menuet-gm-bwv-anh115',
    teaches: 'Minor key contrast, paired minuets',
    description: 'The companion minuet in G minor — traditionally played as a pair with the G major. Notice how the minor key completely changes the mood.' },
  { type: 'branch', id: 'step-11', chapterId: 'bach-notebook', order: 11, songChoices: ['bach-musette-bwv-anh126', 'bach-polonaise-gm-bwv-anh119'],
    teaches: 'Baroque dance forms',
    description: 'Choose your path: the Musette features a drone bass and lively dance character, while the Polonaise explores a stately Polish dance form in G minor.' },

  // Chapter 4: Classical Masters
  { type: 'linear', id: 'step-12', chapterId: 'classical-masters', order: 12, songId: 'mozart-menuet-g-k2',
    teaches: 'Elegant Classical phrasing',
    description: 'Mozart composed this minuet at age five. Despite its simplicity, it showcases the elegant phrasing and balance that define the Classical style.' },
  { type: 'linear', id: 'step-13', chapterId: 'classical-masters', order: 13, songId: 'clementi-sonatina-op36-1',
    teaches: 'Sonata-allegro form, finger independence',
    description: 'The most popular beginner sonatina. Introduces sonata-allegro form (exposition, development, recapitulation) — the architecture of Classical music.' },
  { type: 'branch', id: 'step-14', chapterId: 'classical-masters', order: 14, songChoices: ['kuhlau-sonatina-op20-1', 'beethoven-sonata-op49-2-mvt2'],
    teaches: 'Classical sonatina mastery',
    description: 'Two paths into the Classical masters: Kuhlau\'s bright, virtuosic Sonatina in C, or Beethoven\'s graceful Menuetto from his "Easy" Sonata.' },

  // Chapter 5: Building Artistry
  { type: 'linear', id: 'step-15', chapterId: 'building-artistry', order: 15, songId: 'burgmuller-arabesque-op100-2',
    teaches: 'Speed, agility, dynamic contrasts',
    description: 'A thrilling étude that builds rapid fingerwork with dramatic dynamic contrasts. One of the most satisfying pieces at this level.' },
  { type: 'linear', id: 'step-16', chapterId: 'building-artistry', order: 16, songId: 'schumann-traumerei-op15-7',
    teaches: 'Deep expression, rubato',
    description: 'One of the most beloved piano pieces ever written. "Dreaming" teaches rubato — the art of stretching and compressing time for emotional effect.' },
  { type: 'linear', id: 'step-17', chapterId: 'building-artistry', order: 17, songId: 'satie-gymnopedie-1',
    teaches: 'Pedal technique, atmosphere',
    description: 'Satie\'s hypnotic masterpiece. Slow tempo demands precise pedalling and teaches you to create atmosphere through sustained harmony and space.' },
  { type: 'linear', id: 'step-18', chapterId: 'building-artistry', order: 18, songId: 'bach-invention-1-bwv772',
    teaches: 'Two-voice counterpoint, independence',
    description: 'Bach\'s first two-part invention — each hand plays an independent melody. The ultimate exercise in hand independence and contrapuntal thinking.' },

  // Chapter 6: The Summit
  { type: 'linear', id: 'step-19', chapterId: 'the-summit', order: 19, songId: 'bach-prelude-c-bwv846',
    teaches: 'Arpeggiated patterns',
    description: 'The opening piece of the Well-Tempered Clavier. Its flowing arpeggios directly prepare you for the Moonlight Sonata\'s left-hand patterns.' },
  { type: 'linear', id: 'step-20', chapterId: 'the-summit', order: 20, songId: 'chopin-prelude-op28-4',
    teaches: 'Emotional depth, chord voicing',
    description: 'Played at Chopin\'s own funeral. A profound, slow piece that teaches chord voicing — bringing out the melody within sustained harmonies.' },
  { type: 'linear', id: 'step-21', chapterId: 'the-summit', order: 21, songId: 'beethoven-fur-elise',
    teaches: 'Complete technique showcase',
    description: 'The most famous piano piece ever written. Combines everything you\'ve learned: melody, arpeggios, dynamics, and contrasting sections.' },
  { type: 'linear', id: 'step-22', chapterId: 'the-summit', order: 22, songId: 'satie-gnossienne-1',
    teaches: 'Free rhythm, mysterious expression',
    description: 'Written without bar lines or time signature. Teaches you to feel rhythm freely, creating an otherworldly, meditative atmosphere.' },
  { type: 'linear', id: 'step-23', chapterId: 'the-summit', order: 23, songId: 'beethoven-moonlight-mvt1',
    teaches: 'The culmination — arpeggios, expression, sustained bass',
    description: 'The final destination. Beethoven\'s Moonlight Sonata combines flowing arpeggios, deep expression, and sustained bass — everything your journey has prepared you for.' },
];

export const TOTAL_JOURNEY_STEPS = JOURNEY_STEPS.length;

export function getStepSongIds(step: JourneyStep): string[] {
  return step.type === 'branch' ? step.songChoices : [step.songId];
}

export function isStepComplete(step: JourneyStep, stars: Record<string, 0 | 1 | 2 | 3>): boolean {
  if (step.type === 'linear') {
    return (stars[step.songId] ?? 0) >= 1;
  }
  return step.songChoices.some((id) => (stars[id] ?? 0) >= 1);
}

export function isStepUnlocked(step: JourneyStep, stars: Record<string, 0 | 1 | 2 | 3>): boolean {
  const idx = JOURNEY_STEPS.indexOf(step);
  if (idx === 0) return true;
  const prev = JOURNEY_STEPS[idx - 1];
  return isStepComplete(prev, stars);
}

export function getNextIncompleteStep(stars: Record<string, 0 | 1 | 2 | 3>): JourneyStep | null {
  return JOURNEY_STEPS.find((s) => !isStepComplete(s, stars)) ?? null;
}

export function countCompletedSteps(stars: Record<string, 0 | 1 | 2 | 3>): number {
  return JOURNEY_STEPS.filter((s) => isStepComplete(s, stars)).length;
}

export function isJourneyComplete(stars: Record<string, 0 | 1 | 2 | 3>): boolean {
  return JOURNEY_STEPS.every((s) => isStepComplete(s, stars));
}

export function isFirstNotesComplete(stars: Record<string, 0 | 1 | 2 | 3>): boolean {
  return getChapterSteps('first-notes').every((s) => isStepComplete(s, stars));
}

export function getChapterSteps(chapterId: string): JourneyStep[] {
  return JOURNEY_STEPS.filter((s) => s.chapterId === chapterId);
}

export function getChapterProgress(chapterId: string, stars: Record<string, 0 | 1 | 2 | 3>): { completed: number; total: number } {
  const steps = getChapterSteps(chapterId);
  return {
    completed: steps.filter((s) => isStepComplete(s, stars)).length,
    total: steps.length,
  };
}
