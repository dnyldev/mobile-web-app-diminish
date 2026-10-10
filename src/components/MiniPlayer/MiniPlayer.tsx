import { Cover } from '@/components/Cover';
import { MiniCloseGlyph, MiniPauseGlyph, MiniPlayGlyph } from '@/components/PlaylistV6/icons';
import { THEME } from '@/design/theme';
import type { ThemeMode } from '@/design/theme';
import { MINI_PLAYER } from '@/design/tokens';
import type { Track } from '@/data/tracks';
import './miniKeyframes.css';

export interface MiniPlayerProps {
  track: Track;
  isPlaying: boolean;
  theme: ThemeMode;
  onTogglePlay: () => void;
  /** Dismiss the now-playing item. */
  onClose: () => void;
}

/**
 * The mini player pill, stacked one `gap` above the nav pill.
 *
 * Two things make it a pair with the nav rather than a copy of the v6 one:
 *
 *   1. **The glass is the nav's.** `ThemePalette.pillBackground` / `pillBorder` /
 *      `pillShadow` / `pillBackdropFilter` — byte-identical to the pill below it,
 *      in both modes. v6's mini player was `bg-white/80` because that screen was
 *      light-only; here it has to survive the theme switch, so it borrows the
 *      exact recipe instead of approximating it.
 *   2. **The box is the nav's.** Same height, same `max-w-[352px]`, same
 *      `rounded-full`, and it is the nav that positions it — see
 *      `BottomNav`'s `above` slot. Nothing here computes a `bottom`.
 *
 * Its composition (cover · title/artist · play/pause · dismiss) and every glyph
 * come from the v6 mini player, so the icon language stays one thing.
 *
 * The left half is deliberately NOT a button: v6's opened the Now Playing sheet,
 * and the harness has no sheet — a button with nothing behind it is worse than no
 * button.
 */
export function MiniPlayer({ track, isPlaying, theme, onTogglePlay, onClose }: MiniPlayerProps) {
  const palette = THEME[theme];

  return (
    <div
      className={MINI_PLAYER.shell}
      style={{
        background: palette.pillBackground,
        backdropFilter: palette.pillBackdropFilter,
        WebkitBackdropFilter: palette.pillWebkitBackdropFilter,
        border: palette.pillBorder,
        boxShadow: palette.pillShadow,
        animation: MINI_PLAYER.entrance,
      }}
    >
      <Cover
        gradient={track.gradient}
        letter={track.letter}
        coverUrl={track.coverUrl}
        className={MINI_PLAYER.cover}
      />

      <div className={MINI_PLAYER.textBlock}>
        <div className={`${MINI_PLAYER.title} ${palette.miniTitle}`}>{track.title}</div>
        <div className={`${MINI_PLAYER.artist} ${palette.miniArtist}`}>{track.artist}</div>
      </div>

      <div className={MINI_PLAYER.buttons}>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={`${MINI_PLAYER.button} ${palette.miniButton} ${palette.miniButtonHover}`}
        >
          {isPlaying ? <MiniPauseGlyph /> : <MiniPlayGlyph />}
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss now playing"
          className={`${MINI_PLAYER.button} ${palette.miniClose} ${palette.miniCloseHover}`}
        >
          <MiniCloseGlyph />
        </button>
      </div>
    </div>
  );
}
