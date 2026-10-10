/*
 * Welcome screen — ported VERBATIM from
 * `Sonnet-player/src/components/auth/AuthWelcomeScreen.tsx`, except:
 * 1. Brand `Sonnet` → `Diminish` (title + Terms line), per Danial.
 * 2. No router: `navigate("/auth/phone")` → `onPhone()`, guest → `onGuest()`.
 * 3. Root `h-full` → `min-h-dvh` — same Tailwind-v3 reason as the Onboarding
 *    port (v3 `h-full` inside the lab's min-height shell collapses, and
 *    `100vh`-based heights overshoot the mobile viewport; `min-h-dvh` is the
 *    render-exact equivalent of what the source paints on v4).
 * 4. Motion is Codex's, not Sonnet's: the source faded two inner blocks up
 *    (`opacity 0/y 16 → 1/0`, `duration: 0.5`, second delayed `0.1`). Codex's
 *    auth screen (Codex-player App.tsx, the `auth` section) slides the WHOLE
 *    section in from the right with NO inner stagger and NO transition prop
 *    (framer default): `initial={{ x: 36, opacity: 0 }}`,
 *    `animate={{ x: 0, opacity: 1 }}`, `exit={{ x: -36, opacity: 0 }}`.
 *    Carried here exactly — one `motion.section`, plain inner divs.
 * 5. The Terms line ("By continuing, you agree …") is dropped, per Danial.
 */

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AuthLogo } from './AuthLogo';

export function AuthWelcomeScreen({
  onPhone,
  onGuest,
}: {
  onPhone: () => void;
  onGuest: () => void;
}) {
  return (
    <motion.section
      initial={{ x: 36, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -36, opacity: 0 }}
      className="flex min-h-dvh flex-col justify-between px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(4rem+env(safe-area-inset-top))]"
    >
      <div />
      <div className="flex flex-col items-center text-center">
        <AuthLogo size={72} />
        <h1 className="mt-5 text-[26px] font-bold tracking-tight text-zinc-900 dark:text-white">
          Diminish
        </h1>
        <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Chords and lyrics, perfectly timed to every song you play.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onPhone}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-zinc-900 text-[15px] font-semibold text-white transition-transform active:scale-[0.98] dark:bg-white dark:text-zinc-900"
        >
          Continue with phone number
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onGuest}
          className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-900/10 text-[15px] font-semibold text-zinc-700 transition-colors active:bg-zinc-900/5 dark:border-white/15 dark:text-zinc-200 dark:active:bg-white/5"
        >
          Continue as Guest
        </button>
      </div>
    </motion.section>
  );
}
