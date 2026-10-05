/**
 * Tokens + verbatim class strings for the **Playlist v6** screen.
 *
 * Source: `../Nav-music-playlist.html.html`, whose app region (losslessly
 * re-indented) is `_extract-nav-playlist/app.source.js` — a single component,
 * lines 15-433. Every value below carries the class or the inline style it came
 * from, so it can be re-verified against the original.
 *
 * The screen never branched on a theme: it is light-only (`bg-[#F6F6F7]
 * text-zinc-900`), so nothing here is per-mode. Class strings are kept whole
 * and literal so Tailwind's content scanner finds every one of them.
 */

/** Fixed copy — the string children of the original JSX, verbatim. */
export const V6_COPY = {
  /** `<h1 className="text-[22px] font-semibold tracking-[-0.02em]">Playlist v6</h1>` */
  title: 'Playlist v6',
  /** `children:["• ",e.length," tracks • enterprise"]` */
  countPrefix: '• ',
  countSuffix: ' tracks • enterprise',
  /** the desktop-only pill: `"Glass nav • compact scroll"` */
  headerBadge: 'Glass nav • compact scroll',
  /** rail caption: `["glass + scroll compact • ",E?"36px / text":"56px / icon"]` */
  captionPrefix: 'glass + scroll compact • ',
  captionCompact: '36px / text',
  captionExpanded: '56px / icon',
  /** rail right-hand label: `"Dual pill • gap 12"` */
  railLabel: 'Dual pill • gap 12',
  /** sheet eyebrow: `"Now Playing • Pill System"` */
  sheetEyebrow: 'Now Playing • Pill System',
  /** the design-note card: `"Solution Note"` */
  noteTitle: 'Solution Note',
  /**
   * The artifact's own design note under the list, byte-for-byte. It is part of
   * the page, so it is ported; nothing else depends on it.
   */
  railNote: 'گلس ناو: bg-white/70 backdrop-blur-2xl + border-white/20 + inset shadow. وقتی اسکرول > 120px → ناو 300×36 با متن HOME/DISCOVER/LIBRARY/PLAYLISTS (10px uppercase) • اسکرول < 40px → برگشت به 340×56 آیکون. mini-player همیشه 56px گلس سفید 80%.',
  /** ...and the second design note, inside the bottom sheet. */
  noteBody: 'ناو باتم اصلی ثابت bottom-16 با عرض 340px میمونه. وقتی ترک پلی میشه، یک pill دوم هم‌اندازه (340×56) در bottom 84px با انیمیشن slide-up میاد بالا — فاصله 12px بینشون، هیچ تداخلی نیست. تپ روی mini-player → full sheet با blur پشتش، ناو و mini همچنان پشت blur دیده میشن.',
  /**
   * Original: the component's own `<style>` carried
   * `*{font-family:'Geist',system-ui,sans-serif}`. Applied to the screen root
   * here — `font-family` is inherited and no descendant overrides it, so the
   * two are equivalent. The face itself is bundled (see `styles/index.css`);
   * the original's `@import` from fonts.googleapis.com is the one thing that
   * could not be carried over — it breaks the offline requirement.
   */
  rootFontFamily: "'Geist', system-ui, sans-serif",
} as const;

/** Geometry. Every number is the literal from a class or an inline style. */
export const V6_METRICS = {
  /** header bar: `h-[64px]` */
  headerHeight: 64,
  /** header/content column: `max-w-[720px]` */
  contentMaxWidth: 720,
  /** sheet column: `max-w-[380px]` */
  sheetMaxWidth: 380,

  /** nav shell: inline `width: E ? "300px" : "340px"` */
  navWidth: 340,
  navWidthCompact: 300,
  /** nav shell: inline `height: E ? "36px" : "56px"` */
  navHeight: 56,
  navHeightCompact: 36,
  /** nav shell: `bottom-4` */
  navBottom: 16,

  /** mini player: inline `width:"340px" height:"56px" bottom:"84px"` */
  miniWidth: 340,
  miniHeight: 56,
  miniBottom: 84,
  /** the 12px gap the two pills are designed around: 84 − (16 + 56) */
  dockGap: 12,

  /** row: `h-[64px]` */
  rowHeight: 64,
  /** cover tile: `w-11 h-11` */
  coverSize: 44,
  /** cover radius: `rounded-[10px]` */
  coverRadius: 10,
  /** duration column: `w-[32px]` */
  durationWidth: 32,
  /** sheet play button: `w-[72px] h-[72px]` */
  playButtonSize: 72,

  /** sheet panel: inline `maxHeight:"88vh"` */
  sheetMaxHeight: '88vh',
  /** sheet radius: `rounded-t-[24px]` */
  sheetRadius: 24,

  /** scroll → compact: `window.scrollY > 120` */
  compactAt: 120,
  /** scroll → expanded: `window.scrollY < 40` */
  expandAt: 40,

  /** progress clock: `setInterval(..., 100)` */
  tickMs: 100,
  /** progress step per tick: `S + 0.15` */
  step: 0.15,
  /** the seek bar's own range: `<input type="range" min={0} max={100}>` */
  seekMax: 100,
} as const;

