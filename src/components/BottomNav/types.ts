import type { ReactNode } from 'react';
import type { NavId, NavItemSpec, ThemeMode } from '@/types/theme';

export type { NavId, NavItemSpec, ThemeMode };

/** Public props of the glass navigation bar. */
export interface BottomNavProps {
  /**
   * Destinations, in order. Defaults to the original four
   * (home / search / library / profile) read from `NAV_ITEMS`.
   */
  items?: readonly NavItemSpec[];
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
