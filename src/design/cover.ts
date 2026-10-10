/**
 * The cover box's own layers — and nothing else.
 *
 * A cover in this app is a stack, not a picture: the box itself carries the
 * gradient, the monogram sits on it, and the record's real artwork goes on top.
 * Three surfaces draw that stack (the library's rows, the mini player, the
 * search results), so the layer classes live here rather than inline in three
 * files, where the order could drift apart one at a time.
 *
 * The monogram layer is the original artifact's own `absolute inset-0 grid
 * place-items-center` — the string `HOME_STATIC.coverInner` has always held.
 */
export const COVER_CLASS = {
  /** the monogram layer: centred over the gradient, under the artwork */
  monogram: 'absolute inset-0 grid place-items-center',
  /**
   * the artwork layer: `inset-0` inside the caller's sized box, so a cover that
   * arrives (or fails) never changes the row's geometry.
   */
  artwork: 'absolute inset-0 w-full h-full object-cover pointer-events-none',
} as const;

/**
 * The artwork's paint order, in milliseconds.
 *
 * Cosmetic only: the gradient monogram is already drawn underneath, so the
 * fade hides the swap from monogram to photo rather than gating anything on
 * the network. `0` would be correct too, just less pleasant on a slow image.
 */
export const COVER_MOTION = {
  artworkFadeMs: 200,
} as const;
