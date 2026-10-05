import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface ScrollCompactOptions {
  /** `scrollY > compactAt` → compact (original: 120). */
  compactAt: number;
  /** `scrollY < expandAt` → expanded (original: 40). */
  expandAt: number;
}

/**
 * The original watched the document scroll and flipped only on a crossing —
 * the ref kept it from calling `setState` on every scroll event:
 *
 *   let m = () => {
 *     let S = window.scrollY;
 *     if (S > 120 && !c.current) c.current = !0, D(!0);
 *     else if (S < 40 && c.current) c.current = !1, D(!1)
 *   };
 *   window.addEventListener("scroll", m, { passive: !0 }), m(), () => …
 *
 * It also ran `m()` once on mount, which the port keeps. Inside the phone frame
 * the document does not scroll, so the same logic runs against the screen's own
 * scroll shell; the two thresholds are unchanged.
 */
export function useScrollCompact(
  target: RefObject<HTMLDivElement>,
  { compactAt, expandAt }: ScrollCompactOptions,
): boolean {
  const [compact, setCompact] = useState(false);
  const isCompact = useRef(false);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const onScroll = () => {
      const y = element.scrollTop;
      if (y > compactAt && !isCompact.current) {
        isCompact.current = true;
        setCompact(true);
      } else if (y < expandAt && isCompact.current) {
        isCompact.current = false;
        setCompact(false);
      }
    };

    element.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => element.removeEventListener('scroll', onScroll);
  }, [target, compactAt, expandAt]);

  return compact;
}
