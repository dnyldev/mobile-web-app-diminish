import { useCallback, useMemo, useRef, useState } from 'react';
import {
  V6_COPY,
  V6_DEFAULTS,
  V6_METRICS,
  V6_ROOT_CLASS,
  V6_SCROLLER_CLASS,
  V6_STATIC,
  type V6NavId,
} from '@/design/playlistV6';
import { buildV6Tracks, type V6Track } from '@/data/playlistV6';
import { usePlaybackClock } from '@/hooks/usePlaybackClock';
import { useScrollCompact } from '@/hooks/useScrollCompact';
import { MiniPlayerPill } from './MiniPlayerPill';
import { NowPlayingSheet } from './NowPlayingSheet';
import { TrackRow } from './TrackRow';
import { V6BottomNav } from './V6BottomNav';
import type { PlaylistV6Props } from './types';
import './playlistKeyframes.css';

export type { PlaylistV6Props };

/**
 * The "Playlist v6" screen — the whole app region of
 * `../Nav-music-playlist.html.html` (`_extract-nav-playlist/app.source.js`),
 * one component there, five here.
 *
 * Original, in order: `Array.from({length:79})` demo rows, then ten `useState`s,
 * then a scroll listener, then a 100ms progress interval, then one big tree.
 * The state and the two effects are reproduced here with the same initial
 * values and thresholds; the tree is split across `<TrackRow>`,
 * `<MiniPlayerPill>`, `<V6BottomNav>` and `<NowPlayingSheet>`.
 *
 * Deviations from the original, all forced by the phone frame:
 *   - the document scroll became the screen's own scroll shell
 *     (`V6_SCROLLER_CLASS`), so the thresholds read `scrollTop`, not `scrollY`;
 *   - every `fixed` layer is `absolute` inside the frame;
 *   - `min-h-screen` is dropped from the root (it would push the absolute nav
 *     past the frame's bottom edge);
 *   - the progress advance is hoisted out of the state updater.
 * See `README > Fidelity notes` for the full list.
 */