/** Motion, verbatim from the inline `animation` / `ease-[...]` strings. */
export const V6_MOTION = {
  /** nav: `ease-[cubic-bezier(0.16,1,0.3,1)]` */
  navEase: 'cubic-bezier(0.16,1,0.3,1)',
  /** mini player: `animation:"slideUp 0.35s cubic-bezier(0.16,1,0.3,1)"` */
  miniSlide: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
  /** bottom sheet: `animation:"sheetUp 0.42s cubic-bezier(0.16,1,0.3,1)"` */
  sheetSlide: 'sheetUp 0.42s cubic-bezier(0.16,1,0.3,1)',
} as const;

/**
 * The screen root. Original:
 * `min-h-screen bg-[#F6F6F7] text-zinc-900 selection:bg-zinc-900 selection:text-white antialiased`.
 *
 * `min-h-screen` is dropped on purpose — see `README > Fidelity notes`.
 */
export const V6_ROOT_CLASS =
  'bg-[#F6F6F7] text-zinc-900 selection:bg-zinc-900 selection:text-white antialiased';

/**
 * The original scrolled `window`; inside this app the screen lives in a
 * fixed-height phone frame, so the document scroll becomes a scroll shell and
 * every `fixed` layer below is positioned `absolute` inside the frame instead.
 */
export const V6_SCROLLER_CLASS = 'absolute inset-0 overflow-y-auto overscroll-contain';

/** Top bar + the list rail. */
export const V6_STATIC = {
  /** original header: `sticky top-0 z-10 bg-[#F6F6F7]/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20` */
  header:
    'sticky top-0 z-10 bg-[#F6F6F7]/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20',
  /** original header inner: `mx-auto max-w-[720px] px-6 md:px-8 h-[64px] flex items-center justify-between` */
  headerInner: 'mx-auto max-w-[720px] px-6 md:px-8 h-[64px] flex items-center justify-between',
  /** original: `flex items-baseline gap-3` */
  headerLeft: 'flex items-baseline gap-3',
  /** original h1: `text-[22px] font-semibold tracking-[-0.02em]` */
  headerTitle: 'text-[22px] font-semibold tracking-[-0.02em]',
  /** original count: `text-[13px] font-medium text-zinc-500 tracking-wide` */
  headerCount: 'text-[13px] font-medium text-zinc-500 tracking-wide',
  /** original badge wrapper: `hidden md:flex items-center gap-2` */
  headerBadgeWrap: 'hidden md:flex items-center gap-2',
  /** original badge: `h-7 px-3 rounded-full bg-white border border-zinc-200 text-[12px] font-medium flex items-center gap-1.5` */
  headerBadge:
    'h-7 px-3 rounded-full bg-white border border-zinc-200 text-[12px] font-medium flex items-center gap-1.5',
  /** original badge dot: `w-2 h-2 rounded-full bg-emerald-500 animate-pulse` */
  headerBadgeDot: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse',

  /** original main: `mx-auto max-w-[720px] px-3 md:px-8 pb-[180px]` */
  main: 'mx-auto max-w-[720px] px-3 md:px-8 pb-[180px]',
  /** original rail: `mt-6 mb-3 px-3 flex items-center justify-between` */
  rail: 'mt-6 mb-3 px-3 flex items-center justify-between',
  /** original rail left: `flex items-center gap-2` */
  railLeft: 'flex items-center gap-2',
  /** original counter chip: `h-6 w-6 rounded-full bg-zinc-900 text-white grid place-items-center text-[11px] font-semibold` */
  railCount:
    'h-6 w-6 rounded-full bg-zinc-900 text-white grid place-items-center text-[11px] font-semibold',
  /** original caption: `text-[13px] font-medium text-zinc-500` */
  railCaption: 'text-[13px] font-medium text-zinc-500',
  /** original label: `text-[11px] tracking-widest font-medium text-zinc-400 uppercase` */
  railLabel: 'text-[11px] tracking-widest font-medium text-zinc-400 uppercase',

  /** original card: `rounded-[20px] bg-white border border-zinc-200/70 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]` */
  list: 'rounded-[20px] bg-white border border-zinc-200/70 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]',

  /** original note under the list: `mt-6 px-3 text-[11px] leading-relaxed text-zinc-400` */
  railNote: 'mt-6 px-3 text-[11px] leading-relaxed text-zinc-400',
  /** original note card: `mt-10 rounded-2xl bg-zinc-50 border border-zinc-200 p-4` */
  noteCard: 'mt-10 rounded-2xl bg-zinc-50 border border-zinc-200 p-4',
  /** original: `text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-3` */
  noteTitle: 'text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-3',
  /** original: `text-[13px] leading-relaxed text-zinc-600` */
  noteBody: 'text-[13px] leading-relaxed text-zinc-600',
  /** original spacer: `h-6` */
  noteSpacer: 'h-6',
} as const;

