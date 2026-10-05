import { useCallback, useEffect, useRef, useState } from 'react';
import { V6_METRICS } from '@/design/playlistV6';

export interface PlaybackClockOptions {
  /** The original's `o`: the interval only runs while this is true. */
  running: boolean;
  /** Where the bar starts — original `useState(32)`. */
  initialProgress: number;
  /**
   * Fired once when the bar reaches 100. Original: the track advanced from
   * inside the interval, so this port keeps the advance on the tick rather than
   * on a progress change.
   */
  onComplete: () => void;
}

export interface PlaybackClock {
  progress: number;
  /** Jump the bar — the range input and the two ±10 s buttons. */
  seek: (value: number) => void;
}

/**
 * The original's progress clock, verbatim:
 *
 *   useEffect(() => {
 *     if (!o || r === null) return;                 // not playing / nothing selected
 *     let m = setInterval(() => {
 *       s((S) => {
 *         if (S >= 100) return l((N) => (N === null ? N : (N + 1) % e.length)), 0;
 *         return S + 0.15;
 *       });
 *     }, 100);
 *     return () => clearInterval(m)
 *   }, [o, r, e.length]);
 *
 * The original reached its wrap from *inside* the state updater. React only
 * double-invokes updaters in a development build, and the artifact shipped a
 * production React — so on the artifact the bar completes and the list advances
 * exactly one track. This port therefore keeps the advance on the tick and out
 * of the updater (mirroring the value in a ref), which reproduces that
 * observable behaviour under StrictMode instead of advancing two tracks at once.
 * A manual seek to 100 therefore also wraps on the *next* tick, as it did there.
 */
export function usePlaybackClock({
  running,
  initialProgress,
  onComplete,
}: PlaybackClockOptions): PlaybackClock {
  const [progress, setProgress] = useState(initialProgress);
  const progressRef = useRef(initialProgress);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  const seek = useCallback((value: number) => {
    progressRef.current = value;
    setProgress(value);
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      const next = progressRef.current + V6_METRICS.step;

      if (next >= V6_METRICS.seekMax) {
        progressRef.current = 0;
        setProgress(0);
        completeRef.current();
        return;
      }

      progressRef.current = next;
      setProgress(next);
    }, V6_METRICS.tickMs);

    return () => window.clearInterval(timer);
  }, [running]);

  return { progress, seek };
}
