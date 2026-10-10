/*
 * Bottom sheet shell — the modular source's `src/components/ui/BottomSheet.tsx`
 * VERBATIM (scrim fade `0.28s`, sheet `y: 100% → 0` with `EASE_DRAWER`,
 * `rounded-t-[28px]`, `var(--sheet)` + `var(--shadow-sheet)`, grab handle
 * `h-1 w-10` in `hairline-2`, Esc-to-close), except the motion import comes
 * from `framer-motion` (this app's installed driver) instead of the source's
 * `motion/react`. The two packages share the AnimatePresence/motion API, so
 * the rendered output is identical.
 */

import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_DRAWER } from './ease';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
  nested?: boolean;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  nested,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 z-40"
            style={{ background: nested ? 'transparent' : 'var(--scrim)' }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.42, ease: EASE_DRAWER }}
            className={
              'absolute inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-[28px]' +
              (className ? ` ${className}` : '')
            }
            style={{
              background: 'var(--sheet)',
              boxShadow: 'var(--shadow-sheet)',
              paddingBottom: 'max(12px, var(--safe-b))',
            }}
          >
            <div className="flex justify-center pb-1 pt-2.5">
              <span className="h-1 w-10 rounded-full" style={{ background: 'var(--hairline-2)' }} />
            </div>
            {title ? (
              <div className="px-5 pb-1 pt-1">
                <h2 className="text-[20px] font-semibold tracking-[-0.03em]">{title}</h2>
                {description ? (
                  <p className="mt-1 text-[13px] text-[var(--fg-3)]">{description}</p>
                ) : null}
              </div>
            ) : null}
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
