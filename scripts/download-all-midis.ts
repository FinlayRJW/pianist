import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');
const MUTOPIA = 'https://www.mutopiaproject.org/ftp';
const MIDIWORLD = 'https://www.midiworld.com/midis/other';

interface MidiSource {
  id: string;
  genre: string;
  url: string;
  forceReplace?: boolean;
}

const SOURCES: MidiSource[] = [
  // ========== BAROQUE ==========
  // Bach Inventions (Mutopia - clean 2-track L/R)
  { id: 'bach-invention-1', genre: 'baroque', url: `${MUTOPIA}/BachJS/BWV772/bach-invention-01/bach-invention-01.mid` },
  { id: 'bach-invention-8', genre: 'baroque', url: `${MUTOPIA}/BachJS/BWV779/bach-invention-08/bach-invention-08.mid` },
  { id: 'bach-invention-13', genre: 'baroque', url: `${MUTOPIA}/BachJS/BWV784/bach-invention-13/bach-invention-13.mid` },
  // Bach Prelude in C (MidiWorld)
  { id: 'prelude-in-c', genre: 'baroque', url: `${MIDIWORLD}/bach/bwv846.mid` },

  // ========== CLASSICAL ==========
  // Mozart (Mutopia)
  { id: 'mozart-fantasy-d-minor', genre: 'classical', url: `${MUTOPIA}/MozartWA/KV397/Fantasia/Fantasia.mid` },
  // Beethoven (MidiWorld)
  { id: 'fur-elise', genre: 'classical', url: `${MIDIWORLD}/beethoven/furelise.mid` },
  { id: 'moonlight-sonata', genre: 'classical', url: `${MIDIWORLD}/beethoven/beet27m1.mid` },
  { id: 'beethoven-pathetique-2', genre: 'classical', url: `${MIDIWORLD}/beethoven/pathet2.mid` },
  // Mozart (MidiWorld)
  { id: 'mozart-k545-1', genre: 'classical', url: `${MIDIWORLD}/mozart/mozk545a.mid` },
  { id: 'mozart-alla-turca', genre: 'classical', url: `${MIDIWORLD}/mozart/mozk331c.mid` },

  // ========== ROMANTIC ==========
  // Mutopia sources (clean 2-track)
  { id: 'burgmuller-arabesque', genre: 'romantic', url: `${MUTOPIA}/BurgmullerJFF/O100/25EF-02/25EF-02.mid` },
  { id: 'schumann-traumerei', genre: 'romantic', url: `${MUTOPIA}/SchumannR/O15/SchumannOp15No07/SchumannOp15No07.mid` },
  { id: 'liszt-consolation-3', genre: 'romantic', url: `${MUTOPIA}/LisztF/S.172/liszt-consolation-no3/liszt-consolation-no3.mid` },
  { id: 'rachmaninoff-prelude-g-minor', genre: 'romantic', url: `${MUTOPIA}/RachmaninoffS/O23/rach-prelude23-05/rach-prelude23-05.mid` },
  // MidiWorld sources
  { id: 'chopin-waltz-minute', genre: 'romantic', url: `${MIDIWORLD}/chopin/chwa6401.mid` },
  { id: 'chopin-waltz-csharp-minor', genre: 'romantic', url: `${MIDIWORLD}/chopin/chwa6402.mid` },
  // Mendelssohn Spring Song (Songs Without Words Op.62 No.6)
  { id: 'mendelssohn-song-spring', genre: 'romantic', url: `${MIDIWORLD}/mendelssohn/me62-6.mid` },

  // ========== IMPRESSIONIST ==========
  // Satie Gnossiennes (Mutopia - clean 2-track)
  { id: 'satie-gnossienne-1', genre: 'impressionist', url: `${MUTOPIA}/SatieE/Gnossienne/no_1/no_1.mid` },
  { id: 'satie-gnossienne-2', genre: 'impressionist', url: `${MUTOPIA}/SatieE/Gnossienne/no_2/no_2.mid` },
  { id: 'satie-gnossienne-3', genre: 'impressionist', url: `${MUTOPIA}/SatieE/Gnossienne/no_3/no_3.mid` },
  // Satie Gymnopédies (MidiWorld)
  { id: 'gymnopedie-no1', genre: 'impressionist', url: `${MIDIWORLD}/c3/gymnop01.mid` },
  { id: 'satie-gymnopedie-2', genre: 'impressionist', url: `${MIDIWORLD}/c3/gymnop02.mid` },
  // Debussy (Mutopia - clean 2-track)
  { id: 'debussy-clair-de-lune', genre: 'impressionist', url: `${MUTOPIA}/DebussyC/L75/debussy_Ste_Bergamesq_Clair/debussy_Ste_Bergamesq_Clair.mid` },
  { id: 'debussy-arabesque-1', genre: 'impressionist', url: `${MUTOPIA}/DebussyC/L66/debussy_Arabesque_1/debussy_Arabesque_1.mid` },

  // ========== JAZZ ==========
  // Joplin (Mutopia - clean 2-track)
  { id: 'joplin-entertainer', genre: 'jazz', url: `${MUTOPIA}/JoplinS/entertainer/entertainer.mid` },
  { id: 'joplin-easy-winners', genre: 'jazz', url: `${MUTOPIA}/JoplinS/EliteSyncopations/EliteSyncopations.mid` },

  // ========== ADVANCED ==========
  { id: 'chopin-fantaisie-impromptu', genre: 'advanced', url: `${MIDIWORLD}/chopin/fantaisie.mid` },
  { id: 'beethoven-moonlight-3', genre: 'advanced', url: `${MIDIWORLD}/beethoven/beet27m3.mid` },
];

