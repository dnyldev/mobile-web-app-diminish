/**
 * `Library/Add-song.html`'s data: the archive the search view filters, and the
 * two ways a row gets built.
 *
 * Sources, all from the readable template (`Library/_extract/script-01.fmt2.js`):
 *
 *   `rl`  the archive table — id, title, artist, duration, letter, gradient and
 *         the `trending` flag the empty state's chips are cut from
 *   `L`   a chosen local file (5076-5104): the row goes up FIRST and the track
 *         lands 900ms after the bar fills
 *   `VA`  a picked search result (5108-5127)
 *   `Ie`  the five trending entries the chips show (5128)
 *
 * The cover colours come from the SAME `En` gradient table Playlist v6 ships, so
 * they are imported from `./playlistV6` rather than copied a second time. Each
 * archive entry carries its OWN gradient (the template's table does), which is
 * why filtering never repaints the rows: a track keeps the colour it arrived
 * with.
 *
 * The Add music artifact's twelve-seed catalogue and its `vi` filter are gone
 * with the panel they fed (decision: Danial — the search is the Add-song one
 * now). That panel also picked the cover colour by ROW INDEX (`En[T % En.length]`),
 * so its list repainted from the top on every keystroke; this table does not.
 */
import { V6_GRADIENTS } from './playlistV6';
import type { Track } from './tracks';

/**
 * Original `rl[i]` — one entry of the archive.
 *
 * The shape is the template's, not this app's: the row draws `letter` on
 * `gradient`, the filter reads `title`/`artist`, the chips read `trending`, and
 * `duration` is carried straight into the created track by `VA`.
 */
export interface AddSearchSeed {
  /** `id` — the entry's own key. `VA` keys the spinner/✓ sets on THIS, not on the title. */
  id: number;
  title: string;
  artist: string;
  /** `duration` — the label the created row shows, e.g. `"3:42"` */
  duration: string;
  /** `letter` — the cover's letter */
  letter: string;
  /** `gradient` — the cover's colour, the entry's own */
  gradient: string;
  /** `trending` — `Ie = rl.filter(m => m.trending).slice(0, 5)` */
  trending?: true;
}

/** Original `rl` — the twelve tracks the view searches. */
export const ADD_SEARCH_SEEDS: readonly AddSearchSeed[] = [
  { id: 1, title: 'Bi Gharar', artist: 'Shadmehr Aghili', duration: '3:42', letter: 'B', gradient: V6_GRADIENTS[0], trending: true },
  { id: 2, title: 'Taghdir', artist: 'Moein', duration: '4:18', letter: 'T', gradient: V6_GRADIENTS[1], trending: true },
  { id: 3, title: 'Khooneye Arezoo', artist: 'Ebi', duration: '3:05', letter: 'K', gradient: V6_GRADIENTS[2], trending: true },
  { id: 4, title: 'Parvaze Ghooha', artist: 'Mojtaba Daghighy', duration: '5:02', letter: 'P', gradient: V6_GRADIENTS[3] },
  { id: 5, title: 'Neon Veil', artist: 'Lumen Field', duration: '2:57', letter: 'N', gradient: V6_GRADIENTS[4], trending: true },
  { id: 6, title: 'Midnight Society', artist: 'Atlas Club', duration: '3:33', letter: 'M', gradient: V6_GRADIENTS[5] },
  { id: 7, title: 'Sora Bloom', artist: 'Aether', duration: '4:47', letter: 'S', gradient: V6_GRADIENTS[6] },
  { id: 8, title: 'Halcyon Drift', artist: 'Velvet Cove', duration: '3:21', letter: 'H', gradient: V6_GRADIENTS[7] },
  { id: 9, title: 'Obsidian Heart', artist: 'Solaris', duration: '2:48', letter: 'O', gradient: V6_GRADIENTS[8] },
  { id: 10, title: 'Cinder Light', artist: 'Nova Lane', duration: '4:09', letter: 'C', gradient: V6_GRADIENTS[9] },
  { id: 11, title: 'Saffron Dusk', artist: 'Kairo', duration: '3:56', letter: 'S', gradient: V6_GRADIENTS[10] },
  { id: 12, title: 'Crystal Loom', artist: 'Cerulean', duration: '4:33', letter: 'C', gradient: V6_GRADIENTS[11] },
] as const;

/** `Ie` — `rl.filter(m => m.trending).slice(0, 5)`, the empty state's chips. */
export const TRENDING_SEEDS: readonly AddSearchSeed[] = ADD_SEARCH_SEEDS.filter(
  (seed) => seed.trending,
).slice(0, 5);

/**
 * The three artist chips the template prints after the trending titles — its own
 * literal list (`["Ebi","Googoosh","Hayedeh"]`), not a slice of the archive.
 */
export const TRENDING_ARTISTS = ['Ebi', 'Googoosh', 'Hayedeh'] as const;

