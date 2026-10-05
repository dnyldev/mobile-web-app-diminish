import { V6_COPY, V6_METRICS, V6_MOTION, V6_SHEET, V6_STATIC } from '@/design/playlistV6';
import { elapsedLabel, type V6Track } from '@/data/playlistV6';
import {
  BigPauseGlyph,
  BigPlayGlyph,
  ChevronDownGlyph,
  RepeatGlyph,
  SheetHeartGlyph,
  SheetMoreGlyph,
  ShuffleGlyph,
  SkipBackGlyph,
  SkipForwardGlyph,
} from './icons';

export interface NowPlayingSheetProps {
  track: V6Track;
  /** Original `o`. */
  isPlaying: boolean;
  /** Original `f.has(a.id)`. */
  isLiked: boolean;
  /** Original `i` — the bar position, 0…100. */
  progress: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onToggleLike: () => void;
  onSeek: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * The "Now Playing" bottom sheet.
 *
 * Original: a `Fragment` holding the `fixed inset-0 z-[60]` blur backdrop and
 * the `fixed bottom-0 … z-[70]` panel — both `absolute` here. Everything else
 * is byte-identical: the 36×6 grabber, the eyebrow, the square artwork at
 * `text-[56px]`, the heart, the 6px seek track with its invisible range input
 * on top, the five transport buttons, and the design note at the bottom.
 *
 * Two glyphs in here are deliberately kept unusual: the outer pair are a
 * shuffle arrow and a repeat outline, but they are wired to `progress − 10`
 * and `progress + 10`. That is what the original does.
 */
export function NowPlayingSheet({
  track,
  isPlaying,
  isLiked,
  progress,
  onClose,
  onTogglePlay,
  onToggleLike,
  onSeek,
  onPrevious,
  onNext,
}: NowPlayingSheetProps) {
  return (
    <>
      <div className={V6_SHEET.backdrop} onClick={onClose} />

      <div
        className={V6_SHEET.panel}
        style={{
          animation: V6_MOTION.sheetSlide,
          maxHeight: V6_METRICS.sheetMaxHeight,
        }}
      >
        <div className={V6_SHEET.handleWrap}>
          <div className={V6_SHEET.handle} />
        </div>

        <div className={V6_SHEET.body}>
          <div className={V6_SHEET.column}>
            <div className={V6_SHEET.topRow}>
              <button type="button" onClick={onClose} className={V6_SHEET.circleButton}>
                <ChevronDownGlyph />
              </button>
              <span className={V6_SHEET.eyebrow}>{V6_COPY.sheetEyebrow}</span>
              <button type="button" onClick={onTogglePlay} className={V6_SHEET.circleButton}>
                <SheetMoreGlyph />
              </button>
            </div>

            <div className={V6_SHEET.artwork} style={{ background: track.gradient }}>
              {track.letter}
            </div>

            <div className={V6_SHEET.titleRow}>
              <div className={V6_SHEET.titleBlock}>
                <h2 className={V6_SHEET.title}>{track.title}</h2>
                <p className={V6_SHEET.artist}>{track.artist}</p>
              </div>
              <button
                type="button"
                onClick={onToggleLike}
                className={`${V6_SHEET.likeButton} ${isLiked ? V6_SHEET.liked : V6_SHEET.unliked}`}
              >
                <SheetHeartGlyph filled={isLiked} />
              </button>
            </div>

            <div className={V6_SHEET.seekBlock}>
              <div className={V6_SHEET.seekTrack}>
                <div className={V6_SHEET.seekFill} style={{ width: `${progress}%` }} />
                <input
                  type="range"
                  min={0}
                  max={V6_METRICS.seekMax}
                  value={progress}
                  onChange={(event) => onSeek(Number(event.target.value))}
                  className={V6_SHEET.seekInput}
                />
              </div>
              <div className={V6_SHEET.seekTimes}>
                <span>{elapsedLabel(progress, track.durationSec)}</span>
                <span>{track.durationStr}</span>
              </div>
            </div>

            <div className={V6_SHEET.transport}>
              <button
                type="button"
                onClick={() => onSeek(Math.max(0, progress - 10))}
                className={V6_SHEET.sideButton}
              >
                <ShuffleGlyph />
              </button>
              <button type="button" onClick={onPrevious} className={V6_SHEET.skipButton}>
                <SkipBackGlyph />
              </button>
              <button type="button" onClick={onTogglePlay} className={V6_SHEET.playButton}>
                {isPlaying ? <BigPauseGlyph /> : <BigPlayGlyph />}
              </button>
              <button type="button" onClick={onNext} className={V6_SHEET.skipButton}>
                <SkipForwardGlyph />
              </button>
              <button
                type="button"
                onClick={() => onSeek(Math.min(V6_METRICS.seekMax, progress + 10))}
                className={V6_SHEET.sideButton}
              >
                <RepeatGlyph />
              </button>
            </div>

            <div className={V6_STATIC.noteCard}>
              <div className={V6_STATIC.noteTitle}>{V6_COPY.noteTitle}</div>
              <p className={V6_STATIC.noteBody}>{V6_COPY.noteBody}</p>
            </div>

            <div className={V6_STATIC.noteSpacer} />
          </div>
        </div>
      </div>
    </>
  );
}
