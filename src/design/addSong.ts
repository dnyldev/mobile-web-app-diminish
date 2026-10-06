/**
 * Tokens + verbatim class strings for the **Add music** flow.
 *
 * Source: `../Add music.html`, whose app region (losslessly re-indented) is
 * `_extract-add-music/app.source.js` — a single component, lines 39-746. Every
 * value below carries the class or the inline style it came from, so it can be
 * re-verified against the original:
 *
 *   the toast            lines 249-253
 *   the API search panel 400-462
 *
 * The DRAWER is not this artifact's any more. Its two-path sheet (lines 289-399)
 * was replaced on Danial's instruction by the one from `Library/Add-song.html`
 * (5421-5501): every value below whose `Original:` names a `backgroundColor:` or
 * a `rotate-180 opacity-40` — the panel, the grabber, the two 56px rows, the
 * home indicator — comes from THERE, and the Add music sheet's cards, chips and
 * note box went with it.
 *
 * The artifact's other branch — the floating `ADD NEW SONG` pill, lines 254-288,
 * with its shimmer and its two cross-fading layers — is deliberately NOT here
 * (decision: Danial). Its job moved to the navbar's `+` button, so the pill, its
 * geometry, its timings and its palette entries left with it. `NavActionButton`
 * is what replaced it.
 *
 * That artifact's screen also carried a list, a glass nav, a mini player and a
 * Now Playing sheet — all four duplicate things this app already has, so they are
 * deliberately left in `_extract-add-music/`. The `Wl` / `nf` / `En` tables it
 * shares with Playlist v6 are imported from `data/playlistV6.ts`, not copied.
 *
 * ## The one axis the artifact could not have had
 *
 * Its screen was light-only (`bg-[#F6F6F7] text-zinc-900`), so every surface
 * here was written once, in light. This app has a theme switch, so each surface
 * is now per-mode, with the LIGHT values byte-identical to the artifact and the
 * dark ones derived from the app's own dark tokens — the same treatment
 * `ThemePalette` gave the mini player, which came from a light-only screen for
 * the same reason.
 */
import type { ThemeMode } from '@/types/theme';

/**
 * Geometry and timings. Original inline styles are named in the comments.
 */
