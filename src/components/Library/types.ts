/*
 * Library data model — the modular source's `Track` / `TrackStatus`
 * (`modular-music-player-ui/src/data/types.ts`) VERBATIM, plus the `Filter`
 * union the professional source's `LibraryScreen` owns (`all | liked |
 * recent`). The field stays `favorite` (modular); the "Liked" chip label is
 * the professional source's own copy and maps onto it.
 */

export type TrackStatus = 'ready' | 'queued' | 'uploading' | 'processing' | 'analyzing' | 'failed';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  letter: string;
  status: TrackStatus;
  progress: number;
  favorite: boolean;
  queued: boolean;
  error: string | null;
  local: boolean;
}

export type Filter = 'all' | 'liked' | 'recent';