/** One 64px track row. Original: the `e.map((m,S) => ...)` body. */
export const V6_ROW = {
  /** original shell: `group flex items-center gap-3 px-3 md:px-4 h-[64px] border-b last:border-0 border-zinc-100 cursor-pointer transition-colors` */
  shell:
    'group flex items-center gap-3 px-3 md:px-4 h-[64px] border-b last:border-0 border-zinc-100 cursor-pointer transition-colors',
  /** `N ? "bg-zinc-50"` */
  active: 'bg-zinc-50',
  /** `: "hover:bg-zinc-50/80 bg-white"` */
  idle: 'hover:bg-zinc-50/80 bg-white',

  /** original cover: `shrink-0 w-11 h-11 rounded-[10px] grid place-items-center text-white text-[13px] font-semibold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]` */
  cover:
    'shrink-0 w-11 h-11 rounded-[10px] grid place-items-center text-white text-[13px] font-semibold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
  /** original: `min-w-0 flex-1 flex flex-col justify-center` */
  textBlock: 'min-w-0 flex-1 flex flex-col justify-center',
  /** original: `flex items-baseline gap-2 min-w-0` */
  titleRow: 'flex items-baseline gap-2 min-w-0',
  /** original title: `truncate text-[14.5px] font-medium tracking-[-0.01em]` */
  title: 'truncate text-[14.5px] font-medium tracking-[-0.01em]',
  /**
   * Original wrote the SAME colour in both branches —
   * `${N ? "text-zinc-900" : "text-zinc-900"}` — kept as written.
   */
  titleActive: 'text-zinc-900',
  titleIdle: 'text-zinc-900',
  /** original equaliser: `flex items-center gap-[2px] ml-1` */
  eq: 'flex items-center gap-[2px] ml-1',
  /** original bars: `w-[2px] h-3` / `h-2` / `h-3.5`, pulse offset 0 / 0.2s / 0.4s */
  eqBar1: 'w-[2px] h-3 bg-zinc-900 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]',
  eqBar2: 'w-[2px] h-2 bg-zinc-900 rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]',
  eqBar3: 'w-[2px] h-3.5 bg-zinc-900 rounded-full animate-[pulse_0.8s_ease-in-out_0.4s_infinite]',
  /** original artist: `truncate text-[12.5px] text-zinc-500 font-normal` */
  artist: 'truncate text-[12.5px] text-zinc-500 font-normal',

  /** original trailing column: `flex items-center gap-1 shrink-0` */
  actions: 'flex items-center gap-1 shrink-0',
  /** original duration: `text-[12px] font-medium text-zinc-400 tabular-nums w-[32px] text-right mr-1` */
  duration: 'text-[12px] font-medium text-zinc-400 tabular-nums w-[32px] text-right mr-1',
  /** original like button: `w-8 h-8 grid place-items-center rounded-full transition-colors` */
  likeButton: 'w-8 h-8 grid place-items-center rounded-full transition-colors',
  /** `z ? "text-red-500 bg-red-50" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"` */
  liked: 'text-red-500 bg-red-50',
  unliked: 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100',
  /** original more button: `w-8 h-8 grid place-items-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors` */
  moreButton:
    'w-8 h-8 grid place-items-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors',
} as const;

/**
 * The glass nav pill. Original shell:
 * `fixed left-1/2 -translate-x-1/2 bottom-4 z-50 flex items-center justify-between p-1
 *  bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/20
 *  shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-full
 *  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`
 * — `fixed` → `absolute` for the phone frame.
 */
