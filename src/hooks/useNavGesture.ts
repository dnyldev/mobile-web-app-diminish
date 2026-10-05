import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { INTERACTION } from '@/design/tokens';
import {
  bubbleLeftForPointer,
  indexForBubbleLeft,
  indexForPointer,
  measureTrack,
  restingBubbleCentreX,
} from '@/lib/navGeometry';
import type { NavId, NavItemSpec } from '@/types/theme';

export interface UseNavGestureOptions {
  items: readonly NavItemSpec[];
  activeId: NavId;
  /** Called when a selection is committed (tap, hold-then-release, or drag). */
  onSelect: (id: NavId) => void;
}

export interface UseNavGestureResult {
  /** Attach to the glass pill element — all geometry is measured from it. */
  pillRef: RefObject<HTMLDivElement>;
  activeIndex: number;
  /** Index the bubble sits on right now (drags override the active index). */
  highlightIndex: number;
  /** `isDragging || isPressed` — drives the pill's 1.04 scale-up. */
  engaged: boolean;
  isDragging: boolean;
  /** Live bubble offset in px while dragging; `null` means "use the resting calc()". */
  bubbleLeftPx: number | null;
  /** Id of the item currently held down. */
  pressedId: NavId | null;
  /** Id of the item currently glowing. */
  glowingId: NavId | null;
  beginPress: (id: NavId) => void;
  endPress: () => void;
  startDrag: (clientX: number, pointerId: number | null) => void;
  handlePillPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  handleItemPointerDown: (index: number, id: NavId, event: ReactPointerEvent<HTMLButtonElement>) => void;
  handleItemClick: (id: NavId) => void;
}

/**
 * Owns the whole interaction model of the bar. One-for-one with the original
 * component's `Q` / `N` / `se` / `St` callbacks and its pointermove/pointerup
 * effect — same stages, same thresholds, same commit rule.
 */
export function useNavGesture({
  items,
  activeId,
  onSelect,
}: UseNavGestureOptions): UseNavGestureResult {
  const itemCount = items.length;
  const activeIndex = useMemo(() => {
    const found = items.findIndex((item) => item.id === activeId);
    return found < 0 ? 0 : found;
  }, [items, activeId]);

  const pillRef = useRef<HTMLDivElement>(null);
  const glowTimerRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const didDragRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);
  const highlightIndexRef = useRef<number | null>(null);

  const [pressedId, setPressedId] = useState<NavId | null>(null);
  const [glowingId, setGlowingId] = useState<NavId | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleLeftPx, setBubbleLeftPx] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    highlightIndexRef.current = dragIndex;
  }, [dragIndex]);

  // Clear the glow timer on unmount so it cannot fire into a dead tree.
  useEffect(
    () => () => {
      if (glowTimerRef.current) window.clearTimeout(glowTimerRef.current);
    },
    [],
  );

  const measure = useCallback(() => measureTrack(pillRef.current, itemCount), [itemCount]);

  const scheduleGlowClear = useCallback(() => {
    if (glowTimerRef.current) window.clearTimeout(glowTimerRef.current);
    glowTimerRef.current = window.setTimeout(
      () => setGlowingId(null),
      INTERACTION.glowHoldMs,
    );
  }, []);

  /** Original `Q(id)` — press feedback + glow, both released after 350ms. */
  const beginPress = useCallback(
    (id: NavId) => {
      setPressedId(id);
      setGlowingId(id);
      setIsPressed(true);
      scheduleGlowClear();
    },
    [scheduleGlowClear],
  );

  /** Original `N()` — pointer up / leave / cancel on an item. */
  const endPress = useCallback(() => {
    setPressedId(null);
    setIsPressed(false);
  }, []);

  /** Original `St(clientX, pointerId)` — engage the dragging bubble. */
  const startDrag = useCallback(
    (clientX: number, pointerId: number | null) => {
      const metrics = measure();
      if (!metrics) return;

      startXRef.current = clientX;
      didDragRef.current = false;
      setIsDragging(true);
      setIsPressed(true);
      setPressedId(null);

      const left = bubbleLeftForPointer(clientX, metrics);
      setBubbleLeftPx(left);
      setDragIndex(indexForBubbleLeft(left, metrics, itemCount));

      if (pointerId != null && pillRef.current) {
        try {
          pillRef.current.setPointerCapture(pointerId);
        } catch {
          /* pointer capture is best-effort, exactly as in the original */
        }
      }
    },
    [itemCount, measure],
  );

  /** Original pointermove / pointerup / pointercancel window listeners. */
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: PointerEvent) => {
      const metrics = measure();
      if (!metrics) return;

      const left = bubbleLeftForPointer(event.clientX, metrics);
      setBubbleLeftPx(left);

      if (Math.abs(event.clientX - startXRef.current) > INTERACTION.dragThresholdPx) {
        didDragRef.current = true;
      }
      setDragIndex(indexForBubbleLeft(left, metrics, itemCount));
    };

    const handleEnd = (event: PointerEvent) => {
      const metrics = measure();
      let index: number | null = highlightIndexRef.current;

      if (metrics) {
        index = indexForPointer(event.clientX, metrics, itemCount);
      }
      if (index == null) index = activeIndexRef.current;

      // Commit only when the finger actually moved to another destination —
      // a plain tap is handled by the item's own onClick.
      if (didDragRef.current || index !== activeIndexRef.current) {
        onSelect(items[index].id);
        setGlowingId(items[index].id);
        scheduleGlowClear();
      }

      setIsDragging(false);
      setBubbleLeftPx(null);
      setDragIndex(null);
      didDragRef.current = false;

      try {
        pillRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        /* ignored */
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
    };
  }, [isDragging, items, itemCount, measure, onSelect, scheduleGlowClear]);

  /**
   * A press on the pill itself only starts a drag when it lands within
   * `bubbleWidth / 2 + 28px` of the resting bubble.
   */
  const handlePillPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isDragging) return;
      const metrics = measure();
      if (!metrics) return;

      const centre = restingBubbleCentreX(metrics, activeIndexRef.current, itemCount);
      if (Math.abs(event.clientX - centre) > metrics.bubbleWidth / 2 + INTERACTION.startDragHitSlopPx) {
        return;
      }
      startDrag(event.clientX, event.pointerId);
    },
    [isDragging, itemCount, measure, startDrag],
  );

  const handleItemPointerDown = useCallback(
    (index: number, id: NavId, event: ReactPointerEvent<HTMLButtonElement>) => {
      beginPress(id);
      if (index === activeIndex) startDrag(event.clientX, event.pointerId);
    },
    [activeIndex, beginPress, startDrag],
  );

  /** Original `onClick` — suppressed while a drag is in flight. */
  const handleItemClick = useCallback(
    (id: NavId) => {
      if (didDragRef.current) return;
      if (isDragging) return;
      onSelect(id);
    },
    [isDragging, onSelect],
  );

  const highlightIndex =
    isDragging && dragIndex != null ? dragIndex : activeIndex;

  return {
    pillRef,
    activeIndex,
    highlightIndex,
    engaged: isDragging || isPressed,
    isDragging,
    bubbleLeftPx,
    pressedId,
    glowingId,
    beginPress,
    endPress,
    startDrag,
    handlePillPointerDown,
    handleItemPointerDown,
    handleItemClick,
  };
}
