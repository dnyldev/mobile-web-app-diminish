import type { ReactNode } from 'react';
import type { ThemePalette } from '@/design/theme';
import { NAV_BAR } from '@/design/tokens';

export interface NavActionButtonProps {
  /** Its accessible name. It is an ACTION, so it has a name — not a destination id. */
  label: string;
  /** Its glyph. The bar does not choose it: what the button does is the app's call. */
  icon: ReactNode;
  palette: ThemePalette;
  /** Fired on click. Optional because the button may be a placeholder — see below. */
  onPress?: () => void;
}

/**
 * The `+`. Drawn on the nav's own glyph geometry — 22×22, `viewBox 0 0 24 24`,
 * `strokeWidth 1.6`, round caps and joins — the same eight-attribute set every
 * destination in this bar uses, so the button's picture weighs the same as the
 * three beside it.
 */
export function NavActionPlusGlyph() {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/**
 * The button beside the pill.
 *
 * DEVIATION from the artifact, on purpose (decision: Danial). The artifact put
 * four destinations in one pill; the bar is now THREE destinations and this
 * button. **It is not a fourth destination** — that is the whole reason it is a
 * separate component and not a fourth `NavItem`:
 *
 *   - it is not in `activeId`, so it can never be "the selected tab";
 *   - it has no selected state and no glass that claims one;
 *   - it never moves, hides or repositions the indicator, and it is not part of
 *     the pill's drag track — `useNavGesture` does not know it exists;
 *   - it inherits none of the nav's ITEM physics: no `pressScale` 1.04, no
 *     350ms `softGlow` replay, no `icon-spring`. Those are the rituals of
 *     committing to a destination, and this commits to nothing.
 *
 * What it DOES keep is the bar's material, because Danial chose 56px — the
 * pill's own height — precisely so the two read as one set: the same
 * `pillBackground` / `pillBorder` / `pillShadow` / `pillBackdropFilter`, and
 * `pillHeight` for its diameter. There is deliberately no separate size token;
 * a second literal could drift from the first.
 *
 * Its press feedback is a plain button's — `active:scale-95` in CSS, the same
 * idiom `ThemeToggle` uses — rather than the nav's JS transform physics.
 *
 * Its icon is `iconActive`, i.e. full contrast: a destination at rest is dimmed
 * to show it is not selected, and this is not a destination at rest.
 *
 * `onPress` is optional and currently unused by the app — the button is a
 * deliberate placeholder. Wiring it is one line at the call site; see
 * `BottomNav`'s `onAction`.
 */
export function NavActionButton({ label, icon, palette, onPress }: NavActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      /**
       * `pointer-events-auto` is load-bearing: the button is a child of the same
       * stack as the pill, whose class carries `pointer-events-none` so the empty
       * column around the two cannot swallow taps meant for the screen behind it.
       * Every clickable in that stack has to opt back in — this is exactly the
       * line the mini player was missing.
       */
      className="pointer-events-auto relative shrink-0 rounded-full grid place-items-center isolate overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-black/10 select-none transition-transform duration-150 active:scale-95"
      style={{
        width: `${NAV_BAR.pillHeight}px`,
        height: `${NAV_BAR.pillHeight}px`,
        background: palette.pillBackground,
        backdropFilter: palette.pillBackdropFilter,
        WebkitBackdropFilter: palette.pillWebkitBackdropFilter,
        border: palette.pillBorder,
        boxShadow: palette.pillShadow,
        color: palette.iconActive,
        cursor: 'pointer',
      }}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}
