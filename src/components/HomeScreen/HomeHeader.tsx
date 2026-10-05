import { HOME_CLASSES, HOME_STATIC } from '@/design/home';
import type { ThemeMode } from '@/types/theme';
import { SearchGlyph } from './icons';

export interface HomeHeaderProps {
  /** Left-hand title. Original: the playlist name, hard-coded `"Enterprise Minimal"`. */
  title: string;
  /**
   * Second line. Original: the literal `"79 tracks • Swipe & hold for actions"`.
   * Here it is derived from the data and the interaction copy is gone, since
   * the list is read-only for now.
   */
  subtitle: string;
  theme: ThemeMode;
  /** دکمه آیکن-only که با اسکرول می‌آید توی هدر کنار سرچ */
  aside?: React.ReactNode;
}

/**
 * The playlist header, exactly as the artifact drew it — minus its hamburger
 * button (that only opened the sidebar, which is out of scope). The search
 * button in the corner is kept; wiring it up is the next step.
 */
export function HomeHeader({ title, subtitle, theme, aside }: HomeHeaderProps) {
  return (
    <header className={`${HOME_STATIC.headerBar} ${HOME_CLASSES[theme].headerBar}`}>
      <div className={HOME_STATIC.headerLeft}>
        <div className={HOME_STATIC.titleStack}>
          <span className={`${HOME_STATIC.headerTitle} ${HOME_CLASSES[theme].headerTitle}`}>
            {title}
          </span>
          <span className={HOME_STATIC.headerSubtitle}>{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {aside}
        <button
          type="button"
          aria-label="search"
          className={`${HOME_STATIC.searchButton} ${HOME_CLASSES[theme].searchButton}`}
        >
          <SearchGlyph size={18} />
        </button>
      </div>
    </header>
  );
}
