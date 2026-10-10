/*
 * AuthFlow — the state machine the SOURCE spread across react-router routes.
 *
 * Source routes (Sonnet-player `App.tsx` 33-35) → local steps here:
 *   /auth       (AuthWelcomeScreen) → 'welcome'
 *   /auth/phone (PhoneStep)         → 'phone'
 *   /auth/otp   (OtpStep)           → 'otp'
 * `navigate(-1)` becomes a step back; `navigate("/home")` after verify is
 * dropped on purpose — the flow ENDS at the code (no library), so success and
 * guest both exit through `onComplete`. Step switches run inside
 * `AnimatePresence mode="wait"` — Codex's own wrapper around its screens —
 * so each step's `exit={{ x: -36, opacity: 0 }}` actually plays.
 *
 * Not carried over: AuthContext/localStorage persistence (the host app has no
 * auth store yet — state is in-memory) and ToastContext (a minimal inline
 * toast lives here instead, owned by this flow only).
 *
 * `dark:` classes are the source's verbatim. Note: the source builds on
 * Tailwind v4 with a class-based dark variant; this app builds on v3 with the
 * default media strategy, so here they follow the OS setting.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthWelcomeScreen } from './AuthWelcomeScreen';
import { OtpStep } from './OtpStep';
import { PhoneStep } from './PhoneStep';

export type AuthResult = { method: 'guest' } | { method: 'phone'; phone: string };

type Step = 'welcome' | 'phone' | 'otp';

export function AuthFlow({ onComplete }: { onComplete: (result: AuthResult) => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col bg-white text-zinc-900 dark:bg-[#0b0b0f] dark:text-zinc-50">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <AuthWelcomeScreen
            key="welcome"
            onPhone={() => setStep('phone')}
            onGuest={() => onComplete({ method: 'guest' })}
          />
        )}
        {step === 'phone' && (
          <PhoneStep
            key="phone"
            onBack={() => setStep('welcome')}
            onSubmit={(digits) => {
              setPhone(digits);
              setStep('otp');
            }}
          />
        )}
        {step === 'otp' && (
          <OtpStep
            key={`otp-${phone}`}
            phone={phone}
            onBack={() => setStep('phone')}
            onVerified={(verified) => onComplete({ method: 'phone', phone: verified })}
            showToast={setToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-900 px-4 py-2 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