export const V6_NAV = {
  shell:
    'absolute left-1/2 -translate-x-1/2 bottom-4 z-50 flex items-center justify-between p-1 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  /** original item: `relative flex-1 h-full rounded-full overflow-hidden transition-all duration-300` */
  item: 'relative flex-1 h-full rounded-full overflow-hidden transition-all duration-300',
  /** `S ? "bg-[#E8E8EB]/90 text-zinc-900" : "text-zinc-400 hover:text-zinc-700"` */
  itemActive: 'bg-[#E8E8EB]/90 text-zinc-900',
  itemIdle: 'text-zinc-400 hover:text-zinc-700',
  /** original layer: `absolute inset-0 grid place-items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]` */
  layer:
    'absolute inset-0 grid place-items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  /** icon layer: `${E ? "opacity-0 scale-[0.8] pointer-events-none" : "opacity-100 scale-100"}` */
  iconHidden: 'opacity-0 scale-[0.8] pointer-events-none',
  iconShown: 'opacity-100 scale-100',
  /** label layer: `${E ? "opacity-100 scale-100" : "opacity-0 scale-[0.9] pointer-events-none"}` */
  labelShown: 'opacity-100 scale-100',
  labelHidden: 'opacity-0 scale-[0.9] pointer-events-none',
  /** original label: `text-[10px] font-medium tracking-widest uppercase leading-none` */
  label: 'text-[10px] font-medium tracking-widest uppercase leading-none',
} as const;

/**
 * The mini player pill. Original shell:
 * `fixed left-1/2 z-40 flex items-center gap-2.5 px-2 pr-1.5 bg-white/80 backdrop-blur-2xl
 *  backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]
 *  rounded-full transition-all duration-300` — `fixed` → `absolute`.
 */
export const V6_MINI = {
  shell:
    'absolute left-1/2 z-40 flex items-center gap-2.5 px-2 pr-1.5 bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-full transition-all duration-300',
  /** original: `flex items-center gap-2.5 flex-1 min-w-0 text-left` */
  open: 'flex items-center gap-2.5 flex-1 min-w-0 text-left',
  /** original cover: `shrink-0 w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-semibold` */
  cover: 'shrink-0 w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-semibold',
  /** original: `min-w-0 flex-1` */
  textBlock: 'min-w-0 flex-1',
  /** original: `truncate text-[13.5px] font-medium tracking-[-0.01em] leading-[1.1]` */
  title: 'truncate text-[13.5px] font-medium tracking-[-0.01em] leading-[1.1]',
  /** original: `truncate text-[11.5px] text-zinc-500 leading-[1.2]` */
  artist: 'truncate text-[11.5px] text-zinc-500 leading-[1.2]',
  /** original: `flex items-center gap-0.5 shrink-0` */
  buttons: 'flex items-center gap-0.5 shrink-0',
  /** original play/pause: `w-9 h-9 rounded-full bg-zinc-900 text-white grid place-items-center hover:bg-zinc-800 transition-colors` */
  toggle:
    'w-9 h-9 rounded-full bg-zinc-900 text-white grid place-items-center hover:bg-zinc-800 transition-colors',
  /** original close: `w-9 h-9 rounded-full bg-[#F1F1F3] text-zinc-600 grid place-items-center hover:bg-[#E8E8EB] transition-colors` */
  close:
    'w-9 h-9 rounded-full bg-[#F1F1F3] text-zinc-600 grid place-items-center hover:bg-[#E8E8EB] transition-colors',
} as const;

/**
 * The "Now Playing" bottom sheet. Original:
 * backdrop `fixed inset-0 z-[60] bg-zinc-900/10 backdrop-blur-[8px]`,
 * panel    `fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[24px]
 *           shadow-[0_-8px_40px_rgba(0,0,0,0.16)] border-t border-zinc-200 flex flex-col`
 * — both `fixed` → `absolute`.
 */
