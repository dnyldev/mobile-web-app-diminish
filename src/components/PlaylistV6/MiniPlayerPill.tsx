import { V6_METRICS, V6_MINI, V6_MOTION } from '@/design/playlistV6';
import type { V6Track } from '@/data/playlistV6';
import { MiniCloseGlyph, MiniPauseGlyph, MiniPlayGlyph } from './icons';

export interface MiniPlayerPillProps {
  track: V6Track;
  /** Original `o`. */
  isPlaying: boolean;
  /** Tap the artwork/title — opens the sheet. */
  onOpen: () => void;
  onTogglePlay: () => void;
  /** Original: `C(!1), p(!1), l(null), u(!1)` — hide, close the sheet, deselect, stop. */
  onClose: () => void;
}

/**
 * The mini player pill.
 *
 * Original: a `fixed left-1/2` div at inline
 * `{ width: "340px", height: "56px", bottom: "84px", transform: "translateX(-50%)",
 *    animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }`.
 *
 * It is the same width and height as the nav pill and sits 12px above it
 * (`84 − (16 + 56)`) — the two can never overlap. `fixed` → `absolute`.
 */
export function MiniPlayerPill({
  track,
  isPlaying,
  onOpen,
  onTogglePlay,
  onClose,
}: MiniPlayerPillProps) {
  return (
    <div
      className={V6_MINI.shell}
      style={{
        width: `${V6_METRICS.miniWidth}px`,
        height: `${V6_METRICS.miniHeight}px`,
        bottom: `${V6_METRICS.miniBottom}px`,
        transform: 'translateX(-50%)',
        animation: V6_MOTION.miniSlide,
      }}
    >
      <button type="button" onClick={onOpen} className={V6_MINI.open}>
        <div className={V6_MINI.cover} style={{ background: track.gradient }}>
          {track.letter}
        </div>
        <div className={V6_MINI.textBlock}>
          <div className={V6_MINI.title}>{track.title}</div>
          <div className={V6_MINI.artist}>{track.artist}</div>
        </div>
      </button>

      <div className={V6_MINI.buttons}>
        <button type="button" onClick={onTogglePlay} className={V6_MINI.toggle}>
          {isPlaying ? <MiniPauseGlyph /> : <MiniPlayGlyph />}
        </button>
        <button type="button" onClick={onClose} className={V6_MINI.close}>
          <MiniCloseGlyph />
        </button>
      </div>
    </div>
  );
}
