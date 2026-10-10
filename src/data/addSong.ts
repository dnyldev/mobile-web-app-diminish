/**
 * `Library/Add-song.html`'s data: the archive the search view filters, and the
 * two ways a row gets built.
 *
 * Sources, all from the readable template (`Library/_extract/script-01.fmt2.js`):
 *
 *   `rl`  the archive table — id, title, artist, duration, letter, gradient
 *   `L`   a chosen local file (5076-5104): the row goes up FIRST and the track
 *         lands 900ms after the bar fills
 *   `VA`  a picked search result (5108-5127)
 *
 * The template's `trending` flag and its `Ie = rl.filter(m => m.trending).slice(0, 5)`
 * (5128) are NOT here: they fed the empty state's `TRENDING NOW` chips, and that
 * whole block is not ported (decision: Danial).
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
 *
 * ## The cable
 *
 * `searchArchive` used to filter a twelve-row table and nothing else. It now
 * asks the archive — the backend's Melobit search (`src/api/melobit.ts`) — when
 * a backend is configured, and falls back to that same twelve-row table when one
 * is not. So the table below is no longer "the archive": it is the OFFLINE
 * archive, the demo the app shows when the cable is out.
 *
 * What does NOT change when the cable goes in: the seed's shape. A Melobit row
 * arrives as `ArchiveTrack` and is mapped to the very same `AddSearchSeed` the
 * table produces — its own `m:ss` label, its own cover letter, a cover colour
 * from the app's own `V6_GRADIENTS`. The search view cannot tell the two apart,
 * and that is the point. The one field only a provider row can fill is
 * `coverUrl`: Melobit's artwork, painted over the monogram, `null` on every demo
 * row (see `components/Cover`).
 */
import { ADD_SONG_METRICS } from '@/design/addSong';
import { isApiConnected } from '@/api/client';
import { addArchiveTrack, fetchArchive, type ArchiveTrack } from '@/api/melobit';
import { V6_GRADIENTS } from './playlistV6';
import { formatDuration, type Track } from './tracks';

/**
 * One row of the search view.
 *
 * The shape is the template's, not this app's: the row draws `letter` on
 * `gradient`, the filter reads `title`/`artist`, and `duration` is carried
 * straight into the created track by `VA`.
 *
 * Two fields are this app's own, and both exist because the archive is now a
 * real service rather than a fixed table:
 *
 *   `inLibrary`  whether the user already has the track. The backend computes
 *                it per result, so a row can arrive already ticked.
 *   `source`     the provider row this seed was built from, handed back verbatim
 *                when the row is picked. `null` in demo mode, where there is
 *                nothing to hand back to. Deliberately opaque: naming Melobit's
 *                fields here would put the third-party shape one import away
 *                from the UI, which is exactly what `src/api/` exists to stop.
 */
export interface AddSearchSeed {
  /** `id` — the entry's own key. `VA` keys the spinner/✓ sets on THIS, not on the title. */
  id: string;
  title: string;
  artist: string;
  /** `duration` — the label the created row shows, e.g. `"3:42"` */
  duration: string;
  /** `letter` — the cover's letter */
  letter: string;
  /** `gradient` — the cover's colour, the entry's own */
  gradient: string;
  /**
   * The entry's real artwork, or `null`.
   *
   * Only a provider row has one; the twelve offline rows are gradient-only. The
   * cover's top layer either way — it is drawn over `letter`/`gradient`, never
   * instead of them, so an unreachable image costs the row nothing.
   */
  coverUrl: string | null;
  /** Whether the user already has this track — the backend's own answer per result. */
  inLibrary: boolean;
  /** The provider row behind this seed, or `null` when it is a demo row. */
  source: ArchiveTrack | null;
}

/**
 * `rl` — the OFFLINE archive: the twelve rows the view searches when no backend
 * is configured. With the cable in, the archive is Melobit and this table is
 * only ever reached by demo mode.
 *
 * A demo row has no artwork to name, so `coverUrl` is injected here rather than
 * repeated on all twelve entries — every other field still comes from the row.
 */
function demoSeed(
  id: number,
  row: Omit<AddSearchSeed, 'id' | 'inLibrary' | 'source' | 'coverUrl'>,
): AddSearchSeed {
  // A demo row is never owned, and there is no provider row behind it to hand back.
  return { ...row, coverUrl: null, id: `demo-${id}`, inLibrary: false, source: null };
}

export const ADD_SEARCH_SEEDS: readonly AddSearchSeed[] = [
  demoSeed(1, { title: 'Bi Gharar', artist: 'Shadmehr Aghili', duration: '3:42', letter: 'B', gradient: V6_GRADIENTS[0] }),
  demoSeed(2, { title: 'Taghdir', artist: 'Moein', duration: '4:18', letter: 'T', gradient: V6_GRADIENTS[1] }),
  demoSeed(3, { title: 'Khooneye Arezoo', artist: 'Ebi', duration: '3:05', letter: 'K', gradient: V6_GRADIENTS[2] }),
  demoSeed(4, { title: 'Parvaze Ghooha', artist: 'Mojtaba Daghighy', duration: '5:02', letter: 'P', gradient: V6_GRADIENTS[3] }),
  demoSeed(5, { title: 'Neon Veil', artist: 'Lumen Field', duration: '2:57', letter: 'N', gradient: V6_GRADIENTS[4] }),
  demoSeed(6, { title: 'Midnight Society', artist: 'Atlas Club', duration: '3:33', letter: 'M', gradient: V6_GRADIENTS[5] }),
  demoSeed(7, { title: 'Sora Bloom', artist: 'Aether', duration: '4:47', letter: 'S', gradient: V6_GRADIENTS[6] }),
  demoSeed(8, { title: 'Halcyon Drift', artist: 'Velvet Cove', duration: '3:21', letter: 'H', gradient: V6_GRADIENTS[7] }),
  demoSeed(9, { title: 'Obsidian Heart', artist: 'Solaris', duration: '2:48', letter: 'O', gradient: V6_GRADIENTS[8] }),
  demoSeed(10, { title: 'Cinder Light', artist: 'Nova Lane', duration: '4:09', letter: 'C', gradient: V6_GRADIENTS[9] }),
  demoSeed(11, { title: 'Saffron Dusk', artist: 'Kairo', duration: '3:56', letter: 'S', gradient: V6_GRADIENTS[10] }),
  demoSeed(12, { title: 'Crystal Loom', artist: 'Cerulean', duration: '4:33', letter: 'C', gradient: V6_GRADIENTS[11] }),
];

