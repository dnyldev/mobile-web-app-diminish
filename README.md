# diminish

A modular, offline-first rebuild of the single-file artifact `../diminish.html`
(originally exported as "React Artifact.html").
Same pixels, same motion, same numbers — but a real project you can read, extend and
type-check.

---

## Provenance (nothing here was guessed)

The original file is a 64-line HTML document whose entire app is one 85 KB minified
line. It was taken apart mechanically:

| step | tool | output |
|---|---|---|
| split `<style>` / `<script>` blocks | `tools/split_artifact.py` | `_extract/style-*.css`, `_extract/script-*.js` |
| make the bundle readable | `tools/jsformat2.py` | `_extract/script-01.fmt2.js` |
| isolate the app region (lines 4987–5279) | — | `_extract/app.source.js` |
| **prove nothing was dropped** | `tools/parity_check.py` | PASS |

`jsformat2.py` is a real tokenizer (strings, template literals with `${}` nesting,
regex literals, comments). It **self-verifies**: it re-tokenizes its own output and
compares the token stream to the input's, byte for byte. Current run:

```
LOSSLESS: True
in_tokens: 65846   out_tokens: 65846
```

`parity_check.py` then compares the original app region against `src/` as sets of
class tokens and numeric literals:

```
RESULT: PASS — every class token and numeric literal from the original is present
```

## What the original contained

* React **18.3.1** + react-dom, bundled inline, mounted with `createRoot` under
  `StrictMode`, classic `React.createElement` (`L` / `Me`).
* Tailwind CSS, generated inline (12 KB), preflight enabled, `sm:` breakpoint only.
* **App:** a component-preview harness — device frame, centred copy, theme switch and
  a liquid-glass bottom navigation bar with four destinations
  (`home` / `search` / `library` / `profile`).
* **Interaction:** press feedback, a 350 ms tap glow, and a draggable 72×48 highlight
  bubble that snaps across the bar (drag starts only within 36 px of the bubble centre).
* **Three extra scripts that are NOT app code** — Claude-artifact host plumbing:
  external-link hardening (`target=_blank`), product-id link interception, and the
  `ecto:artifact-focus-request` / `ecto:artifact-close-request` postMessage bridge.
  These are deliberately **not** ported; they only make sense inside the artifact host.

## Architecture

```
src/
├── main.tsx                      mount (StrictMode + createRoot)
├── App.tsx                       the preview harness: frame, copy, toggle, nav
├── design/
│   ├── tokens.ts                 geometry, icon, interaction + preview copy
│   ├── theme.ts                  every themed value per mode + harness classes
│   ├── motion.ts                 easings, durations, composed transition strings
│   ├── home.ts                   Home: row geometry, colours, whole class strings
│   └── playlistV6.ts             v6: geometry, copy, whole class strings
├── components/
│   ├── BottomNav/
│   │   ├── BottomNav.tsx         the bottom stack + glass pill + track + items
│   │   ├── NavItem.tsx           one destination button
│   │   ├── HighlightBubble.tsx   72×48 bubble + 64 px tap glow
│   │   ├── icons.tsx             the four glyphs, one component each
│   │   ├── navKeyframes.css      icon-spring / softGlow / reduced-motion
│   │   └── types.ts              BottomNavProps (incl. the `above` slot)
│   ├── HomeScreen/               the screen from `enterprise-playlist 2.html`
│   │   ├── HomeScreen.tsx        scroll shell + header + list
│   │   ├── HomeHeader.tsx        sticky 64px bar + search button
│   │   ├── TrackRow.tsx          one 72px row; tapping it sets now-playing
│   │   ├── icons.tsx             the header's search glyph
│   │   └── index.ts
│   ├── PlaylistV6/               the screen from `Nav-music-playlist.html.html`
│   │   ├── PlaylistV6.tsx        state, the two effects, the tree
│   │   ├── TrackRow.tsx          one 64px row (active / playing / liked)
│   │   ├── V6BottomNav.tsx       the glass nav pill, both states
│   │   ├── MiniPlayerPill.tsx    340×56 pill at bottom 84px
│   │   ├── NowPlayingSheet.tsx   backdrop + panel + seek + transport
│   │   ├── icons.tsx             every glyph the screen draws
│   │   ├── playlistKeyframes.css slideUp / sheetUp
│   │   └── types.ts, index.ts
│   ├── MiniPlayer/
│   │   ├── MiniPlayer.tsx        the pill above the bar, in the bar's own glass
│   │   └── miniKeyframes.css     miniPlayerIn
│   ├── ThemeToggle.tsx           light/dark switch
│   ├── ViewSwitch.tsx            harness chrome: harness ⇄ Playlist v6
│   └── NavPreviewLabel.tsx       "Nav preview / bottom-nav / <id> · <n>"
├── data/
│   ├── tracks.ts + tracks.json   the Home catalogue + its loader
│   └── playlistV6.ts             the v6 generator and its three source arrays
├── hooks/
│   ├── useNavGesture.ts          press / glow / drag state machine
│   ├── useThemeMode.ts           OS preference + manual override
│   ├── useTracks.ts              one load per mount, abort-guarded
│   ├── usePlaybackClock.ts       the v6 100 ms progress clock
│   └── useScrollCompact.ts       scroll position → the nav pill's two sizes
├── lib/
│   └── navGeometry.ts            pure track/bubble math
└── styles/index.css              @font-face + :where + Tailwind layers
```