/**
 * `vi` — the filtered archive, and the ONE function the search view reads.
 *
 * Original (the effect at 5066-5075, whose `setTimeout(…, 600)` the hook owns):
 *
 *   if (a.trim() === "") { l([]); c(false); return }   // blank → no results
 *   c(true)
 *   setTimeout(() => {
 *     let $ = a.toLowerCase()
 *     l(rl.filter(x => x.title.toLowerCase().includes($) || x.artist.toLowerCase().includes($)))
 *     c(false)
 *   }, 600)
 *
 * Two details worth keeping, because they are the template's behaviour and not
 * an oversight: the emptiness test uses the TRIMMED query while the match uses
 * the raw one (so `" bi"` finds nothing), and the list is NOT capped — the Add
 * music panel's "first six / max eight" belonged to that panel.
 */
export function searchArchive(query: string): AddSearchSeed[] {
  if (query.trim() === '') return [];

  const needle = query.toLowerCase();
  return ADD_SEARCH_SEEDS.filter(
    (seed) =>
      seed.title.toLowerCase().includes(needle) || seed.artist.toLowerCase().includes(needle),
  );
}

/** Original: `En[Math.floor(Math.random() * En.length)]` */
function randomGradient(): string {
  return V6_GRADIENTS[Math.floor(Math.random() * V6_GRADIENTS.length)];
}

/**
 * Original: `` `${Math.floor(Math.random() * 3 + 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` ``
 * — a random 3:00–5:59 label, independent of the track's real length.
 */
function randomDurationLabel(): string {
  return `${Math.floor(Math.random() * 3 + 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
}

/**
 * `mm:ss` → seconds.
 *
 * Not in the template: its tracks carry only the label. This app's `Track` also
 * carries `seconds`, so the two are derived from one another here rather than
 * set independently — a row can never show a label that disagrees with its own
 * length.
 */
function durationSeconds(label: string): number {
  const [minutes, seconds] = label.split(':').map(Number);
  return minutes * 60 + seconds;
}

/**
 * A chosen local file, as the row that is still uploading.
 *
 * Original `L(G)` — lines 5076-5104: the row is built FIRST and the file's entry
 * is committed 900ms after the bar fills, so what the list shows during that
 * time is this, not a `Track`. Its `id` is a string on purpose: `upload-…` can
 * never collide with a catalogue row's number.
 *
 *   title  = file.name.replace(/\.[^/.]+$/, "") — the extension comes off
 *   letter = file.name[0]?.toUpperCase() || "U"  — off the FILE NAME
 *   artist = "Uploading from device"             — the artifact's own line, and
 *                                                  the row reads it from
 *                                                  `ADD_SONG_COPY.uploadingLabel`
 */
export interface PendingUpload {
  id: string;
  title: string;
  letter: string;
  gradient: string;
  /** 0–100, the artifact's `progress` */
  progress: number;
  /** `"uploading"` while the interval runs; `"processing"` once the bar is full */
  status: 'uploading' | 'processing';
}

/** Original: `` { id:`upload-${Date.now()}`, title: $.length>22 ? $.slice(0,22) : $, progress:0, status:"uploading", … } `` */
export function buildPendingUpload(fileName: string): PendingUpload {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
  const title = withoutExtension.length > 22 ? withoutExtension.slice(0, 22) : withoutExtension;

  return {
    id: `upload-${Date.now()}`,
    title,
    letter: withoutExtension[0]?.toUpperCase() || 'U',
    gradient: randomGradient(),
    progress: 0,
    status: 'uploading',
  };
}

/**
 * The upload's last step: the pending row becomes a real track.
 *
 * Original (the `setTimeout(…, 900)` at 5090-5100): the committed record gets a
 * fresh id, `artist: "Unknown Artist"`, a random duration label, and the letter
 * and gradient CARRIED OVER from the pending row — so the cover does not change
 * colour at the moment the row stops being an upload.
 *
 * Two adaptations, both mechanical: the original's `id` is a string and this
 * app's is a number, and `seconds` is derived from the label it just rolled.
 */
export function commitPendingUpload(pending: PendingUpload): Track {
  const duration = randomDurationLabel();

  return {
    id: Date.now(),
    title: pending.title,
    artist: 'Unknown Artist',
    seconds: durationSeconds(duration),
    duration,
    letter: pending.letter,
    gradient: pending.gradient,
  };
}

/**
 * A picked search result, as a row. Original `VA` (5108-5127):
 *
 *   id       = Date.now().toString() + m.id   — the entry's own id appended, so
 *              two picks can never collide. This app's `Track.id` is a number, so
 *              it ADDS the entry's 1-12 index instead of concatenating it: the
 *              same guarantee, one type.
 *   artist   = m.artist    — the entry's artist, verbatim (no suffix is added)
 *   duration = m.duration  — the entry's own label
 *   letter   = m.letter    — taken from the entry, not re-derived from the title
 *   gradient = m.gradient  — the entry's own cover colour
 */
export function buildSearchTrack(seed: AddSearchSeed): Track {
  return {
    id: Date.now() + seed.id,
    title: seed.title,
    artist: seed.artist,
    seconds: durationSeconds(seed.duration),
    duration: seed.duration,
    letter: seed.letter,
    gradient: seed.gradient,
  };
}
