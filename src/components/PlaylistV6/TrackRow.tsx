import { V6_ROW } from '@/design/playlistV6';
import type { V6Track } from '@/data/playlistV6';
import { HeartGlyph, MoreGlyph } from './icons';

export interface TrackRowProps {
  track: V6Track;
  /** Original `N`: this row is the selected track. */
  isActive: boolean;
  /** Original `z`: this row is in the liked set. */
  isLiked: boolean;
  /** Original `o`: playback is running. */
  isPlaying: boolean;
  onSelect: () => void;
  onToggleLike: () => void;
  onOpenSheet: () => void;
}

/**
 * One 64px row of the v6 list.
 *
 * Original: the body of `e.map((m, S) => { let N = r === m.id, z = f.has(m.id); … })`.
 * The equaliser dots render on `N && o` (selected **and** playing), the row
 * background on `N` alone — the two conditions are not the same one.
 */
export function TrackRow({
  track,
  isActive,
  isLiked,
  isPlaying,
  onSelect,
  onToggleLike,
  onOpenSheet,
}: TrackRowProps) {
  return (
    <div
      onClick={onSelect}
      className={`${V6_ROW.shell} ${isActive ? V6_ROW.active : V6_ROW.idle}`}
    >
      <div className={V6_ROW.cover} style={{ background: track.gradient }}>
        {track.letter}
      </div>

      <div className={V6_ROW.textBlock}>
        <div className={V6_ROW.titleRow}>
          <span
            className={`${V6_ROW.title} ${isActive ? V6_ROW.titleActive : V6_ROW.titleIdle}`}
          >
            {track.title}
          </span>
          {isActive && isPlaying && (
            <span className={V6_ROW.eq}>
              <span className={V6_ROW.eqBar1} />
              <span className={V6_ROW.eqBar2} />
              <span className={V6_ROW.eqBar3} />
            </span>
          )}
        </div>
        <span className={V6_ROW.artist}>{track.artist}</span>
      </div>

      <div className={V6_ROW.actions}>
        <span className={V6_ROW.duration}>{track.durationStr}</span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
          className={`${V6_ROW.likeButton} ${isLiked ? V6_ROW.liked : V6_ROW.unliked}`}
        >
          <HeartGlyph size={16} filled={isLiked} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenSheet();
          }}
          className={V6_ROW.moreButton}
        >
          <MoreGlyph size={16} />
        </button>
      </div>
    </div>
  );
}
