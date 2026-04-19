import { execSync } from 'child_process';

const MUTOPIA = 'https://www.mutopiaproject.org/ftp';

interface SongPath {
  id: string;
  genre: string;
  path: string; // path without extension, e.g., 'BachJS/BWV772/bach-invention-01/bach-invention-01'
  midZip?: string; // if MIDI is in a zip, path to the zip (without .zip extension)
  lyDir?: boolean; // if true, LY is in a -lys/ directory, not individual .ly file
}

const ALL_SONGS: SongPath[] = [
  // ========== BEGINNER (24 new pieces) ==========
  // Schumann Album for the Young Op.68
  { id: 'schumann-melodie-op68-1', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-01-melodie/schumann-op68-01-melodie' },
  { id: 'schumann-march-op68-2', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-02-marche-militaire/schumann-op68-02-marche-militaire' },
  { id: 'schumann-humming-op68-3', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-03-chanson-fredonnee/schumann-op68-03-chanson-fredonnee' },
  { id: 'schumann-choral-op68-4', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-04-choral/schumann-op68-04-choral' },
  { id: 'schumann-petite-op68-5', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-05-petite-piece/schumann-op68-05-petite-piece' },
  { id: 'schumann-orphan-op68-6', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-06-pauvre-orpheline/schumann-op68-06-pauvre-orpheline' },
  // Czerny 160 Eight-Measure Exercises Op.821
  { id: 'czerny-op821-no1', genre: 'beginner', path: 'CzernyC/Op_821/Czerny_Op_821_No_001/Czerny_Op_821_No_001' },
  { id: 'czerny-op821-no2', genre: 'beginner', path: 'CzernyC/Op_821/Czerny_Op_821_No_002/Czerny_Op_821_No_002' },
  { id: 'czerny-op821-no3', genre: 'beginner', path: 'CzernyC/Op_821/Czerny_Op_821_No_003/Czerny_Op_821_No_003' },
  // Bach Applicatio
  { id: 'bach-applicatio-bwv994', genre: 'beginner', path: 'BachJS/BWV994/bach-applicatio/bach-applicatio' },
  // Bach Anna Magdalena Notebook
  { id: 'bach-menuet-g-anh114', genre: 'beginner', path: 'BachJS/BWVAnh114/anna-magdalena-04/anna-magdalena-04' },
  { id: 'bach-menuet-gm-anh115', genre: 'beginner', path: 'BachJS/BWVAnh115/anna-magdalena-05/anna-magdalena-05' },
  { id: 'bach-menuet-anh116', genre: 'beginner', path: 'BachJS/BWVAnh116/anna-magdalena-07/anna-magdalena-07' },
  { id: 'bach-polonaise-f-anh117a', genre: 'beginner', path: 'BachJS/BWV117a/BWV-117a/BWV-117a' },
  { id: 'bach-minuet-bb-anh118', genre: 'beginner', path: 'BachJS/BWVAnh118/BWV-118/BWV-118' },
  { id: 'bach-polonaise-gm-anh119', genre: 'beginner', path: 'BachJS/BWVAnh119/BWV-119/BWV-119' },
  { id: 'bach-minuet-am-anh120', genre: 'beginner', path: 'BachJS/BWVAnh120/BWV-120/BWV-120' },
  { id: 'bach-musette-anh126', genre: 'beginner', path: 'BachJS/BWVAnh126/anna-magdalena-22/anna-magdalena-22' },
  { id: 'bach-march-eb-anh127', genre: 'beginner', path: 'BachJS/BWVAnh127/BWV-127/BWV-127' },
  // Burgmuller Op.100
  { id: 'burgmuller-candeur-op100-1', genre: 'beginner', path: 'BurgmullerJFF/O100/25EF-01/25EF-01' },
  { id: 'burgmuller-pastorale-op100-3', genre: 'beginner', path: 'BurgmullerJFF/O100/25EF-03/25EF-03' },
  // Schumann Le gai laboureur
  { id: 'schumann-laboureur-op68-10', genre: 'beginner', path: 'SchumannR/O68/schumann-op68-10-gai-laboureur/schumann-op68-10-gai-laboureur' },
  // Clementi Sonatina
  { id: 'clementi-sonatina-op36-1', genre: 'beginner', path: 'ClementiM/O36/sonatina-1/sonatina-1', midZip: 'ClementiM/O36/sonatina-1/sonatina-1-mids' },
  // Kuhlau Sonatina (1st mvt - Allegro)
  { id: 'kuhlau-sonatina-op20-1', genre: 'beginner', path: 'KuhlauF/O20/sonatine-1-allegro/sonatine-1-allegro' },

  // ========== BAROQUE (4 existing) ==========
  { id: 'bach-invention-1', genre: 'baroque', path: 'BachJS/BWV772/bach-invention-01/bach-invention-01' },
  { id: 'bach-invention-8', genre: 'baroque', path: 'BachJS/BWV779/bach-invention-08/bach-invention-08' },
  { id: 'bach-invention-13', genre: 'baroque', path: 'BachJS/BWV784/bach-invention-13/bach-invention-13' },
  { id: 'prelude-in-c', genre: 'baroque', path: 'BachJS/BWV846/wtk1-prelude1/wtk1-prelude1' },

  // ========== CLASSICAL (6 existing) ==========
  { id: 'fur-elise', genre: 'classical', path: 'BeethovenLv/WoO59/fur_Elise_WoO59/fur_Elise_WoO59' },
  { id: 'mozart-k545-1', genre: 'classical', path: 'MozartWA/KV545/K545-1/K545-1' },
  { id: 'beethoven-pathetique-2', genre: 'classical', path: 'BeethovenLv/O13/pathetique-2/pathetique-2' },
  // Moonlight Sonata mvt1: MIDI in zip, LY in lys/ directory
  { id: 'moonlight-sonata', genre: 'classical', path: 'BeethovenLv/O27/moonlight/moonlight', midZip: 'BeethovenLv/O27/moonlight/moonlight-mids', lyDir: true },
  { id: 'mozart-alla-turca', genre: 'classical', path: 'MozartWA/KV331/KV331_3_RondoAllaTurca/KV331_3_RondoAllaTurca', lyDir: true },
  { id: 'mozart-fantasy-d-minor', genre: 'classical', path: 'MozartWA/KV397/Fantasia/Fantasia' },

  // ========== ROMANTIC (existing kept + new replacements) ==========
  { id: 'burgmuller-arabesque', genre: 'romantic', path: 'BurgmullerJFF/O100/25EF-02/25EF-02' },
  { id: 'schumann-traumerei', genre: 'romantic', path: 'SchumannR/O15/SchumannOp15No07/SchumannOp15No07' },
  { id: 'liszt-consolation-3', genre: 'romantic', path: 'LisztF/S.172/liszt-consolation-no3/liszt-consolation-no3' },
  { id: 'rachmaninoff-prelude-g-minor', genre: 'romantic', path: 'RachmaninoffS/O23/rach-prelude23-05/rach-prelude23-05' },
  { id: 'chopin-waltz-minute', genre: 'romantic', path: 'ChopinFF/O64/chopin_valse_op64_no1/chopin_valse_op64_no1', lyDir: true },
  { id: 'mendelssohn-song-spring', genre: 'romantic', path: 'Mendelssohn-BartholdyF/O53/SongWW_opus53no5/SongWW_opus53no5' },
  { id: 'chopin-prelude-e-minor', genre: 'romantic', path: 'ChopinFF/O28/Chop-28-4/Chop-28-4' },
  { id: 'chopin-nocturne-op9-2', genre: 'romantic', path: 'ChopinFF/O9/chopin_nocturne_op9_n2/chopin_nocturne_op9_n2' },
  { id: 'chopin-prelude-raindrop', genre: 'romantic', path: 'ChopinFF/O28/Chop-28-15/Chop-28-15', lyDir: true },
  { id: 'brahms-intermezzo-op118-2', genre: 'romantic', path: 'BrahmsJ/O118/intermezzo/intermezzo' },
  { id: 'schubert-impromptu-op90-3', genre: 'romantic', path: 'SchubertF/D899/SchubertF-D899-3-Impromptu/SchubertF-D899-3-Impromptu' },
  { id: 'schubert-impromptu-op90-2', genre: 'romantic', path: 'SchubertF/D899/SchubertF-D899-2-Impromptu/SchubertF-D899-2-Impromptu' },
  { id: 'rachmaninoff-prelude-csharp', genre: 'romantic', path: 'RachmaninoffS/O3/rach-prelude-op3-no2/rach-prelude-op3-no2' },
  { id: 'chopin-ballade-1', genre: 'romantic', path: 'ChopinFF/O23/chopin-op23-ballade-1/chopin-op23-ballade-1', lyDir: true },
  { id: 'chopin-etude-op10-12', genre: 'romantic', path: 'ChopinFF/O10/op-10-12-wfi/op-10-12-wfi' },
  // New romantic replacements
  { id: 'chopin-nocturne-op9-1', genre: 'romantic', path: 'ChopinFF/O9/nocturne_in_b-flat_minor/nocturne_in_b-flat_minor' },
  { id: 'chopin-nocturne-op72-1', genre: 'romantic', path: 'ChopinFF/O72/nocturne_in_e_minor/nocturne_in_e_minor' },
  { id: 'chopin-etude-op10-5', genre: 'romantic', path: 'ChopinFF/O10/chp-10-05/chp-10-05', lyDir: true },
  { id: 'chopin-etude-op25-1', genre: 'romantic', path: 'ChopinFF/O25/chopin-op-25-01/chopin-op-25-01' },
  { id: 'chopin-waltz-op69-2', genre: 'romantic', path: 'ChopinFF/O69/w10-h-moll-cfi/w10-h-moll-cfi' },
  { id: 'chopin-mazurka-op6-1', genre: 'romantic', path: 'ChopinFF/O6/Mazurka-Op6-No1/Mazurka-Op6-No1' },
  { id: 'liszt-consolation-1', genre: 'romantic', path: 'LisztF/S.172/liszt-consolation-no1/liszt-consolation-no1' },

  // ========== IMPRESSIONIST (existing + replacements) ==========
  { id: 'satie-gnossienne-1', genre: 'impressionist', path: 'SatieE/Gnossienne/no_1/no_1' },
  { id: 'satie-gnossienne-2', genre: 'impressionist', path: 'SatieE/Gnossienne/no_2/no_2' },
  { id: 'satie-gnossienne-3', genre: 'impressionist', path: 'SatieE/Gnossienne/no_3/no_3' },
  { id: 'debussy-clair-de-lune', genre: 'impressionist', path: 'DebussyC/L75/debussy_Ste_Bergamesq_Clair/debussy_Ste_Bergamesq_Clair' },
  { id: 'debussy-arabesque-1', genre: 'impressionist', path: 'DebussyC/L66/debussy_Arabesque_1/debussy_Arabesque_1' },
  { id: 'gymnopedie-no1', genre: 'impressionist', path: 'SatieE/gymnopedie_1/gymnopedie_1' },
  { id: 'satie-gymnopedie-2', genre: 'impressionist', path: 'SatieE/gymnopedie_2/gymnopedie_2' },
  // Replacement for debussy-girl-flaxen-hair (Prelude No.8 not individually on Mutopia)
  { id: 'debussy-prelude-l117-4', genre: 'impressionist', path: 'DebussyC/L117/L117-prel-4/L117-prel-4', lyDir: true },
  { id: 'debussy-arabesque-2', genre: 'impressionist', path: 'DebussyC/L66/debussy_Arabesque_2/debussy_Arabesque_2' },
  { id: 'satie-gymnopedie-3', genre: 'impressionist', path: 'SatieE/gymnopedie_3/gymnopedie_3' },

  // ========== JAZZ (existing + new) ==========
  { id: 'joplin-entertainer', genre: 'jazz', path: 'JoplinS/entertainer/entertainer' },
  // Replacement for joplin-easy-winners (not on Mutopia)
  { id: 'joplin-bethena', genre: 'jazz', path: 'JoplinS/bethena/bethena', lyDir: true },
  { id: 'joplin-maple-leaf', genre: 'jazz', path: 'JoplinS/maple/maple' },
  { id: 'joplin-solace', genre: 'jazz', path: 'JoplinS/solace/solace', lyDir: true },

  // ========== ADVANCED (kept + replacements) ==========
  { id: 'chopin-fantaisie-impromptu', genre: 'advanced', path: 'ChopinFF/O66/chopin_fantaisie-impromptu/chopin_fantaisie-impromptu' },
  // Moonlight mvt3: same zip as mvt1
  { id: 'beethoven-moonlight-3', genre: 'advanced', path: 'BeethovenLv/O27/moonlight/moonlight', midZip: 'BeethovenLv/O27/moonlight/moonlight-mids', lyDir: true },
  // Replacements
  { id: 'beethoven-appassionata-3', genre: 'advanced', path: 'BeethovenLv/O57/LVB_Sonate_57_3/LVB_Sonate_57_3', lyDir: true },
  { id: 'beethoven-tempest-1', genre: 'advanced', path: 'BeethovenLv/O31/LVB_Sonate_31no2_1/LVB_Sonate_31no2_1' },
  { id: 'chopin-sonata-op35-4', genre: 'advanced', path: 'ChopinFF/O35/chp-op-35-4-scholz-fi/chp-op-35-4-scholz-fi', lyDir: true },
  { id: 'liszt-ballade-2', genre: 'advanced', path: 'LisztF/ballade/ballade' },
  { id: 'scriabin-etude-op2-1', genre: 'advanced', path: 'ScriabinA/O2/scriabin_etude_2_1/scriabin_etude_2_1' },
  { id: 'chopin-etude-op10-1', genre: 'advanced', path: 'ChopinFF/O10/chp-10-01/chp-10-01', lyDir: true },
  { id: 'bach-italian-concerto', genre: 'advanced', path: 'BachJS/BWV971/piano/piano', midZip: 'BachJS/BWV971/piano/piano-mids', lyDir: true },
  // Replacement for mussorgsky-pictures (not on Mutopia)
  { id: 'chopin-etude-op10-9', genre: 'advanced', path: 'ChopinFF/O10/chopin-op-10-09-wfi/chopin-op-10-09-wfi' },

  // ========== JOURNEY (25 songs) ==========
  // Chapter 1 (shared paths with beginner except bach-applicatio)
  { id: 'j-schumann-melody-op68-1', genre: 'journey', path: 'SchumannR/O68/schumann-op68-01-melodie/schumann-op68-01-melodie' },
  { id: 'j-schumann-march-op68-2', genre: 'journey', path: 'SchumannR/O68/schumann-op68-02-marche-militaire/schumann-op68-02-marche-militaire' },
  { id: 'j-schumann-humming-op68-3', genre: 'journey', path: 'SchumannR/O68/schumann-op68-03-chanson-fredonnee/schumann-op68-03-chanson-fredonnee' },
  { id: 'j-bach-applicatio-bwv994', genre: 'journey', path: 'BachJS/BWV994/bach-applicatio/bach-applicatio' },
  // Chapter 2
  { id: 'j-schumann-wild-rider-op68-8', genre: 'journey', path: 'SchumannR/O68/schumann-op68-08-cavalier-sauvage/schumann-op68-08-cavalier-sauvage' },
  { id: 'j-schumann-happy-farmer-op68-10', genre: 'journey', path: 'SchumannR/O68/schumann-op68-10-gai-laboureur/schumann-op68-10-gai-laboureur' },
  { id: 'j-burgmuller-candeur-op100-1', genre: 'journey', path: 'BurgmullerJFF/O100/25EF-01/25EF-01' },
  { id: 'j-handel-sonatina-hwv585', genre: 'journey', path: 'HandelGF/HWV585/sonatina-in-b-flat-major/sonatina-in-b-flat-major' },
  // Chapter 3
  { id: 'j-bach-menuet-g-anh114', genre: 'journey', path: 'BachJS/BWVAnh114/anna-magdalena-04/anna-magdalena-04' },
  { id: 'j-bach-menuet-gm-anh115', genre: 'journey', path: 'BachJS/BWVAnh115/anna-magdalena-05/anna-magdalena-05' },
  { id: 'j-bach-musette-anh126', genre: 'journey', path: 'BachJS/BWVAnh126/anna-magdalena-22/anna-magdalena-22' },
  { id: 'j-bach-polonaise-gm-anh119', genre: 'journey', path: 'BachJS/BWVAnh119/BWV-119/BWV-119' },
  // Chapter 4
  { id: 'j-mozart-menuet-g-k2', genre: 'journey', path: 'MozartWA/KV2/menuet_k2/menuet_k2' },
  { id: 'j-clementi-sonatina-op36-1', genre: 'journey', path: 'ClementiM/O36/sonatina-1/sonatina-1', midZip: 'ClementiM/O36/sonatina-1/sonatina-1-mids' },
  { id: 'j-kuhlau-sonatina-op20-1', genre: 'journey', path: 'KuhlauF/O20/sonatine-1-allegro/sonatine-1-allegro' },
  { id: 'j-beethoven-sonata-op49-2-mvt2', genre: 'journey', path: 'BeethovenLv/O49/LVB_Sonate_49no2_2/LVB_Sonate_49no2_2' },
  // Chapter 5 (shared paths)
  { id: 'j-burgmuller-arabesque-op100-2', genre: 'journey', path: 'BurgmullerJFF/O100/25EF-02/25EF-02' },
  { id: 'j-schumann-traumerei-op15-7', genre: 'journey', path: 'SchumannR/O15/SchumannOp15No07/SchumannOp15No07' },
  { id: 'j-satie-gymnopedie-1', genre: 'journey', path: 'SatieE/gymnopedie_1/gymnopedie_1' },
  { id: 'j-bach-invention-1-bwv772', genre: 'journey', path: 'BachJS/BWV772/bach-invention-01/bach-invention-01' },
  // Chapter 6 (shared paths)
  { id: 'j-bach-prelude-c-bwv846', genre: 'journey', path: 'BachJS/BWV846/wtk1-prelude1/wtk1-prelude1' },
  { id: 'j-chopin-prelude-op28-4', genre: 'journey', path: 'ChopinFF/O28/Chop-28-4/Chop-28-4' },
  { id: 'j-beethoven-fur-elise', genre: 'journey', path: 'BeethovenLv/WoO59/fur_Elise_WoO59/fur_Elise_WoO59' },
  { id: 'j-satie-gnossienne-1', genre: 'journey', path: 'SatieE/Gnossienne/no_1/no_1' },
  { id: 'j-beethoven-moonlight-mvt1', genre: 'journey', path: 'BeethovenLv/O27/moonlight/moonlight', midZip: 'BeethovenLv/O27/moonlight/moonlight-mids', lyDir: true },
];

async function checkUrl(url: string): Promise<{ status: number; ok: boolean }> {
  try {
    const result = execSync(
      `curl -sL -o /dev/null -w "%{http_code}" --max-time 10 "${url}"`,
      { timeout: 15000 }
    ).toString().trim();
    const status = parseInt(result, 10);
    return { status, ok: status === 200 };
  } catch {
    return { status: 0, ok: false };
  }
}

async function listDirectory(url: string): Promise<string[]> {
  try {
    const html = execSync(
      `curl -sL --max-time 10 "${url}"`,
      { timeout: 15000 }
    ).toString();
    const links = [...html.matchAll(/href="([^"]+)"/g)]
      .map(m => m[1])
      .filter(l => !l.startsWith('?') && !l.startsWith('/') && !l.startsWith('http'));
    return links;
  } catch {
    return [];
  }
}

function getUniquePaths(): SongPath[] {
  const seen = new Set<string>();
  const unique: SongPath[] = [];
  for (const song of ALL_SONGS) {
    if (!seen.has(song.path)) {
      seen.add(song.path);
      unique.push(song);
    }
  }
  return unique;
}

async function main() {
  const uniqueSongs = getUniquePaths();
  console.log(`Verifying ${uniqueSongs.length} unique Mutopia paths (${ALL_SONGS.length} total songs)...\n`);

  let okCount = 0;
  let partialCount = 0;
  let failCount = 0;

  for (const song of uniqueSongs) {
    // Check MIDI
    let midOk = false;
    if (song.midZip) {
      const zipResult = await checkUrl(`${MUTOPIA}/${song.midZip}.zip`);
      midOk = zipResult.ok;
    } else {
      const midResult = await checkUrl(`${MUTOPIA}/${song.path}.mid`);
      midOk = midResult.ok;
    }

    // Check LY
    let lyOk = false;
    if (song.lyDir) {
      // Check for -lys/ directory existence
      const pathParts = song.path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const dirPath = pathParts.slice(0, -1).join('/');
      const lysDirUrl = `${MUTOPIA}/${dirPath}/${fileName}-lys/`;
      const entries = await listDirectory(lysDirUrl);
      lyOk = entries.some(e => e.endsWith('.ly'));
    } else {
      const lyResult = await checkUrl(`${MUTOPIA}/${song.path}.ly`);
      lyOk = lyResult.ok;
    }

    if (midOk && lyOk) {
      const extra = song.midZip ? ' [zip-mid]' : '';
      const extra2 = song.lyDir ? ' [dir-ly]' : '';
      console.log(`  OK   ${song.id}${extra}${extra2}`);
      okCount++;
    } else if (midOk || lyOk) {
      console.log(`  PART ${song.id} -> mid:${midOk ? 'OK' : 'FAIL'} ly:${lyOk ? 'OK' : 'FAIL'}`);
      partialCount++;

      if (!lyOk) {
        // Try checking for -lys/ directory as fallback
        const pathParts = song.path.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const dirPath = pathParts.slice(0, -1).join('/');
        const lysDirUrl = `${MUTOPIA}/${dirPath}/${fileName}-lys/`;
        const entries = await listDirectory(lysDirUrl);
        const lyFiles = entries.filter(e => e.endsWith('.ly'));
        if (lyFiles.length > 0) {
          console.log(`         -> LY found in -lys/ dir: [${lyFiles.join(', ')}]`);
        }
      }
    } else {
      console.log(`  FAIL ${song.id} -> mid:FAIL ly:FAIL`);
      failCount++;

      // Try to discover correct path
      const pathParts = song.path.split('/');
      if (pathParts.length >= 3) {
        const parentPath = pathParts.slice(0, -1).join('/');
        const parentUrl = `${MUTOPIA}/${parentPath}/`;
        const entries = await listDirectory(parentUrl);
        if (entries.length > 0) {
          const midFiles = entries.filter(e => e.endsWith('.mid'));
          const lyFiles = entries.filter(e => e.endsWith('.ly'));
          if (midFiles.length > 0 || lyFiles.length > 0) {
            console.log(`         -> Found in parent: mid=[${midFiles.join(',')}] ly=[${lyFiles.join(',')}]`);
          } else {
            const grandparentPath = pathParts.slice(0, -2).join('/');
            const grandparentUrl = `${MUTOPIA}/${grandparentPath}/`;
            const subdirs = await listDirectory(grandparentUrl);
            if (subdirs.length > 0) {
              const dirNames = subdirs.filter(s => s.endsWith('/')).map(s => s.replace('/', '')).slice(0, 15);
              console.log(`         -> Subdirs in ${grandparentPath}: [${dirNames.join(', ')}]`);
            }
          }
        }
      }
    }
  }

  console.log(`\n========== SUMMARY ==========`);
  console.log(`OK: ${okCount}/${uniqueSongs.length}`);
  console.log(`PARTIAL: ${partialCount} (mid or ly only)`);
  console.log(`FAIL: ${failCount} (both missing)`);

  if (okCount === uniqueSongs.length) {
    console.log(`\nAll paths verified! Ready to download.`);
  }
}

main().catch(console.error);
