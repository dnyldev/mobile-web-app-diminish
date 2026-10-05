/**
 * Every glyph Playlist v6 draws, one component per original inline `<svg>`.
 *
 * Transcribed attribute for attribute — and the attribute *lists are not all
 * the same*: the four nav icons and the row's heart/more carry
 * `strokeLinecap`/`strokeLinejoin`, while the sheet's chevron / more / heart
 * stop at `strokeWidth: "1.6"`. Keeping them separate is the point.
 */
import type { ComponentType } from 'react';
import type { V6NavId } from '@/design/playlistV6';

export interface NavIconProps {
  /**
   * Original: `createElement(m.Icon, { active: S })` — the flag every nav glyph
   * receives and none of them reads (`function Pm({active:e})` never uses `e`).
   * Kept so the call site matches the original; deliberately unused.
   */
  active: boolean;
}

/* ------------------------------------------------------------------ nav 22px */

/** Original: `function Pm({active:e})`. */
export function V6HomeIcon(_props: NavIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    </svg>
  );
}

/** Original: `function xm()`. */
export function V6DiscoverIcon(_props: NavIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
    </svg>
  );
}

/** Original: `function Lm()`. */
export function V6LibraryIcon(_props: NavIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4v16" />
      <path d="M8 8v12" />
      <path d="M12 6v14" />
      <path d="M16 6 20 20" />
    </svg>
  );
}

/** Original: `function Tm()`. */
export function V6PlaylistsIcon(_props: NavIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15V6" />
      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" />
      <path d="M16 6H3" />
      <path d="M12 18H3" />
    </svg>
  );
}

/** Original: `{ home: Pm, discover: xm, library: Lm, playlists: Tm }`. */
export const V6_NAV_ICONS: Record<V6NavId, ComponentType<NavIconProps>> = {
  home: V6HomeIcon,
  discover: V6DiscoverIcon,
  library: V6LibraryIcon,
  playlists: V6PlaylistsIcon,
};

/* ----------------------------------------------------------------- row glyphs */

/** Original: the row's 16×16 heart, `fill: z ? "currentColor" : "none"`. */
export function HeartGlyph({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.08C10.5 3.5 9.5 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/** Original: the row's 16×16 "more" — three 1-radius dots. */
export function MoreGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ mini 14px */

/** Original: the mini player's 14×14 pause. */
export function MiniPauseGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="5" width="3" height="14" rx="1" />
      <rect x="14" y="5" width="3" height="14" rx="1" />
    </svg>
  );
}

/** Original: the mini player's 14×14 play. */
export function MiniPlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 5.2a1 1 0 0 1 1.5-.86l9 5.8a1 1 0 0 1 0 1.72l-9 5.8A1 1 0 0 1 7 16.8V5.2Z" />
    </svg>
  );
}

/** Original: the mini player's 14×14 close — an X. */
export function MiniCloseGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ---------------------------------------------------------------- sheet glyphs */

/**
 * Original: the sheet's 18×18 "collapse" chevron. Note the attribute list stops
 * at `strokeWidth` — no `strokeLinecap` / `strokeLinejoin`.
 */
export function ChevronDownGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Original: the sheet's 18×18 "more" — also without the cap/join attributes. */
export function SheetMoreGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

/** Original: the sheet's 18×18 heart — same path, still no cap/join attributes. */
export function SheetHeartGlyph({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.08C10.5 3.5 9.5 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/**
 * Original: the first transport button's 20×20 glyph. It is the classic
 * "shuffle" arrow pair, but the original wires it to `progress − 10` — the
 * glyph and the handler are both kept as they were.
 */
export function ShuffleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15 21 21" />
      <path d="M4 4 9 9" />
    </svg>
  );
}

/** Original: the 28×28 "previous" glyph. */
export function SkipBackGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 18a1 1 0 0 1-1.5-.86V7.86A1 1 0 0 1 11 7l7 5a1 1 0 0 1 0 1.72l-7 5Z" />
      <rect x="4" y="5" width="3" height="14" rx="1" />
    </svg>
  );
}

/** Original: the 28×28 "next" glyph. */
export function SkipForwardGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 6a1 1 0 0 1 1.5-.86l7 5a1 1 0 0 1 0 1.72l-7 5A1 1 0 0 1 13 16V6Z" />
      <rect x="4" y="5" width="3" height="14" rx="1" transform="rotate(180 5.5 12)" />
    </svg>
  );
}

/** Original: the big 28×28 pause. */
export function BigPauseGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="5" width="4" height="14" rx="1" />
      <rect x="13" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

/** Original: the big 28×28 play, nudged 2px right by `translate-x-[2px]`. */
export function BigPlayGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[2px]">
      <path d="M7 5.2a1.5 1.5 0 0 1 2.2-1.3l9 5.8a1.5 1.5 0 0 1 0 2.6l-9 5.8A1.5 1.5 0 0 1 7 16.8V5.2Z" />
    </svg>
  );
}

/**
 * Original: the last transport button's 20×20 glyph — a "repeat" outline wired
 * to `progress + 10`, again kept exactly as it was.
 */
export function RepeatGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
      <path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
      <path d="M12 7v10" />
    </svg>
  );
}
