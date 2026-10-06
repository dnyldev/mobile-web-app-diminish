import { HOME_CLASSES, HOME_STATIC, TRACK_LIST } from '@/design/home';
import type { PendingUpload } from '@/data/addSong';
import type { Track } from '@/data/tracks';
import { useTracks } from '@/hooks/useTracks';
import type { ThemeMode } from '@/types/theme';
import { HomeHeader } from './HomeHeader';
import { TrackRow } from './TrackRow';
import { UploadRow } from './UploadRow';

export interface HomeScreenProps {
  theme: ThemeMode;
  /**
   * Rows added through the add-music flow, newest first.
   *
   * They arrive as a prop rather than as state here because the flow belongs to
   * the harness: its trigger is the navbar's `+` button, which is a sibling of
   * this screen inside the frame. See `App`.
   */
  added: readonly Track[];
  /**
   * The row a local file occupies WHILE it uploads, or `null`.
   *
   * It arrives from the same flow and for the same reason as `added`, and it is
   * NOT a `Track`: it has a progress and a status until the flow commits it, at
   * which point it leaves this prop and shows up in `added` instead.
   */
  pending: PendingUpload | null;
  /**
   * Tapping a row hands the track up to the harness, which is what gives the
   * mini player something to show. Without it the list is read-only.
   */
  onSelectTrack: (track: Track) => void;
  /** The ✕ on the uploading row — the flow's own `H`. */
  onCancelUpload: () => void;
}

/**
 * The Home destination: the playlist header and the track list.
 *
 * The artifact scrolled its own document; inside this app the screen lives in a
 * fixed-size phone frame, so the list gets its own scroll shell and the 112px
 * tail padding (`pb-28`) that used to keep the last row clear of the bottom
 * navigation.
 *
 * The big `ADD NEW SONG` pill that used to head the list is GONE (decision:
 * Danial) — the navbar's `+` button does that job now. Only the trigger moved:
 * the sheet it opens, the API search panel and the toast are unchanged, and
 * `App` renders them beside this screen. They have to live outside the scroll
 * shell, because an `absolute` overlay inside a scrolling box anchors to the
 * scroll content and would travel with the list instead of covering the frame.
 *
 * What the trigger starts now ends HERE as well: a chosen file is a row of this
 * list from the moment it starts uploading (`UploadRow`, above `rows`), so the
 * upload is visible on the screen it will land on rather than in a dialog that
 * has already closed.
 */
export function HomeScreen({
  theme,
  added,
  pending,
  onSelectTrack,
  onCancelUpload,
}: HomeScreenProps) {
  const { status, playlistTitle, tracks, error } = useTracks();

  const rows = [...added, ...tracks];
  const subtitle =
    status === 'ready'
      ? `${rows.length} tracks`
      : status === 'loading'
        ? 'Loading…'
        : 'Unavailable';

  return (
    <div
      className={HOME_STATIC.scroller}
      style={{ fontFamily: TRACK_LIST.rootFontFamily }}
      data-status={status}
    >
      <HomeHeader title={playlistTitle || 'Playlist'} subtitle={subtitle} theme={theme} />

      <main className={HOME_STATIC.main}>
        {status === 'ready' && (
          <div className={HOME_STATIC.listWrapper}>
            {/* The row that is still uploading heads the list, exactly where the
                artifact put it — which is also why the first real row below it
                needs its divider. */}
            {pending && <UploadRow pending={pending} theme={theme} onCancel={onCancelUpload} />}

            {rows.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                showDivider={pending !== null || index !== 0}
                theme={theme}
                onSelect={onSelectTrack}
              />
            ))}
          </div>
        )}

        {status === 'loading' && (
          <p className={`${HOME_STATIC.status} ${HOME_CLASSES[theme].status}`}>
            Loading tracks…
          </p>
        )}

        {status === 'error' && (
          <p className={`${HOME_STATIC.status} ${HOME_CLASSES[theme].status}`}>
            Could not load the catalogue — {error}
          </p>
        )}
      </main>
    </div>
  );
}
