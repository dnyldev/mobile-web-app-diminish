/**
 * Geometry + timing tokens, extracted verbatim from the original minified
 * artifact (`React Artifact.html` -> script-01, app region lines 4987-5279).
 *
 * Nothing here is inferred or rounded: every value carries the class or the
 * inline style it came from so it can be re-verified against the original.
 */
import type { NavItemSpec } from '@/types/theme';

/** The four destinations. Original: `var Bl=[{id:"home",label:"Home"},{id:"search",label:"Search"},{id:"library",label:"Library"},{id:"profile",label:"Profile"}]`. */
export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'library', label: 'Library' },
  { id: 'profile', label: 'Profile' },
] as const;

/**
 * The destinations the bar actually offers — the artifact's four minus the last.
 *
 * DEVIATION from the artifact, on purpose (decision: Danial). The artifact put
 * all four in one pill; the bar is now three destinations, and the fourth slot
 * is a separate button that is not a destination at all (see
 * `components/BottomNav/NavActionButton.tsx`). `NAV_ITEMS` is kept whole above
 * because it is the artifact's own array and the fidelity record of it; this is
 * the live list.
 */
export const NAV_TABS: readonly NavItemSpec[] = NAV_ITEMS.slice(0, -1);

/** The default active destination. Original: `useState("home")`. */
export const DEFAULT_ACTIVE_ID = 'home';

/** Icon geometry. Original: every `<svg>` is `width:"28" height:"28" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" strokeWidth:1.75 strokeLinecap:"round" strokeLinejoin:"round"`. */
export const ICON = {
  /** width / height attribute */
  size: 28,
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  /** `fillOpacity: active ? 0.12 : 0` — the "premium" filled-active look */
  activeFillOpacity: 0.12,
} as const;

/** The glass pill + its moving highlight bubble. */
export const NAV_BAR = {
  /** nav: `max-w-[400px]` */
  wrapperMaxWidth: 400,
  /** nav: `px-6` */
  wrapperPaddingX: 24,
  /** nav: `py-3` */
  wrapperPaddingY: 12,
  /** nav: `pb-[max(12px,env(safe-area-inset-bottom))]` — safe-area aware */
  wrapperPaddingBottom: 'max(12px,env(safe-area-inset-bottom))',

  /** pill container: `max-w-[352px]` */
  pillMaxWidth: 352,
  /** pill container: `h-[56px]` */
  pillHeight: 56,
  /**
   * Gap between the pill and the `+1` button: `gap-2`.
   *
   * DEVIATION from the artifact, on purpose (decision: Danial). The bar used to
   * be four destinations in ONE pill; the fourth is now its own round button
   * beside the pill — the 3+1 split.
   *
   * The button's diameter is deliberately NOT a token here: it IS `pillHeight`,
   * read at the call site, because that is the whole point of the choice —
   * 56 against 56 is what makes the bar and the button read as one set instead
   * of a bar plus an accessory, and a second literal could drift from the first.
   * The gap is the only new number, and it is measured: on the reference the
   * round button sat 22px from a 158px-tall bar, so 22 / 158 × 56 ≈ 8.
   */
  actionGap: 8,
  /**
   * Edge inset of the indicator inside the pill — one number, both axes.
   *
   * DEVIATION from the artifact, on purpose. The original used `px-[6px]` on
   * the pill, `left-[6px] right-[6px]` on the track, and a bare 4px of vertical
   * gap — 6px across, 4px up and down. That asymmetry is what this pass removes,
   * taking v6's own nav as the model: it insets its indicator by a uniform 4px.
   * `(pillHeight − bubbleHeight) / 2` is also 4, so the two axes cannot disagree.
   */
  pillPadding: 4,

  /** track overlay: `left-1 right-1` — the same `pillPadding` */
  trackInset: 4,

  /**
   * The sliding indicator: `h-[48px]`, `rounded-full`, `pillHeight − 2 × pillPadding` tall.
   *
   * DEVIATION from the artifact, on purpose. The original indicator was a fixed
   * `w-[72px]` blob sitting *inside* a slot without filling it (72px on an
   * 82.5px slot). It is now exactly ONE SLOT wide, derived as
   * `trackWidth / items.length` and applied as a percentage of the track — v6's
   * construction, which makes the indicator and the slot the same thing.
   *
   * The percentage is why there is no `bubbleWidth` token any more: the
   * original's 72px was only correct for one pill width. At 342px the result is
   * the same 4px inset on every side; at any other width it still is.
   */
  bubbleHeight: 48,
  /** bubble `zIndex:10` */
  bubbleZIndex: 10,
  /** items sit at `z-20`, the track overlay is inert (`pointer-events-none`) */
  itemZIndex: 20,

  /** glow disc inside the bubble: `width:"64px" height:"64px"`, `filter:"blur(8px)"` */
  glowSize: 64,
  glowBlur: 8,

  /** theme toggle: `top-4 right-4`, `h-8`, `px-3`, `text-[12px]`, `gap-1.5` */
  toggleInset: 16,
  toggleHeight: 32,
  togglePaddingX: 12,
  toggleTextSize: 12,
  toggleGap: 6,
} as const;

