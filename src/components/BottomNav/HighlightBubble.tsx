import type { PointerEvent as ReactPointerEvent } from 'react';
import { TRANSITION } from '@/design/motion';
import type { ThemePalette } from '@/design/theme';
import { NAV_BAR } from '@/design/tokens';
import { restingBubbleLeft } from '@/lib/navGeometry';

export interface HighlightBubbleProps {
  activeIndex: number;
  itemCount: number;
  /** Index the bubble is currently snapped to (drags override the active index). */
  highlightIndex: number;
  isDragging: boolean;
  /** Live pointer offset while dragging, in px relative to the track. */
  bubbleLeftPx: number | null;
  palette: ThemePalette;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

/**
 * The 72x48 glass pill that slides between destinations, plus the 64px radial
 * glow that replays on every tap. The glow is keyed by the highlight index so
 * it remounts (and therefore replays) exactly like the original did.
 */
export function HighlightBubble({
  activeIndex,
  itemCount,
  highlightIndex,
  isDragging,
  bubbleLeftPx,
  palette,
  onPointerDown,
}: HighlightBubbleProps) {
  const dragging = isDragging && bubbleLeftPx !== null;

  return (
    <div className="absolute inset-y-0 left-1 right-1 pointer-events-none" aria-hidden>
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[48px] rounded-full will-change-transform overflow-hidden pointer-events-auto"
        style={{
          /**
           * One slot wide, expressed as a percentage of the track — so the
           * indicator and the item it highlights are always the same box, at any
           * pill width. The original was a fixed 72px here.
           */
          width: `${100 / itemCount}%`,
          left: dragging
            ? `${bubbleLeftPx}px`
            : restingBubbleLeft(activeIndex, itemCount),
          transition: isDragging ? 'none' : TRANSITION.bubbleLeft,
          transform: 'translateY(-50%)',
          background: palette.bubbleBackground,
          backdropFilter: palette.bubbleBackdropFilter,
          WebkitBackdropFilter: palette.bubbleWebkitBackdropFilter,
          boxShadow: palette.bubbleShadow,
          zIndex: NAV_BAR.bubbleZIndex,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
      >
        <div
          key={highlightIndex}
          className="soft-glow absolute rounded-full will-change-transform"
          style={{
            width: `${NAV_BAR.glowSize}px`,
            height: `${NAV_BAR.glowSize}px`,
            background: palette.glowGradient,
            filter: `blur(${NAV_BAR.glowBlur}px)`,
            WebkitFilter: `blur(${NAV_BAR.glowBlur}px)`,
          }}
        />
      </div>
    </div>
  );
}
