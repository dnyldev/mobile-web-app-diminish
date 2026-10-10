/*
 * Diminish auth mark.
 *
 * Source shape: `Sonnet-player/.../auth/AuthLogo.tsx` — a rounded-square
 * `size × size` box. The SOURCE's fill (violet→indigo gradient + `Music4`
 * glyph) is replaced by Danial's own icon (`src/assets/images/diminish-logo.png`,
 * magenta removed → transparent, cropped to the circle), at his direction.
 * Box geometry (`rounded-[22px]`, `size` prop, glyph-to-box ratio) is untouched.
 */

import logo from '@/assets/images/diminish-logo.png';

export function AuthLogo({ size = 64 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="Diminish"
      width={size}
      height={size}
      className="rounded-[22px]"
      style={{ width: size, height: size }}
    />
  );
}
