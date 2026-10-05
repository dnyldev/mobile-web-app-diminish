import { useMemo } from 'react';
import { TRANSITION } from '@/design/motion';
import { THEME } from '@/design/theme';
import { INTERACTION, NAV_ITEMS } from '@/design/tokens';
import { useNavGesture } from '@/hooks/useNavGesture';
import { HighlightBubble } from './HighlightBubble';
import { NavItem } from './NavItem';
import type { BottomNavProps } from './types';
import './navKeyframes.css';

export type { BottomNavProps };

/**
 * The bottom stack: whatever rides above the bar (the mini player) plus the bar
 * itself, as one flex column.
 *
 * The wrapper's classes are the original `<nav>`'s, plus `flex flex-col gap-3`.
 * It is a stack rather than two independently positioned elements for two reasons
 * a second `bottom` value could not have covered:
 *   - the 12px gap between the pills is a real flex gap, so it cannot drift;
 *   - `pb-[max(12px,env(safe-area-inset-bottom))]` raises the WHOLE pair on a
 *     device with a home indicator, not just the lower pill.
 * `pointer-events-none` stays; only the pills themselves take pointers.
 */
const STACK_CLASS =
  'fixed sm:absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 px-6 py-3 pb-[max(12px,env(safe-area-inset-bottom))] pointer-events-none flex flex-col gap-3';

/**
 * Verbatim from the original pill className — except `px-[6px]`, which is now
 * `px-1` so that the horizontal inset equals the vertical one (see
 * `NAV_BAR.pillPadding`). The original was 6px across and 4px up.
 */
const PILL_CLASS =
  'pointer-events-auto relative w-full max-w-[352px] mx-auto rounded-full h-[56px] px-1 flex items-center justify-between isolate overflow-hidden will-change-transform';

const PILL_PRESSED_TRANSFORM = `scale(${INTERACTION.pressScale})`;

export function BottomNav({
  items = NAV_ITEMS,
  activeId,
  onSelect,
  theme,
  above,
}: BottomNavProps) {
  const palette = useMemo(() => THEME[theme], [theme]);

  const {
    pillRef,
    activeIndex,
    highlightIndex,
    engaged,
    isDragging,
    bubbleLeftPx,
    pressedId,
    glowingId,
    endPress,
    startDrag,
    handlePillPointerDown,
    handleItemPointerDown,
    handleItemClick,
  } = useNavGesture({ items, activeId, onSelect });

  return (
    <div className={STACK_CLASS}>
      {above}

      <nav className="w-full max-w-[352px] mx-auto">
        <div
          ref={pillRef}
          className={PILL_CLASS}
          style={{
            background: palette.pillBackground,
            backdropFilter: palette.pillBackdropFilter,
            WebkitBackdropFilter: palette.pillWebkitBackdropFilter,
            border: palette.pillBorder,
            boxShadow: palette.pillShadow,
            transform: engaged ? PILL_PRESSED_TRANSFORM : 'scale(1)',
            transition: engaged ? TRANSITION.pillPressed : TRANSITION.pillIdle,
            transformOrigin: 'center center',
            touchAction: 'none',
          }}
          onPointerDown={handlePillPointerDown}
        >
          <HighlightBubble
            activeIndex={activeIndex}
            itemCount={items.length}
            highlightIndex={highlightIndex}
            isDragging={isDragging}
            bubbleLeftPx={bubbleLeftPx}
            palette={palette}
            onPointerDown={(event) => {
              event.stopPropagation();
              startDrag(event.clientX, event.pointerId);
            }}
          />
          {items.map((item, index) => (
            <NavItem
              key={item.id}
              index={index}
              id={item.id}
              label={item.label}
              isActive={index === activeIndex}
              isHighlighted={index === highlightIndex}
              isPressed={pressedId === item.id}
              isGlowing={glowingId === item.id}
              isDragging={isDragging}
              palette={palette}
              onPointerDown={handleItemPointerDown}
              onPointerUp={endPress}
              onPointerLeave={endPress}
              onPointerCancel={endPress}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
