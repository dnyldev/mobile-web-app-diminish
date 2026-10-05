/**
 * The one glyph the Home header needs.
 *
 * `createLucideIcon`'s defaults, verbatim from the artifact:
 *   { xmlns, width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
 *     stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round",
 *     strokeLinejoin: "round" }
 * with `width`/`height` replaced by the `size` prop. `strokeWidth` stays 2 —
 * this is lucide's glyph, not one of the nav bar's 1.75px icons.
 */

export interface GlyphProps {
  /** Original: `<Search size={18} />` in the header, `16` elsewhere. */
  size?: number;
}

export function SearchGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
