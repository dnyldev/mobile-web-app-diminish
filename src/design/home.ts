/**
 * Tokens + verbatim class strings for the Home screen (header + track list),
 * extracted from `enterprise-playlist 2.html` — the artifact whose app region
 * now sits in `_extract-enterprise/app.source.js` (formatted, lossless).
 *
 * Every value carries the class or inline style it came from, so it can be
 * re-verified against the original. Class strings are kept whole and per mode
 * so Tailwind's scanner sees each one, exactly like `HARNESS_CLASSES`.
 *
 * Deliberately NOT ported from that artifact (this list is read-only):
 * the swipe layers (queue / like), the 500 ms long-press action sheet, the
 * playing / active row state, equaliser bars, the hover "more" button, the
 * search overlay, the mini player, the sidebar, and the hamburger button.
 */
import type { ThemeMode } from '@/types/theme';

/** Geometry. Original: `h-[72px]` row, `w-12 h-12` cover, `h-[64px]` header. */
export const TRACK_LIST = {
  /** row content: `h-[72px]` */
  rowHeight: 72,
  /** hairline between rows: inline `marginLeft: "64px"` */
  dividerInset: 64,
  /** header bar: `h-[64px]` */
  headerHeight: 64,
  /** cover square: `w-12 h-12` */
  coverSize: 48,
  /** cover radius: `rounded-[10px]` */
  coverRadius: 10,
  /** duration column: `min-w-[36px]` */
  durationMinWidth: 36,
  /** `fontFamily: "JetBrains Mono, monospace"` on every duration */
  durationFontFamily: 'JetBrains Mono, monospace',
  /** the artifact set this on its root: `fontFamily: "Inter, -apple-system, ..."` */
  rootFontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
} as const;

/**
 * Themed values. The original alternated on `let K = u === "dark"` and wrote
 * `l ? "#71717A" : "#71717A"` for the duration — the same colour twice, kept
 * as written.
 */
export const HOME_COLORS: Record<
  ThemeMode,
  {
    divider: string;
    duration: string;
  }
> = {
  dark: { divider: '#1F1F23', duration: '#71717A' },
  light: { divider: '#F4F4F5', duration: '#71717A' },
};

/** Mode-independent class strings, verbatim from the original markup. */
export const HOME_STATIC = {
  /** scroll shell added for the phone frame (the artifact scrolled the document) */
  scroller: 'absolute inset-0 overflow-y-auto overscroll-contain',

  /** original main: `flex-1 px-0 pb-28 max-w-[640px] w-full mx-auto` */
  main: 'px-0 pb-28 max-w-[640px] w-full mx-auto',
  /** original list wrapper: `pt-2` */
  listWrapper: 'pt-2',

  /** original header: `h-[64px] sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl border-b transition-colors` */
  headerBar:
    'h-[64px] sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl border-b transition-colors',
  /** original header left group: `flex items-center gap-3` */
  headerLeft: 'flex items-center gap-3',
  /** original title stack: `flex flex-col leading-none` */
  titleStack: 'flex flex-col leading-none',
  /** original title: `text-[14px] font-semibold tracking-[-0.02em]` */
  headerTitle: 'text-[14px] font-semibold tracking-[-0.02em]',
  /** original subtitle: `text-[11px] text-zinc-500 tracking-wide` */
  headerSubtitle: 'text-[11px] text-zinc-500 tracking-wide',
  /** original search button: `w-9 h-9 rounded-full grid place-items-center transition-colors` */
  searchButton: 'w-9 h-9 rounded-full grid place-items-center transition-colors',

  /** original row group: `relative group` */
  rowGroup: 'relative group',
  /** original divider: `h-px` */
  divider: 'h-px',
  /** original row shell: `relative overflow-hidden h-[72px] select-none` */
  rowShell: 'relative overflow-hidden h-[72px] select-none',
  /**
   * original row content: `absolute inset-0 flex items-center h-[72px] px-4 sm:px-4 py-3`.
   * `cursor-pointer will-change-transform` are dropped with the pointer handling.
   */
  row: 'absolute inset-0 flex items-center h-[72px] px-4 sm:px-4 py-3',
  /** original cover: `relative w-12 h-12 rounded-[10px] overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-[1.02]` */
  cover:
    'relative w-12 h-12 rounded-[10px] overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-[1.02]',
  /** original cover inner: `absolute inset-0 grid place-items-center` */
  coverInner: 'absolute inset-0 grid place-items-center',
  /** original monogram: `text-white font-semibold text-[14px] tracking-[-0.02em] drop-shadow-sm` */
  letter: 'text-white font-semibold text-[14px] tracking-[-0.02em] drop-shadow-sm',
  /** original text column: `flex-1 min-w-0 ml-3` */
  textBlock: 'flex-1 min-w-0 ml-3',
  /** original title: `text-[15px] font-medium leading-[1.25] truncate tracking-[-0.01em] transition-colors` */
  trackTitle: 'text-[15px] font-medium leading-[1.25] truncate tracking-[-0.01em] transition-colors',
  /** original artist: `text-[13px] leading-[1.2] truncate mt-[1px]` */
  trackArtist: 'text-[13px] leading-[1.2] truncate mt-[1px]',
  /** original trailing column: `flex items-center gap-2 shrink-0 ml-3` */
  metaRow: 'flex items-center gap-2 shrink-0 ml-3',
  /** original duration: `text-[13px] tabular-nums tracking-[-0.01em] min-w-[36px] text-right` */
  duration: 'text-[13px] tabular-nums tracking-[-0.01em] min-w-[36px] text-right',

  /** loading / error note — no counterpart in the original, which had no async data */
  status: 'px-6 py-12 text-center text-[13px]',
} as const;

/** Per-mode class strings, verbatim from the original ternaries. */
export const HOME_CLASSES: Record<
  ThemeMode,
  {
    headerBar: string;
    headerTitle: string;
    searchButton: string;
    row: string;
    trackTitle: string;
    trackArtist: string;
    status: string;
  }
> = {
  dark: {
    headerBar: 'bg-[rgba(10,10,10,0.8)] border-[#1F1F23]',
    headerTitle: 'text-white',
    searchButton: 'hover:bg-[#18181B] text-zinc-400 hover:text-zinc-100',
    row: 'bg-[#0A0A0A] hover:bg-[#141416]',
    trackTitle: 'text-[#FAFAFA]',
    trackArtist: 'text-[#A1A1AA]',
    status: 'text-zinc-500',
  },
  light: {
    headerBar: 'bg-[rgba(255,255,255,0.8)] border-[#F4F4F5]',
    headerTitle: 'text-black',
    searchButton: 'hover:bg-[#F4F4F5] text-zinc-500 hover:text-zinc-900',
    row: 'bg-white hover:bg-[#FAFAFA]',
    trackTitle: 'text-[#111113]',
    trackArtist: 'text-[#71717A]',
    status: 'text-zinc-400',
  },
};
