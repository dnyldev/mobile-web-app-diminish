/**
 * ThemeMode — the two appearance modes the artifact supports.
 * Extracted from the original bundle: `let K = u === "dark"` where `u` is the
 * mode state seeded from `window.matchMedia("(prefers-color-scheme: dark)")`.
 */
export type ThemeMode = 'light' | 'dark';

/** Identifiers of the four navigation destinations (exact, in source order). */
export type NavId = 'home' | 'search' | 'library' | 'profile';

/** One entry of the original `Bl` array. */
export interface NavItemSpec {
  id: NavId;
  label: string;
}