/**
 * The mini player pill that sits above the nav pill.
 *
 * Placement is deliberately NOT a number here: both pills are children of one
 * stack (`BottomNav`'s `STACK_CLASS`), so the 12px gap is a real flex gap and the
 * nav's `pb-[max(12px,env(safe-area-inset-bottom))]` lifts the whole pair together
 * on a device with a home indicator. A computed `bottom` could only have got one
 * of those two right.
 *
 * The box is the nav pill's box — same `h-[56px]`, same `max-w-[352px]`, same
 * `rounded-full` — so the two line up edge to edge and read as a pair. The inner
 * composition is Playlist v6's own (`px-2 pr-1.5`, `gap-2.5`, 32px cover, 36px
 * buttons), which was drawn against this exact 342px pill. Its GLASS is not v6's
 * though: the component paints it with the same `ThemePalette` entries the nav
 * pill uses, so it follows the light/dark switch instead of being white always.
 */
export const MINI_PLAYER = {
  /**
   * The pill itself.
   *
   * `pointer-events-auto` is load-bearing: the pill is a child of `BottomNav`'s
   * stack, whose class carries `pointer-events-none` so the empty column around
   * the two pills cannot swallow taps meant for the screen behind it. Every pill
   * in that stack has to opt back in — the nav pill does it in `PILL_CLASS`; this
   * one did not, so the whole mini player (buttons included, `pointer-events`
   * inherits) was click-through: play/pause and ✕ landed on the track row behind
   * it and silently swapped the now-playing track instead.
   */
  shell:
    'pointer-events-auto relative mx-auto w-full max-w-[352px] h-[56px] rounded-full px-2 pr-1.5 flex items-center gap-2.5 overflow-hidden',
  /** the cover disc; `background` comes from the track's gradient */
  cover:
    'shrink-0 w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
  textBlock: 'min-w-0 flex-1',
  title: 'truncate text-[13.5px] font-medium tracking-[-0.01em] leading-[1.1]',
  artist: 'truncate text-[11.5px] leading-[1.2]',
  buttons: 'flex items-center gap-0.5 shrink-0',
  /** shared by the play/pause and the dismiss button; the colours are per-mode */
  button: 'w-9 h-9 rounded-full grid place-items-center transition-colors',
  /**
   * Entry animation — the keyframe is in the component's own css.
   * There is deliberately no `bottom` or `gap` value here: the bar owns both
   * (`STACK_CLASS`'s `gap-3` and its own safe-area padding).
   */
  entrance: 'miniPlayerIn 350ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/** Phone frame that the harness draws on desktop. */
export const FRAME = {
  /** outer page wrapper: `min-h-[100dvh] w-full flex justify-center` */
  pageMinHeight: '100dvh',
  /** inner device: `max-w-[390px] min-h-[100dvh]` */
  maxWidth: 390,
  minHeight: '100dvh',
  /** `sm:my-6` */
  desktopMarginY: 24,
  /** `sm:min-h-[720px]` */
  desktopMinHeight: 720,
  /** `sm:rounded-[36px]` */
  desktopRadius: 36,
} as const;

/** Interaction constants. */
export const INTERACTION = {
  /** hold-to-glow window: `window.setTimeout(() => o(null), 350)` */
  glowHoldMs: 350,
  /** drag is "real" once the pointer travels more than this: `Math.abs(q.clientX - E.current) > 5` */
  dragThresholdPx: 5,
  /** a drag may only start within `bubbleW/2 + 28` of the bubble centre */
  startDragHitSlopPx: 28,
  /** the pill scales to this while the bubble is engaged: `scale(1.04)` */
  pressScale: 1.04,
  /** theme toggle: `active:scale-95` */
  togglePressScale: 0.95,
} as const;

/** Harness copy shown in the middle of the (intentionally empty) device screen. */
export const PREVIEW_COPY = {
  eyebrow: 'Nav Preview',
  title: 'bottom-nav',
  meta: 'premium liquid glass • 1.75px',
  /** separator used before the press counter: `${id} · ${count}` */
  counterSeparator: ' · ',
} as const;

export const PREVIEW_CLASSES = {
  eyebrow: 'text-[11px] tracking-[0.2em] uppercase font-medium transition-colors',
  title: 'mt-2 text-[22px] font-semibold tracking-[-0.02em] transition-colors',
  state: 'mt-1 text-[13px] font-mono transition-colors',
  meta: 'mt-6 text-[11px] tracking-wide transition-colors',
} as const;
