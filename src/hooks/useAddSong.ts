import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, RefObject } from 'react';
import { ADD_SONG_COPY, ADD_SONG_METRICS } from '@/design/addSong';
import {
  buildPendingUpload,
  buildSearchTrack,
  commitPendingUpload,
  searchArchive,
} from '@/data/addSong';
import type { AddSearchSeed, PendingUpload } from '@/data/addSong';
import type { Track } from '@/data/tracks';

export interface UseAddSongOptions {
  /** Prepend the track to the list and start it — the artifact's `t(…), u(id), a(!0)`. */
  onAdd: (track: Track) => void;
}

export interface AddSongController {
  /** `g` / `f` — the toast's text, or `null` while it is down. */
  toast: string | null;
  /** `d` — the two-path sheet. */
  sheetOpen: boolean;
  /** `p` — the search view. */
  searchOpen: boolean;
  /** `_` */
  query: string;
  /** `T` — the filtered results, i.e. what the debounce last settled on. */
  results: AddSearchSeed[];
  /** `Q` — the 600ms debounce is running, i.e. the skeletons are up. */
  searching: boolean;
  /** `W` — the hidden `input[type=file]`. */
  fileInputRef: RefObject<HTMLInputElement>;
  /** `n` — the row a chosen file is uploading into, or `null`. */
  pending: PendingUpload | null;
  /** `R` — results whose track is being committed, i.e. showing the spinner. Keyed by the entry's own id. */
  addingIds: ReadonlySet<number>;
  /** `B` — results that have just landed, i.e. showing the ✓. */
  savedIds: ReadonlySet<number>;

  openSheet: () => void;
  closeSheet: () => void;
  /** `df` — the local path. */
  chooseLocal: () => void;
  /** `pf` — the API path. */
  chooseSearch: () => void;
  closeSearch: () => void;
  setQuery: (value: string) => void;
  /** `vf` */
  pickResult: (seed: AddSearchSeed) => void;
  /** `mf` — a chosen file starts uploading. */
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** `H` — cancel the upload in flight. */
  cancelUpload: () => void;
}

/**
 * The Add music flow's state machine.
 *
 * Original: `_extract-add-music/app.source.js` lines 153-235 — nine `useState`s
 * plus `Hl`, `cf`, `ff`, `df`, `pf`, `mf`, `vf` and the two effects around `_n`.
 * Everything the flow does is one of those, and the timings are the artifact's
 * own (see `ADD_SONG_METRICS`).
 *
 * Three pieces of that are deliberately NOT here, because they existed only to
 * serve the `ADD NEW SONG` pill that the nav's `+` button replaced:
 *
 *   `R` / `uf` / `Ae`     the scroll threshold that shrank the pill to 36px
 *   `Hl()` / `_n` / `af`  the 3-second "hold the pill open" deadline — NOT a
 *                         toast, despite the timer that reads like one
 *   `cf`                  the compact-state no-op handler
 *
 * What is left is the flow itself: the sheet, the search view, the file input,
 * the toast, and the two ways a row gets built. Its only caller now is the
 * nav's `+`, through `openSheet`.
 *
 * ## The row lifecycle, ported from the readable artifact
 *
 * The flow used to commit a row the instant a file or a result was chosen.
 * `Library/Add-song.html` does not: it runs a lifecycle first, and this hook now
 * runs the same one, with its own numbers.
 *
 *   the file path   (`onFileChange` → `commitUpload`) a `PendingUpload` row goes
 *                   up first and its bar climbs on an 80ms interval, `+3..11`
 *                   per tick. At 100% the row turns `processing`, and 900ms
 *                   later the real `Track` replaces it. `cancelUpload` is its ✕.
 *   the search path (`pickResult`, the artifact's `VA`) a picked result shows a
 *                   spinner for 900ms, then the ✓ for 1500ms, and the track lands
 *                   at the spinner's end. The view stays open and the query stays
 *                   as typed — the template does not reset either on a pick.
 *
 * ## The search itself
 *
 * `results` is not derived on render any more: the template filters inside a
 * 600ms `setTimeout` and raises a `searching` flag while it waits, so the view
 * can put its skeletons up. Both are the artifact's own effect (5066-5075), and
 * both live here so the view stays a render.
 */
