import { useCallback, useEffect, useState } from 'react';
import type { ThemeMode } from '@/types/theme';

/**
 * Appearance mode, seeded from the OS preference and then user-overridable —
 * exactly the original behaviour:
 *   matchMedia("(prefers-color-scheme: dark)") -> setMode("dark"|"light")
 *   addEventListener("change", ...)           -> follow the OS live
 *   toggle: setMode(current === "dark" ? "light" : "dark")
 */
export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    if (query.matches) setMode('dark');

    const onChange = (event: MediaQueryListEvent) =>
      setMode(event.matches ? 'dark' : 'light');

    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { mode, setMode, toggle };
}