export const ADD_SONG_METRICS = {
  /**
   * The drawer, from `Library/Add-song.html` (5421-5501): a 390px panel, a 36×4
   * grabber, a centered 17/22 title, two 56px rows and a 134×5 home indicator.
   */
  /** panel: `w-full max-w-[390px]`. The app's frame is already 390, so this is the artifact's own cap. */
  sheetMaxWidth: 390,
  /** panel inline style: `padding: "12px 24px 32px 24px"` */
  sheetPadding: '12px 24px 32px 24px',
  /** panel inline style: `boxShadow: "0 -10px 40px rgba(0,0,0,0.12)"` */
  sheetShadow: '0 -10px 40px rgba(0,0,0,0.12)',
  /** panel class: `rounded-t-[24px]`, applied in the class string */

  /** a path row: inline `height: "56px"`, `padding: "0 4px"` */
  rowHeight: 56,
  rowPaddingX: 4,
  /** the leading disc: `w-10 h-10` with a 20px glyph at `strokeWidth: 1.8` */
  rowLeadSize: 40,
  rowIconSize: 20,
  rowIconStroke: 1.8,
  /** row title: inline `fontSize: "16px", lineHeight: "19px"` */
  rowTitleSize: 16,
  rowTitleLine: 19,
  /** row sub: inline `fontSize: "13px", color: "#8E8E93"` */
  rowSubSize: 13,
  rowSubColor: '#8E8E93',
  /** trailing chevron: `size:16` + `rotate-180 opacity-40` */
  rowChevronSize: 16,

  /** title: inline `fontSize: "17px", lineHeight: "22px"` */
  sheetTitleSize: 17,
  sheetTitleLine: 22,

  /**
   * Entrance. The template's own: the backdrop fades in `0.3s ease-out` and the
   * panel rises on `slideUp 0.32s cubic-bezier(0.32,0.72,0,1)`.
   *
   * The keyframe NAMES differ from the template's on purpose: this file already
   * owns a `fadeIn` (it bakes in `translateX(-50%)` for the toast and the search
   * panel, both `left-1/2`), and `slideUp` is PlaylistV6's. `sheetFadeIn` is new;
   * for the panel, this file's `sheetUp` has the template's `slideUp` body
   * verbatim (`translateY(100%)` → `translateY(0)`), so only the duration and
   * curve come from the template.
   */
  backdropAnimation: 'sheetFadeIn 0.3s ease-out',
  panelAnimation: 'sheetUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)',

  /**
   * The search view's own numbers, all from `Library/Add-song.html`:
   *
   *   the debounce    600ms — the effect at 5066-5075 filters once the typing
   *                   stops. A blank query clears the list immediately;
   *                   anything else puts the three skeletons up for 600ms.
   *   the autofocus   100ms after the view opens (`setTimeout(() => v.current?.focus(), 100)`)
   *   the chips       `Ie = rl.filter(m => m.trending).slice(0, 5)`
   */
  searchDebounceMs: 600,
  searchFocusDelayMs: 100,
  searchTrendingCount: 5,
  /** the skeleton rows while the debounce runs: `[1,2,3].map(…)` */
  searchSkeletonCount: 3,
  /** a result row: inline `height: "72px"` */
  searchRowHeight: 72,
  /** its cover: inline `width/height: "52px", borderRadius: "14px"` and a `fontSize: "20px"` letter */
  searchCoverSize: 52,
  searchCoverRadius: 14,
  searchCoverLetterSize: 20,
  /** its two lines: inline `fontSize: "16px", lineHeight: "20px"` and `fontSize: "13.5px"` */
  searchTitleSize: 16,
  searchTitleLine: 20,
  searchSubSize: 13.5,
  /** its add disc: inline `width/height: "32px"` */
  searchAddSize: 32,
  /** glyph sizes, each one the call site's own argument */
  searchFieldGlyphSize: 16,
  searchEmptyGlyphSize: 32,
  searchEmptyGlyphStroke: 1.6,
  searchNoResultsGlyphSize: 28,
  searchBackGlyphSize: 22,
  searchBackGlyphStroke: 2.2,
  searchClearGlyphSize: 12,
  searchSpinnerGlyphSize: 16,
  searchCheckGlyphSize: 18,
  searchCheckGlyphStroke: 2.5,
  searchPlusGlyphSize: 16,
  searchPlusGlyphStroke: 2,

  /** how long a toast stays up — the artifact's `setTimeout(() => L(!1), 2200)`, now shared by all three texts */
  localToastMs: 2200,
  /** local path: `setTimeout(() => W.current?.click(), 200)` */
  filePickerDelayMs: 200,
  /** search path: `setTimeout(() => y(!0), 180)` */
  searchOpenDelayMs: 180,

  /**
   * The uploading row's own clock — the artifact's `setInterval(…, 80)` with
   * `xA += Math.random() * 8 + 3` per tick. Each tick adds 3..11, so the bar
   * reaches 100 in roughly **0.7–2.7s** (≈14 ticks, ~1.1s, on average).
   * `uploadStepMin` / `uploadStepRandom` are the two literals of that expression.
   */
  uploadTickMs: 80,
  uploadStepMin: 3,
  uploadStepRandom: 8,
  /** right after the bar hits 100: `setTimeout(…, 900)` before the row lands */
  uploadCommitMs: 900,

  /** search path: `setTimeout(…, 900)` before a picked result lands */
  searchAddMs: 900,
  /** search path: `setTimeout(…, 1500)` before the ✓ goes back to a `+` */
  searchAddedMs: 1500,

  /**
   * The ✓ pop, verbatim from the artifact's own keyframes:
   * `animate-[checkSpring_0.4s_cubic-bezier(0.34,1.56,0.64,1)]`. The keyframe
   * itself lives in `AddSong/addSongKeyframes.css`.
   */
  checkSpringAnimation: 'checkSpring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',

  /** the three faces the artifact's own `*{font-family:…}` rule named */
  rootFontFamily: "Geist, Vazirmatn, system-ui, sans-serif",
} as const;

