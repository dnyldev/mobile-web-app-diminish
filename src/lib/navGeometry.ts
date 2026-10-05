import { NAV_BAR } from '@/design/tokens';

/**
 * Pure geometry for the dragging highlight bubble.
 *
 * All of this mirrors the original callbacks one-for-one:
 *   se() -> measure()            (trackLeft = rect.left + inset, trackWidth = rect.width − 2×inset)
 *   St() -> startDrag()          (bubbleLeftForPointer + indexForBubbleLeft)
 *   move -> indexForPointer()
 *   up   -> indexForPointer()    (recomputed from the final pointer x)
 *
 * One thing is NOT the original's: the bubble's width. It used to be a fixed
 * 72px, which is why the original's resting position needed
 * `calc(p*25% + 12.5% − 36px)` — the 36px was half of that fixed width. The
 * indicator is now exactly one slot wide (`trackWidth / itemCount`), so every
 * `bubbleWidth / 2` term below lands on the slot's own centre and the resting
 * position is a plain percentage. Same numbers at the original's pill width;
 * correct at every other width too, which the fixed 72px was not.
 */

export interface TrackMetrics {
  rect: DOMRect;
  /** the indicator's width: one slot, `trackWidth / itemCount` */
  bubbleWidth: number;
  /** left edge of the draggable track, inside the pill's `pillPadding` */
  trackLeft: number;
  /** usable track width */
  trackWidth: number;
}

/** One slot — the width the indicator and its snap segment share. */
export function bubbleWidthForTrack(trackWidth: number, itemCount: number): number {
  return trackWidth / itemCount;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Original `se()` — returns null when the pill has not mounted. */
export function measureTrack(element: HTMLElement | null, itemCount: number): TrackMetrics | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  const trackWidth = rect.width - NAV_BAR.trackInset * 2;
  return {
    rect,
    bubbleWidth: bubbleWidthForTrack(trackWidth, itemCount),
    trackLeft: rect.left + NAV_BAR.trackInset,
    trackWidth,
  };
}

/** Left offset (px, relative to the track) that centres the bubble on the pointer. */
export function bubbleLeftForPointer(clientX: number, m: TrackMetrics): number {
  return clamp(
    clientX - m.trackLeft - m.bubbleWidth / 2,
    0,
    m.trackWidth - m.bubbleWidth,
  );
}

/** Nearest slide index for a bubble left offset. */
export function indexForBubbleLeft(
  left: number,
  m: TrackMetrics,
  itemCount: number,
): number {
  const segment = m.trackWidth / itemCount;
  return clamp(
    Math.round((left + m.bubbleWidth / 2) / segment - 0.5),
    0,
    itemCount - 1,
  );
}

export function indexForPointer(
  clientX: number,
  m: TrackMetrics,
  itemCount: number,
): number {
  return indexForBubbleLeft(bubbleLeftForPointer(clientX, m), m, itemCount);
}

/**
 * Resting `left` for a given index — one slot along the track.
 *
 * The original expression was `calc(${p * 25}% + 12.5% − 36px)`: the slot's
 * centre minus half the fixed 72px bubble. With the indicator now one slot wide,
 * slot-start and indicator-left are the same point, so it collapses to a plain
 * percentage — and it stays exact at any pill width.
 */
export function restingBubbleLeft(index: number, itemCount: number): string {
  return `${index * (100 / itemCount)}%`;
}

/**
 * Screen x of the resting bubble's centre for a given index — the original
 * `te = q + (_.current * (ae/4) + ae/8 - Y/2) + Y/2`, used for the
 * "did the finger land near the bubble" hit test.
 */
export function restingBubbleCentreX(
  m: TrackMetrics,
  index: number,
  itemCount: number,
): number {
  const segment = m.trackWidth / itemCount;
  return m.trackLeft + index * segment + segment / 2;
}
