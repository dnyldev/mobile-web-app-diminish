/*
 * OTP step — ported VERBATIM from
 * `Sonnet-player/src/components/auth/OtpStep.tsx`, except:
 * 1. No router: `phone` arrives as a prop (not location state), back →
 *    `onBack()`, verified → `onVerified(phone)`. The source's
 *    `navigate("/home")` is deliberately NOT carried over — the flow ends
 *    here, per Danial (no library after the code).
 * 2. `showToast` arrives as a prop instead of `useToast()` — the host app has
 *    no toast context; `AuthFlow` owns the toast.
 * 3. Root `h-full` → `min-h-dvh` (same Tailwind-v3 reason as the Onboarding port).
 * 4. Root is a `motion.section` with Codex's auth-screen slide (`x: 36 → 0 → -36`,
 *    no transition prop) so step changes animate exactly like Codex's screens.
 *    The source itself had no step motion (react-router cut); everything inside
 *    (boxes, cooldown, spring check) is still Sonnet's verbatim.
 *
 * Untouched: 6-box inputs with auto-advance + backspace-back, 30s resend
 * cooldown, auto-verify on 6 digits (900ms verifying → 650ms success),
 * the masked `+98 912 *** 89` line, the spring success check
 * (`stiffness: 420, damping: 24`), the `Enter any 6 digits` preview hint.
 */

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

type Status = 'idle' | 'verifying' | 'success';

export function OtpStep({
  phone,
  onBack,
  onVerified,
  showToast,
}: {
  phone: string;
  onBack: () => void;
  onVerified: (phone: string) => void;
  showToast: (message: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const [status, setStatus] = useState<Status>('idle');
  const [cooldown, setCooldown] = useState(30);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  useEffect(() => {
    if (values.every((v) => v !== '') && status === 'idle') {
      void verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const masked = `+98 ${phone.slice(0, 3)} *** ${phone.slice(-2)}`;

  function setDigit(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function verify() {
    setStatus('verifying');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('success');
    await new Promise((r) => setTimeout(r, 650));
    onVerified(phone);
  }

  function resend() {
    setCooldown(30);
    setValues(Array(6).fill(''));
    inputsRef.current[0]?.focus();
    showToast('A new code was sent.');
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
        disabled={status !== 'idle'}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 active:bg-zinc-900/5 disabled:opacity-30 dark:text-zinc-300 dark:active:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mt-6">
        <h1 className="text-[24px] font-bold tracking-tight text-zinc-900 dark:text-white">
          Enter the code
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{masked}</span>
        </p>
      </div>

      <div className="mt-8 flex justify-between gap-2">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            autoFocus={i === 0}
            value={v}
            disabled={status !== 'idle'}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="otp-input h-14 w-11 rounded-2xl border border-zinc-900/10 bg-zinc-900/[0.03] text-center text-[20px] font-semibold text-zinc-900 outline-none transition-colors focus:border-violet-400 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        ))}
      </div>

      <div className="mt-5">
        {cooldown > 0 ? (
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500">
            Resend code in 0:{cooldown.toString().padStart(2, '0')}
          </p>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="text-[13px] font-semibold text-violet-500 dark:text-violet-400"
          >
            Resend code
          </button>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex h-14 items-center justify-center">
        {status === 'idle' && (
          <p className="text-[12.5px] text-zinc-400 dark:text-zinc-500">
            Enter any 6 digits to continue this preview
          </p>
        )}
        {status === 'verifying' && (
          <div className="flex items-center gap-2 text-[14px] font-medium text-zinc-500 dark:text-zinc-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200" />
            Verifying…
          </div>
        )}
        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white"
          >
            <Check className="h-6 w-6" strokeWidth={2.4} />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