/** The flow's class strings, whole and literal so Tailwind's scanner sees each one. */
export const ADD_SONG_CLASS = {
  /**
   * Original: `fixed left-1/2 -translate-x-1/2 top-[76px] z-[80] bg-zinc-900
   * text-white text-[12px] font-medium px-4 py-2 rounded-full shadow-[…]
   * pointer-events-none` — `fixed` → `absolute`, so `top-[76px]` is 76px down
   * the phone frame rather than down the viewport. The offset itself is the
   * artifact's own.
   */
  toast:
    'absolute left-1/2 -translate-x-1/2 top-[76px] z-[80] text-[12px] font-medium px-4 py-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)] pointer-events-none',

  /**
   * Original: `absolute inset-0 bg-black/40 backdrop-blur-[12px]` — `fixed` → `absolute`.
   *
   * The `z` is NOT the template's (`z-40` on its wrapper). Its page had no bottom
   * nav; this one does, and the bar's stack is `z-50` — so the drawer has to clear
   * it. The ladder here is the one this flow already used for its first sheet:
   * nav `50` → backdrop `55` → panel `66` → search backdrop `70` → search panel
   * `71` → toast `80`.
   */
  sheetBackdrop: 'absolute inset-0 z-[55] bg-black/40 backdrop-blur-[12px]',
  /** Original panel: `absolute bottom-0 w-full max-w-[390px] rounded-t-[24px] flex flex-col` — `z` as above */
  sheetPanel: 'absolute bottom-0 z-[66] w-full max-w-[390px] rounded-t-[24px] flex flex-col',
  /** Original grabber row: `flex justify-center pt-1 pb-4` */
  handleWrap: 'flex justify-center pt-1 pb-4',
  /** Original grabber: `w-9 h-1 rounded-full` */
  handle: 'w-9 h-1 rounded-full',
  /** Original title: `text-center font-semibold mb-5` */
  sheetTitle: 'text-center font-semibold mb-5',
  /** Original list: `flex flex-col gap-3` */
  sheetRows: 'flex flex-col gap-3',
  /** Original row: `flex items-center gap-4 w-full text-left rounded-2xl active:scale-[0.98] transition-transform hover:opacity-80` */
  sheetRow:
    'flex items-center gap-4 w-full text-left rounded-2xl active:scale-[0.98] transition-transform hover:opacity-80',
  /** Original leading disc: `w-10 h-10 rounded-full flex items-center justify-center shrink-0` */
  rowLead: 'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
  /** Original text column: `flex-1 min-w-0` */
  rowBody: 'flex-1 min-w-0',
  /** Original row title: `font-medium` (16/19 inline) */
  rowTitle: 'font-medium',
  /** Original row sub: `mt-[2px]` (13px + #8E8E93 inline) */
  rowSub: 'mt-[2px]',
  /**
   * Original trailing chevron: `rotate-180 opacity-40`. The artifact draws
   * lucide's `ChevronLeft` (`m15 18-6-6 6-6`) and mirrors it — kept as-is, so
   * the drawer's markup matches the template's element for element.
   */
  rowChevron: 'rotate-180 opacity-40',
  /**
   * The template's footer — an `h-4` spacer and the `134×5` home indicator
   * (`bg-[#3A3A3C]` / `bg-black`) — is DELIBERATELY NOT PORTED (decision: Danial).
   * It is the same copy of the indicator the nav bar dropped for the same reason:
   * on a real device iOS already draws one at that exact spot, so the artifact's
   * version is a duplicate. With it gone the panel ends on its own `32px` bottom
   * padding, which is what the template left above the indicator's row anyway.
   */

  /**
   * The Add music artifact's two 132px cards, its chips, its note box and every
   * gradient they carried are GONE with the sheet they belonged to (decision:
   * Danial — the drawer is the Add-song one now, see README). Their class strings
   * are not kept here: nothing renders them any more, and a stored recipe with no
   * consumer reads as an option that is still on the table.
   */

  /**
   * The SEARCH VIEW (`Add-song.html` 5268-5418) — the drawer's second row.
   *
   * In the template it is a full SCREEN, not a floating panel: picking `Search
   * Archive` closes the drawer and switches the page to it. So here it renders
   * where the screen renders, inside the frame, and `absolute inset-0` does what
   * the template's `min-h-screen` did — with one addition, `pb-28`: this app's
   * bottom nav sits over the frame and the template had no nav to clear, so the
   * scroller carries the same tail `HomeScreen` does.
   *
   * (The Add music artifact's floating `top-[72px]` panel, its blur backdrop, its
   * 44px field and its `max-h-[360px]` list are gone with it.)
   */
  searchRoot: 'absolute inset-0 flex flex-col overflow-y-auto overscroll-contain pb-28',
  /** Original header: `flex items-center gap-3 px-4 pt-3 pb-3` */
  searchHeader: 'flex items-center gap-3 px-4 pt-3 pb-3',
  /** Original back button: `w-9 h-9 -ml-1 flex items-center justify-center rounded-full active:scale-90 transition` */
  searchBack:
    'w-9 h-9 -ml-1 flex items-center justify-center rounded-full active:scale-90 transition',
  /** Original field: `flex-1 flex items-center h-9 px-3 rounded-full gap-2` */
  searchField: 'flex-1 flex items-center h-9 px-3 rounded-full gap-2',
  /** Original input: `flex-1 bg-transparent outline-none border-none text-[15px]` */
  searchInput: 'flex-1 bg-transparent outline-none border-none text-[15px]',
  /** Original clear chip: `w-6 h-6 rounded-full flex items-center justify-center` */
  searchClear: 'w-6 h-6 rounded-full flex items-center justify-center',
  /** Original body: `flex-1 flex flex-col px-0` */
  searchBody: 'flex-1 flex flex-col px-0',

  /** Original empty state: `flex-1 flex flex-col items-center justify-start pt-20 px-6` */
  searchEmpty: 'flex-1 flex flex-col items-center justify-start pt-20 px-6',
  /** its disc: `w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5` */
  searchEmptyDisc: 'w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5',
  /** `text-[16px] font-medium mb-1` */
  searchEmptyTitle: 'text-[16px] font-medium mb-1',
  /** `text-[13.5px] mb-8` */
  searchEmptySub: 'text-[13.5px] mb-8',
  /** the trending block: `w-full`, its label `text-[13px] font-semibold tracking-wide uppercase mb-3` */
  searchTrending: 'w-full',
  searchTrendingLabel: 'text-[13px] font-semibold tracking-wide uppercase mb-3',
  /** its chips: `flex flex-wrap gap-2` */
  searchChips: 'flex flex-wrap gap-2',
  /** a track chip: `px-4 h-8 rounded-full text-[14px] font-medium active:scale-95 transition-transform` */
  searchChipTrack:
    'px-4 h-8 rounded-full text-[14px] font-medium active:scale-95 transition-transform',
  /** an artist chip: `px-4 h-8 rounded-full text-[14px] font-medium active:scale-95 transition` */
  searchChipArtist: 'px-4 h-8 rounded-full text-[14px] font-medium active:scale-95 transition',

  /** the skeletons: rows `flex items-center px-5`, cover `w-[52px] h-[52px] rounded-[14px] animate-pulse`,
   *  bars `h-4 w-32 rounded-full animate-pulse` and `h-3 w-20 rounded-full animate-pulse` */
  searchSkeletonList: 'flex flex-col',
  searchSkeletonRow: 'flex items-center px-5',
  searchSkeletonCover: 'w-[52px] h-[52px] rounded-[14px] animate-pulse',
  searchSkeletonBody: 'flex-1 ml-3 flex flex-col gap-2',
  searchSkeletonBarTitle: 'h-4 w-32 rounded-full animate-pulse',
  searchSkeletonBarSub: 'h-3 w-20 rounded-full animate-pulse',

  /** the results: `flex flex-col`, each row `relative flex items-center px-5` */
  searchResults: 'flex flex-col',
  searchResultRow: 'relative flex items-center px-5',
  /** its cover `shrink-0 flex items-center justify-center`, its letter `text-white font-bold` */
  searchResultCover: 'shrink-0 flex items-center justify-center',
  searchResultLetter: 'text-white font-bold',
  /** its text column `flex-1 ml-3 min-w-0`, title `truncate font-semibold`, artist `truncate mt-[2px]` */
  searchResultBody: 'flex-1 ml-3 min-w-0',
  searchResultTitle: 'truncate font-semibold',
  searchResultSub: 'truncate mt-[2px]',
  /** its add disc:
   *  `ml-3 w-8 h-8 rounded-full flex items-center justify-center border active:scale-90 transition-all duration-300 ease-out` */
  searchAdd:
    'ml-3 w-8 h-8 rounded-full flex items-center justify-center border active:scale-90 transition-all duration-300 ease-out',
  /** its divider: `absolute bottom-0 left-[72px] right-0 h-[1px]` */
  searchDivider: 'absolute bottom-0 left-[72px] right-0 h-[1px]',

  /** the no-results state: `flex-1 flex flex-col items-center justify-center pt-20 px-8 text-center`,
   *  its disc `w-[64px] h-[64px] rounded-full flex items-center justify-center mb-4`,
   *  its title `text-[16px] font-medium`, its sub `text-[13.5px] mt-1` */
  searchNoResults: 'flex-1 flex flex-col items-center justify-center pt-20 px-8 text-center',
  searchNoResultsDisc: 'w-[64px] h-[64px] rounded-full flex items-center justify-center mb-4',
  searchNoResultsTitle: 'text-[16px] font-medium',
  searchNoResultsSub: 'text-[13.5px] mt-1',
} as const;

