/**
 * Every glyph the flow draws, one component per original `<svg>` — transcribed
 * attribute for attribute.
 *
 * Source: `Library/Add-song.html`. Every one of these is built in the template
 * through lucide's own factory (`var ci=…`, `oo=…`, `dK=…`, `di=…`, `Lo=…`,
 * `PK=…`, `Pi=…`, definitions at 4944-4986), so all of them carry
 * `strokeLinecap/Linejoin: "round"` and default to `strokeWidth: 2` — which is
 * exactly why the sizes and widths below are written at each call site rather
 * than baked in:
 *
 *   `PK` Upload        the drawer's upload row                 (20 / 1.8)
 *   `cK` Library       the drawer's archive row                (20 / 1.8)
 *   `qo` ChevronLeft   the drawer's row chevrons               (16 / 2)
 *                      the search view's back button           (22 / 2.2)
 *   `Lo` Search        the search field                        (16 / 2)
 *                      the empty state's disc                  (32 / 1.6)
 *   `Pi` X             the field's clear chip                  (12 / 2)
 *                      the uploading row's ✕                    (16 / 2)
 *   `di` Plus          a result row's add disc                 (16 / 2)
 *   `ci` Check         the ✓ a result row shows once added     (18 / 2.5)
 *   `oo` LoaderCircle  a result row's disc                     (16 / 2)
 *                      the uploading row's cover overlay       (20 / 2)
 *   `dK` Music2        the no-results disc                     (28 / 2)
 *
 * The Add music artifact's four card glyphs, its 14px field search glyph
 * (`rf`, a different `Search` — `r="6"` rather than `r="8"`) and its 12px add
 * disc glyph are all gone with the sheet and the panel they belonged to.
 */
import type { CSSProperties } from 'react';

export interface GlyphProps {
  /** `Pi` is drawn at two sizes: 12px in the search field, 16px on the uploading row. */
  size?: number;
}

/**
 * The two glyphs that carry a state rather than just a shape: one spins, the
 * other pops. Both take the same escape hatches a component would need to drive
 * them, so neither needs a wrapper element to be animated.
 */
export interface StateGlyphProps extends GlyphProps {
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * A glyph the drawer sizes per use. The Add-song template passes `size` and
 * `strokeWidth` at every call site (20/1.8 in the drawer, 16/2 for its chevron)
 * and a `className` on its chevron (`rotate-180 opacity-40`), so the defaults
 * here are the drawer's own values.
 */
export interface SizedGlyphProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * `PK()` — the drawer's upload glyph. Lucide's `Upload`; the template draws it
 * at 20px with `strokeWidth: 1.8` inside the row's 40px disc.
 */
export function UploadGlyph({ size = 20, strokeWidth = 1.8, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

/** `cK()` — the drawer's archive glyph. Lucide's `Library`, four rules. */
export function LibraryGlyph({ size = 20, strokeWidth = 1.8, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

/**
 * `Lo()` — lucide's `Search`, at whichever size the call site asks for: the
 * field's 16px mark and the empty state's 32px one (`strokeWidth: 1.6` there,
 * which is the thinnest stroke in the flow). Note the radius: `r="8"`, not the
 * Add music panel's `r="6"` — the two artifacts drew different search glyphs.
 */
export function SearchGlyph({ size = 16, strokeWidth = 2, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/**
 * `qo()` — the drawer's trailing chevron. Lucide's `ChevronLeft` (`m15 18-6-6 6-6`),
 * which the template mirrors with `rotate-180 opacity-40` rather than swapping
 * the path — kept that way so the drawer's markup matches it element for element.
 */
export function ChevronLeftGlyph({ size = 16, strokeWidth = 2, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/**
 * `Pi()` — lucide's `X`. The field's clear chip draws it at 12px; the uploading
 * row's ✕ at 16px. (Both call sites pass only a size, so `strokeWidth` stays the
 * factory's own 2 — unlike the drawer's glyphs, which pass theirs.)
 */
export function CloseGlyph({ size = 12, strokeWidth = 2, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/** `di()` — lucide's `Plus`, a result row's add disc. 16px / 2. */
export function PlusGlyph({ size = 16, strokeWidth = 2, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

/**
 * `dK()` — lucide's `Music2`, the no-results state's 28px mark. The template
 * passes no `strokeWidth` here, so this one really is the factory's 2.
 */
export function Music2Glyph({ size = 28, strokeWidth = 2, className }: SizedGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </svg>
  );
}

/** `ci()` — the ✓ a result row shows once it has been added. Lucide's `Check`, 18px / 2.5. */
export function CheckGlyph({ size = 18, strokeWidth = 2.5, className, style }: StateGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * `oo()` — the spinner (lucide's `LoaderCircle`). Two call sites: a result row's
 * 32px disc while its track is being committed, and the uploading row's cover
 * overlay at 20px.
 *
 * Inside a result row only the GLYPH changes between `+`, this and the ✓ — the
 * disc keeps its idle paint until the row is actually added, which is how the
 * template drew it.
 */
export function LoaderGlyph({ size = 16, strokeWidth = 2, className, style }: StateGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
