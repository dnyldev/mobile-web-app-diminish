import type { V6NavId } from '@/design/playlistV6';
import type { V6Track } from '@/data/playlistV6';

export type { V6NavId, V6Track };

/** Public props of the Playlist v6 screen. */
export interface PlaylistV6Props {
  /**
   * The catalogue. Defaults to the 79 rows the artifact generated
   * (`buildV6Tracks()`); pass your own to drive the screen from real data.
   */
  tracks?: readonly V6Track[];
}
