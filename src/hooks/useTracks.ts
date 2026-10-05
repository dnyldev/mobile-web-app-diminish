import { useEffect, useState } from 'react';
import { loadTrackCatalog } from '@/data/tracks';
import type { Track } from '@/data/tracks';

export type TracksStatus = 'loading' | 'ready' | 'error';

export interface TracksState {
  status: TracksStatus;
  playlistTitle: string;
  tracks: Track[];
  error: string | null;
}

const INITIAL: TracksState = {
  status: 'loading',
  playlistTitle: '',
  tracks: [],
  error: null,
};

/**
 * Loads the catalogue once per mount. The abort guard keeps React 18's
 * StrictMode double-invocation (and any unmount mid-flight) from writing to a
 * dead component.
 */
export function useTracks(): TracksState {
  const [state, setState] = useState<TracksState>(INITIAL);

  useEffect(() => {
    const controller = new AbortController();

    loadTrackCatalog(controller.signal)
      .then((catalog) => {
        setState({
          status: 'ready',
          playlistTitle: catalog.playlistTitle,
          tracks: catalog.tracks,
          error: null,
        });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          playlistTitle: '',
          tracks: [],
          error: cause instanceof Error ? cause.message : String(cause),
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
