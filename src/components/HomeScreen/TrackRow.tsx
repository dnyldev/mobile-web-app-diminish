import { Cover } from '@/components/Cover';
import type { Track } from '@/data/tracks';
import { HOME_CLASSES, HOME_STATIC, HOME_COLORS, TRACK_LIST } from '@/design/home';
import type { ThemeMode } from '@/types/theme';

export interface TrackRowProps {
  track: Track;
  /** The original draws the hairline on every row except the first. */
  showDivider: boolean;
  theme: ThemeMode;
  /**
   * Tapping the row makes it the now-playing track.
   *
   * The original artifact had a whole gesture layer here — swipe-to-queue,
   * swipe-to-like, a 500ms long-press action sheet — and the port deliberately
   * kept the row static. This is the one affordance the harness actually needs
   * from it: the mini player has nothing to show until something is picked.
   * A plain `onClick` on the row, the same way Playlist v6's own rows work.
   */
  onSelect: (track: Track) => void;
}

/**
 * One 72px track row.
 *
 * Original: `function vm({track, idx, isActive, ...})`. Everything that only
 * existed to support a gesture or a playback state is left out on purpose —
 * at rest the original rendered exactly what is below (the swipe layers were
 * `opacity: 0`, the transform was `translateX(0px)`, and the active/playing
 * branches never applied because nothing is playing yet).
 */
export function TrackRow({ track, showDivider, theme, onSelect }: TrackRowProps) {
  return (
    <div className={HOME_STATIC.rowGroup}>
      {showDivider && (
        <div
          className={HOME_STATIC.divider}
          style={{
            marginLeft: TRACK_LIST.dividerInset,
            backgroundColor: HOME_COLORS[theme].divider,
          }}
        />
      )}

      <div
        className={`${HOME_STATIC.rowShell} cursor-pointer`}
        onClick={() => onSelect(track)}
      >
        <div className={`${HOME_STATIC.row} ${HOME_CLASSES[theme].row}`}>
          <Cover
            gradient={track.gradient}
            letter={track.letter}
            coverUrl={track.coverUrl}
            className={HOME_STATIC.cover}
            letterClassName={HOME_STATIC.letter}
          />

          <div className={HOME_STATIC.textBlock}>
            <div className={`${HOME_STATIC.trackTitle} ${HOME_CLASSES[theme].trackTitle}`}>
              {track.title}
            </div>
            <div className={`${HOME_STATIC.trackArtist} ${HOME_CLASSES[theme].trackArtist}`}>
              {track.artist}
            </div>
          </div>

          <div className={HOME_STATIC.metaRow}>
            <span
              className={HOME_STATIC.duration}
              style={{
                fontFamily: TRACK_LIST.durationFontFamily,
                color: HOME_COLORS[theme].duration,
              }}
            >
              {track.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
