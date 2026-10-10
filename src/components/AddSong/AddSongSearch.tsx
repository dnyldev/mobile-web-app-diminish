import { useEffect, useRef } from 'react';
import { Cover } from '@/components/Cover';
import { ADD_SONG_CLASS, ADD_SONG_COPY, ADD_SONG_METRICS, ADD_SONG_THEME } from '@/design/addSong';
import type { AddSearchSeed } from '@/data/addSong';
import type { ThemeMode } from '@/types/theme';
import { CheckGlyph, ChevronLeftGlyph, CloseGlyph, LoaderGlyph, Music2Glyph, PlusGlyph, SearchGlyph } from './icons';
import './addSongKeyframes.css';

export interface AddSongSearchProps {
  theme: ThemeMode;
  /** `_` */
  query: string;
  /** `T` */
  results: AddSearchSeed[];
  /** `Q` */
  searching: boolean;
  /** The archive's own failure, or `null` — this app's state, not the template's. */
  searchError: string | null;
  /** `R` — rows keyed by their entry's own id. */
  addingIds: ReadonlySet<string>;
  /** `B` */
  savedIds: ReadonlySet<string>;
  onQueryChange: (value: string) => void;
  /** the back button — the artifact's `t("library"), s("")` */
  onClose: () => void;
  /** `VA` */
  onPick: (seed: AddSearchSeed) => void;
}

/**
 * The search view — the drawer's `Search Archive` row leads here.
 *
 * Original: `Library/Add-song.html` 5268-5418, the `U === "search"` branch of the
 * template's own tab switch. It is a full SCREEN there, not an overlay: picking
 * the row closes the drawer and swaps the page (`F(!1), t("search"), s("")`), and
 * that is how it renders here — where `HomeScreen` renders, inside the frame.
 *
 * Its states are the template's, in its own order, plus one the template could
 * not have had:
 *
 *   blank query   the 72px disc with a 32px `Search` glyph at `strokeWidth 1.6`,
 *                 `No recent searches`, and `Start typing to find tracks`. The
 *                 template's `TRENDING NOW` block — its label, the five `trending`
 *                 entries it flagged and the three hard-coded artists — is NOT
 *                 ported (decision: Danial): that option is not wanted there.
 *   searching     three skeleton rows while the hook's 600ms debounce runs — and
 *                 now for the whole round trip, since the archive answers over
 *                 the network.
 *   results       the 72px rows: a 52px `rounded-[14px]` cover (the entry's OWN
 *                 gradient and letter, with the provider's artwork over them
 *                 when the entry has one), a `truncate` title over a `#8E8E93`
 *                 artist, the 32px add disc, and a 1px divider inset to
 *                 `left-[72px]`.
 *   archive down  a 64px disc with a 28px `Close` glyph. NOT the template's: its
 *                 archive was a fixed table, so `No results` was the only thing
 *                 that could go wrong. This app's archive is a service, and a
 *                 service that is down is not a search that found nothing — the
 *                 block is the no-results one's own, on its own copy.
 *   no matches    the same 64px disc with a 28px `Music2` glyph instead,
 *                 `No results for "<what you typed>"`, and `Try a different
 *                 search term`.
 *
 * The add disc's three glyphs are `+`, the spinner, then the ✓ — and only the
 * GLYPH changes: the disc keeps its idle paint until the row is actually added,
 * which is what the template drew. An add that FAILS returns the disc to `+`
 * (with the toast saying so), because a row that could not be added must stay
 * addable — the template had no such case, having nothing to fail.
 *
 * The Add music artifact's floating panel (its `z-[70]` blur backdrop, its 44px
 * field with a 14px `r="6"` search glyph, its `max-h-[360px]` list, its results
 * eyebrow and its simulation footer) is gone with the row that used to open it.
 */
