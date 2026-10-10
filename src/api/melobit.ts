/**
 * The archive — the Melobit-backed song search, through our own backend.
 *
 * Melobit is a THIRD-PARTY API with its own auth, its own headers and its own
 * idea of what a song is. None of that may leave this file. The backend
 * (`apps/api-server/src/routes/melobit.ts`) already normalises it, rejects what
 * is unplayable and tells us what is already in the library — so what arrives
 * here is clean, and what leaves here is `ArchiveTrack`, which names no Melobit
 * field a UI could accidentally depend on.
 *
 * Two calls, and both are the backend's, not Melobit's:
 *
 *   fetchArchive   GET  /api/melobit/search?q=   → rows to draw
 *   addArchiveTrack POST /api/melobit/add        → downloads the file server-side
 *                                                  and returns the created song
 *
 * The second one is slow by nature — the backend pulls the whole MP3 down before
 * it answers (up to a 300s timeout on its side). Treat it as a job, not a tap.
 */
import { apiGet, apiPost } from './client';

/** One search result, as the backend normalises it, plus what it knows about us. */
export interface ArchiveTrack {
  /** Melobit's own id — a STRING, `[A-Za-z0-9_-]{1,64}`. Opaque to this app. */
  id: string;
  title: string;
  artist: string;
  /** Seconds. The backend defaults a missing one to `0`. */
  duration: number;
  /** A remote image URL, or `''`. */
  coverUrl: string;
  /** The quality token the stream/download call needs. */
  audioId: string;
  /** Whether this user already has the track — the backend computes it per result. */
  inLibrary: boolean;
}

/** `GET /api/melobit/search` → `{ results: [...] }` (note: an object, not an array). */
interface ArchiveSearchResponse {
  results: ArchiveTrack[];
}

/** `POST /api/melobit/add` → `{ already, song }`, where `song` is the DB row. */
interface ArchiveAddResponse {
  already: boolean;
  song: { id: number; title: string } & Record<string, unknown>;
}

/**
 * Search the archive.
 *
 * Failures are NOT swallowed here: the caller decides. The backend distinguishes
 * the cases it can see — `MELOBIT_UNREACHABLE` (its Melobit proxy is down),
 * `MELOBIT_ERROR` (Melobit answered badly) — and those reach the UI as an
 * `ApiError` with the backend's own message.
 */
export async function fetchArchive(
  query: string,
  signal?: AbortSignal,
): Promise<ArchiveTrack[]> {
  if (query.trim() === '') return [];

  const payload = await apiGet<ArchiveSearchResponse>(
    `/api/melobit/search?q=${encodeURIComponent(query)}`,
    signal,
  );

  return Array.isArray(payload?.results) ? payload.results : [];
}

/**
 * Add a result to the library.
 *
 * Returns the created song's own id — the numeric DB id the whole rest of the
 * app keys on, which is why the row can stop being a search result and become a
 * normal library track with no translation.
 *
 * The body carries the display fields as well as the two ids: without them the
 * backend would store the row as `Unknown Artist` with no cover and no length.
 * Sending what we already have is the whole reason this is one round trip.
 */
export async function addArchiveTrack(
  track: ArchiveTrack,
  signal?: AbortSignal,
): Promise<number> {
  const payload = await apiPost<ArchiveAddResponse>(
    '/api/melobit/add',
    {
      song: {
        id: track.id,
        audioId: track.audioId,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        coverUrl: track.coverUrl,
      },
    },
    signal,
  );

  return payload.song.id;
}
