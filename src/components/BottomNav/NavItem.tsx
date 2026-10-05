import type { PointerEvent as ReactPointerEvent } from 'react';
import { TRANSITION } from '@/design/motion';
import type { ThemePalette } from '@/design/theme';
import { INTERACTION } from '@/design/tokens';
import type { NavId } from '@/types/theme';
import { NAV_ICONS } from './icons';

export interface NavItemProps {
  index: number;
  id: NavId;
  label: string;
  /** The bubble is sitting on this item right now. */
  isHighlighted: boolean;
  /** This item is the committed destination. */
  isActive: boolean;
  /** The finger is down on this item. */
  isPressed: boolean;
  /** The 350ms tap-glow is playing. */
  isGlowing: boolean;
  isDragging: boolean;
  palette: ThemePalette;
  onPointerDown: (
    index: number,
    id: NavId,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onClick: (id: NavId) => void;
}

/** Verbatim from the original button className. */
const ITEM_CLASS =
  'relative z-20 flex-1 h-full flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black/10 select-none touch-manipulation will-change-transform transition-colors duration-200';

export function NavItem({
  index,
  id,
  label,
  isHighlighted,
  isActive,
  isPressed,
  isGlowing,
  isDragging,
  palette,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onClick,
}: NavItemProps) {
  const Icon = NAV_ICONS[id];

  return (
    <button
      type="button"
      onPointerDown={(event) => onPointerDown(index, id, event)}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      onClick={() => onClick(id)}
      className={ITEM_CLASS}
      style={{
        transform: isPressed ? `scale(${INTERACTION.pressScale})` : 'scale(1)',
        transition: isPressed ? TRANSITION.itemPressed : TRANSITION.itemIdle,
        color: isHighlighted ? palette.iconActive : palette.iconInactive,
        touchAction: 'none',
        cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
      }}
    >
      <span
        className="relative will-change-transform"
        style={{
          display: 'inline-flex',
          animation: isGlowing ? TRANSITION.iconSpring : undefined,
        }}
      >
        <Icon active={isHighlighted} />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
