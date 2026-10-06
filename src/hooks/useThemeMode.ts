import { useCallback, useEffect, useState } from 'react';
import { HARNESS_PAGE_COLOR } from '@/design/theme';
import type { ThemeMode } from '@/types/theme';

/**
 * Appearance mode, seeded from the OS preference and then user-overridable —
 * the original's behaviour, with one correction and one addition.
 *
 * Original:
 *   useState("light")
 *   useEffect(() => { if (matchMedia("(prefers-color-scheme: dark)").matches) setMode("dark")
 *                     addEventListener("change", …) }, [])
 *   toggle: setMode(current === "dark" ? "light" : "dark")
 *
 * ## The correction: the seed
 *
 * `useState("light")` is a LIGHT FIRST PAINT for a dark-mode user, and the
 * harness's `transition-colors duration-300` stretched it into a visible
 * white→dark wash on every load. Measured on the running app with the OS set to
 * dark: the frame is `rgb(251,251,252)` at ~100ms and only reaches
 * `rgb(20,20,22)` at ~430ms. The seed now reads the OS synchronously, so the
 * first paint is already the right one. The subscription still follows the OS
 * live and `toggle` still overrides it.
 *
 * ## The addition: the document
 *
 * The artifact left `<html>`/`<body>` transparent and declared no
 * `color-scheme`, so everything outside the frame stayed white in a dark
 * session — the overscroll area behind it, and on a phone the browser's own
 * toolbar, status bar and keyboard, which is what a "the theme went light" flash
 * on a full-screen view is. `color-scheme` is also what makes the UA draw
 * scrollbars and form controls (this flow has a text input) dark, and
 * `theme-color` is what mobile browsers read for the toolbar — `index.html` has
 * no such tag, so it is created here.
 */
export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');

    const onChange = (event: MediaQueryListEvent) =>
      setMode(event.matches ? 'dark' : 'light');

    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const background = HARNESS_PAGE_COLOR[mode];

    root.style.backgroundColor = background;
    root.style.colorScheme = mode;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', background);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { mode, setMode, toggle };
}