/**
 * Every surface the artifact wrote once, in light. `light` is byte-identical to
 * it; `dark` is the same structure on the app's dark tokens.
 */
export interface AddSongPalette {
  /** toast (original: `bg-zinc-900 text-white`) */
  toast: string;

  /** sheet panel (original: `backgroundColor: dark ? "#1C1C1E" : "#FFFFFF"`) */
  sheet: string;
  /**
   * The panel's inherited text colour, and the search view's: the template sets
   * the same `A ? "#FFFFFF" : "#000000"` once on each of their roots, and the
   * title, both row titles, both chevrons, the search input, the result titles
   * and both empty-state headings read it from there.
   */
  text: string;
  /** sheet grabber (original: `backgroundColor: dark ? "#3A3A3C" : "#E5E5EA"`) */
  handle: string;
  /** a path row's leading disc (original: `dark ? "#2C2C2E" : "#F2F2F7"`) */
  rowLead: string;
  /** a path row's sub-line — `#8E8E93` in BOTH modes, exactly as the artifact wrote it */
  rowSub: string;

  /**
   * The search view's surfaces, one key per ternary the template actually wrote:
   *
   *   `searchRoot`      `A ? "#000000" : "#FFFFFF"` — the screen, and again on
   *                     every result row (the row restates it so its divider reads)
   *   `searchSurface`   `A ? "#1C1C1E" : "#F2F2F7"` — written three times: the
   *                     field, the empty-state disc and every chip
   *   `searchClearBg`   `A ? "#2C2C2E" : "#E5E5EA"` — the clear chip's fill
   *   `searchAddBorder` the same pair again — the add disc's 1px border
   *   `searchAddBg`     `A ? "#1C1C1E" : "#FFFFFF"` — the add disc's fill
   *   `searchHairline`  `A ? "#1C1C1E" : "#F0F0F0"` — the skeletons and the dividers
   *   `searchInk`       `#8E8E93` in BOTH modes — the sub-lines, the glyphs, the `%`
   */
  searchRoot: string;
  searchSurface: string;
  searchClearBg: string;
  searchAddBorder: string;
  searchAddBg: string;
  searchHairline: string;
  searchInk: string;
  /**
   * An added result's disc: the artifact's own `#34C759` border AND fill with a
   * white ✓, unchanged in both modes (`G ? "#34C759" : …`). This is the flow's
   * one accent, and the only colour this app has that is not ink — it is kept
   * because a ✓ that is merely "ink" reads as decoration, not as success.
   */
  searchSaved: string;
}

