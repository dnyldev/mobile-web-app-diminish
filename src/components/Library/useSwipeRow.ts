/*
 * Row swipe engine — the professional source's `useSwipeRow`
 * (`professional-music-player-design/src/hooks/useSwipeRow.ts`) with the
 * MODULAR row's geometry plugged in, so the gesture feels like the pro
 * build but lands on the modular look:
 *
 * Kept from pro (untouched): the `deciding → horizontal | vertical` state
 * machine, press-shrink state, rubber-band overshoot (`* 0.3` past the stop),
 * snap spring (`stiffness: 480, damping: 40`), `setPointerCapture` on the
 * drag target, doc-`pointerdown` close contract (`side` + `close()` returned
 * to the row), `MotionValue` driven imperatively (no re-render per pixel).
 *
 * Forked for modular geometry (the ONLY numeric deviations):
 * - `ACTION_WIDTH = 72` (pro: 76) — the modular row's left action is
 *   `w-[72px]` (`LibraryRow.tsx` line 54).
 * - `RIGHT_OPEN = 144` (pro: 152) — the modular row's right cluster is
 *   `w-[144px]` (line 68: queue + delete).
 * - `LONG_PRESS_MS = 430` (pro: 480) — the modular row fires its sheet at
 *   430ms (line 108).
 * `OPEN_THRESHOLD = 0.42` and `DRAG_THRESHOLD = 9` are pro-verbatim.
 */

import { useRef, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';

export type SwipeSide = 'none' | 'left' | 'right';

const ACTION_WIDTH = 72;
const LEFT_OPEN = ACTION_WIDTH; // one action revealed on the left (favorite)
const RIGHT_OPEN = ACTION_WIDTH * 2; // two actions revealed on the right (queue + remove)
const DRAG_THRESHOLD = 9;
const OPEN_THRESHOLD = 0.42;
const LONG_PRESS_MS = 430;

export interface SwipeRowCallbacks {
  onTap: () => void;
  onLongPress: () => void;
}

export function useSwipeRow({ onTap, onLongPress }: SwipeRowCallbacks) {
  const x = useMotionValue(0);
  const [side, setSide] = useState<SwipeSide>('none');
  const [pressed, setPressed] = useState(false);

  const start = useRef({ x: 0, y: 0, base: 0, time: 0 });
  const mode = useRef<'idle' | 'deciding' | 'horizontal' | 'vertical'>('idle');
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);
  const pointerId = useRef<number | null>(null);

  const clearLongPress = () => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const snapTo = (target: SwipeSide) => {
    const value = target === 'left' ? LEFT_OPEN : target === 'right' ? -RIGHT_OPEN : 0;
    animate(x, value, { type: 'spring', stiffness: 480, damping: 40 });
    setSide(target);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    pointerId.current = e.pointerId;
    start.current = { x: e.clientX, y: e.clientY, base: x.get(), time: Date.now() };
    mode.current = 'deciding';
    longPressFired.current = false;
    setPressed(true);
    clearLongPress();
    longPressTimer.current = window.setTimeout(() => {
      if (mode.current === 'deciding' || mode.current === 'idle') {
        longPressFired.current = true;
        setPressed(false);
        onLongPress();
      }
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;

    if (mode.current === 'deciding') {
      if (Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        mode.current = 'horizontal';
        clearLongPress();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      } else if (Math.abs(dy) > DRAG_THRESHOLD) {
        mode.current = 'vertical';
        clearLongPress();
      }
    }

    if (mode.current === 'horizontal') {
      let next = start.current.base + dx;
      if (next > LEFT_OPEN) next = LEFT_OPEN + (next - LEFT_OPEN) * 0.3;
      if (next < -RIGHT_OPEN) next = -RIGHT_OPEN + (next + RIGHT_OPEN) * 0.3;
      x.set(next);
    }
  };

  const finish = () => {
    setPressed(false);
    clearLongPress();
    if (mode.current === 'horizontal') {
      const value = x.get();
      if (value > LEFT_OPEN * OPEN_THRESHOLD) snapTo('left');
      else if (value < -RIGHT_OPEN * OPEN_THRESHOLD) snapTo('right');
      else snapTo('none');
    } else if (mode.current === 'deciding' && !longPressFired.current) {
      if (side !== 'none') {
        snapTo('none');
      } else {
        onTap();
      }
    }
    mode.current = 'idle';
    pointerId.current = null;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    finish();
  };

  const onPointerCancel = () => {
    setPressed(false);
    clearLongPress();
    mode.current = 'idle';
    pointerId.current = null;
  };

  const close = () => snapTo('none');

  return {
    x,
    side,
    pressed,
    close,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    widths: { ACTION_WIDTH, LEFT_OPEN, RIGHT_OPEN },
  };
}
