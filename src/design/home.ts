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

  /** error note — no counterpart in the original, which had no async data. The
   *  loading state is the skeleton list below, not a note. */
  status: 'px-6 py-12 text-center text-[13px]',
} as const;

/**
 * The library's loading row: `TrackRow`'s own geometry, greyed out.
 *
 * The list used to say "Loading tracks…" in the middle of the screen, while the
 * search view drew skeleton rows — the same wait, told two different ways. This
 * is the search view's idiom (`ADD_SONG_CLASS.searchSkeleton*`) expressed in
 * this screen's tokens, so the wait reads as the row that is arriving rather
 * than as an announcement.
 *
 * The bars are sized from the row they stand in for — 48px cover, 15px title
 * line, 13px artist line, the 36px duration column — and the rows themselves
 * compose `HOME_STATIC.rowShell` / `HOME_STATIC.row`, so a skeleton and the
 * track that replaces it cannot be different heights.
 *
 * No colour of its own: the fill is `HOME_COLORS[theme].divider`, the hairline
 * this screen already draws between rows.
 */
export const TRACK_ROW_SKELETON = {
  /**
   * How many rows stand in for the catalogue.
   *
   * The frame is `min-h-[720px]` under a 64px header, so eight rows fill the
   * visible list without the skeleton scrolling.
   */
  count: 8,
  cover: 'w-12 h-12 rounded-[10px] shrink-0 animate-pulse',
  /** the text column's own stack: two bars where the title and artist go */
  textBlock: 'flex-1 min-w-0 ml-3 flex flex-col gap-2',
  barTitle: 'h-4 w-32 rounded-full animate-pulse',
  barSub: 'h-3 w-20 rounded-full animate-pulse',
  /** the trailing column, where a real row prints its `m:ss` */
  barDuration: 'h-3 w-[36px] rounded-full animate-pulse',
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

/**
 * The row the add-music flow shows WHILE a local file is still being read.
 *
 * It is the SAME 72px row as `TrackRow` — the component composes `HOME_STATIC`
 * rather than re-declaring the geometry, so the two cannot drift — with the
 * artist line carrying the upload's own label and a 2px progress track under it.
 *
 * The values are this app's own tokens. The artifact drew that bar in `#1C1C1E` /
 * `#F0F0F0` with a `#FFFFFF` / `#000000` fill and an `#8E8E93` percentage, which
 * in this design system ARE the hairline, the ink and the muted text (the same
 * three `HOME_COLORS` already names). The percentage itself reuses
 * `HOME_STATIC.duration`, so the numbers in that column stay one weight.
 */
export const UPLOAD_ROW = {
  /** original: the bar under the row's title — `mt-[6px] h-[2px] w-full rounded-full overflow-hidden` */
  progressTrack: 'relative mt-[6px] h-[2px] w-full overflow-hidden rounded-full',
  /** original: `absolute left-0 top-0 h-full transition-all duration-100 ease-linear` */
  progressFill: 'absolute left-0 top-0 h-full transition-all duration-100 ease-linear',
  /**
   * The ✕ that cancels (the artifact's `H`). Its 32px disc was `active:scale-90`;
   * at this row's scale it takes the app's own 0.95, the idiom `NavActionButton`
   * and `ThemeToggle` already use.
   */
  cancelButton:
    'w-7 h-7 rounded-full grid place-items-center shrink-0 transition-transform duration-150 active:scale-95',
} as const;

/** Per-mode surfaces of the uploading row. */
export const UPLOAD_ROW_CLASSES: Record<
  ThemeMode,
  {
    progressTrack: string;
    progressFill: string;
    cancelButton: string;
  }
> = {
  dark: {
    progressTrack: 'bg-[#1F1F23]',
    progressFill: 'bg-[#FAFAFA]',
    cancelButton: 'bg-white/[0.06] text-[#71717A] hover:bg-white/[0.1] hover:text-[#FAFAFA]',
  },
  light: {
    progressTrack: 'bg-[#F4F4F5]',
    progressFill: 'bg-[#18181B]',
    cancelButton: 'bg-black/[0.06] text-[#71717A] hover:bg-black/[0.1] hover:text-[#111113]',
  },
};
