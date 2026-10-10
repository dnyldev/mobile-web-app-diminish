import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { COVER_CLASS, COVER_MOTION } from '@/design/cover';

export interface CoverProps {
  /** CSS `background` — the box's own colour, and the layer under the artwork. */
  gradient: string;
  /** The monogram drawn on the gradient. */
  letter: string;
  /** Real artwork. `null`/absent keeps the monogram alone — never an empty box. */
  coverUrl?: string | null;
  /** The caller's own box classes (`HOME_STATIC.cover`, `V6_ROW.cover`, …). */
  className?: string;
  /** The caller's own box metrics — width, height, `borderRadius`. */
  style?: CSSProperties;
  /** The caller's own monogram type scale (`HOME_STATIC.letter`, …). */
  letterClassName?: string;
  letterStyle?: CSSProperties;
}

/**
 * One cover square: gradient, monogram, and the record's artwork when it has one.
 *
 * ## Why the gradient is the floor rather than a fallback
 *
 * `coverUrl` is a REMOTE image — it can be slow, blocked by the network, or
 * simply absent (the bundled demo catalogue has none). So the gradient monogram
 * is not a placeholder that gets swapped out later: it is what the box always
 * IS, and the artwork is painted over it. That is what makes the offline case
 * free — no state to await, no empty square while a request is in flight, and
 * no layout to undo when one fails, because the artwork is `absolute inset-0`
 * inside a box whose size the caller already set.
 *
 * ## What this component does NOT own
 *
 * Sizes, radii and type scales stay with the caller's design table
 * (`ADD_SONG_METRICS.searchCoverSize`, `HOME_STATIC.coverInner`, …), exactly as
 * before this was factored out. The only thing added to the box is what an
 * overlay needs — `position: relative` so `inset-0` means the box, and
 * `overflow: hidden` so the artwork is clipped to the same radius the gradient
 * is. Both are no-ops on layout.
 *
 * The monogram is wrapped in its own absolutely-positioned layer so a caller
 * that centres with `grid place-items-center` or `flex items-center` keeps
 * centring the same way it did when the monogram was a direct child.
 */
export function Cover({
  gradient,
  letter,
  coverUrl,
  className,
  style,
  letterClassName,
  letterStyle,
}: CoverProps) {
  return (
    <div
      className={className}
      style={{ ...style, background: gradient, position: 'relative', overflow: 'hidden' }}
    >
      <div className={COVER_CLASS.monogram}>
        <span className={letterClassName} style={letterStyle}>
          {letter}
        </span>
      </div>

      <CoverArtwork src={coverUrl} />
    </div>
  );
}

/**
 * The artwork layer, or nothing at all.
 *
 * Returns `null` for a missing URL and for one that has failed, which leaves
 * the monogram underneath visible with no cleanup to do.
 *
 * `complete` is checked on mount as well as on `load`, because a cover already
 * in the browser cache can finish before React attaches its handler — without
 * that check a cached image would sit at opacity 0 forever.
 */
function CoverArtwork({ src }: { src?: string | null }) {
  const element = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<'pending' | 'ready' | 'failed'>('pending');

  useEffect(() => {
    setStatus('pending');

    const image = element.current;
    if (!image?.complete) return;

    setStatus(image.naturalWidth > 0 ? 'ready' : 'failed');
  }, [src]);

  if (!src || status === 'failed') return null;

  return (
    <img
      ref={element}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={COVER_CLASS.artwork}
      onLoad={() => setStatus('ready')}
      onError={() => setStatus('failed')}
      style={{
        opacity: status === 'ready' ? 1 : 0,
        transition: `opacity ${COVER_MOTION.artworkFadeMs}ms ease`,
      }}
    />
  );
}