export const ADD_SONG_THEME: Record<ThemeMode, AddSongPalette> = {
  light: {
    toast: 'bg-zinc-900 text-white',

    sheet: 'bg-white',
    text: 'text-black',
    handle: 'bg-[#E5E5EA]',
    rowLead: 'bg-[#F2F2F7]',
    rowSub: 'text-[#8E8E93]',

    searchRoot: 'bg-white',
    searchSurface: 'bg-[#F2F2F7]',
    searchClearBg: 'bg-[#E5E5EA]',
    searchAddBorder: 'border-[#E5E5EA]',
    searchAddBg: 'bg-white',
    searchHairline: 'bg-[#F0F0F0]',
    searchInk: 'text-[#8E8E93]',
    searchSaved: 'border-[#34C759] bg-[#34C759] text-white',
  },

  /**
   * Derived, not extracted. Rules applied: the drawer becomes the app's dark
   * surface (`#1C1C1E`, which is the template's own dark panel colour, and the
   * search view takes the template's own `#000000` screen behind it). Every
   * colour the template DID write for dark mode is used as written — the search
   * view's `#1C1C1E` surfaces, `#2C2C2E` outlines, `#F0F0F0` hairlines and
   * `#8E8E93` ink are all the template's own dark values.
   */
  dark: {
    toast: 'bg-white text-zinc-900',

    sheet: 'bg-[#1C1C1E]',
    text: 'text-white',
    handle: 'bg-[#3A3A3C]',
    rowLead: 'bg-[#2C2C2E]',
    rowSub: 'text-[#8E8E93]',

    searchRoot: 'bg-black',
    searchSurface: 'bg-[#1C1C1E]',
    searchClearBg: 'bg-[#2C2C2E]',
    searchAddBorder: 'border-[#2C2C2E]',
    searchAddBg: 'bg-[#1C1C1E]',
    searchHairline: 'bg-[#1C1C1E]',
    searchInk: 'text-[#8E8E93]',
    searchSaved: 'border-[#34C759] bg-[#34C759] text-white',
  },
};

