/**
 * Motion tokens — every easing curve, duration and composed transition string
 * from the original artifact, kept as data so no component hard-codes one.
 */

export const EASING = {
  /** the signature "spring-ish" curve used for the bubble + idle transforms */
  spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /** faster curve used while a finger is down */
  press: 'cubic-bezier(0.2,0,0,1)',
  /** the tap-glow curve */
  glow: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const DURATION = {
  /** pill + item transform while pressed: `transform 180ms ...` */
  press: 180,
  /** pill transform returning to rest: `transform 320ms ...` */
  release: 320,
  /** item colour fade: `color 200ms ease` */
  color: 200,
  /** pill surface (background / border-colour / box-shadow): `300ms ease` */
  surface: 300,
  /** bubble travel: `left 350ms cubic-bezier(0.32, 0.72, 0, 1)` */
  bubbleTravel: 350,
  /** the icon spring animation: `icon-spring 350ms ...` */
  iconSpring: 350,
  /** the glow disc: `softGlow 500ms ... forwards` */
  glow: 500,
} as const;

export const TRANSITION = {
  /** pill, finger down */
  pillPressed: `transform ${DURATION.press}ms ${EASING.press}, background ${DURATION.surface}ms ease, border-color ${DURATION.surface}ms ease, box-shadow ${DURATION.surface}ms ease`,
  /** pill, at rest */
  pillIdle: `transform ${DURATION.release}ms ${EASING.spring}, background ${DURATION.surface}ms ease, border-color ${DURATION.surface}ms ease, box-shadow ${DURATION.surface}ms ease`,
  /** nav item, finger down */
  itemPressed: `transform ${DURATION.press}ms ${EASING.press}`,
  /** nav item, at rest */
  itemIdle: `transform ${DURATION.release}ms ${EASING.spring}, color ${DURATION.color}ms ease`,
  /** highlight bubble horizontal travel */
  bubbleLeft: `left ${DURATION.bubbleTravel}ms ${EASING.spring}`,
  /** icon spring, composed for a style object */
  iconSpring: `icon-spring ${DURATION.iconSpring}ms ${EASING.spring}`,
  /** glow disc, composed for a style object */
  glow: `softGlow ${DURATION.glow}ms ${EASING.glow} forwards`,
} as const;

export const KEYFRAMES = {
  iconSpring: 'icon-spring',
  softGlow: 'softGlow',
} as const;
