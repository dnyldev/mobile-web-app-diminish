import { THEME } from '@/design/theme';
import type { ThemeMode } from '@/design/theme';
import { PREVIEW_CLASSES, PREVIEW_COPY } from '@/design/tokens';
import type { NavId } from '@/types/theme';

export interface NavPreviewLabelProps {
  activeId: NavId;
  /** How many times a destination has been committed since load. */
  counter: number;
  theme: ThemeMode;
}

/**
 * The copy in the middle of the (deliberately empty) device screen:
 *   "Nav Preview" / "bottom-nav" / "<activeId>[ · <counter>]" / "premium liquid glass • 1.75px"
 */
export function NavPreviewLabel({ activeId, counter, theme }: NavPreviewLabelProps) {
  const palette = THEME[theme];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center -mt-24 px-6">
        <p className={`${PREVIEW_CLASSES.eyebrow} ${palette.previewEyebrow}`}>
          {PREVIEW_COPY.eyebrow}
        </p>
        <p className={`${PREVIEW_CLASSES.title} ${palette.previewTitle}`}>
          {PREVIEW_COPY.title}
        </p>
        <p className={`${PREVIEW_CLASSES.state} ${palette.previewState}`}>
          {`${activeId}${counter ? `${PREVIEW_COPY.counterSeparator}${counter}` : ''}`}
        </p>
        <p className={`${PREVIEW_CLASSES.meta} ${palette.previewMeta}`}>
          {PREVIEW_COPY.meta}
        </p>
      </div>
    </div>
  );
}