export function PlaylistV6({ tracks: providedTracks }: PlaylistV6Props) {
  /** Original: `useMemo(() => Array.from({ length: 79 }, …), [])`. */
  const tracks = useMemo<V6Track[]>(
    () => (providedTracks ? [...providedTracks] : buildV6Tracks()),
    [providedTracks],
  );

  const [activeNavId, setActiveNavId] = useState<V6NavId>(V6_DEFAULTS.activeNavId);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(V6_DEFAULTS.activeTrackId);
  const [playing, setPlaying] = useState<boolean>(V6_DEFAULTS.playing);
  const [likedIds, setLikedIds] = useState<ReadonlySet<number>>(
    () => new Set(V6_DEFAULTS.likedIds),
  );
  const [sheetOpen, setSheetOpen] = useState<boolean>(V6_DEFAULTS.sheetOpen);
  const [miniVisible, setMiniVisible] = useState<boolean>(V6_DEFAULTS.miniVisible);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const compact = useScrollCompact(scrollerRef, {
    compactAt: V6_METRICS.compactAt,
    expandAt: V6_METRICS.expandAt,
  });

  /** Original: `a = r !== null ? e[r] : null`. */
  const activeTrack = activeTrackId !== null ? (tracks[activeTrackId] ?? null) : null;

  /** Original: the wrap `(N + 1) % e.length` inside the interval. */
  const advance = useCallback(() => {
    setActiveTrackId((current) => (current === null ? current : (current + 1) % tracks.length));
  }, [tracks.length]);

  const { progress, seek } = usePlaybackClock({
    running: playing && activeTrackId !== null,
    initialProgress: V6_DEFAULTS.progress,
    onComplete: advance,
  });

  /** Original `d`: toggle membership of the liked set. */
  const toggleLike = (id: number) => {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Original `w`: select the row, start playing, and jump to a random point. */
  const selectTrack = (id: number) => {
    setActiveTrackId(id);
    setPlaying(true);
    seek(Math.random() * 40);
  };

  /** Original: `l(m > 0 ? e[m-1].id : e[e.length-1].id), s(0)`. */
  const previous = () => {
    const index = tracks.findIndex((track) => track.id === activeTrackId);
    setActiveTrackId(index > 0 ? tracks[index - 1].id : tracks[tracks.length - 1].id);
    seek(0);
  };

  /** Original: `l(e[(m+1) % e.length].id), s(0)`. */
  const next = () => {
    const index = tracks.findIndex((track) => track.id === activeTrackId);
    setActiveTrackId(tracks[(index + 1) % tracks.length].id);
    seek(0);
  };

  /** Original: `C(!1), p(!1), l(null), u(!1)`. */
  const closeMini = () => {
    setMiniVisible(false);
    setSheetOpen(false);
    setActiveTrackId(null);
    setPlaying(false);
  };

  return (
    <div
      className={`absolute inset-0 ${V6_ROOT_CLASS}`}
      style={{ fontFamily: V6_COPY.rootFontFamily }}
    >
      <div ref={scrollerRef} className={V6_SCROLLER_CLASS}>
        <header className={V6_STATIC.header}>
          <div className={V6_STATIC.headerInner}>
            <div className={V6_STATIC.headerLeft}>
              <h1 className={V6_STATIC.headerTitle}>{V6_COPY.title}</h1>
              <span className={V6_STATIC.headerCount}>
                {V6_COPY.countPrefix}
                {tracks.length}
                {V6_COPY.countSuffix}
              </span>
            </div>
            <div className={V6_STATIC.headerBadgeWrap}>
              <div className={V6_STATIC.headerBadge}>
                <div className={V6_STATIC.headerBadgeDot} />
                {V6_COPY.headerBadge}
              </div>
            </div>
          </div>
        </header>

        <main className={V6_STATIC.main}>
          <div className={V6_STATIC.rail}>
            <div className={V6_STATIC.railLeft}>
              <div className={V6_STATIC.railCount}>{tracks.length}</div>
              <span className={V6_STATIC.railCaption}>
                {V6_COPY.captionPrefix}
                {compact ? V6_COPY.captionCompact : V6_COPY.captionExpanded}
              </span>
            </div>
            <div className={V6_STATIC.railLabel}>{V6_COPY.railLabel}</div>
          </div>

          <div className={V6_STATIC.list}>
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                isActive={activeTrackId === track.id}
                isLiked={likedIds.has(track.id)}
                isPlaying={playing}
                onSelect={() => selectTrack(track.id)}
                onToggleLike={() => toggleLike(track.id)}
                onOpenSheet={() => {
                  setSheetOpen(true);
                  if (activeTrackId === null) setActiveTrackId(track.id);
                }}
              />
            ))}
          </div>

          <div className={V6_STATIC.railNote}>{V6_COPY.railNote}</div>
        </main>
      </div>

      {activeTrack && miniVisible && (
        <MiniPlayerPill
          track={activeTrack}
          isPlaying={playing}
          onOpen={() => setSheetOpen(true)}
          onTogglePlay={() => setPlaying((current) => !current)}
          onClose={closeMini}
        />
      )}

      <V6BottomNav activeId={activeNavId} compact={compact} onSelect={setActiveNavId} />

      {sheetOpen && activeTrack && (
        <NowPlayingSheet
          track={activeTrack}
          isPlaying={playing}
          isLiked={likedIds.has(activeTrack.id)}
          progress={progress}
          onClose={() => setSheetOpen(false)}
          onTogglePlay={() => setPlaying((current) => !current)}
          onToggleLike={() => toggleLike(activeTrack.id)}
          onSeek={seek}
          onPrevious={previous}
          onNext={next}
        />
      )}
    </div>
  );
}
