import { useCallback, useState } from 'react';
import { AddSongLayer, AddSongSearch } from '@/components/AddSong';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen } from '@/components/HomeScreen';
import { MiniPlayer } from '@/components/MiniPlayer';
import { NavPreviewLabel } from '@/components/NavPreviewLabel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HARNESS_CLASSES, HARNESS_STATIC } from '@/design/theme';
import { DEFAULT_ACTIVE_ID } from '@/design/tokens';
import type { Track } from '@/data/tracks';
import { useAddSong } from '@/hooks/useAddSong';
import { useThemeMode } from '@/hooks/useThemeMode';
import type { NavId } from '@/types/theme';

/**
 * The artifact's component-preview harness: a phone frame on desktop, the
 * explanatory copy in the middle of an intentionally empty screen, the theme
 * switch, and the navigation bar pinned to the bottom.
 *
 * Original: `function fi()` — the single component the artifact mounted.
 *
 * Home renders the playlist screen ported from `enterprise-playlist 2.html`
 * (header + read-only track list). The other destinations still show the
 * harness copy.
 *
 * ## Why the add-music flow lives here
 *
 * Its trigger is the navbar's `+` button, and the bar is a sibling of the screen
 * inside this frame — so the flow cannot live inside `HomeScreen` any more. What
 * moved up are three things: the flow's state machine (`useAddSong`), the list of
 * rows it produces, and the overlays it draws. The ROWS are handed back down to
 * the screen that shows them; the overlays are rendered here, where `absolute`
 * means "the frame" rather than "the scroll content".
 */
export default function App() {
  const { mode, toggle } = useThemeMode();
  const [activeId, setActiveId] = useState<NavId>(DEFAULT_ACTIVE_ID);
  const [counter, setCounter] = useState(0);

  /**
   * Nothing is playing until a row is tapped.
   *
   * The mini player IS the harness's now-playing indicator, so it starts absent
   * rather than pinned to a stand-in track: absent → tap a row → it slides up →
   * ✕ puts it back to absent. `playing` is the only thing the transport moves, and
   * it is display-only — there is no audio behind this preview.
   */
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(true);

  /** Rows added through the add-music flow, newest first. */
  const [added, setAdded] = useState<Track[]>([]);

  /** Original v6: tapping a row selects it *and* starts it playing. */
  const handleSelectTrack = useCallback((track: Track) => {
    setNowPlaying(track);
    setPlaying(true);
  }, []);

  /** The artifact's `t(rows => [track, ...rows]), u(id), a(!0), m(0)`. */
  const handleAddTrack = useCallback((track: Track) => {
    setAdded((rows) => [track, ...rows]);
    setNowPlaying(track);
    setPlaying(true);
  }, []);

  const addSong = useAddSong({ onAdd: handleAddTrack });

  /**
   * The original bumped its press counter on every commit, whether that came
   * from a tap or from releasing a drag on a different destination.
   *
   * It also leaves the search view: in the template that view IS a destination
   * (`U === "search"`), so switching tabs leaves it — and here the nav is what
   * switches destinations, so a tap on any of them has to do the same or the
   * view would sit over the screen the user just asked for.
   */
  const handleSelect = useCallback(
    (id: NavId) => {
      setActiveId(id);
      setCounter((value) => value + 1);
      if (addSong.searchOpen) addSong.closeSearch();
    },
    [addSong],
  );

  const isHome = activeId === 'home';

  return (
    <div className={`${HARNESS_STATIC.page} ${HARNESS_CLASSES[mode].page}`}>
      <div className={`${HARNESS_STATIC.frame} ${HARNESS_CLASSES[mode].frame}`}>
        {/* The search view replaces the screen rather than floating over it —
            the template switches its page to it, and that is what this is. */}
        {addSong.searchOpen ? (
          <AddSongSearch
            theme={mode}
            query={addSong.query}
            results={addSong.results}
            searching={addSong.searching}
            searchError={addSong.searchError}
            addingIds={addSong.addingIds}
            savedIds={addSong.savedIds}
            onQueryChange={addSong.setQuery}
            onClose={addSong.closeSearch}
            onPick={addSong.pickResult}
          />
        ) : isHome ? (
          <HomeScreen
            theme={mode}
            added={added}
            /* The row that is mid-upload is the flow's state, not this screen's;
               the screen only renders it. */
            pending={addSong.pending}
            onSelectTrack={handleSelectTrack}
            onCancelUpload={addSong.cancelUpload}
          />
        ) : (
          <NavPreviewLabel activeId={activeId} counter={counter} theme={mode} />
        )}

        {/* The harness switch sits at `top-4 right-4` — exactly on top of the Home
            header's search button — so the real screen owns that corner. It steps
            aside for the search view too, whose field runs to the same edge. */}
        {!isHome && !addSong.searchOpen && <ThemeToggle theme={mode} onToggle={toggle} />}

        {/* The add-music overlays cover the frame, not the scroll content. */}
        <AddSongLayer theme={mode} controller={addSong} />

        <BottomNav
          activeId={activeId}
          onSelect={handleSelect}
          theme={mode}
          /* The `+` beside the pill — an action, not a destination — opens the
             add-music sheet. */
          onAction={addSong.openSheet}
          /* The mini player is handed to the bar rather than positioned
             beside it, so the two pills share one stack and one safe-area
             offset — they cannot drift apart. */
          above={
            nowPlaying ? (
              <MiniPlayer
                track={nowPlaying}
                isPlaying={playing}
                theme={mode}
                onTogglePlay={() => setPlaying((value) => !value)}
                onClose={() => setNowPlaying(null)}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}
