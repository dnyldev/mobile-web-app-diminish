/*
 * Library screen — modular skeleton, professional filters.
 *
 * From the modular `Library.tsx` VERBATIM: `dlib`-scoped root, header
 * (`pt-[max(18px,calc(var(--safe-t)+14px))]`, 32px `tracking-[-0.04em]` title,
 * `{n} tracks` count, `h-11 rounded-full` search pill in `var(--fill)` with
 * clear-X), both empty states ("Library is empty / Upload a track to get
 * started / Add a track", "No matching tracks / Try a different title or
 * artist"), and the `held`-track → `QuickActions` bottom-sheet wiring
 * (Play/Favorite/Queue/Share/Delete each closing the sheet).
 *
 * From the professional `LibraryScreen.tsx`: the filter chips
 * (`All tracks / Liked / Recently added`, `h-8 rounded-full px-3.5`,
 * active = inverted `fg/bg`, idle = `fill/fg-2`), the combined
 * search+filter memo (liked → `favorite`, recent → insertion order, top 5),
 * the count line shape (`{n} track(s) · hold a row for quick actions`), and
 * the per-row entrance (`motion.div layout="position"`, opacity `0 → 1`,
 * `0.25s`).
 *
 * Deliberate deviations (6), all per Danial or forced by the host:
 * 1. NO bottom dock inside this screen — the mini-player + tab bar the source
 *    stacked under the list live OUTSIDE it (the host's `BottomNav`, mounted
 *    by the lab below this screen): the list ends with `pb-36` (room for the
 *    56px pill + stack padding + safe-area), not the source's `pb-40` that
 *    reserved room for the source's own dock.
 * 2. Eyebrow `Midnight`/`Nocturne` → `Diminish` (house brand, like the
 *    Sonnet→Diminish rename in Auth).
 * 3. `min-h-dvh` shell (same Tailwind-v3 reason as the Onboarding port).
 * 4. Theme arrives as a `theme` prop (`day | night`, seeded from the OS in
 *    the lab) instead of the source's `documentElement.dataset.theme` write —
 *    a component must not own the document. `dark:` variants are absent here
 *    on purpose: every color reads `var(--…)` from `libraryTokens.css`.
 * 5. The header `+` upload button is REMOVED (per Danial) — upload is owned
 *    by the `BottomNav` action button beside the pill. `onUpload` stays on
 *    the props ONLY for the empty-library "Add a track" button; the lab
 *    wires the same handler to both.
 * 6. The `Diminish` eyebrow and the `{n} tracks · hold a row for quick
 *    actions` hint line are REMOVED (per Danial). The `{n} tracks` count
 *    beside the title stays — it is the modular header's own.
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { LibraryRow } from './LibraryRow';
import { QuickActions } from './QuickActions';
import type { Filter, Track } from './types';
import './libraryTokens.css';

export type LibraryTheme = 'day' | 'night';

interface LibraryScreenProps {
  tracks: Track[];
  currentId: string;
  playing: boolean;
  theme: LibraryTheme;
  onOpen: (id: string) => void;
  onUpload: () => void;
  onFavorite: (id: string) => void;
  onQueue: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  onShare: (track: Track) => void;
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All tracks' },
  { id: 'liked', label: 'Liked' },
  { id: 'recent', label: 'Recently added' },
];

const RECENT_COUNT = 5;

export function LibraryScreen({
  tracks,
  currentId,
  playing,
  theme,
  onOpen,
  onUpload,
  onFavorite,
  onQueue,
  onDelete,
  onRetry,
  onShare,
}: LibraryScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [held, setHeld] = useState<Track | null>(null);

  const filtered = useMemo(() => {
    let list = tracks;
    if (filter === 'liked') list = list.filter((t) => t.favorite);
    if (filter === 'recent') list = list.slice(-RECENT_COUNT).reverse();
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q),
    );
  }, [tracks, query, filter]);

  return (
    <div className="dlib relative flex min-h-dvh flex-1 flex-col" data-theme={theme}>
      <header className="px-5 pb-3 pt-[max(18px,calc(var(--safe-t)+14px))]">
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="text-[32px] font-semibold leading-none tracking-[-0.04em]">Library</h1>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[var(--fg-3)]">{filtered.length} tracks</span>
          </div>
        </div>
        <label className="mt-4 flex h-11 items-center gap-2 rounded-full px-3.5" style={{ background: 'var(--fill)' }}>
          <Search className="size-4 shrink-0 text-[var(--fg-3)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles and artists"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-3)]"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="grid size-7 place-items-center rounded-full text-[var(--fg-3)] hover:text-[var(--fg)]"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </label>

        <div className="mt-3.5 flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className="h-8 rounded-full px-3.5 text-[12.5px] font-medium transition-colors"
              style={{
                background: filter === f.id ? 'var(--fg)' : 'var(--fill)',
                color: filter === f.id ? 'var(--bg)' : 'var(--fg-2)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-36">
        {tracks.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-[15px] font-medium">Library is empty</p>
            <p className="mt-1 text-[13px] text-[var(--fg-3)]">Upload a track to get started.</p>
            <button
              type="button"
              onClick={onUpload}
              className="mt-4 h-10 rounded-full px-4 text-[13px] font-medium"
              style={{ background: 'var(--fg)', color: 'var(--bg)' }}
            >
              Add a track
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-[15px] font-medium">No matching tracks</p>
            <p className="mt-1 text-[13px] text-[var(--fg-3)]">Try a different title or artist.</p>
          </div>
        ) : null}
        {filtered.map((track) => (
          <motion.div
            key={track.id}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <LibraryRow
              track={track}
              current={track.id === currentId}
              playing={playing && track.id === currentId}
              onOpen={() => onOpen(track.id)}
              onFavorite={() => onFavorite(track.id)}
              onQueue={() => onQueue(track.id)}
              onDelete={() => onDelete(track.id)}
              onRetry={() => onRetry(track.id)}
              onLongPress={() => setHeld(track)}
            />
          </motion.div>
        ))}
      </div>

      <QuickActions
        track={held}
        open={!!held}
        onOpenChange={(open) => {
          if (!open) setHeld(null);
        }}
        onPlay={() => {
          if (held) onOpen(held.id);
          setHeld(null);
        }}
        onFavorite={() => {
          if (held) onFavorite(held.id);
          setHeld(null);
        }}
        onQueue={() => {
          if (held) onQueue(held.id);
          setHeld(null);
        }}
        onShare={() => {
          if (held) onShare(held);
          setHeld(null);
        }}
        onDelete={() => {
          if (held) onDelete(held.id);
          setHeld(null);
        }}
      />
    </div>
  );
}
