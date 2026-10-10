/*
 * Mini player — grok body + sonnet progress line.
 *
 * Body VERBATIM from grok's `Library.tsx` dock (lines 102-128): `motion.div
 * layout`, `mb-2 flex w-full items-center gap-2 rounded-[22px]
 * border-[var(--hairline)] p-1.5` in `var(--glass)` with
 * `blur(22px) saturate(160%)` + `var(--shadow-float)`, open button
 * (`flex-1`, `gap-2.5`, `rounded-[16px] px-1 py-0.5`, 44px cover,
 * 14px-medium title / 12px artist), inverted 44px play/pause disc with
 * `SPRING_PRESS` tap (`whileTap scale 0.9`).
 *
 * Progress VERBATIM in behavior from sonnet's `MiniPlayer.tsx` (lines 51-56):
 * a 2px bar pinned to the pill's bottom edge, width = playback fraction with
 * `transition-[width] duration-200`. Colors mapped onto this screen's own
 * tokens (track `var(--fill-strong)`, fill `var(--fg)`) — sonnet's
 * `zinc-900/white` pair only works on its own light/dark surfaces.
 *
 * Deliberate deviations (3):
 * 1. `pointer-events-auto` on the root — it rides in `BottomNav`'s `above`
 *    slot, whose stack is `pointer-events-none` (every clickable opts back
 *    in; same rule as the pill and the `+` button).
 * 2. `relative overflow-hidden` on the root — grok has neither; the absolute
 *    progress bar needs the relative box, and the overflow keeps the bar
 *    clipped to the `rounded-[22px]` corners.
 * 3. `hashHue` gradient cover fallback — grok assumes a cover; the row in
 *    this same screen already falls back this way, so the pill can never
 *    show an empty box.
 */

import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { SPRING_PRESS } from './ease';
import { clamp, hashHue } from './format';
import type { Track } from './types';

interface MiniPlayerProps {
  track: Track;
  playing: boolean;
  /** Playback fraction, 0..1. */
  progress: number;
  onOpen: () => void;
  onToggle: () => void;
}

export function MiniPlayer({ track, playing, progress, onOpen, onToggle }: MiniPlayerProps) {
  const pct = clamp(progress, 0, 1) * 100;
  const hue = hashHue(track.title);

  return (
    <motion.div
      layout
      className="pointer-events-auto relative mb-2 flex w-full items-center gap-2 overflow-hidden rounded-[22px] border border-[var(--hairline)] p-1.5"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(22px) saturate(160%)',
        boxShadow: 'var(--shadow-float)',
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[16px] px-1 py-0.5 text-left"
      >
        {track.cover ? (
          <img src={track.cover} alt="" className="size-11 shrink-0 rounded-[12px] object-cover" draggable={false} />
        ) : (
          <div
            className="grid size-11 shrink-0 place-items-center rounded-[12px] text-[14px] font-semibold text-white"
            style={{
              background: `linear-gradient(145deg, hsl(${hue} 32% 42%), hsl(${(hue + 40) % 360} 28% 28%))`,
            }}
          >
            {track.letter}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium tracking-[-0.015em]">{track.title}</p>
          <p className="truncate text-[12px] text-[var(--fg-3)]">{track.artist}</p>
        </div>
      </button>
      <motion.button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        transition={SPRING_PRESS}
        className="grid size-11 shrink-0 place-items-center rounded-full"
        style={{ background: 'var(--fg)', color: 'var(--bg)' }}
      >
        {playing ? (
          <Pause className="size-4" fill="currentColor" />
        ) : (
          <Play className="size-4 translate-x-px" fill="currentColor" />
        )}
      </motion.button>
      <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: 'var(--fill-strong)' }}>
        <div
          className="h-full transition-[width] duration-200"
          style={{ width: `${pct}%`, background: 'var(--fg)' }}
        />
      </div>
    </motion.div>
  );
}
