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
import catalogFile from './tracks.json';

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

export async function loadTrackCatalog(signal?: AbortSignal): Promise<TrackCatalog> {
  if (TRACKS_SOURCE) {
    const response = await fetch(TRACKS_SOURCE, { signal });
    if (!response.ok) {
      throw new Error(`GET ${TRACKS_SOURCE} → HTTP ${response.status}`);
    }
    return normalize(await response.json());
  }

  return normalize(catalogFile);
}
