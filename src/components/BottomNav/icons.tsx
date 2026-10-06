import type { ComponentType, ReactNode } from 'react';
import {
  V6DiscoverIcon,
  V6HomeIcon,
  V6LibraryIcon,
  V6PlaylistsIcon,
} from '@/components/PlaylistV6/icons';
import { ICON } from '@/design/tokens';
import type { NavId } from '@/types/theme';

export interface NavIconProps {
  /** When true the glyph fills with `currentColor` at 12% opacity. */
  active: boolean;
}

/**
 * The eight attributes shared by all four glyphs, in the original order:
 * width / height / viewBox / fill / stroke / strokeWidth / strokeLinecap /
 * strokeLinejoin.
 */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width={ICON.size}
      height={ICON.size}
      viewBox={ICON.viewBox}
      fill="none"
      stroke={ICON.stroke}
      strokeWidth={ICON.strokeWidth}
      strokeLinecap={ICON.strokeLinecap}
      strokeLinejoin={ICON.strokeLinejoin}
    >
      {children}
    </svg>
  );
}

/** `fill: active ? "currentColor" : "none"`, `fillOpacity: active ? 0.12 : 0` */
function activeFill(active: boolean) {
  return {
    fill: active ? 'currentColor' : ('none' as const),
    fillOpacity: active ? ICON.activeFillOpacity : 0,
  };
}

export function HomeIcon({ active }: NavIconProps) {
  return (
    <Glyph>
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1V9.5z"
        {...activeFill(active)}
      />
    </Glyph>
  );
}

export function SearchIcon({ active }: NavIconProps) {
  return (
    <Glyph>
      <circle cx="11" cy="11" r="6" {...activeFill(active)} />
      <path d="M15.5 15.5L19 19" />
    </Glyph>
  );
}

export function LibraryIcon({ active }: NavIconProps) {
  return (
    <Glyph>
      <path
        d="M6 3.5A1.5 1.5 0 0 0 4.5 5v15a.5.5 0 0 0 .78.42L12 16l6.72 4.42A.5.5 0 0 0 19.5 20V5A1.5 1.5 0 0 0 18 3.5H6z"
        {...activeFill(active)}
      />
    </Glyph>
  );
}

export function ProfileIcon({ active }: NavIconProps) {
  return (
    <Glyph>
      <circle cx="12" cy="8" r="4" {...activeFill(active)} />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </Glyph>
  );
}

/**
 * Which glyph each destination draws.
 *
 * The pill draws the **Playlist v6** glyphs — the v6 components are *imported*,
 * not copied, so the two navs cannot drift apart. Two consequences that come
 * with the v6 glyphs as they are drawn there: they are 22×22 at
 * `strokeWidth 1.6` (the harness's own four are 28×28 at 1.75), and they never
 * fill — in v6 the active state is the pill behind the icon, not a filled glyph.
 *
 * DEVIATION, ours (decision: Danial): the bar's third destination draws
 * `V6HomeIcon` in place of `V6DiscoverIcon`, so the house that used to sit on
 * the `+` button moved into the bar once that slot stopped being a destination.
 * The bar is now playlists · library · home, left to right.
 *
 * `profile` is still keyed because `NavId` still has four members — it is the
 * artifact's own union — but nothing draws it any more: the button beside the
 * pill carries its own glyph (`NavActionButton`'s `NavActionPlusGlyph`) and is
 * not a destination. Its entry keeps `V6DiscoverIcon` so the glyph the bar
 * dropped is not lost from this module.
 *
 * `HomeIcon` / `SearchIcon` / `LibraryIcon` / `ProfileIcon` below are the
 * harness's own four, still exported, so this stays one patch to put back.
 */
export const NAV_ICONS: Record<NavId, ComponentType<NavIconProps>> = {
  home: V6PlaylistsIcon,
  search: V6LibraryIcon,
  library: V6HomeIcon,
  profile: V6DiscoverIcon,
};
