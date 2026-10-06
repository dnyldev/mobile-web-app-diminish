import type { ReactNode } from 'react';
import type { NavId, NavItemSpec, ThemeMode } from '@/types/theme';

export type { NavId, NavItemSpec, ThemeMode };

/**
 * The button beside the pill.
 *
 * An ACTION, not a destination: it has a name and a glyph and nothing else — no
 * `NavId`, no selected state, no place in the pill's drag track. See
 * `NavActionButton`.
 */
export interface NavActionSpec {
  /** Its accessible name. */
  label: string;
  /** Its glyph. The bar does not choose it: what the button does is the app's call. */
  icon: ReactNode;
}

/** Public props of the glass navigation bar. */
export interface BottomNavProps {
  /**
   * Destinations, in order — the pill's tabs, and only those.
   *
   * Defaults to `NAV_TABS`: the artifact's four minus the last (decision:
   * Danial). Three destinations; the fourth slot is `action` below, which is not
   * a destination at all.
   */
  items?: readonly NavItemSpec[];
  /**
   * The button beside the pill.
   *
   * An ACTION, not a destination — see `NavActionButton`. Defaults to the app's
   * `+`; pass `null` to render the pill alone.
   */
  action?: NavActionSpec | null;
  /**
   * Fired when the action button is pressed.
   *
   * Deliberately unwired for now: the button is a placeholder (decision:
   * Danial). Wiring it is this prop and nothing else.
   */
  onAction?: () => void;
  /** Currently selected destination. */
  activeId: NavId;
  /** Fired whenever a selection is committed (tap, hold-and-release, or drag). */
  onSelect: (id: NavId) => void;
  /** Active appearance mode. */
  theme: ThemeMode;
  /**
   * Anything that should ride above the bar — the mini player, typically.
   *
   * It is rendered as the first child of the same flex stack as the pill, so it
   * inherits the bar's side padding and safe-area offset and sits exactly one
   * `gap` above it. Passing it in (rather than letting a caller absolutely
   * position it) is what stops the two pills from drifting apart.
   */
  above?: ReactNode;
}
