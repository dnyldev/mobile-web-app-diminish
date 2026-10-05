import { THEME, THEME_LABEL } from '@/design/theme';
import type { ThemeMode } from '@/design/theme';
import { NAV_BAR } from '@/design/tokens';

export interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

/**
 * The floating light/dark switch in the top-right of the device.
 * Original: a single <button> in `<div className="absolute top-4 right-4 z-20">`
 * whose label is `K ? "Dark" : "Light"` next to the `K ? "☾" : "☀︎"` glyph.
 */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const palette = THEME[theme];

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        type="button"
        onClick={onToggle}
        className={`h-8 rounded-full px-3 text-[12px] font-medium tracking-wide flex items-center gap-1.5 transition-all active:scale-95 ${palette.toggleBackground} ${palette.toggleText} ${palette.toggleBackgroundHover} ${palette.toggleBorder}`}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <span className="text-[13px]">{palette.toggleGlyph}</span>
        {THEME_LABEL[theme]}
      </button>
    </div>
  );
}

/** Re-exported so consumers can size their own toggles identically. */
export const TOGGLE_METRICS = {
  inset: NAV_BAR.toggleInset,
  height: NAV_BAR.toggleHeight,
  paddingX: NAV_BAR.togglePaddingX,
  textSize: NAV_BAR.toggleTextSize,
  gap: NAV_BAR.toggleGap,
} as const;