export function useAddSong({ onAdd }: UseAddSongOptions): AddSongController {
  /** `g` */
  const [toast, setToast] = useState<string | null>(null);
  /** `d` */
  const [sheetOpen, setSheetOpen] = useState(false);
  /** `p` */
  const [searchOpen, setSearchOpen] = useState(false);
  /** `_` */
  const [query, setQuery] = useState('');
  /** `T` */
  const [results, setResults] = useState<AddSearchSeed[]>([]);
  /** `Q` */
  const [searching, setSearching] = useState(false);
  /** `n` */
  const [pending, setPending] = useState<PendingUpload | null>(null);
  /** `R` */
  const [addingIds, setAddingIds] = useState<ReadonlySet<number>>(new Set());
  /** `B` */
  const [savedIds, setSavedIds] = useState<ReadonlySet<number>>(new Set());

  /** `W` */
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** `S` — the upload's interval. */
  const tickRef = useRef<number | null>(null);

  // The artifact let its pending timeouts run past unmount; this app tears them
  // down, so a dismissed screen can never write state. The interval goes with
  // them — it is the one timer that would otherwise tick forever.
  const timers = useRef<number[]>([]);
  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
    },
    [],
  );
  const later = useCallback((run: () => void, ms: number) => {
    timers.current.push(window.setTimeout(run, ms));
  }, []);

  /**
   * The toast dismisses itself, keyed on its text so a later toast restarts the
   * clock instead of being cut short by an earlier one's timer — the artifact's
   * own `useEffect(() => { if (f) { const m = setTimeout(() => g(null), 2500) } }, [f])`.
   *
   * One duration for all three texts (the artifact had 2200 for the gallery path
   * and 2500 in that effect): `localToastMs` is the value this app already shipped.
   */
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), ADD_SONG_METRICS.localToastMs);
    return () => window.clearTimeout(id);
  }, [toast]);

  const stopTicking = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  /** `ff` — open the two-path sheet. The nav's `+` is the only caller. */
  const openSheet = useCallback(() => setSheetOpen(true), []);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  /** `df` — close the sheet, say what is about to happen, then open the picker. */
  const chooseLocal = useCallback(() => {
    setSheetOpen(false);
    setToast(ADD_SONG_COPY.toast);
    later(() => fileInputRef.current?.click(), ADD_SONG_METRICS.filePickerDelayMs);
  }, [later]);

  /**
   * The template's own search effect (5066-5075), which is the whole of what
   * `results` and `searching` do:
   *
   *   if (a.trim() === "") { l([]); c(false); return }
   *   c(true)
   *   const m = setTimeout(() => { l(filter(a)); c(false) }, 600)
   *   return () => clearTimeout(m)
   *
   * A blank query clears the list and drops the flag at once — no skeletons for
   * an empty field. Anything else raises the flag, and the filter runs only when
   * the typing settles; a keystroke inside the 600ms replaces the pending timer
   * rather than adding to it, so the list is never filtered mid-word.
   */
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const id = window.setTimeout(() => {
      setResults(searchArchive(query));
      setSearching(false);
    }, ADD_SONG_METRICS.searchDebounceMs);

    return () => window.clearTimeout(id);
  }, [query]);

  /** `pf` — close the sheet, then the search view takes the screen. */
  const chooseSearch = useCallback(() => {
    setSheetOpen(false);
    later(() => setSearchOpen(true), ADD_SONG_METRICS.searchOpenDelayMs);
  }, [later]);

  /**
   * The view's back button — the artifact's `t("library"), s("")`: back to the
   * library AND the query is dropped, so returning to the view never shows the
   * last search's results.
   */
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
  }, []);

  /** `H` — the ✕ on the uploading row: stop the clock and drop the row. */
  const cancelUpload = useCallback(() => {
    stopTicking();
    setPending(null);
  }, [stopTicking]);

  /**
   * The artifact's `setTimeout(…, 900)` once the bar is full: the row becomes a
   * real track, a toast says so, and the phone gets one short buzz.
   *
   * The record is built from the row as it was CREATED (the artifact's `G`), not
   * from its last ticking value: only title, letter and gradient cross over, so
   * the cover never changes colour at the moment the row stops being an upload.
   */
  const commitUpload = useCallback(
    (row: PendingUpload) => {
      onAdd(commitPendingUpload(row));
      setPending(null);
      setToast(ADD_SONG_COPY.uploadAddedToast);
      try {
        navigator.vibrate?.(10);
      } catch {
        // No `navigator.vibrate` on desktop browsers; the artifact guarded it too.
      }
    },
    [onAdd],
  );

  /** `mf` — a chosen file starts uploading: the row goes up now, the track lands later. */
  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const row = buildPendingUpload(files[0].name);
      stopTicking();
      setPending(row);

      let progress = 0;
      tickRef.current = window.setInterval(() => {
        progress +=
          Math.random() * ADD_SONG_METRICS.uploadStepRandom + ADD_SONG_METRICS.uploadStepMin;

        if (progress >= 100) {
          stopTicking();
          setPending((current) =>
            current ? { ...current, progress: 100, status: 'processing' } : null,
          );
          later(() => commitUpload(row), ADD_SONG_METRICS.uploadCommitMs);
          return;
        }

        setPending((current) => (current ? { ...current, progress } : null));
      }, ADD_SONG_METRICS.uploadTickMs);

      // Reset the input so the same file can be picked twice.
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [commitUpload, later, stopTicking],
  );

  /** `vf` — the artifact's `VA`: spinner, then ✓, and the track lands at 900ms. */
  const pickResult = useCallback(
    (seed: AddSearchSeed) => {
      const key = seed.id;
      if (addingIds.has(key) || savedIds.has(key)) return;

      setAddingIds((current) => new Set(current).add(key));

      later(() => {
        setAddingIds((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
        setSavedIds((current) => new Set(current).add(key));

        onAdd(buildSearchTrack(seed));
        setToast(`${seed.title}${ADD_SONG_COPY.addedSuffix}`);
        try {
          navigator.vibrate?.([10, 30, 10]);
        } catch {
          // see `commitUpload`
        }

        later(() => {
          setSavedIds((current) => {
            const next = new Set(current);
            next.delete(key);
            return next;
          });
        }, ADD_SONG_METRICS.searchAddedMs);
      }, ADD_SONG_METRICS.searchAddMs);
    },
    [addingIds, later, onAdd, savedIds],
  );

  /** `vi` */
  return {
    toast,
    sheetOpen,
    searchOpen,
    query,
    results,
    searching,
    fileInputRef,
    pending,
    addingIds,
    savedIds,
    openSheet,
    closeSheet,
    chooseLocal,
    chooseSearch,
    closeSearch,
    setQuery,
    pickResult,
    onFileChange,
    cancelUpload,
  };
}