/** The offline filter — byte-for-byte the template's own, `vi`. */
function searchDemoArchive(query: string): AddSearchSeed[] {
  if (query.trim() === '') return [];

  const needle = query.toLowerCase();
  return ADD_SEARCH_SEEDS.filter(
    (seed) =>
      seed.title.toLowerCase().includes(needle) || seed.artist.toLowerCase().includes(needle),
  );
}

/**
 * The cover colour for an archive row, derived from its id.
 *
 * Melobit sends `coverUrl` too, and that artwork is now drawn — but as the
 * cover's TOP layer, over this colour. So the colour is still derived here: it
 * is what the row shows while the image travels, if it never arrives, and if
 * the backend ever answers without one. Same table the library cable uses, but
 * hashed from a STRING id, so a given track keeps one colour across reloads and
 * two rows with similar titles cannot collide on an index.
 */
function gradientForArchiveId(id: string): string {
  let hash = 5381;
  for (let index = 0; index < id.length; index += 1) {
    hash = ((hash << 5) + hash + id.charCodeAt(index)) >>> 0;
  }
  return V6_GRADIENTS[hash % V6_GRADIENTS.length];
}

/**
 * A Melobit row as the search view's own row.
 *
 * The mirror of `tracks.ts`'s `toTrackFromSong`, and the same rules: the API's
 * seconds become the app's `m:ss`, its title decides the cover letter, and the
 * cover colour comes from the app's own table. The provider row rides along in
 * `source` so picking the row can hand it straight back.
 */
export function toSearchSeed(track: ArchiveTrack): AddSearchSeed {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: formatDuration(track.duration),
    letter: coverLetterFor(track.title),
    gradient: gradientForArchiveId(track.id),
    coverUrl: track.coverUrl || null,
    inLibrary: track.inLibrary,
    source: track,
  };
}

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
 *
 * Now async, and that is the only change to its contract: with a backend
 * configured it asks Melobit through it, and without one it runs the original
 * filter synchronously under a resolved promise. It does NOT swallow a failed
 * search — a service that is down is not an empty result, and the view has a
 * state for it.
 */
export async function searchArchive(
  query: string,
  signal?: AbortSignal,
): Promise<AddSearchSeed[]> {
  if (query.trim() === '') return [];

  if (!isApiConnected()) return searchDemoArchive(query);

  const tracks = await fetchArchive(query, signal);
  return tracks.map(toSearchSeed);
}

/**
 * The cover letter, matching `tracks.ts`'s own rule: the first character of the
 * title, uppercased, `'A'` when there is nothing to take.
 */
function coverLetterFor(title: string): string {
  return title.trim()[0]?.toUpperCase() || 'A';
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
 *
 * No artwork: the file came off the device and nothing read its tags, so the
 * committed row keeps the monogram its upload row already showed.
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
    coverUrl: null,
  };
}

/**
 * A picked search result, as a library row. Original `VA` (5108-5127):
 *
 *   id       = Date.now().toString() + m.id   — the entry's own id appended, so
 *              two picks can never collide.
 *   artist   = m.artist    — the entry's artist, verbatim (no suffix is added)
 *   duration = m.duration  — the entry's own label
 *   letter   = m.letter    — taken from the entry, not re-derived from the title
 *   gradient = m.gradient  — the entry's own cover colour
 *   coverUrl = m.coverUrl  — the entry's own artwork, so the row shows the real
 *                            cover the instant it lands, without waiting for the
 *                            library to re-fetch the record it just created.
 *
 * `id` is now a PARAMETER rather than something derived here, and that is the
 * consequence of the cable: with a backend the id is the created song's own
 * database id, so the row that lands in the list is the same record the library
 * would return — not a look-alike optimistically invented on the client. The
 * demo path passes `Date.now()`, which is all it ever had.
 */
export function buildSearchTrack(seed: AddSearchSeed, id: number): Track {
  return {
    id,
    title: seed.title,
    artist: seed.artist,
    seconds: durationSeconds(seed.duration),
    duration: seed.duration,
    letter: seed.letter,
    gradient: seed.gradient,
    coverUrl: seed.coverUrl,
  };
}

/**
 * Add a picked row to the library.
 *
 * With a backend: the real `POST /api/melobit/add`, which downloads the whole
 * file server-side before it answers and resolves with the created song's id.
 * It is slow by nature and can genuinely fail, so it REJECTS with the backend's
 * own error and leaves it to the caller to show — a failed add is not an added
 * track.
 *
 * Without one: the demo, holding the artifact's own 900ms so the spinner the
 * view draws is still the spinner it drew before. Nothing is uploaded and the
 * id is synthetic, which is exactly what demo mode means.
 */
export async function addSeedToLibrary(seed: AddSearchSeed): Promise<number> {
  if (!seed.source) {
    await new Promise((resolve) => setTimeout(resolve, ADD_SONG_METRICS.searchAddMs));
    return Date.now();
  }

  return addArchiveTrack(seed.source);
}
