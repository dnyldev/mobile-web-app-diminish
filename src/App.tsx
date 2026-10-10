import { useCallback, useState } from 'react';
import { AddSongLayer, AddSongSearch } from '@/components/AddSong';
import { AuthFlow } from '@/components/Auth';
import type { AuthResult } from '@/components/Auth';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen } from '@/components/HomeScreen';
import { LibraryScreen } from '@/components/Library';
import { SEED_TRACKS } from '@/components/Library/data';
import type { Track as LibraryTrack } from '@/components/Library/types';
import { MiniPlayer } from '@/components/MiniPlayer';
import { NavPreviewLabel } from '@/components/NavPreviewLabel';
import { Onboarding } from '@/components/Onboarding';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HARNESS_CLASSES, HARNESS_STATIC } from '@/design/theme';
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
  /**
   * The destination the flow ends on.
   *
   * The lab's onboarding → auth → library chain lands in the library, so this
   * app opens on the library tab too. The harness's own `DEFAULT_ACTIVE_ID` is
   * `home`, whose screen is the older playlist list (the `enterprise-playlist`
   * port) — landing there made the flow end on the old library instead.
   */
  const [activeId, setActiveId] = useState<NavId>('library');
  const [counter, setCounter] = useState(0);

  /**
   * Entry gate: onboarding (3 steps) → auth (welcome/phone/OTP) → the app.
   * Both completions persist in localStorage so a returning visitor lands
   * straight in the app. Demo auth only — no backend call behind it.
   */
  type Phase = 'onboarding' | 'auth' | 'app';
  const [phase, setPhase] = useState<Phase>(() => {
    try {
      if (window.localStorage.getItem('diminish.onboarded') !== '1') return 'onboarding';
      if (!window.localStorage.getItem('diminish.auth')) return 'auth';
      return 'app';
    } catch {
      return 'onboarding';
    }
  });

  const handleOnboardingDone = useCallback(() => {
    try {
      window.localStorage.setItem('diminish.onboarded', '1');
    } catch {
      /* storage unavailable — gate reappears next visit */
    }
    setPhase('auth');
  }, []);

  const handleAuthComplete = useCallback((result: AuthResult) => {
    try {
      window.localStorage.setItem('diminish.auth', JSON.stringify(result));
    } catch {
      /* storage unavailable — gate reappears next visit */
    }
    /* The flow ends where the lab's does: in the library. */
    setActiveId('library');
    setPhase('app');
  }, []);

  /** Library demo catalogue + its selection. Display-only, like the harness. */
  const [libTracks, setLibTracks] = useState<LibraryTrack[]>(SEED_TRACKS);
  const [libCurrentId, setLibCurrentId] = useState<string | null>(null);

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
  const isLibrary = activeId === 'library';
  const pageClasses = isLibrary
    ? 'h-[100dvh] w-full overflow-hidden selection:bg-black/10 transition-colors duration-300'
    : HARNESS_STATIC.page;
  const frameClasses = isLibrary
    ? 'relative isolate h-full w-full overflow-hidden transition-colors duration-300'
    : HARNESS_STATIC.frame;

  /** Library row actions — local demo state (favorite/queue/delete/retry). */
  const patchLibTrack = useCallback((id: string, patch: Partial<LibraryTrack>) => {
    setLibTracks((rows) => rows.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);
  const handleLibOpen = useCallback((id: string) => setLibCurrentId(id), []);
  const handleLibUpload = useCallback(() => {
    setActiveId('home');
    addSong.openSheet();
  }, [addSong]);

  if (phase === 'onboarding') {
    return <Onboarding onDone={handleOnboardingDone} />;
  }
  if (phase === 'auth') {
    return <AuthFlow onComplete={handleAuthComplete} />;
  }

  return (
    <div className={`${pageClasses} ${HARNESS_CLASSES[mode].page}`}>
      <div
        className={`${frameClasses} ${isLibrary ? '' : HARNESS_CLASSES[mode].frame}`}
      >
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
        ) : isLibrary ? (
          <LibraryScreen
            tracks={libTracks}
            currentId={libCurrentId ?? ''}
            playing={playing}
            theme={mode === 'dark' ? 'night' : 'day'}
            onOpen={handleLibOpen}
            onUpload={handleLibUpload}
            onFavorite={(id) =>
              setLibTracks((rows) =>
                rows.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t)),
              )
            }
            onQueue={(id) =>
              patchLibTrack(
                id,
                libTracks.find((t) => t.id === id)?.queued ? { queued: false } : { queued: true },
              )
            }
            onDelete={(id) => setLibTracks((rows) => rows.filter((t) => t.id !== id))}
            onRetry={(id) =>
              patchLibTrack(id, { status: 'queued', progress: 0, error: null })
            }
            onShare={() => {}}
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
