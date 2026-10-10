/**
 * The backend's `Song` payload and the reads this app makes of it.
 *
 * Typed straight off the OpenAPI schema the API generates its own client from
 * (`packages/api-spec/openapi.yaml` → `components.schemas.Song`), including its
 * nullability — `duration`, `artist` and the musical fields are all nullable in
 * the spec, and pretending otherwise is how a `null` reaches the screen.
 *
 * Raw on purpose: nothing here is a UI type. `src/data/tracks.ts` owns the
 * translation into the app's own `Track`, so the API's shape stops at this file.
 */
import { apiGet } from './client';

/** `components.schemas.Song` — what `GET /api/songs` returns per item. */
export interface ApiSong {
  id: number;
  title: string;
  artist: string | null;
  artistId: number | null;
  /** Beware: the API also exposes a `difficulty` string column. */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Duration in seconds, or `null` when the row has none. */
  duration: number | null;
  bpm: number | null;
  /** The API aliases `musicalKey` to `key` in its response mapping. */
  key: string | null;
  musicalKey: string | null;
  mode: string | null;
  timeSignature: string | null;
  /** A remote image URL, or `null`. */
  coverUrl: string | null;
  playCount: number;
  featured: boolean;
  /** ISO 8601. */
  createdAt: string;
  /** ISO 8601. */
  updatedAt: string;
}

/**
 * `GET /api/songs` — every published song, in the order the API returns them.
 *
 * Public: this endpoint needs no auth (the API's local dev auth bypass is
 * irrelevant here — there is no `getAuth` on this route at all).
 */
export function fetchSongs(signal?: AbortSignal): Promise<ApiSong[]> {
  return apiGet<ApiSong[]>('/api/songs', signal);
}
