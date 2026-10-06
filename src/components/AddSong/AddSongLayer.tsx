import { ADD_SONG_CLASS, ADD_SONG_METRICS, ADD_SONG_THEME } from '@/design/addSong';
import type { AddSongController } from '@/hooks/useAddSong';
import type { ThemeMode } from '@/types/theme';
import { AddSongSheet } from './AddSongSheet';
import './addSongKeyframes.css';

export interface AddSongLayerProps {
  theme: ThemeMode;
  controller: AddSongController;
}

/**
 * Everything the flow renders OVER the screen: the hidden file input, the toast
 * and the drawer.
 *
 * All three are the artifact's own top-level branches — `input` at 247-248, the
 * toast at 249-253, the drawer at 5420-5501 — and all three were `fixed` in their
 * originals. They are `absolute` here, inside the phone frame, which is what the
 * originals' `fixed` layers were relative to the viewport.
 *
 * `App` renders this as a child of the frame, beside the screen, so the overlays
 * cover the frame instead of travelling with the list.
 *
 * The SEARCH VIEW is deliberately not here: in the template it is a screen (the
 * drawer's second row switches the page to it), so `App` renders it where it
 * renders `HomeScreen`. Only things that float over the screen live in this file.
 */
export function AddSongLayer({ theme, controller }: AddSongLayerProps) {
  const palette = ADD_SONG_THEME[theme];

  return (
    <>
      <input
        ref={controller.fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={controller.onFileChange}
      />

      {controller.toast && (
        <div
          className={`${ADD_SONG_CLASS.toast} ${palette.toast}`}
          style={{
            animation: 'fadeIn 0.2s ease',
            fontFamily: ADD_SONG_METRICS.rootFontFamily,
          }}
        >
          {controller.toast}
        </div>
      )}

      {controller.sheetOpen && (
        <AddSongSheet
          theme={theme}
          onClose={controller.closeSheet}
          onLocal={controller.chooseLocal}
          onSearch={controller.chooseSearch}
        />
      )}
    </>
  );
}