export function AddSongSearch({
  theme,
  query,
  results,
  searching,
  searchError,
  addingIds,
  savedIds,
  onQueryChange,
  onClose,
  onPick,
}: AddSongSearchProps) {
  const palette = ADD_SONG_THEME[theme];
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * The template's focus effect, verbatim: `if (U === "search") setTimeout(() =>
   * v.current?.focus(), 100)` — the field takes the keyboard 100ms after the
   * view opens, not on the same frame it mounts.
   */
  useEffect(() => {
    const id = window.setTimeout(
      () => inputRef.current?.focus(),
      ADD_SONG_METRICS.searchFocusDelayMs,
    );
    return () => window.clearTimeout(id);
  }, []);

  /** The template's own emptiness test — trimmed, so a field of spaces is blank. */
  const blank = query.trim() === '';

  return (
    <div
      className={`${ADD_SONG_CLASS.searchRoot} ${palette.searchRoot} ${palette.text}`}
      style={{ fontFamily: ADD_SONG_METRICS.rootFontFamily }}
    >
      <div className={ADD_SONG_CLASS.searchHeader}>
        <button
          type="button"
          onClick={onClose}
          aria-label={ADD_SONG_COPY.searchBackLabel}
          className={ADD_SONG_CLASS.searchBack}
        >
          <ChevronLeftGlyph
            size={ADD_SONG_METRICS.searchBackGlyphSize}
            strokeWidth={ADD_SONG_METRICS.searchBackGlyphStroke}
          />
        </button>

        <div className={`${ADD_SONG_CLASS.searchField} ${palette.searchSurface}`}>
          <SearchGlyph
            size={ADD_SONG_METRICS.searchFieldGlyphSize}
            className={palette.searchInk}
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={ADD_SONG_COPY.searchPlaceholder}
            className={ADD_SONG_CLASS.searchInput}
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label={ADD_SONG_COPY.searchClearLabel}
              className={`${ADD_SONG_CLASS.searchClear} ${palette.searchClearBg}`}
            >
              <CloseGlyph
                size={ADD_SONG_METRICS.searchClearGlyphSize}
                className={palette.searchInk}
              />
            </button>
          )}
        </div>
      </div>

      <div className={ADD_SONG_CLASS.searchBody}>
        {blank ? (
          <div className={ADD_SONG_CLASS.searchEmpty}>
            <div className={`${ADD_SONG_CLASS.searchEmptyDisc} ${palette.searchSurface}`}>
              <SearchGlyph
                size={ADD_SONG_METRICS.searchEmptyGlyphSize}
                strokeWidth={ADD_SONG_METRICS.searchEmptyGlyphStroke}
                className={palette.searchInk}
              />
            </div>

            <div className={`${ADD_SONG_CLASS.searchEmptyTitle} ${palette.text}`}>
              {ADD_SONG_COPY.searchEmptyTitle}
            </div>
            <div className={`${ADD_SONG_CLASS.searchEmptySub} ${palette.searchInk}`}>
              {ADD_SONG_COPY.searchEmptySub}
            </div>
          </div>
        ) : searching ? (
          <div className={ADD_SONG_CLASS.searchSkeletonList}>
            {Array.from({ length: ADD_SONG_METRICS.searchSkeletonCount }, (_, index) => (
              <div
                key={index}
                className={ADD_SONG_CLASS.searchSkeletonRow}
                style={{ height: `${ADD_SONG_METRICS.searchRowHeight}px` }}
              >
                <div className={`${ADD_SONG_CLASS.searchSkeletonCover} ${palette.searchHairline}`} />

                <div className={ADD_SONG_CLASS.searchSkeletonBody}>
                  <div
                    className={`${ADD_SONG_CLASS.searchSkeletonBarTitle} ${palette.searchHairline}`}
                  />
                  <div
                    className={`${ADD_SONG_CLASS.searchSkeletonBarSub} ${palette.searchHairline}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : searchError ? (
          /* The archive is a service, and it can be down. The template's own
             table could not fail, so this block is its no-results one with the
             `Close` glyph and this app's own copy — no new classes, no new
             geometry. */
          <div className={ADD_SONG_CLASS.searchNoResults}>
            <div className={`${ADD_SONG_CLASS.searchNoResultsDisc} ${palette.searchSurface}`}>
              <CloseGlyph
                size={ADD_SONG_METRICS.searchNoResultsGlyphSize}
                className={palette.searchInk}
              />
            </div>

            <div className={ADD_SONG_CLASS.searchNoResultsTitle}>
              {ADD_SONG_COPY.searchErrorTitle}
            </div>
            <div className={`${ADD_SONG_CLASS.searchNoResultsSub} ${palette.searchInk}`}>
              {ADD_SONG_COPY.searchErrorSub}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className={ADD_SONG_CLASS.searchResults}>
            {results.map((seed) => {
              const adding = addingIds.has(seed.id);
              const saved = savedIds.has(seed.id);

              return (
                <div
                  key={seed.id}
                  className={`${ADD_SONG_CLASS.searchResultRow} ${palette.searchRoot}`}
                  style={{ height: `${ADD_SONG_METRICS.searchRowHeight}px` }}
                >
                  <Cover
                    gradient={seed.gradient}
                    letter={seed.letter}
                    coverUrl={seed.coverUrl}
                    className={ADD_SONG_CLASS.searchResultCover}
                    style={{
                      width: `${ADD_SONG_METRICS.searchCoverSize}px`,
                      height: `${ADD_SONG_METRICS.searchCoverSize}px`,
                      borderRadius: `${ADD_SONG_METRICS.searchCoverRadius}px`,
                    }}
                    letterClassName={ADD_SONG_CLASS.searchResultLetter}
                    letterStyle={{ fontSize: `${ADD_SONG_METRICS.searchCoverLetterSize}px` }}
                  />

                  <div className={ADD_SONG_CLASS.searchResultBody}>
                    <div
                      className={`${ADD_SONG_CLASS.searchResultTitle} ${palette.text}`}
                      style={{
                        fontSize: `${ADD_SONG_METRICS.searchTitleSize}px`,
                        lineHeight: `${ADD_SONG_METRICS.searchTitleLine}px`,
                      }}
                    >
                      {seed.title}
                    </div>
                    <div
                      className={`${ADD_SONG_CLASS.searchResultSub} ${palette.searchInk}`}
                      style={{ fontSize: `${ADD_SONG_METRICS.searchSubSize}px` }}
                    >
                      {seed.artist}
                    </div>
                  </div>

                  {/* The template disables the disc for the whole adding + saved
                      window (`disabled: $ || G`), so one entry cannot be picked
                      twice inside its own lifecycle. */}
                  <button
                    type="button"
                    onClick={() => onPick(seed)}
                    disabled={adding || saved}
                    className={`${ADD_SONG_CLASS.searchAdd} ${
                      saved
                        ? palette.searchSaved
                        : `${palette.searchAddBorder} ${palette.searchAddBg} ${palette.searchInk}`
                    }`}
                    style={{
                      width: `${ADD_SONG_METRICS.searchAddSize}px`,
                      height: `${ADD_SONG_METRICS.searchAddSize}px`,
                    }}
                  >
                    {adding ? (
                      <LoaderGlyph
                        size={ADD_SONG_METRICS.searchSpinnerGlyphSize}
                        className="animate-spin"
                      />
                    ) : saved ? (
                      <CheckGlyph
                        size={ADD_SONG_METRICS.searchCheckGlyphSize}
                        strokeWidth={ADD_SONG_METRICS.searchCheckGlyphStroke}
                        style={{ animation: ADD_SONG_METRICS.checkSpringAnimation }}
                      />
                    ) : (
                      <PlusGlyph
                        size={ADD_SONG_METRICS.searchPlusGlyphSize}
                        strokeWidth={ADD_SONG_METRICS.searchPlusGlyphStroke}
                      />
                    )}
                  </button>

                  <div className={`${ADD_SONG_CLASS.searchDivider} ${palette.searchHairline}`} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className={ADD_SONG_CLASS.searchNoResults}>
            <div className={`${ADD_SONG_CLASS.searchNoResultsDisc} ${palette.searchSurface}`}>
              <Music2Glyph
                size={ADD_SONG_METRICS.searchNoResultsGlyphSize}
                className={palette.searchInk}
              />
            </div>

            <div className={ADD_SONG_CLASS.searchNoResultsTitle}>
              {ADD_SONG_COPY.searchNoResultsPrefix}
              {query}
              {ADD_SONG_COPY.searchNoResultsSuffix}
            </div>
            <div className={`${ADD_SONG_CLASS.searchNoResultsSub} ${palette.searchInk}`}>
              {ADD_SONG_COPY.searchNoResultsSub}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
