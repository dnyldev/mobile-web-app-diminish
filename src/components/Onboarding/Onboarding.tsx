/*
 * Onboarding — the 3-step intro ported VERBATIM from the Codex-player reference.
 *
 * Source: `ideas-reference/Codex-player/src/App.tsx`
 *   copy .......... lines 14-27 (`onboardingSteps`)
 *   layout + motion lines 224-266 (the `landing` section)
 *
 * Carried across byte-for-byte: the step copy (English, as in the source), the
 * full-bleed hero image + `from-black/40 via-black/55 to-black/90` scrim, the
 * `tracking-[0.32em]` eyebrow, the `Step X of 3` counter, the
 * `text-4xl font-semibold leading-tight` title, the `max-w-[34ch] text-sm
 * leading-6 text-white/80` body, the Skip/Back + Next/Continue button pair, and
 * the motion: outer `AnimatePresence mode="wait"` + section opacity 0→1, inner
 * `motion.div key={step}` sliding `x: 24 → 0 → -24` at `duration: 0.4`.
 * (No nested AnimatePresence around the step div — the source has none either.)
 *
 * Deliberate deviations from the source (2), both forced by the host:
 * 1. Exits route to `onDone`. The source's Skip-on-step-0 and Continue-on-last
 *    went to its auth screens (`setScreen("auth")`) — this port ships the three
 *    onboarding steps only, so both exits call `onDone` instead.
 * 2. The hero image is a bundler import (`@/assets/images/hero-stage.jpg`),
 *    not the source's `/images/hero-stage.jpg` string: this app builds ONE
 *    self-contained `dist/index.html`, so only assets the bundler sees get
 *    inlined — the same reason its fonts live under `src/assets/`.
 * 3. `min-h-dvh`, not the source's `min-h-screen`: this app builds on
 *    Tailwind v3, where `min-h-screen` = `100vh` — on a mobile browser that
 *    includes the URL-bar area, so the section grows taller than the visible
 *    viewport and the page scrolls. The source builds on Tailwind v4, whose
 *    screen height tracks the DYNAMIC viewport (no scroll). `min-h-dvh` is
 *    v3's render-exact equivalent of what the source paints.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import heroStage from '@/assets/images/hero-stage.jpg';

const onboardingSteps = [
  {
    title: 'Play with confidence',
    body: 'Diminish is a mobile rehearsal web app for songs, lyrics, and chord guidance in one focused player.',
  },
  {
    title: 'Move from idea to performance',
    body: 'Save songs, switch key, adjust tempo, and follow synced lyrics and chord flow without visual noise.',
  },
  {
    title: 'Built for live mobile use',
    body: 'A clean performance mode keeps essentials visible and gracefully fades secondary details while you play.',
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex min-h-dvh flex-col justify-between"
      >
        <img
          src={heroStage}
          alt="Musician using mobile player"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/90" />

        <div className="relative z-10 px-6 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/80">Diminish</p>
        </div>

        <motion.div
          key={step}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 px-6 pb-10"
        >
          <p className="text-sm text-white/70">
            Step {step + 1} of {onboardingSteps.length}
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight text-white">
            {onboardingSteps[step].title}
          </h1>
          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/80">
            {onboardingSteps[step].body}
          </p>

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (step === 0 ? onDone() : setStep((prev) => prev - 1))}
              className="h-11 px-4 text-sm font-medium text-white/75"
            >
              {step === 0 ? 'Skip' : 'Back'}
            </button>
            <button
              type="button"
              onClick={() =>
                step === onboardingSteps.length - 1 ? onDone() : setStep((prev) => prev + 1)
              }
              className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-zinc-900"
            >
              {step === onboardingSteps.length - 1 ? 'Continue' : 'Next'}
            </button>
          </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
