import { HOME_CLASSES, HOME_STATIC, TRACK_LIST } from '@/design/home';
import type { Track } from '@/data/tracks';
import { useTracks } from '@/hooks/useTracks';
import type { ThemeMode } from '@/types/theme';
import { HomeHeader } from './HomeHeader';
import { TrackRow } from './TrackRow';

export interface HomeScreenProps {
  theme: ThemeMode;
  /**
   * Tapping a row hands the track up to the harness, which is what gives the
   * mini player something to show. Without it the list is read-only.
   */
  onSelectTrack: (track: Track) => void;
}

/**
 * The Home destination: the playlist header plus the track list.
 *
 * The artifact scrolled its own document; inside this app the screen lives in
 * a fixed-size phone frame, so the list gets its own scroll shell and the
 * 112px tail padding (`pb-28`) that used to keep the last row clear of the
 * bottom navigation.
 */
export function HomeScreen({ theme, onSelectTrack }: HomeScreenProps) {
  const { status, playlistTitle, tracks, error } = useTracks();

  const subtitle =
    status === 'ready'
      ? `${tracks.length} tracks`
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
            {tracks.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                showDivider={index !== 0}
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
