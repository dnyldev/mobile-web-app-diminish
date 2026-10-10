/*
 * Phone step — ported VERBATIM from
 * `Sonnet-player/src/components/auth/PhoneStep.tsx`, except:
 * 1. No router: back → `onBack()`, valid submit → `onSubmit(digits)`.
 * 2. Root `h-full` → `min-h-dvh` (same Tailwind-v3 reason as the Onboarding port).
 * 3. Root is a `motion.section` with Codex's auth-screen slide (`x: 36 → 0 → -36`,
 *    no transition prop) so step changes animate exactly like Codex's screens.
 *    The source itself had no step motion (react-router cut); the layout and
 *    all copy inside are still Sonnet's verbatim.
 *
 * Untouched: the `formatDigits` 3-3-4 grouping, the touched-gated error
 * strings, the `9`-prefix + 10-digit rule, the 🇮🇷 +98 prefix box, the
 * `Send code` disabled rule (`digits.length > 0 && !isValid`).
 */

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AuthLogo } from './AuthLogo';

function formatDigits(digits: string) {
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
  return parts.join(' ');
}

export function PhoneStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (phone: string) => void;
}) {
  const [digits, setDigits] = useState('');
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    if (!touched) return null;
    if (digits.length === 0) return 'Enter your mobile number.';
    if (digits[0] !== '9') return 'Iranian mobile numbers start with 9.';
    if (digits.length < 10) return 'Enter all 10 digits.';
    return null;
  }, [digits, touched]);

  const isValid = digits.length === 10 && digits[0] === '9';

  function handleChange(value: string) {
    const clean = value.replace(/\D/g, '').slice(0, 10);
    setDigits(clean);
  }

  function handleSubmit() {
    setTouched(true);
    if (!isValid) return;
    onSubmit(digits);
  }

  return (
    <motion.section
      initial={{ x: 36, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -36, opacity: 0 }}
      className="flex min-h-dvh flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top))]"
    >
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 active:bg-zinc-900/5 dark:text-zinc-300 dark:active:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mt-6 flex flex-col items-start">
        <AuthLogo size={52} />
        <h1 className="mt-5 text-[24px] font-bold tracking-tight text-zinc-900 dark:text-white">
          What&apos;s your number?
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          We&apos;ll text a one-time code to verify it&apos;s really you.
        </p>
      </div>

      <div className="mt-8">
        <label className="mb-2 block text-[12.5px] font-medium text-zinc-500 dark:text-zinc-400">
          Mobile number
        </label>
        <div
          className={
            'flex h-14 items-center gap-2 rounded-2xl border bg-zinc-900/[0.03] px-4 transition-colors dark:bg-white/5 ' +
            (error
              ? 'border-red-400/70'
              : 'border-zinc-900/10 focus-within:border-zinc-900/30 dark:border-white/10 dark:focus-within:border-white/30')
          }
        >
          <span className="flex items-center gap-1.5 border-r border-zinc-900/10 pr-3 text-[15px] font-medium text-zinc-700 dark:border-white/10 dark:text-zinc-200">
            +98
          </span>
          <input
            inputMode="numeric"
            autoFocus
            value={formatDigits(digits)}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="912 345 6789"
            className="h-full flex-1 bg-transparent text-[16px] font-medium tracking-wide text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>
        {error && <p className="mt-2 text-[12.5px] text-red-500">{error}</p>}
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleSubmit}
        className="flex h-14 w-full items-center justify-center rounded-full bg-zinc-900 text-[15px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40 dark:bg-white dark:text-zinc-900"
        disabled={digits.length > 0 && !isValid}
      >
        Send code
      </button>
    </motion.section>
  );
}