export const V6_SHEET = {
  backdrop: 'absolute inset-0 z-[60] bg-zinc-900/10 backdrop-blur-[8px]',
  panel:
    'absolute bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.16)] border-t border-zinc-200 flex flex-col',
  /** original: `shrink-0 pt-3 pb-2 grid place-items-center` */
  handleWrap: 'shrink-0 pt-3 pb-2 grid place-items-center',
  /** original: `w-9 h-1.5 rounded-full bg-zinc-200` */
  handle: 'w-9 h-1.5 rounded-full bg-zinc-200',
  /** original: `overflow-y-auto px-6 pb-8 flex-1` */
  body: 'overflow-y-auto px-6 pb-8 flex-1',
  /** original: `mx-auto max-w-[380px]` */
  column: 'mx-auto max-w-[380px]',
  /** original: `flex items-center justify-between mt-1 mb-6` */
  topRow: 'flex items-center justify-between mt-1 mb-6',
  /** original: `w-9 h-9 rounded-full bg-zinc-100 grid place-items-center text-zinc-600` */
  circleButton: 'w-9 h-9 rounded-full bg-zinc-100 grid place-items-center text-zinc-600',
  /** original: `text-[11px] tracking-widest font-semibold text-zinc-400 uppercase` */
  eyebrow: 'text-[11px] tracking-widest font-semibold text-zinc-400 uppercase',
  /** original artwork: `aspect-square w-full rounded-[24px] grid place-items-center text-white text-[56px] font-semibold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_40px_rgba(0,0,0,0.15)] mb-6` */
  artwork:
    'aspect-square w-full rounded-[24px] grid place-items-center text-white text-[56px] font-semibold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_40px_rgba(0,0,0,0.15)] mb-6',
  /** original: `flex items-start justify-between gap-4 mb-6` */
  titleRow: 'flex items-start justify-between gap-4 mb-6',
  /** original: `min-w-0` */
  titleBlock: 'min-w-0',
  /** original h2: `text-[22px] font-semibold tracking-[-0.02em] leading-tight truncate` */
  title: 'text-[22px] font-semibold tracking-[-0.02em] leading-tight truncate',
  /** original p: `text-[14px] text-zinc-500 mt-0.5 truncate` */
  artist: 'text-[14px] text-zinc-500 mt-0.5 truncate',
  /** original like button: `w-10 h-10 rounded-full grid place-items-center border transition-colors shrink-0` */
  likeButton: 'w-10 h-10 rounded-full grid place-items-center border transition-colors shrink-0',
  /** `${f.has(a.id) ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-zinc-200 text-zinc-400"}` */
  liked: 'bg-red-50 border-red-200 text-red-500',
  unliked: 'bg-white border-zinc-200 text-zinc-400',

  /** original seek block: `mb-8` */
  seekBlock: 'mb-8',
  /** original: `h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative` */
  seekTrack: 'h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative',
  /** original fill: `absolute left-0 top-0 bottom-0 bg-zinc-900 rounded-full transition-all` */
  seekFill: 'absolute left-0 top-0 bottom-0 bg-zinc-900 rounded-full transition-all',
  /** original range: `absolute inset-0 w-full opacity-0 cursor-pointer` */
  seekInput: 'absolute inset-0 w-full opacity-0 cursor-pointer',
  /** original times: `flex justify-between mt-2 text-[11px] font-medium tabular-nums text-zinc-400` */
  seekTimes: 'flex justify-between mt-2 text-[11px] font-medium tabular-nums text-zinc-400',

  /** original: `flex items-center justify-between` */
  transport: 'flex items-center justify-between',
  /** original outer buttons: `w-12 h-12 grid place-items-center text-zinc-400 hover:text-zinc-900` */
  sideButton: 'w-12 h-12 grid place-items-center text-zinc-400 hover:text-zinc-900',
  /** original skip buttons: `w-14 h-14 grid place-items-center text-zinc-900` */
  skipButton: 'w-14 h-14 grid place-items-center text-zinc-900',
  /** original play button: `w-[72px] h-[72px] rounded-full bg-zinc-900 text-white grid place-items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-[0.98] active:scale-[0.96] transition-transform` */
  playButton:
    'w-[72px] h-[72px] rounded-full bg-zinc-900 text-white grid place-items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-[0.98] active:scale-[0.96] transition-transform',
} as const;

/** The four destinations. Original: the inline `[{id:"home",Icon:Pm,label:"HOME"}, …]`. */
export const V6_NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'discover', label: 'DISCOVER' },
  { id: 'library', label: 'LIBRARY' },
  { id: 'playlists', label: 'PLAYLISTS' },
] as const;

export type V6NavId = (typeof V6_NAV_ITEMS)[number]['id'];

/** Initial state, one line per `useState` in the original. */
export const V6_DEFAULTS = {
  /** `useState("playlists")` */
  activeNavId: 'playlists' as V6NavId,
  /** `useState(7)` */
  activeTrackId: 7 as number | null,
  /** `useState(!0)` — it starts playing */
  playing: true,
  /** `useState(32)` */
  progress: 32,
  /** `useState(() => new Set([2,7,12]))` */
  likedIds: [2, 7, 12] as readonly number[],
  /** `useState(!1)` */
  sheetOpen: false,
  /** `useState(!0)` */
  miniVisible: true,
} as const;
