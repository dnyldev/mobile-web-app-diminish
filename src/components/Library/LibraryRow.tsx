/*
 * Track row — the modular source's `LibraryRow.tsx` VERBATIM in every visual:
 * 72px favorite drawer / 144px queue+remove drawer, `px-5 py-2.5` body,
 * 48px `rounded-[14px]` cover (image, else `hashHue` gradient letter), ring
 * on current, `Eq` dancing bars (`eq-bar 0.9s ease-in-out`, stagger `0.14s`),
 * dot on paused-current, status lines ("Waiting to upload", "Uploading N%",
 * "Processing audio", "Fingerprinting mix"), 2px progress bar, `RotateCcw`
 * retry, `LoaderCircle` spinner, mono duration.
 *
 * The ONLY transplant: the hand-rolled pointer machine (local `x` state +
 * inline down/move/up) is replaced by the pro `useSwipeRow` hook sitting
 * beside this file — same 72/144 geometry, plus its deciding-state machine,
 * rubber-band overshoot, press-shrink (`scale 0.985`, pro `TrackRow` line 96)
 * and outside-tap close. Long-press still opens the modular bottom sheet
 * (430ms), not the pro floating menu.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ListPlus, LoaderCircle, RotateCcw, Trash2 } from 'lucide-react';
import type { Track } from './types';
import { useSwipeRow } from './useSwipeRow';
import { SPRING_PRESS } from './ease';
import { hashHue } from './format';

interface LibraryRowProps {
  track: Track;
  current: boolean;
  playing: boolean;
  onOpen: () => void;
  onFavorite: () => void;
  onQueue: () => void;
  onDelete: () => void;
  onRetry: () => void;
  onLongPress: () => void;
}

export function LibraryRow({
  track,
  current,
  playing,
  onOpen,
  onFavorite,
  onQueue,
  onDelete,
  onRetry,
  onLongPress,
}: LibraryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const busy = track.status !== 'ready' && track.status !== 'failed';
  const hue = hashHue(track.title);

  const { x, side, pressed, close, handlers, widths } = useSwipeRow({
    onTap: () => {
      if (track.status === 'ready') onOpen();
    },
    onLongPress,
  });

  useEffect(() => {
    if (side !== 'none') {
      const onDocPointerDown = (e: PointerEvent) => {
        if (!rowRef.current?.contains(e.target as Node)) close();
      };
      document.addEventListener('pointerdown', onDocPointerDown);
      return () => document.removeEventListener('pointerdown', onDocPointerDown);
    }
  }, [side, close]);

  return (
    <div ref={rowRef} className="relative select-none overflow-hidden">
      <div className="absolute inset-y-0 left-0 flex items-stretch" style={{ width: widths.LEFT_OPEN }}>
        <button
          type="button"
          aria-label={track.favorite ? 'Unfavorite' : 'Favorite'}
          onClick={() => {
            onFavorite();
            close();
          }}
          className="flex flex-1 items-center justify-center"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Heart className="size-4" fill={track.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-stretch" style={{ width: widths.RIGHT_OPEN }}>
        <button
          type="button"
          aria-label="Add to queue"
          onClick={() => {
            onQueue();
            close();
          }}
          className="flex flex-1 items-center justify-center"
          style={{ background: 'var(--fill-strong)', color: 'var(--fg)' }}
        >
          <ListPlus className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Remove"
          onClick={() => {
            onDelete();
            close();
          }}
          className="flex flex-1 items-center justify-center"
          style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <motion.div
        className="relative z-10"
        style={{ x, background: 'var(--bg)' }}
        animate={{ scale: pressed ? 0.985 : 1 }}
        transition={SPRING_PRESS}
        {...handlers}
      >
        <div
          className={
            'flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors' +
            (current ? ' bg-[var(--fill)]' : '')
          }
        >
          <Cover track={track} current={current} playing={playing} hue={hue} />
          <div className="min-w-0 flex-1">
            <p className={'truncate text-[15px] tracking-[-0.015em]' + (current ? ' font-medium' : '')}>
              {track.title}
            </p>
            <p className="truncate text-[13px] text-[var(--fg-3)]">
              {statusLabel(track) ?? `${track.artist}`}
            </p>
            {busy ? (
              <div className="mt-1.5 h-[2px] overflow-hidden rounded-full" style={{ background: 'var(--fill)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${track.progress * 100}%`, background: 'var(--fg)' }}
                />
              </div>
            ) : null}
          </div>
          {track.status === 'failed' ? (
            <motion.button
              type="button"
              aria-label="Retry upload"
              onClick={(e) => {
                e.stopPropagation();
                onRetry();
              }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING_PRESS}
              className="grid size-9 place-items-center rounded-full"
              style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
            >
              <RotateCcw className="size-3.5" />
            </motion.button>
          ) : current && playing && track.status === 'ready' ? (
            <Eq />
          ) : current ? (
            <span className="size-1.5 rounded-full bg-[var(--fg)]" />
          ) : null}
          {track.status === 'ready' ? (
            <span className="font-mono text-[12px] tabular-nums text-[var(--fg-3)]">{track.duration}</span>
          ) : busy ? (
            <LoaderCircle className="size-3.5 animate-spin text-[var(--fg-3)]" />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function statusLabel(track: Track) {
  switch (track.status) {
    case 'queued':
      return 'Waiting to upload';
    case 'uploading':
      return `Uploading ${Math.round(track.progress * 100)}%`;
    case 'processing':
      return 'Processing audio';
    case 'analyzing':
      return 'Fingerprinting mix';
    case 'failed':
      return track.error ?? 'Upload failed';
    default:
      return null;
  }
}

function Cover({
  track,
  current,
  playing,
  hue,
}: {
  track: Track;
  current: boolean;
  playing: boolean;
  hue: number;
}) {
  return (
    <div
      className="relative size-12 shrink-0 overflow-hidden rounded-[14px]"
      style={{ boxShadow: current ? '0 0 0 1px var(--fg)' : undefined }}
    >
      {track.cover ? (
        <img src={track.cover} alt="" className="size-full object-cover" draggable={false} />
      ) : (
        <div
          className="grid size-full place-items-center text-[16px] font-semibold"
          style={{
            background: `linear-gradient(145deg, hsl(${hue} 32% 42%), hsl(${(hue + 40) % 360} 28% 28%))`,
            color: 'white',
          }}
        >
          {track.letter}
        </div>
      )}
      {playing && current ? <div className="absolute inset-0 bg-black/20" /> : null}
    </div>
  );
}

function Eq() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] origin-bottom rounded-full bg-[var(--fg)]"
          style={{
            height: 12,
            animation: `eq-bar 0.9s ease-in-out ${i * 0.14}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