Every style object in the original has a home: values that never change live in
`design/tokens.ts` and `design/theme.ts`; values composed from those tokens are built
in `design/motion.ts`; the gesture thresholds are `INTERACTION`.

### Behaviour tried to keep byte-identical

| behaviour | original | rebuild |
|---|---|---|
| glow hold | `setTimeout(…, 350)` | `INTERACTION.glowHoldMs` |
| drag threshold | `Math.abs(dx) > 5` | `INTERACTION.dragThresholdPx` |
| drag start hit test | `abs(x − bubbleCentre) > 36 + 28 → bail` | `restingBubbleCentreX()` + `INTERACTION.startDragHitSlopPx` |
| resting bubble left | `calc(p*25% + 12.5% − 36px)` | `restingBubbleLeft(index, itemCount)` |
| commit rule | `didDrag \|\| index !== activeIndex` | same, in `useNavGesture` |
| counter | +1 on every commit (tap **and** drag) | `App.handleSelect` |

The two hard-coded `3`s (last index) and `25%`/`12.5%`/`4` (item count) are now derived
from `items.length`; with the original four destinations every value is identical.

## Playlist v6 — the second artifact

`../Nav-music-playlist.html.html` is another exported artifact from the same design
folder. Its app region is one component (437 formatted lines) that generates a
79-row playlist, plays a fake progress clock over it, and hangs three glass layers
off the bottom edge: a nav pill that collapses as you scroll, a mini player, and a
"Now Playing" sheet.

| step | tool | output |
|---|---|---|
| split | `tools/split_artifact.py` | `_extract-nav-playlist/style-*.css`, `script-*.js` |
| make it readable | `tools/jsformat2.py` | `LOSSLESS: True`, 67374 = 67374 tokens |
| isolate the app region | — | `_extract-nav-playlist/app.source.js` (lines 5002–5438) |
| **prove nothing was dropped** | `tools/parity_check.py --original … --deviations …` | PASS |
| **prove the data table is identical** | `_extract-nav-playlist/` re-derivation | 79/79 rows |

### What was ported

* **The generated catalogue**, not a snapshot of it. `buildV6Tracks()` reproduces the
  original's `Array.from({length:79}, …)` expression for expression, so the table is
  identical row for row. Verified by running *the artifact's own lifted expressions*
  and *the port's module* under the same seeded `Math.random` sequence and diffing all
  79 rows: identical. The only values that are not stable are the durations — the
  original drew them from `Math.random()`, so nobody's were.
  Note the source arrays: the artifact shipped **82** titles and asked for **79** rows,
  which makes its `S % Ll.length` wrap and its `" 2"` overflow branch dead code. Both
  are kept as written so `buildV6Tracks(count)` stays correct for any count.
* **The two thresholds.** `scrollY > 120` collapses the nav pill to
  `300×36` with `HOME / DISCOVER / LIBRARY / PLAYLISTS` at `10px uppercase`;
  `scrollY < 40` brings back the `340×56` icon row. Both layers are always in the DOM —
  the flag only swaps which one is scaled and opaque.
* **The three glass layers and their exact geometry.** Nav `340×56` at `bottom-4`,
  mini player `340×56` at `bottom: 84px` — a 12 px gap they are designed around, so
  they can never overlap — and the sheet at `maxHeight: 88vh` with a 24 px top radius.
  Glass recipes are the originals:
  `bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border-white/20` plus
  `shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]`, and the
  mini player at `bg-white/80 border-white/30`.
* **The playback clock.** `setInterval(…, 100)` adding `0.15` per tick, wrapping to
  `0` and advancing to `(n + 1) % length`; a row tap selects, starts playing and jumps
  to a *random* point (`Math.random() * 40`), which is what the original does.
* **All four initial states** — nav on `playlists`, track `7`, playing, progress `32`,
  liked `{2, 7, 12}`, sheet closed, mini player visible.
* **Every glyph**, attribute list included: the four 22px nav icons at
  `strokeWidth 1.6`; the row's 16px heart and dots; the mini player's 14px pair and X;
  and the sheet's 18px chevron / dots / heart, which stop at `strokeWidth` with **no**
  `strokeLinecap` / `strokeLinejoin` (the row's copies do carry them — the difference
  is preserved). The two outer transport buttons are drawn as a shuffle arrow and a
  repeat outline but wired to `progress − 10` and `progress + 10`; kept as they were.