function splitByPitch(allNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>, splitPoint = 60) {
  const rightNotes = allNotes.filter(n => n.midi >= splitPoint);
  const leftNotes = allNotes.filter(n => n.midi < splitPoint);
  return { rightNotes, leftNotes };
}

function normalizeToTwoTracks(inputBuffer: Buffer): Buffer {
  const midi = new Midi(inputBuffer);
  const tracksWithNotes = midi.tracks.filter(t => t.notes.length > 0);

  if (tracksWithNotes.length === 0) {
    throw new Error('No notes found in MIDI file');
  }

  const collectNotes = (tracks: typeof tracksWithNotes) =>
    tracks.flatMap(t => t.notes.map(n => ({
      midi: n.midi,
      time: n.time,
      duration: n.duration,
      velocity: Math.round(n.velocity * 127),
    })));

  let rightNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>;
  let leftNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>;

  if (tracksWithNotes.length === 2) {
    const t0Name = tracksWithNotes[0].name.toLowerCase();
    const t1Name = tracksWithNotes[1].name.toLowerCase();

    const rightPatterns = ['right', 'upper', 'up:', 'piano r', 'treble', 'rh', 'one'];
    const leftPatterns = ['left', 'lower', 'down:', 'piano l', 'bass', 'lh', 'two'];

    const t0IsRight = rightPatterns.some(p => t0Name.includes(p));
    const t1IsLeft = leftPatterns.some(p => t1Name.includes(p));
    const t0IsLeft = leftPatterns.some(p => t0Name.includes(p));
    const t1IsRight = rightPatterns.some(p => t1Name.includes(p));

    const extract = (track: typeof tracksWithNotes[0]) =>
      track.notes.map(n => ({ midi: n.midi, time: n.time, duration: n.duration, velocity: Math.round(n.velocity * 127) }));

    if (t0IsRight || t1IsLeft) {
      rightNotes = extract(tracksWithNotes[0]);
      leftNotes = extract(tracksWithNotes[1]);
    } else if (t0IsLeft || t1IsRight) {
      rightNotes = extract(tracksWithNotes[1]);
      leftNotes = extract(tracksWithNotes[0]);
    } else {
      const avg0 = tracksWithNotes[0].notes.reduce((s, n) => s + n.midi, 0) / tracksWithNotes[0].notes.length;
      const avg1 = tracksWithNotes[1].notes.reduce((s, n) => s + n.midi, 0) / tracksWithNotes[1].notes.length;
      if (avg0 >= avg1) {
        rightNotes = extract(tracksWithNotes[0]);
        leftNotes = extract(tracksWithNotes[1]);
      } else {
        rightNotes = extract(tracksWithNotes[1]);
        leftNotes = extract(tracksWithNotes[0]);
      }
    }
  } else {
    const allNotes = collectNotes(tracksWithNotes);
    ({ rightNotes, leftNotes } = splitByPitch(allNotes));
  }

  const newMidi = new Midi();
  newMidi.header.setTempo(midi.header.tempos[0]?.bpm ?? 120);
  newMidi.header.timeSignatures = midi.header.timeSignatures;
  newMidi.header.name = midi.header.name;

  const rhTrack = newMidi.addTrack();
  rhTrack.name = 'Right Hand';
  rhTrack.channel = 0;
  for (const n of rightNotes) {
    rhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: n.velocity / 127 });
  }

  const lhTrack = newMidi.addTrack();
  lhTrack.name = 'Left Hand';
  lhTrack.channel = 1;
  for (const n of leftNotes) {
    lhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: n.velocity / 127 });
  }

  return Buffer.from(newMidi.toArray());
}

function download(url: string, destPath: string): boolean {
  try {
    execSync(`curl -sL --max-time 15 -o "${destPath}" "${url}"`, { timeout: 20000 });
    const buf = readFileSync(destPath);
    if (buf.length < 50 || buf.slice(0, 4).toString() !== 'MThd') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Downloading and normalizing real MIDI files...\n');
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const src of SOURCES) {
    const destDir = join(PUBLIC_DIR, src.genre);
    const destPath = join(destDir, `${src.id}.mid`);
    mkdirSync(destDir, { recursive: true });

    if (existsSync(destPath) && !src.forceReplace) {
      try {
        const existing = readFileSync(destPath);
        const midi = new Midi(existing);
        const noteTrackCount = midi.tracks.filter(t => t.notes.length > 0).length;
        if (noteTrackCount >= 2 && existing.length > 1000) {
          console.log(`  skip ${src.genre}/${src.id}.mid (already has ${noteTrackCount} tracks, ${existing.length} bytes)`);
          skipped++;
          continue;
        }
      } catch { /* re-download */ }
    }

    const tmpPath = destPath + '.tmp';
    const ok = download(src.url, tmpPath);
    if (!ok) {
      console.log(`  FAIL ${src.genre}/${src.id}.mid (download failed from ${src.url})`);
      try { execSync(`rm -f "${tmpPath}"`); } catch {}
      failed++;
      continue;
    }

    try {
      const rawBuf = readFileSync(tmpPath);
      const normalizedBuf = normalizeToTwoTracks(rawBuf);

      const check = new Midi(normalizedBuf);
      const rh = check.tracks[0]?.notes.length ?? 0;
      const lh = check.tracks[1]?.notes.length ?? 0;

      writeFileSync(destPath, normalizedBuf);
      execSync(`rm -f "${tmpPath}"`);
      console.log(`  ok   ${src.genre}/${src.id}.mid (R:${rh} L:${lh} notes, ${normalizedBuf.length} bytes)`);
      downloaded++;
    } catch (err: any) {
      console.log(`  FAIL ${src.genre}/${src.id}.mid (normalization error: ${err.message})`);
      try { execSync(`rm -f "${tmpPath}"`); } catch {}
      failed++;
    }
  }

  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);
