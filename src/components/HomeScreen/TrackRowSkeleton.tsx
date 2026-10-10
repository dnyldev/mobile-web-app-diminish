import {
  HOME_CLASSES,
  HOME_COLORS,
  HOME_STATIC,
  TRACK_LIST,
  TRACK_ROW_SKELETON,
} from '@/design/home';
import type { ThemeMode } from '@/types/theme';

export interface TrackRowSkeletonProps {
  theme: ThemeMode;
  /** The original draws the hairline on every row except the first — same rule as `TrackRow`. */
  showDivider: boolean;
}

/**
 * One 72px row standing in for a track that has not arrived.
 *
 * It composes `HOME_STATIC` — the same shell, the same 48px cover box, the same
 * 15px/13px line rhythm — so the skeleton is exactly the row it is waiting for,
 * and the swap at the end of the load moves nothing.
 *
 * Only three things are drawn, because only three things are on a real row: the
 * cover, the title/artist stack, and the trailing duration column. The divider
 * is this component's own, unlike `TrackRow`, where the list decides it: a
 * skeleton list has no pending-upload row above it to renumber the dividers.
 */
export function TrackRowSkeleton({ theme, showDivider }: TrackRowSkeletonProps) {
  const fill = HOME_COLORS[theme].divider;

  return (
    <div className={HOME_STATIC.rowGroup}>
      {showDivider && (
        <div
          className={HOME_STATIC.divider}
          style={{ marginLeft: TRACK_LIST.dividerInset, backgroundColor: fill }}
        />
      )}

      <div className={HOME_STATIC.rowShell}>
        <div className={`${HOME_STATIC.row} ${HOME_CLASSES[theme].row}`}>
          <div className={TRACK_ROW_SKELETON.cover} style={{ backgroundColor: fill }} />

          <div className={TRACK_ROW_SKELETON.textBlock}>
            <div className={TRACK_ROW_SKELETON.barTitle} style={{ backgroundColor: fill }} />
            <div className={TRACK_ROW_SKELETON.barSub} style={{ backgroundColor: fill }} />
          </div>

          <div className={HOME_STATIC.metaRow}>
            <div className={TRACK_ROW_SKELETON.barDuration} style={{ backgroundColor: fill }} />
          </div>
        </div>
      </div>
    </div>
  );
}
