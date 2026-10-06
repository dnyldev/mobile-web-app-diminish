import { ADD_SONG_CLASS, ADD_SONG_COPY, ADD_SONG_METRICS, ADD_SONG_THEME } from '@/design/addSong';
import type { ThemeMode } from '@/types/theme';
import { ChevronLeftGlyph, LibraryGlyph, UploadGlyph } from './icons';
import './addSongKeyframes.css';

export interface AddSongSheetProps {
  theme: ThemeMode;
  onClose: () => void;
  /** `df` */
  onLocal: () => void;
  /** `pf` */
  onSearch: () => void;
}

/**
 * The drawer — the Add-song artifact's own sheet.
 *
 * Source: `Library/Add-song.html`, whose readable app region is
 * `../Library/_extract/script-01.fmt2.js` lines 5421-5501. Verbatim from it: a
 * `bg-black/40 backdrop-blur-[12px]` backdrop on `fadeIn 0.3s ease-out`, a
 * `max-w-[390px] rounded-t-[24px]` panel at `padding: 12px 24px 32px 24px` with
 * `box-shadow: 0 -10px 40px rgba(0,0,0,0.12)` rising on
 * `slideUp 0.32s cubic-bezier(0.32,0.72,0,1)`, a `w-9 h-1` grabber, a centered
 * 17/22 title, two 56px rows (a 40px disc holding a 20px glyph at
 * `strokeWidth 1.8`, a `font-medium` 16/19 title, a 13px `#8E8E93` sub, and a
 * 16px chevron mirrored with `rotate-180 opacity-40`). `fixed` → `absolute`, as
 * with every other overlay in this app, and the template's trailing `h-4` spacer
 * plus its `134×5` home indicator are NOT ported (decision: Danial — the same
 * duplicate iOS already draws that the nav bar's copy was dropped for).
 *
 * REPLACED, on Danial's instruction: this used to be the *Add music* artifact's
 * sheet — two 132px cards with `LOCAL` / `API` chips and a note box. Its class
 * strings, palette entries, copy and four glyphs left with it; see the README.
 *
 * The two rows still do what THIS app does: `onLocal` opens the real
 * `input[type=file]` picker (the template instead starts a synthetic
 * `Track N.mp3` upload, which would throw the user's own file away) and
 * `onSearch` opens the API panel 180ms later. Only the drawer comes from the
 * template.
 */
export function AddSongSheet({ theme, onClose, onLocal, onSearch }: AddSongSheetProps) {
  const palette = ADD_SONG_THEME[theme];

  return (
    <>
      <div
        className={ADD_SONG_CLASS.sheetBackdrop}
        style={{ animation: ADD_SONG_METRICS.backdropAnimation }}
        onClick={onClose}
      />

      <div
        className={`${ADD_SONG_CLASS.sheetPanel} ${palette.sheet} ${palette.text}`}
        style={{
          padding: ADD_SONG_METRICS.sheetPadding,
          boxShadow: ADD_SONG_METRICS.sheetShadow,
          animation: ADD_SONG_METRICS.panelAnimation,
          fontFamily: ADD_SONG_METRICS.rootFontFamily,
        }}
      >
        <div className={ADD_SONG_CLASS.handleWrap}>
          <div className={`${ADD_SONG_CLASS.handle} ${palette.handle}`} />
        </div>

        <div
          className={ADD_SONG_CLASS.sheetTitle}
          style={{
            fontSize: `${ADD_SONG_METRICS.sheetTitleSize}px`,
            lineHeight: `${ADD_SONG_METRICS.sheetTitleLine}px`,
          }}
        >
          {ADD_SONG_COPY.sheetTitle}
        </div>

        <div className={ADD_SONG_CLASS.sheetRows}>
          <button
            type="button"
            onClick={onLocal}
            data-testid="upload-btn"
            className={ADD_SONG_CLASS.sheetRow}
            style={{
              height: `${ADD_SONG_METRICS.rowHeight}px`,
              padding: `0 ${ADD_SONG_METRICS.rowPaddingX}px`,
            }}
          >
            <div className={`${ADD_SONG_CLASS.rowLead} ${palette.rowLead}`}>
              <UploadGlyph />
            </div>

            <div className={ADD_SONG_CLASS.rowBody}>
              <div
                className={ADD_SONG_CLASS.rowTitle}
                style={{
                  fontSize: `${ADD_SONG_METRICS.rowTitleSize}px`,
                  lineHeight: `${ADD_SONG_METRICS.rowTitleLine}px`,
                }}
              >
                {ADD_SONG_COPY.uploadTitle}
              </div>
              <div
                className={`${ADD_SONG_CLASS.rowSub} ${palette.rowSub}`}
                style={{ fontSize: `${ADD_SONG_METRICS.rowSubSize}px` }}
              >
                {ADD_SONG_COPY.uploadSub}
              </div>
            </div>

            <ChevronLeftGlyph className={ADD_SONG_CLASS.rowChevron} />
          </button>

          <button
            type="button"
            onClick={onSearch}
            data-testid="archive-btn"
            className={ADD_SONG_CLASS.sheetRow}
            style={{
              height: `${ADD_SONG_METRICS.rowHeight}px`,
              padding: `0 ${ADD_SONG_METRICS.rowPaddingX}px`,
            }}
          >
            <div className={`${ADD_SONG_CLASS.rowLead} ${palette.rowLead}`}>
              <LibraryGlyph />
            </div>

            <div className={ADD_SONG_CLASS.rowBody}>
              <div
                className={ADD_SONG_CLASS.rowTitle}
                style={{
                  fontSize: `${ADD_SONG_METRICS.rowTitleSize}px`,
                  lineHeight: `${ADD_SONG_METRICS.rowTitleLine}px`,
                }}
              >
                {ADD_SONG_COPY.archiveTitle}
              </div>
              <div
                className={`${ADD_SONG_CLASS.rowSub} ${palette.rowSub}`}
                style={{ fontSize: `${ADD_SONG_METRICS.rowSubSize}px` }}
              >
                {ADD_SONG_COPY.archiveSub}
              </div>
            </div>

            <ChevronLeftGlyph className={ADD_SONG_CLASS.rowChevron} />
          </button>
        </div>
      </div>
    </>
  );
}
