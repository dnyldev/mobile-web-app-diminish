/*
 * AddSong — باکس افزودن + دکمه داک هدر.
 *
 * باکس (نگاه اول): زیر هدر، بالای لیست. با اسکرول محو می‌شود و آیکنش
 * می‌رود توی هدر کنار سرچ (AddSongDocked).
 *
 * تصمیم‌ها (دلایل پایین همان‌جا):
 * - تایپو عین هدر: HOME_STATIC.headerTitle/headerSubtitle — با تغییر هدر خودبه‌خود سینک می‌ماند
 * - بج 40px/rounded-12 در برابر کاور 48px/rounded-10: عمداً کوچک‌تر تا با کاور آهنگ اشتباه نشود
 * - بردر dashed تنها المان غیرتوکنی است (آرتیفکت اصلی باکس افزودن نداشت)؛ رنگش از همان خانواده divider
 * - بدون shimmer: برق متحرک مال مارکتینگ است نه ابزار اینترپرایز؛ affordance را dashed + بج می‌دهد
 *
 * REVERT: حذف این پوشه + برگرداندن پچ HomeScreen.tsx / HomeHeader.tsx (بلوک ADD-SONG-TRY).
 */

import { THEME } from '@/design/theme';
import { HOME_CLASSES, HOME_STATIC, TRACK_LIST } from '@/design/home';
import type { ThemeMode } from '@/types/theme';

/* پلاس تمیز — افزودن از هر جا (لوکال/کتابخانه)، هم‌خانواده SearchGlyph (stroke 2 round) */
export function AddPlusGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* داک هدر — عین کلاس searchButton، پس همیشه با آیکن کناری یکدست است */
export function AddSongDocked({
  theme,
  visible,
  onClick,
}: {
  theme: ThemeMode;
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Add song"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      className={`${HOME_STATIC.searchButton} ${HOME_CLASSES[theme].searchButton} transition-all duration-300 active:scale-95 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <AddPlusGlyph size={18} />
    </button>
  );
}

/* دکمه افزودن — مشکی بزرگ، وسط فضای قبلی */
export function AddSongDropBox({
  theme,
  onClick,
}: {
  theme: ThemeMode;
  onClick: () => void;
}) {
  const palette = THEME[theme];
  return (
    <div
      className="w-full py-5 grid place-items-center"
      style={{ fontFamily: TRACK_LIST.rootFontFamily }}
    >
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-[56px] rounded-full flex items-center justify-center transition-all active:scale-[0.99] ${palette.miniButton} ${palette.miniButtonHover}`}
        style={{ boxShadow: palette.pillShadow }}
      >
        <span className="text-[15px] font-semibold tracking-[-0.02em] flex items-center gap-2">
          <AddPlusGlyph size={16} />
          ADD NEW SONG
        </span>
      </button>
    </div>
  );
}