* **The copy**, byte-for-byte, including the two Persian design notes the artifact
  prints on the page itself.

### How to see it

`ViewSwitch` (page top-left, or press **v**) swaps the device screen between the
original harness and Playlist v6. It sits *outside* the phone frame so it can never be
mistaken for part of either design. The v6 screen brings its own nav and is light-only
in the original, so the harness's own nav and theme switch stand down while it is
mounted — the harness view itself is untouched.

Prefer routing it through the project's own glass nav instead (the way `home` already
opens HomeScreen)? That is one branch in `App.tsx`.

## Run it

```bash
npm install          # react 18.3.1, react-dom 18.3.1, vite, tailwind, TS
npm run dev          # http://localhost:5173
npm run build        # -> dist/index.html — ONE self-contained, offline file
npm run preview      # serve the built file
```

`npm run build` inlines the JS and CSS into a single `dist/index.html`
(`vite-plugin-singlefile`, `assetsInlineLimit` raised, relative `base`) — the same
shape as the artifact it replaces, but readable and rebuildable.

## Fidelity notes

* **Home indicator removed — deliberate deviation.** The original drew a 120×5
  iOS-style grabber (`mx-auto mt-2 h-[5px] w-[120px] rounded-full`) under the pill.
  It is gone on purpose: on a real device iOS already draws its own, so the artifact's
  copy duplicated it. `tools/parity_check.py` lists the four affected values as an
  explicit *deviation* with a reason rather than letting them look like an oversight.
* **Fonts.** The original declares `@font-face` for *Optimistic* / *Optimistic Mono* at
  `/fonts/*.woff2`. Those files are Anthropic-internal and are not on this machine, so
  the artifact always fell back to `system-ui` — the declarations are preserved
  verbatim so dropping the `.woff2` files into `public/fonts/` restores the lettering
  exactly. See `public/fonts/README.md`.
* **Keyframes** moved from an inline `<style>` element into
  `components/BottomNav/navKeyframes.css`, imported by the component that uses them.
  The CSS text is unchanged, so the global `prefers-reduced-motion` rule still applies
  document-wide as before.
* **Style order** in `styles/index.css` keeps the font block *before* the Tailwind
  layers, matching the original's two `<style>` blocks — which is why Tailwind's
  preflight still wins over the zero-specificity `:where(html)` rule, as it did there.
* `onPointerDown` on the pill and on the bubble, the `stopPropagation`, and the order
  of the `didDrag` / `isDragging` guards in `onClick` are all preserved as-is.
* **The sliding indicator is now slot-shaped — deliberate deviation (Danial).** The
  original bubble was a fixed `72×48` blob with the pill inset `px-[6px]`, the track
  `left-[6px] right-[6px]`, and 4px of vertical gap: 6px across, 4px up, and the blob
  covered 72px of an 82.5px slot without ever filling it. It is now inset a uniform
  **4px** on all four sides and is exactly **one slot wide**, which is how the Playlist
  v6 nav draws its own selection. Two consequences:
  - `NAV_BAR.pillPadding` is the single number behind `px-1`, `left-1`/`right-1` and the
    vertical gap (`(pillHeight − bubbleHeight) / 2`), so the axes cannot drift apart.
  - the width is **derived**, `trackWidth / items.length`, and applied as a percentage of
    the track — the original's resting position needed `calc(p*25% + 12.5% − 36px)`
    precisely because 72px was hard-coded, and that was only correct at one pill width.
    `python3 tools/parity_check.py` names `px-[6px]`, `left-[6px]` and `right-[6px]` as
    explicit deviations with that reason; the drag maths in `lib/navGeometry.ts` is
    unchanged and now lands on the slot's own centre for free.
  The 350ms tap glow, the drag and the snap are untouched.
