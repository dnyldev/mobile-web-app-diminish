/**
 * The track catalogue — loaded, never hard-coded.
 *
 * The 79 demo entries used to be generated inline in the original artifact
 * (`$e = Array.from({length:79}, ...)`). They now live in `./tracks.json`, a
 * plain data file, and this module is the only place that knows where they come
 * from. Normalisation (display strings from raw numbers) happens here too, so
 * components only ever see a finished `Track`.
 *
 * Swapping the source: set `TRACKS_SOURCE` to a URL and the loader fetches it
 * instead; every consumer keeps the same async signature. Keep it `null` for
 * the bundled file — the build is a single self-contained HTML and browsers
 * refuse `fetch()` on `file://`, so a remote source needs a server (dev server,
 * static host or tunnel).
 */
import { isApiConnected } from '@/api/client';
import { fetchSongs, type ApiSong } from '@/api/songs';
import catalogFile from './tracks.json';
import { V6_GRADIENTS } from './playlistV6';

export interface Track {
  /** stable key from the data (falls back to the 1-based position) */
  id: number;
  title: string;
  artist: string;
  /** length in seconds, exactly as stored in the data */
  seconds: number;
  /** `m:ss` — the original's `Math.floor(s/60)` + zero-padded remainder */
  duration: string;
  /** cover monogram — the original's `title.trim()[0].toUpperCase() || "A"` */
  letter: string;
  /** CSS `background` for the cover square */
  gradient: string;
  /**
   * The record's real artwork, when it has one.
   *
   * Present on backend rows, absent from the bundled demo catalogue. It is the
   * cover's LAST layer, not a replacement for the two above: `gradient` and
   * `letter` are what the box is painted with, and this is drawn over them. So
   * a record with no artwork — or with one that never arrives — degrades to the
   * monogram it always had instead of to an empty square. See `components/Cover`.
   */
  coverUrl?: string | null;
}

export interface TrackCatalog {
  playlistTitle: string;
  tracks: Track[];
}

/** `null` = use the bundled `./tracks.json`. Set a URL to load it over the wire. */
export const TRACKS_SOURCE: string | null = null;

/** Fallback cover when a record carries no gradient. */
const FALLBACK_GRADIENT = 'linear-gradient(135deg,#27272a 0%,#000000 100%)';

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function coverLetter(title: string): string {
  return title.trim()[0]?.toUpperCase() || 'A';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toTrack(raw: unknown, index: number): Track {
  const source = isRecord(raw) ? raw : {};
  const title = typeof source.title === 'string' ? source.title : `Track ${index + 1}`;
  const seconds = typeof source.seconds === 'number' ? source.seconds : 0;

  return {
    id: typeof source.id === 'number' ? source.id : index + 1,
    title,
    artist: typeof source.artist === 'string' ? source.artist : '',
    seconds,
    duration: formatDuration(seconds),
    letter: coverLetter(title),
    gradient: typeof source.gradient === 'string' ? source.gradient : FALLBACK_GRADIENT,
    coverUrl: typeof source.coverUrl === 'string' && source.coverUrl ? source.coverUrl : null,
  };
}

function normalize(file: unknown): TrackCatalog {
  const source = isRecord(file) ? file : {};
  const rows = Array.isArray(source.tracks) ? source.tracks : [];
  const playlist = isRecord(source.playlist) ? source.playlist : {};

  return {
    playlistTitle: typeof playlist.title === 'string' ? playlist.title : '',
    tracks: rows.map(toTrack),
  };
}

/** The header the backend-sourced list shows. The API has no playlist title. */
const BACKEND_PLAYLIST_TITLE = 'Library';

/** The cover table index for a song — derived from its id, so a song keeps one colour. */
function gradientFor(seed: number): string {
  return V6_GRADIENTS[Math.abs(Math.trunc(seed)) % V6_GRADIENTS.length];
}

/**
 * A backend `Song` as the row this app draws.
 *
 * The backend describes a song; the list needs a cover square and a `m:ss`
 * label. Only three fields cross over as-is (`id`, `title`, `artist`); the rest
 * are built with the app's OWN helpers — `formatDuration`, `coverLetter` and the
 * `V6_GRADIENTS` table that `playlistV6` already exports — so a row that
 * arrived over the wire is painted by exactly the same rules as a bundled demo
 * row. Plugging the cable in introduces no new visual vocabulary.
 *
 * `coverUrl` crosses over too, but it does not replace that work: the API's
 * artwork is the cover's top layer and the monogram built here is the layer it
 * sits on. Both are kept, so a row is identical whether the image loads, the
 * network is down, or the URL is dead — see `components/Cover`.
 */
export function toTrackFromSong(song: ApiSong): Track {
  const seconds = typeof song.duration === 'number' ? song.duration : 0;

  return {
    id: song.id,
    title: song.title,
    artist: song.artist ?? '',
    seconds,
    duration: formatDuration(seconds),
    letter: coverLetter(song.title),
    gradient: gradientFor(song.id),
    coverUrl: song.coverUrl ?? null,
  };
}

/**
 * The cable.
 *
 * Returns the backend's catalogue when one is configured and reachable, and
 * `null` in every other case — including a flat-out failure. That `null` is the
 * whole point of the plug: an unplugged or offline backend must never blank the
 * screen, so the caller falls through to the bundled demo catalogue and the
 * reason is logged once, to the console.
 *
 * An abort is NOT swallowed — it is re-thrown so `useTracks`'s guard can drop
 * the result of a request nobody is waiting for.
 */
async function loadFromBackend(signal?: AbortSignal): Promise<TrackCatalog | null> {
  if (!isApiConnected()) return null;

  try {
    const songs = await fetchSongs(signal);
    return {
      playlistTitle: BACKEND_PLAYLIST_TITLE,
      tracks: songs.map(toTrackFromSong),
    };
  } catch (cause) {
    if (signal?.aborted) throw cause;
    console.warn(
      '[diminish] backend unreachable — showing the bundled demo catalogue instead',
      cause,
    );
    return null;
  }
}

export async function loadTrackCatalog(signal?: AbortSignal): Promise<TrackCatalog> {
  const fromBackend = await loadFromBackend(signal);
  if (fromBackend) return fromBackend;

  if (TRACKS_SOURCE) {
    const response = await fetch(TRACKS_SOURCE, { signal });
    if (!response.ok) {
      throw new Error(`GET ${TRACKS_SOURCE} → HTTP ${response.status}`);
    }
    return normalize(await response.json());
  }

  return normalize(catalogFile);
}
