import type { PendingUpload } from '@/data/addSong';
import { ADD_SONG_COPY } from '@/design/addSong';
import {
  HOME_CLASSES,
  HOME_COLORS,
  HOME_STATIC,
  TRACK_LIST,
  UPLOAD_ROW,
  UPLOAD_ROW_CLASSES,
} from '@/design/home';
import type { ThemeMode } from '@/types/theme';
import { CloseGlyph } from '@/components/AddSong/icons';

export interface UploadRowProps {
  pending: PendingUpload;
  theme: ThemeMode;
  /** `H` — the artifact's cancel; stops the clock and drops the row. */
  onCancel: () => void;
}

/**
 * The row a local file occupies WHILE it is being uploaded.
 *
 * Original: the artifact's uploading branch of its library list (`Library/Add-song.html`,
 * rendered at 5195-5235): a normal row whose artist line carries the upload's
 * own status, with a 2px bar under it, `Math.round(progress)` + `%` in the
 * trailing column, and an ✕ beside it.
 *
 * It is deliberately NOT a new row geometry: it composes `HOME_STATIC` — the
 * same shell, the same 48px cover, the same 15px title and 13px artist — so the
 * row a file occupies while it uploads and the row it becomes afterwards are the
 * same row, and the list does not shift when the swap happens.
 *
 * The ✕ is `AddSong`'s own glyph: the state it cancels belongs to that flow, not
 * to the Home screen, which is why the import crosses the two features.
 */
export function UploadRow({ pending, theme, onCancel }: UploadRowProps) {
  const palette = UPLOAD_ROW_CLASSES[theme];
  const processing = pending.status === 'processing';

  return (
    <div className={HOME_STATIC.rowGroup}>
      <div className={HOME_STATIC.rowShell}>
        <div className={`${HOME_STATIC.row} ${HOME_CLASSES[theme].row}`}>
          <div className={HOME_STATIC.cover} style={{ background: pending.gradient }}>
            <div className={HOME_STATIC.coverInner}>
              <span className={HOME_STATIC.letter}>{pending.letter}</span>
            </div>
          </div>

          <div className={HOME_STATIC.textBlock}>
            <div className={`${HOME_STATIC.trackTitle} ${HOME_CLASSES[theme].trackTitle}`}>
              {pending.title}
            </div>
            <div className={`${HOME_STATIC.trackArtist} ${HOME_CLASSES[theme].trackArtist}`}>
              {processing ? ADD_SONG_COPY.processingLabel : ADD_SONG_COPY.uploadingLabel}
            </div>

            {/* The artifact's bar: 2px, full width of the text column, filling left to right. */}
            <div className={`${UPLOAD_ROW.progressTrack} ${palette.progressTrack}`}>
              <div
                className={`${UPLOAD_ROW.progressFill} ${palette.progressFill}`}
                style={{ width: `${pending.progress}%` }}
              />
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
              {Math.round(pending.progress)}%
            </span>

            <button
              type="button"
              onClick={onCancel}
              aria-label={ADD_SONG_COPY.cancelUploadLabel}
              className={`${UPLOAD_ROW.cancelButton} ${palette.cancelButton}`}
            >
              <CloseGlyph size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
