import { useCallback, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen } from '@/components/HomeScreen';
import { MiniPlayer } from '@/components/MiniPlayer';
import { NavPreviewLabel } from '@/components/NavPreviewLabel';
import { PlaylistV6 } from '@/components/PlaylistV6';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewSwitch, type HarnessView } from '@/components/ViewSwitch';
import { HARNESS_CLASSES, HARNESS_STATIC } from '@/design/theme';
import { DEFAULT_ACTIVE_ID } from '@/design/tokens';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useTracks } from '@/hooks/useTracks';
import type { NavId } from '@/types/theme';

/**
 * The artifact's component-preview harness: a phone frame on desktop, the
 * explanatory copy in the middle of an intentionally empty screen, the theme
 * switch, and the navigation bar pinned to the bottom.
 *
 * Original: `function fi()` — the single component the artifact mounted.
 *
 * Home is no longer empty: it renders the playlist screen ported from
 * `enterprise-playlist 2.html` (header + read-only track list). The other three
 * destinations still show the harness copy.
 *
 * `ViewSwitch` swaps the whole device screen for the Playlist v6 port (from
 * `Nav-music-playlist.html.html`), which brings its own bottom nav, mini player
 * and sheet. That screen is light-only in the original, and its own nav would
 * collide with this one, so the harness's nav and theme switch stand down while
 * it is mounted — nothing about the harness view itself changes.
 */
export default function App() {
  const { mode, toggle } = useThemeMode();
  const [view, setView] = useState<HarnessView>('harness');
  const [activeId, setActiveId] = useState<NavId>(DEFAULT_ACTIVE_ID);
  const [counter, setCounter] = useState(0);

  // The harness's now-playing is the first row of the catalogue HomeScreen lists,
  // so the mini player never shows invented copy. Nothing is playing behind it —
  // play/pause and dismiss move local state only.
  const { status, tracks } = useTracks();
  const nowPlaying = status === 'ready' ? tracks[0] : undefined;
  const [miniVisible, setMiniVisible] = useState(true);
  const [playing, setPlaying] = useState(true);

  // The original bumped its press counter on every commit, whether that came
  // from a tap or from releasing a drag on a different destination.
  const handleSelect = useCallback((id: NavId) => {
    setActiveId(id);
    setCounter((value) => value + 1);
    // Committing a destination also un-dismisses the mini player: the harness has
    // no library to re-open one from, so the dismiss button must not be a
    // one-way door.
    setMiniVisible(true);
  }, []);

  const isHome = activeId === 'home';
  const showV6 = view === 'v6';

  return (
    <div className={`${HARNESS_STATIC.page} ${HARNESS_CLASSES[mode].page}`}>
      <div className={`${HARNESS_STATIC.frame} ${HARNESS_CLASSES[mode].frame}`}>
        {showV6 ? (
          <PlaylistV6 />
        ) : (
          <>
            {isHome ? (
              <HomeScreen theme={mode} />
            ) : (
              <NavPreviewLabel activeId={activeId} counter={counter} theme={mode} />
            )}

            {/* The harness switch sits at `top-4 right-4` — exactly on top of the Home
                header's search button — so the real screen owns that corner. */}
            {!isHome && <ThemeToggle theme={mode} onToggle={toggle} />}

            <BottomNav
              activeId={activeId}
              onSelect={handleSelect}
              theme={mode}
              /* The mini player is handed to the bar rather than positioned
                 beside it, so the two pills share one stack and one safe-area
                 offset — they cannot drift apart. */
              above={
                nowPlaying && miniVisible ? (
                  <MiniPlayer
                    track={nowPlaying}
                    isPlaying={playing}
                    theme={mode}
                    onTogglePlay={() => setPlaying((value) => !value)}
                    onClose={() => setMiniVisible(false)}
                  />
                ) : null
              }
            />
          </>
        )}
      </div>

      <ViewSwitch view={view} onChange={setView} />
    </div>
  );
}
