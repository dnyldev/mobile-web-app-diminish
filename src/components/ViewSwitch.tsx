import { useEffect } from 'react';

/** Which screen the harness is showing. */
export type HarnessView = 'harness' | 'v6';

export interface ViewSwitchProps {
  view: HarnessView;
  /** Pass a state setter — the keyboard shortcut re-subscribes on every change. */
  onChange: (view: HarnessView) => void;
}

const VIEWS: readonly { id: HarnessView; label: string }[] = [
  { id: 'harness', label: 'harness' },
  { id: 'v6', label: 'Playlist v6' },
];

/** Press to flip without aiming. */
const SHORTCUT = 'v';

/**
 * The control that swaps the device screen between the original harness and the
 * ported Playlist v6 screen.
 *
 * This is chrome, not a ported design: it sits OUTSIDE the phone frame (fixed to
 * the page's top-left corner, which on a desktop viewport is the grey margin
 * beside the device), so it can never be mistaken for part of either screen.
 *
 * The alternative — routing v6 through the project's own glass nav the way Home
 * already is — is one line in `App.tsx` if that reads better.
 */
export function ViewSwitch({ view, onChange }: ViewSwitchProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== SHORTCUT || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
        return;
      }

      onChange(view === 'v6' ? 'harness' : 'v6');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view, onChange]);

  return (
    <div className="fixed top-4 left-4 z-[100]">
      <div
        className="flex items-center gap-1 p-1 rounded-full bg-white/80 border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        {VIEWS.map((entry) => {
          const isCurrent = view === entry.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onChange(entry.id)}
              className={`h-7 rounded-full px-3 text-[12px] font-medium tracking-wide transition-all active:scale-95 ${
                isCurrent ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {entry.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1 ml-2 text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
        press v
      </p>
    </div>
  );
}