/**
 * Every string the flow renders, byte-for-byte from the original's JSX children
 * — including the Persian copy, which is the design's own language here.
 */
export const ADD_SONG_COPY = {
  /** original toast: `"در حال باز کردن گالری — فایل صوتی انتخاب کنید"` */
  toast: 'در حال باز کردن گالری — فایل صوتی انتخاب کنید',

  /**
   * The drawer's copy, byte for byte from the Add-song template's own JSX:
   * `Add to Library` (5436), `Upload from Device` (5456) with `mp3, m4a, wav`
   * (5460), `Search Archive` (5483) with `Thousands of tracks` (5487).
   *
   * English, not translated: a 100% port carries the reference file's own copy.
   * (The gallery toast and the search panel below are Persian because THOSE come
   * from `Add music.html`, whose own copy is Persian — each surface speaks the
   * language of the file it was taken from.)
   */
  sheetTitle: 'Add to Library',
  uploadTitle: 'Upload from Device',
  uploadSub: 'mp3, m4a, wav',
  archiveTitle: 'Search Archive',
  archiveSub: 'Thousands of tracks',

  /**
   * The search view's copy, byte for byte from the Add-song template's JSX:
   * the placeholder (5288), the two empty-state lines (5315, 5319), the trending
   * label (5324), and the no-results pair (5412, 5416).
   */
  searchPlaceholder: 'Search songs, artists...',
  searchEmptyTitle: 'No recent searches',
  searchEmptySub: 'Start typing to find tracks',
  searchTrendingLabel: 'Trending now',
  /** original: `['No results for "', a, '"']`, split so the query sits between the two */
  searchNoResultsPrefix: 'No results for "',
  searchNoResultsSuffix: '"',
  searchNoResultsSub: 'Try a different search term',
  /**
   * The two icon-only buttons in the view. Not template copy — the template gave
   * neither a label — so they are this app's own, in the same Persian as the
   * uploading row's ✕ (`cancelUploadLabel`).
   */
  searchBackLabel: 'بازگشت به کتابخانه',
  searchClearLabel: 'پاک کردن جستجو',

  /**
   * The uploading row's own strings, byte for byte from the Add-song template:
   * the artist line while `L`'s interval runs is `"Uploading from device"` and
   * becomes `"Processing..."` (three dots) at 100%.
   */
  uploadingLabel: 'Uploading from device',
  processingLabel: 'Processing...',
  /** original: `g("1 track added")` once a local file becomes a real row */
  uploadAddedToast: '1 track added',
  /** original: `` g(`${m.title} added`) `` — a suffix, like the no-results wrapper's */
  addedSuffix: ' added',
  /** original: the `H` button on the uploading row */
  cancelUploadLabel: 'لغو آپلود',
} as const;