* **The mini player joined the harness — a new component, not the v6 one (Danial).** v6's
  mini player is white-only (`bg-white/80`) because that screen never had a theme. This
  is a separate `components/MiniPlayer/`, painted with the **same `ThemePalette` glass
  entries as the nav pill** (`pillBackground` / `pillBorder` / `pillShadow` /
  `pillBackdropFilter`), so it follows the light/dark switch and reads as half of one
  pair; only its controls and two text colours needed their own per-mode entries, and
  those follow the theme switch's own recipe. Its box is the bar's box — `h-[56px]`,
  `max-w-[352px]`, `rounded-full` — and its composition and all three glyphs come from
  v6. Two decisions worth knowing:
  - **the bar positions it, it does not position itself.** `BottomNav` grew an `above`
    slot and its wrapper became a flex column (`STACK_CLASS`, `flex flex-col gap-3`), so
    the 12px gap is a real gap and the wrapper's
    `pb-[max(12px,env(safe-area-inset-bottom))]` raises BOTH pills on a device with a
    home indicator. An independently positioned `bottom: 80px` could only have got one of
    those two right — which is exactly the flaw in the v6 nav's own mini player.
  - **its left half is not a button.** v6's opened the Now Playing sheet; the harness has
    no sheet, and a button with nothing behind it is worse than no button.
  **It has a real trigger, and starts absent.** There is no stand-in track: `App` holds
  `nowPlaying: Track | null`, `HomeScreen` grew an `onSelectTrack` prop, and the row hands
  the tapped `Track` up. No row tapped → no pill at all. Row tapped → the pill slides in
  with that track *and* starts playing, which is Playlist v6's own rule
  (`select → play`). ✕ sets it back to `null`, so dismissing is a real dismissal rather
  than a one-way door, and tapping another row swaps the pill's contents in place.
  Play/pause swaps the glyph and nothing else — there is no audio behind this preview, and
  the pill itself is the only "something is playing" indicator. (The row is a plain
  `onClick` on a `div`, exactly like v6's rows, so it is not keyboard-reachable.)

### Playlist v6

* **Its font is bundled, not fetched — this is the one thing that could not be
  carried over verbatim.** The screen injected
  `@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap')`
  into its own tree. That is a network fetch, which breaks the offline requirement, so
  the face now lives in `src/assets/fonts/geist-var-{latin,latin-ext}.woff2` and is
  declared in `styles/index.css`. Google serves 400/500/600 from **one variable file**
  (all three weight declarations in the served CSS resolve to the same URL), so the
  three static requests collapse into a single `font-weight: 400 600` face. The
  original's `*{font-family:'Geist',…}` rule became `V6_COPY.rootFontFamily` on the
  screen root — `font-family` is inherited and no descendant overrides it. Persian copy
  in the two design notes has no Geist coverage and falls back to `system-ui`, as it
  did in the artifact.
* **`fixed` → `absolute`, and the document scroll became a scroll shell.** The original
  *was* the page: it scrolled `window` and pinned four layers with `position: fixed`.
  This app renders a screen inside a fixed-size phone frame, so the same four layers
  (nav, mini player, sheet backdrop, sheet panel) are `absolute` inside the frame and
  the two scroll thresholds read `scrollTop` instead of `scrollY`. The thresholds
  themselves (`120` / `40`) are unchanged. HomeScreen already made the same move.
* **`min-h-screen` is the one dropped class token — deliberate.** Inside the frame the
  root is `absolute inset-0`; `min-height: 100vh` would make it taller than the frame
  (which is `overflow-hidden`) and push the absolutely-positioned nav pill past the
  bottom edge, so the nav would vanish. The frame supplies the height instead.
  `tools/parity-nav-playlist.json` records it as a named deviation with that reason, so
  the parity gate still fails on anything *undeclared*.
* **The progress advance is hoisted out of the state updater.** The original wrapped the
  track from inside `setProgress`, which is safe on a production React (and the artifact
  shipped one) but makes React 18's StrictMode double-invoke it in development — the
  list would advance two tracks per completion. The port keeps the wrap on the tick, in
  a ref mirror, so the observable behaviour matches the artifact: one track.
* **The screen is light-only** (`bg-[#F6F6F7] text-zinc-900`), so the harness's theme
  switch hides while it is mounted. Its own four destinations
  (`home` / `discover` / `library` / `playlists`, flat `bg-[#E8E8EB]/90` active pill)
  are separate from the harness nav and never touch it.

## Tools

```bash
# the diminish artifact (the original gate, default paths)
python3 tools/split_artifact.py "../diminish.html" _extract
python3 tools/jsformat2.py _extract/script-01.js _extract/script-01.fmt2.js   # self-verifying
python3 tools/parity_check.py                                                # gates on MISSING

# the Playlist v6 artifact
python3 tools/split_artifact.py "../Nav-music-playlist.html.html" _extract-nav-playlist
python3 tools/jsformat2.py _extract-nav-playlist/script-01.js _extract-nav-playlist/script-01.fmt2.js
python3 tools/parity_check.py \
    --original _extract-nav-playlist/app.source.js \
    --deviations tools/parity-nav-playlist.json                              # gates on MISSING
```

`parity_check.py` strips comments before it compares, so a value that survives only
inside a comment cannot satisfy the gate — otherwise the file that *documents* a
deviation would be the file that hides it. Sanity-check it by pointing `--src` at an
empty directory; it must report every token missing. It does.

Everything that changed for Playlist v6 was syntax-checked with the project's own
`node_modules/.bin/esbuild` (Vite's copy) — that catches syntax, not types. The type
gate is `npm run typecheck`.
