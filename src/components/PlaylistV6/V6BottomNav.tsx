import { V6_METRICS, V6_NAV, V6_NAV_ITEMS, type V6NavId } from '@/design/playlistV6';
import { V6_NAV_ICONS } from './icons';

export interface V6BottomNavProps {
  /** Original `n`: the committed destination. */
  activeId: V6NavId;
  /** Original `E`: `scrollY > 120` — the pill collapses to text. */
  compact: boolean;
  onSelect: (id: V6NavId) => void;
}

/**
 * The glass nav pill.
 *
 * Original: `createElement("nav", { className: "fixed left-1/2 -translate-x-1/2 bottom-4 …",
 * style: { width: E ? "300px" : "340px", height: E ? "36px" : "56px" } }, [ …four items ].map(…))`.
 *
 * The shell class lives in `V6_NAV.shell` with `fixed` swapped for `absolute`;
 * the two sizes are the same strings the original wrote inline. Every item
 * carries BOTH layers — the 22px icon and the 10px uppercase label — and the
 * compact flag only swaps which one is scaled/opaque, exactly as before.
 */
export function V6BottomNav({ activeId, compact, onSelect }: V6BottomNavProps) {
  return (
    <nav
      className={V6_NAV.shell}
      style={{
        width: compact ? `${V6_METRICS.navWidthCompact}px` : `${V6_METRICS.navWidth}px`,
        height: compact ? `${V6_METRICS.navHeightCompact}px` : `${V6_METRICS.navHeight}px`,
      }}
    >
      {V6_NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        const Icon = V6_NAV_ICONS[item.id];

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`${V6_NAV.item} ${isActive ? V6_NAV.itemActive : V6_NAV.itemIdle}`}
          >
            <span className={`${V6_NAV.layer} ${compact ? V6_NAV.iconHidden : V6_NAV.iconShown}`}>
              <Icon active={isActive} />
            </span>
            <span className={`${V6_NAV.layer} ${compact ? V6_NAV.labelShown : V6_NAV.labelHidden}`}>
              <span className={V6_NAV.label}>{item.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
