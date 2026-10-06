import type { ThemeMode } from '@/types/theme';

export type { ThemeMode };

/**
 * Every themed value in the artifact, per mode, exactly as it appeared inline.
 * Original: `let K = u === "dark"` then every style object branches on `K`.
 */
export interface ThemePalette {
  /** glass pill background */
  pillBackground: string;
  /** glass pill border */
  pillBorder: string;
  /** glass pill box-shadow (outer glow + 1px inner highlight) */
  pillShadow: string;
  /** both backdrop filters are identical across modes: blur(24px) saturate(180%) */
  pillBackdropFilter: string;
  pillWebkitBackdropFilter: string;

  /** highlight bubble background */
  bubbleBackground: string;
  bubbleBackdropFilter: string;
  bubbleWebkitBackdropFilter: string;
  bubbleShadow: string;

  /** radial-gradient of the tap glow */
  glowGradient: string;

  /** active icon colour — `q ? (K ? "white" : "#111") : ...` */
  iconActive: string;
  /** inactive icon colour — `K ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.38)"` */
  iconInactive: string;

  /** theme toggle button */
  toggleBackground: string;
  toggleBackgroundHover: string;
  toggleText: string;
  toggleBorder: string;
  /** the glyph pair `K ? "☾" : "☀︎"` */
  toggleGlyph: string;

  /** harness copy colours */
  previewEyebrow: string;
  previewTitle: string;
  previewState: string;
  previewMeta: string;
  /** device-screen selection colour — `selection:bg-black/10` */
  selectionBackground: string;

  /**
   * Mini player. Its glass is the SAME pill recipe as `pillBackground` /
   * `pillBorder` / `pillShadow` / `pillBackdropFilter` above — that is the whole
   * point of it, so the two pills read as one pair — so only the controls and
   * the two text colours need their own entries. They follow the theme switch's
   * recipe (`bg-white/10` vs `bg-black/[0.06]`), which is what keeps them looking
   * like part of this app rather than part of the v6 screen.
   */
  miniButton: string;
  miniButtonHover: string;
  miniClose: string;
  miniCloseHover: string;
  miniTitle: string;
  miniArtist: string;
}

const SHARED_BACKDROP = 'blur(24px) saturate(180%)';
const BUBBLE_BACKDROP = 'blur(12px)';

export const THEME: Record<ThemeMode, ThemePalette> = {
  dark: {
    pillBackground: 'rgba(28,28,30,0.72)',
    pillBorder: '1px solid rgba(255,255,255,0.08)',
    pillShadow: '0 8px 32px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)',
    pillBackdropFilter: SHARED_BACKDROP,
    pillWebkitBackdropFilter: SHARED_BACKDROP,

    bubbleBackground: 'rgba(255,255,255,0.12)',
    bubbleBackdropFilter: BUBBLE_BACKDROP,
    bubbleWebkitBackdropFilter: BUBBLE_BACKDROP,
    bubbleShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',

    glowGradient:
      'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.18) 32%, transparent 62%)',

    iconActive: 'white',
    iconInactive: 'rgba(255,255,255,0.55)',

    toggleBackground: 'bg-white/10',
    toggleBackgroundHover: 'hover:bg-white/[0.14]',
    toggleText: 'text-white/80',
    toggleBorder: 'border border-white/10',
    toggleGlyph: '☾',

    previewEyebrow: 'text-white/40',
    previewTitle: 'text-white',
    previewState: 'text-white/50',
    previewMeta: 'text-white/30',
    selectionBackground: 'selection:bg-black/10',

    // The dark pill is dark, so the play button inverts: a light disc with a
    // dark glyph. Same pair, flipped — the v6 screen only ever had the light one.
    miniButton: 'bg-white/90 text-zinc-900',
    miniButtonHover: 'hover:bg-white',
    miniClose: 'bg-white/10 text-white/80',
    miniCloseHover: 'hover:bg-white/[0.14]',
    miniTitle: 'text-white',
    miniArtist: 'text-white/50',
  },
  light: {
    pillBackground: 'rgba(255,255,255,0.72)',
    pillBorder: '1px solid rgba(255,255,255,0.4)',
    pillShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
    pillBackdropFilter: SHARED_BACKDROP,
    pillWebkitBackdropFilter: SHARED_BACKDROP,

    bubbleBackground: 'rgba(0,0,0,0.06)',
    bubbleBackdropFilter: BUBBLE_BACKDROP,
    bubbleWebkitBackdropFilter: BUBBLE_BACKDROP,
    bubbleShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',

    glowGradient:
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.28) 30%, transparent 62%)',

    iconActive: '#111',
    iconInactive: 'rgba(0,0,0,0.38)',

    toggleBackground: 'bg-black/[0.06]',
    toggleBackgroundHover: 'hover:bg-black/[0.08]',
    toggleText: 'text-black/70',
    toggleBorder: 'border border-black/[0.06]',
    toggleGlyph: '☀︎',

    previewEyebrow: 'text-neutral-400',
    previewTitle: 'text-neutral-900',
    previewState: 'text-neutral-500',
    previewMeta: 'text-neutral-400',
    selectionBackground: 'selection:bg-black/10',

    // This is the v6 mini player's own pairing, exactly: `bg-zinc-900` disc,
    // `bg-[#F1F1F3]` close.
    miniButton: 'bg-zinc-900 text-white',
    miniButtonHover: 'hover:bg-zinc-800',
    miniClose: 'bg-black/[0.06] text-black/70',
    miniCloseHover: 'hover:bg-black/[0.08]',
    miniTitle: 'text-neutral-900',
    miniArtist: 'text-neutral-500',
  },
};

export const THEME_LABEL: Record<ThemeMode, string> = {
  dark: 'Dark',
  light: 'Light',
};

/**
 * The harness shell's Tailwind classes, kept as whole literal strings so the
 * Tailwind content scanner picks every one of them up.
 * Original, in order: outer page div, then the inner device div.
 */
export const HARNESS_CLASSES: Record<ThemeMode, { page: string; frame: string }> = {
  dark: {
    page: 'bg-[#0a0a0b]',
    frame: 'bg-[#141416] sm:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
  },
  light: {
    page: 'bg-[#f5f5f7]',
    frame: 'bg-white sm:bg-[#fbfbfc] sm:shadow-[0_0_0_1px_rgba(0,0,0,0.06)]',
  },
};

/**
 * The page colours `HARNESS_CLASSES` writes as classes (`bg-[#f5f5f7]` /
 * `bg-[#0a0a0b]`), as values — so the document itself can be painted with them
 * (`useThemeMode`), which is what keeps the browser's own chrome and the
 * overscroll area from staying white in a dark session.
 */
export const HARNESS_PAGE_COLOR: Record<ThemeMode, string> = {
  light: '#f5f5f7',
  dark: '#0a0a0b',
};

/** Fixed classes on the harness shell (identical in both modes). */
export const HARNESS_STATIC = {
  page: 'min-h-[100dvh] w-full flex justify-center selection:bg-black/10 transition-colors duration-300',
  frame:
    'relative w-full max-w-[390px] min-h-[100dvh] sm:my-6 sm:min-h-[720px] sm:rounded-[36px] overflow-hidden transition-colors duration-300',
  center: 'absolute inset-0 flex items-center justify-center',
  stack: 'text-center -mt-24 px-6',
} as const;

