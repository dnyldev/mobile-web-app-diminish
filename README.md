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
│   ├── playlistV6.ts             v6: geometry, copy, whole class strings
│   └── addSong.ts                add flow: geometry, timings, per-mode surfaces, copy
├── components/
│   ├── BottomNav/
│   │   ├── BottomNav.tsx         the stack + the `[pill][gap][button]` row
│   │   ├── NavItem.tsx           one destination button
│   │   ├── NavActionButton.tsx   the button beside the pill — an action, not a tab
│   │   ├── HighlightBubble.tsx   72×48 bubble + 64 px tap glow
│   │   ├── icons.tsx             the four glyphs, one component each
│   │   ├── navKeyframes.css      icon-spring / softGlow / reduced-motion
│   │   └── types.ts              BottomNavProps (incl. `above` + `action`)
│   ├── HomeScreen/               the screen from `enterprise-playlist 2.html`
│   │   ├── HomeScreen.tsx        scroll shell + header + list (+ added rows)
│   │   ├── HomeHeader.tsx        sticky 64px bar + search button
│   │   ├── TrackRow.tsx          one 72px row; tapping it sets now-playing
│   │   ├── UploadRow.tsx         the same 72px row while a file uploads into it
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
│   ├── AddSong/                  the flow from `Library/Add-song.html`
│   │   ├── AddSongSheet.tsx      the drawer — two rows
│   │   ├── AddSongSearch.tsx     the search view — the drawer's second row leads here
│   │   ├── AddSongLayer.tsx      input + toast + drawer, over the frame
│   │   ├── icons.tsx             every glyph the flow draws
│   │   ├── addSongKeyframes.css  fadeIn / sheetUp / checkSpring
│   │   └── index.ts
│   ├── MiniPlayer/
│   │   ├── MiniPlayer.tsx        the pill above the bar, in the bar's own glass
│   │   └── miniKeyframes.css     miniPlayerIn
│   ├── ThemeToggle.tsx           light/dark switch
│   └── NavPreviewLabel.tsx       "Nav preview / bottom-nav / <id> · <n>"
├── data/
│   ├── tracks.ts + tracks.json   the Home catalogue + its loader
│   ├── playlistV6.ts             the v6 generator and its three source arrays
│   └── addSong.ts                the archive table + the two row builders
├── hooks/
│   ├── useNavGesture.ts          press / glow / drag state machine
│   ├── useThemeMode.ts           OS preference + manual override
│   ├── useTracks.ts              one load per mount, abort-guarded
│   ├── useAddSong.ts             sheet / search / file-picker + upload machine
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

The screen is currently **not mounted**. `App` renders `HomeScreen` for `home` and the
`NavPreviewLabel` for the other three destinations; the `ViewSwitch` that used to swap
Playlist v6 in was removed, and the port has been unrendered since. It is intact under
`components/PlaylistV6/`, and one branch in `App.tsx` brings it back — either as that
switch again, or routed through the project's own glass nav the way `home` already
opens `HomeScreen`.

## Add music — the third artifact

`../Add music.html` is the third exported artifact. Its app region is
`_extract-add-music/app.source.js` (746 formatted lines), and **only its add flow** was
ported: the hidden file input and the toast. Two more surfaces came from
`Library/Add-song.html` afterwards — the drawer and the search view — and the sheet and the
API search panel this artifact drew have been replaced by them (see "The drawer" and "The
search view" below). The
rest of that screen — its list, its glass nav, its mini player and its Now Playing sheet —
duplicates things this app already has from the other two artifacts, so it is left where it
is. The artifact's own trigger (the `ADD NEW SONG` pill) is left there too; see "The trigger
moved" below.

| step | tool | output |
|---|---|---|
| split | `tools/split_artifact.py` | `_extract-add-music/style-*.css`, `script-*.js` |
| make it readable | `tools/jsformat2.py` | `LOSSLESS: True` |
| isolate the app region | — | `_extract-add-music/app.source.js` (lines 39-746) |
| slice out just the add flow | — | `_extract-add-music/add-flow.source.js` (lines 248-253 — the sheet at 289-399 and the panel at 400-462 have both been replaced, see below) |
| **prove nothing was dropped** | `parity_check.py --original …/add-flow.source.js` | PASS — 12/12 class tokens, 9/9 numeric literals, **no deviations** |

### The trigger moved — and the artifact's own button went with it

The artifact's trigger was a 340px `ADD NEW SONG` button pinned at `top-4`: 52px tall, and
36px once the screen had scrolled past **80px**, with a `shimmerMove 2.8s` sweep and two
layers cross-fading inside it — plus a 3-second "hold it open" deadline behind it (`Hl()`,
which sets a timer and is NOT the toast, despite reading like one).

**All of it is gone (decision: Danial).** The navbar's `+` button does that job now, so the
pill left, and its geometry, its timings, its palette entries and its `shimmerMove` keyframe
went with it. The trigger is the only thing that changed: the sheet it opens is
byte-identical, and with the pill gone the flow's layers are back on the artifact's OWN
offsets (`top-[76px]` and `top-[72px]`) — which is why this is the one gate in the project
that needs no deviations at all.

### What was ported

* **The two paths, and what each really does.** The drawer's first row closes it, raises the
  toast for 2200ms and clicks a hidden `input[type=file][accept=audio/*]` 200ms later; the
  file's name (extension stripped) becomes the title, the monogram comes off the FILE NAME
  rather than the title, and 900ms after the bar fills the row becomes a real track —
  `Unknown Artist`, the artifact's own line, with the label it rolled and `seconds` derived
  from that label. The second row closes the drawer and the search view takes the screen
  180ms later; see "The search view" below. (The API panel that used to answer this row —
  its 12-seed catalogue, its "first six with no query / max eight" caps, its
  `… • Demenish` artist suffix and its simulation footer — went with it.)
* **The sheet this artifact drew has been REPLACED.** It was two 132px cards — the local
  one a light card with a dark tile, a diagonal `from-zinc-50 to-white` wash and a 120px
  blob; the API one `bg-[#0A0A0B]` with a white tile and two radial gradients — plus a
  `LOCAL`/`API` chip each and a note box. The drawer is now the Add-song artifact's, on
  Danial's instruction; see "The drawer" below for what stands there now, and for the one
  command that re-cuts this flow's parity gate.
* **Every glyph**, attribute list included. The Add-song template builds all of its own
  through lucide's factory, so they carry `strokeLinecap/Linejoin: "round"` and a default
  `strokeWidth` of 2; the widths are stated at each call site instead, exactly as the
  template states them. `AddSong/icons.tsx` carries the table of every glyph, its size and
  its width.
* **The copy**, byte for byte from whichever file each surface came from: the drawer and the
  search view speak the Add-song template's English, the gallery toast speaks this
  artifact's Persian. Nothing in the flow touches the network, which is what keeps the
  build offline.

### The drawer — now the Add-song one's (decision: Danial)

The sheet that shipped first was *this* artifact's: two 132px cards, `rounded-t-[28px]`, a
`z-[55]` backdrop and a note box. He asked for the drawer from `Library/Add-song.html`
instead, so that is what stands there now, at its own values, in both modes:

| | the template (`Add-song.html` 5421-5501) |
|---|---|
| backdrop | `bg-black/40 backdrop-blur-[12px]`, `fadeIn 0.3s ease-out` — **not** themed, exactly as the template wrote it |
| panel | `max-w-[390px] rounded-t-[24px]`, `padding:12px 24px 32px 24px`, `box-shadow:0 -10px 40px rgba(0,0,0,0.12)`, rising on `slideUp 0.32s cubic-bezier(0.32,0.72,0,1)` |
| `z` | backdrop `55`, panel `66`. The template's own `z-40` cannot work here: this app's bottom nav is `z-50` and is rendered *after* the drawer, so it painted on top of it. The ladder is the flow's existing one — nav `50` → drawer backdrop `55` → drawer panel `66` → toast `80`. (The search view needs no `z`: it is a screen, not an overlay.) |
| panel colour | `#1C1C1E` dark / `#FFFFFF` light; the title, both row titles and both chevrons take the panel's inherited text colour, as the template's screen root set it |
| grabber | `w-9 h-1`, `#3A3A3C` / `#E5E5EA` |
| title | centered `17px/22px` semibold — `Add to Library` |
| rows | two `56px` rows at `padding:0 4px`: a `40px` disc (`#2C2C2E` / `#F2F2F7`) holding a `20px` glyph at `strokeWidth 1.8`, a `font-medium 16/19` title, a `13px #8E8E93` sub, and a `16px` chevron at `rotate-180 opacity-40` |
| footer | NONE — the template's `h-4` spacer and its `134×5` home indicator are dropped (decision: Danial), for the same reason the *nav bar's* copy was |

Three things worth knowing:

* **The copy is the template's own English, verbatim** — `Add to Library`,
  `Upload from Device` + `mp3, m4a, wav`, `Search Archive` + `Thousands of tracks` —
  because a 100% port carries the reference file's words. (The gallery toast stays Persian:
  it came from `Add music.html`, and that is *its* copy. Each surface speaks the language of
  the file it was taken from.)
* **There is no ✕ button.** The template closes on the backdrop alone, and so does this.
  One line to add one back.
* **The rows keep this app's behaviour.** `Upload` opens the real `input[type=file]` picker
  (the template instead starts a synthetic `Track N.mp3` upload, which would throw the
  user's own file away) and `Search Archive` opens the search view 180ms later.
* **The home indicator is NOT drawn.** The template ends on an `h-4` spacer and a
  `134×5` bar (`#3A3A3C` / `#000000`); both are gone (decision: Danial). On a real
  device iOS draws its own indicator at exactly that spot — the argument that
  dropped the nav bar's copy — and in light mode that bar was a solid black line
  across the drawer. With it gone the panel ends on its own `32px` bottom padding.

The Add music sheet's class strings, palette entries and copy were deleted with it, its four
glyphs (`rm`, `lm`, the right-hand chevron, the note's info glyph) are gone, and this flow's
parity gate now covers what is actually left — the toast and the file input — re-cut it with:

```bash
sed -n '248,253p' _extract-add-music/app.source.js > _extract-add-music/add-flow.source.js
python3 tools/parity_check.py --original _extract-add-music/add-flow.source.js
```

which reports 12 class tokens and 9 numeric literals, none missing. (`289-399` was the sheet
and `400-462` the API panel; both are replaced, so both left the slice.)

### The row lifecycle — ported from `../Library/Add-song.html`

The flow used to commit a row the instant a file or a result was chosen. The readable
`Add-song.html` does not: it puts a row up first and finishes the job later. That lifecycle
is now this app's, with the artifact's own numbers:

| step | the artifact | here |
|---|---|---|
| a file is chosen | a row with `progress: 0`, `status: "uploading"` goes up | `PendingUpload`, `buildPendingUpload` |
| the bar fills | `setInterval(…, 80)` with `+= random*8 + 3` per tick → ~0.7–2.7s | `uploadTickMs` / `uploadStepMin` / `uploadStepRandom` |
| the bar is full | `status: "processing"`, label → `Processing…` | `ADD_SONG_COPY.processingLabel` |
| 900ms later | the real track replaces it + toast + `navigator.vibrate(10)` | `commitPendingUpload`, `uploadCommitMs` |
| the ✕ | `H()` — clear the interval, drop the row | `controller.cancelUpload` |
| a result is picked | spinner 900ms → ✓ for 1500ms, the track lands at the spinner's end | `pickResult`, `searchAddMs` / `searchAddedMs` |

The row is a row of the **Home list**, not a second dialog: `useAddSong` owns it, `App`
hands it to `HomeScreen` as `pending`, and `components/HomeScreen/UploadRow.tsx` composes
`HOME_STATIC` — so the row a file uploads into and the row it becomes are the same 72px row
and the list does not shift when the swap happens.

Three deliberate choices, each reversible in one line:

* **a picked result does not leave the search view.** The template stays on its search tab
  and keeps the query, so this does too — and the ✓ needs the row to still be there to be
  seen. `pickResult` used to call `setSearchOpen(false)` + `setQuery('')`.
* **the artist is the artifact's own**: `"Unknown Artist"` for an uploaded file, and the
  entry's own `artist` for a picked result (`VA` adds no suffix). The earlier
  `Local • گوشی شما` was this app's invention and went with the rest of it.
* **one new colour: the artifact's own `#34C759`** for the ✓-saved disc
  (`ADD_SONG_THEME[…].searchSaved`). It is the only non-ink colour in this app, and it is
  there because an "ink" ✓ reads as decoration instead of as success.

Added for it: `addSongKeyframes.css`'s `checkSpring` (the artifact's own keyframes),
`CheckGlyph` + `LoaderGlyph` in `AddSong/icons.tsx` (`ci` / `oo`), and the upload row's
class strings in `design/home.ts` (`UPLOAD_ROW`, `UPLOAD_ROW_CLASSES`). `tsc --noEmit` is
clean and every changed file was syntax-checked with the project's own `esbuild`.

### The search view — from `../Library/Add-song.html` (decision: Danial)

The drawer's second row used to open the Add music artifact's floating API panel. He asked for
the Add-song one instead, and that artifact's search is not a panel at all — it is a SCREEN:
picking `Search Archive` closes the drawer and switches the page to it
(`F(!1), t("search"), s("")`). So it renders where `HomeScreen` renders, and `App` chooses
between them.

| | the template (`Add-song.html` 5268-5418) |
|---|---|
| the screen | `flex flex-col flex-1 min-h-screen`, `#000000` / `#FFFFFF`. Here `absolute inset-0` inside the frame, plus `pb-28` so the nav's stack cannot cover the last row |
| the header | `flex items-center gap-3 px-4 pt-3 pb-3`: a `w-9 h-9 -ml-1` back disc (`ChevronLeft` 22 / 2.2) and a `flex-1 h-9 px-3 rounded-full` field — `#1C1C1E`/`#F2F2F7`, a 16px `Search` glyph, a `text-[15px]` input, and a `w-6 h-6` clear chip (`#2C2C2E`/`#E5E5EA`, `X` at 12) that exists only while there is a query |
| the debounce | 600ms. A blank query clears the list at once; anything else raises `searching` and the filter runs once the typing settles |
| the skeletons | three rows at 72px: a `w-[52px] h-[52px] rounded-[14px] animate-pulse` cover and two `h-4 w-32` / `h-3 w-20` bars, `#1C1C1E`/`#F0F0F0` |
| the rows | 72px, `px-5`: a 52px `rounded-[14px]` cover with the entry's OWN gradient and a 20px white letter, a `truncate font-semibold` 16/20 title, a 13.5px `#8E8E93` artist, a `w-8 h-8` add disc, and a `h-[1px]` divider inset to `left-[72px]` |
| the add disc | `+` → spinner → ✓, and only the GLYPH changes until the row is added. Idle: a `#E5E5EA`/`#2C2C2E` border on `#FFFFFF`/`#1C1C1E` with a `#8E8E93` glyph. Saved: `#34C759` border and fill, white ✓, on `checkSpring` |
| the empty state | a 72px disc with a 32px `Search` at `strokeWidth 1.6`, `No recent searches`, and `Start typing to find tracks` — nothing else. The template's `TRENDING NOW` block (its label, the five `trending` entries and its three hard-coded artists) is NOT ported: Danial does not want that option there, so the block, its classes, its copy, `TRENDING_ARTISTS` and the archive table's `trending` flag all left together |
| no matches | a 64px disc with a 28px `Music2`, `No results for "<what you typed>"`, `Try a different search term` |

Worth knowing:

* **It is English, verbatim** — `Search songs, artists...`, `No recent searches`,
  `Trending now`, `Try a different search term` — for the same reason the drawer is.
* **The two icon-only buttons carry aria-labels the template did not have**
  (`searchBackLabel` / `searchClearLabel`), in Persian, like the uploading row's ✕.
* **The archive is this app's own table** (`ADD_SEARCH_SEEDS`, twelve entries) in the
  template's ENTRY SHAPE: `id`, `title`, `artist`, `duration`, `letter`, `gradient`. Each
  entry keeps its OWN gradient, so filtering never repaints the list — the panel's
  index-keyed colours (`En[T % En.length]`) went with the panel. (The template's `trending`
  flag left with the `TRENDING NOW` block it fed.)
* **No `TRENDING NOW`, no chips.** That whole block is gone on his instruction — label, chip
  cloud, the three hard-coded artists and the archive's `trending` flag with them. The empty
  state is the disc and the two lines, nothing else.
* **Nothing is capped.** The panel showed the first six with no query and a maximum of eight
  with one; the template's filter has neither, so neither does this.
* **A picked result stays in the view** with the query as typed — the template resets
  neither, and the ✓ needs the row to still be there.
* **A tap on any nav destination leaves the view**, which is what the template's tab switch
  does; without it the view would sit over the screen the user just asked for.

What left with the panel: its `z-[70]` blur backdrop, its `top-[72px] max-w-[400px]` shell, its
44px field with the 14px `r="6"` search glyph (a DIFFERENT `Search` from this view's `r="8"`),
its results eyebrow (`Demenish • N result`), its simulation footer, its 12px add glyph, and
the `filterAddSearch` / `resultGradient` helpers that fed it.

### The two adaptations

* **`fixed` → `absolute`.** The artifact *was* the page and pinned its layers to the
  viewport. Here they are `absolute` inside the phone frame — which is what its `fixed`
  layers were relative to the viewport — and `App` renders them as children of the frame
  beside the screen. They cannot live inside the screen: an `absolute` overlay inside a
  scrolling box anchors to the scroll content and would travel with the list.
* **Per-mode surfaces — the one axis the artifact could not have had.** Its screen was
  light-only, so every surface in the flow was written once, in light. Each is now an
  `AddSongPalette` entry: the LIGHT values are byte-identical to the artifact and the dark
  ones are derived from the app's own dark tokens — the same treatment `ThemePalette` gave
  the mini player, for the same reason. The Add-song surfaces are the exception in the other
  direction: the template wrote its own dark values (`#000000` screen, `#1C1C1E` surfaces,
  `#2C2C2E` outlines, `#F0F0F0` hairlines, `#8E8E93` ink) and those are used as written.

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
* **The bar is three destinations and a button — deliberate deviation (Danial).**
  The artifact put all four destinations in one pill. The bar now offers three —
  `NAV_TABS`, the artifact's own array minus its last entry, with `NAV_ITEMS` kept
  whole above it because that is the fidelity record — and the fourth slot is
  `components/BottomNav/NavActionButton.tsx`. **It is not a fourth destination**,
  and that is the entire reason it is a separate component rather than a fourth
  `NavItem`:
  - it is not in `activeId`, so it can never be "the selected tab";
  - it has no selected state, and no glass that claims one;
  - it never moves, hides or repositions the indicator, and it is not part of the
    pill's drag track — `useNavGesture` does not know it exists;
  - it inherits none of the nav items' physics: no `pressScale` 1.04, no 350ms
    `softGlow` replay, no `icon-spring`. Its press feedback is a plain button's —
    `active:scale-95` in CSS, the same idiom `ThemeToggle` uses.
  What it keeps is the bar's *material*, because Danial chose 56px — the pill's
  own height — precisely so the two read as one set: the same `pillBackground` /
  `pillBorder` / `pillShadow` / `pillBackdropFilter`, and `pillHeight` for its
  diameter. There is deliberately no separate size token, because a second literal
  could drift from the first. The gap is the only new number, `NAV_BAR.actionGap`
  = 8, and it is measured rather than guessed: on the reference Danial supplied
  the round button sat 22px from a 158px-tall bar, so 22 / 158 × 56 ≈ 8.
  Its glyph is its own — `NavActionPlusGlyph`, drawn on the nav's own 22px /
  `strokeWidth 1.6` geometry — and its icon is `iconActive`, i.e. full contrast: a
  destination at rest is dimmed to show it is not selected, and this is not a
  destination at rest. **`onAction` is deliberately unwired** — the button is a
  placeholder for now (decision: Danial), and wiring it is that one prop.
  Two consequences worth knowing:
  - **The pill's width is now derived.** `max-w-[352px]` moved from the pill to
    the row that holds `[pill][gap][button]`, and the pill is its flex-growing
    half — so it is `352 − actionGap − pillHeight` at layout time, and it
    re-derives itself if either number ever moves. At a 390px frame that is 278px,
    which gives three 90px slots where the artifact had four 83.5px ones.
  - **The bar's third glyph is `V6HomeIcon`.** `V6DiscoverIcon` left the bar along
    with the fourth destination; the house that used to sit on the button moved
    into the bar in its place, so the bar is playlists · library · home, left to
    right.
  Inside the pill the 350ms glow, the drag and the snap are untouched, and the
  pill is still the drag track: with three items the indicator is still exactly
  one slot wide. `useNavGesture.ts` and `HighlightBubble.tsx` are byte-identical to
  what they were before the split — an earlier pass taught them to cope with
  `activeIndex === -1`, and that scaffolding was removed again the moment the
  button stopped being a destination. See the before/after at
  `http://localhost:5173/sandbox/nav-split.html` — the same component with and
  without `action`.
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

# the Add music artifact — only its add flow is in the gate
python3 tools/split_artifact.py "../Add music.html" _extract-add-music
python3 tools/jsformat2.py _extract-add-music/script-01.js _extract-add-music/script-01.fmt2.js
sed -n '248,253p' _extract-add-music/app.source.js > _extract-add-music/add-flow.source.js
python3 tools/parity_check.py \
    --original _extract-add-music/add-flow.source.js                       # gates on MISSING
```

The last one is both narrower and stricter than the other two. Narrower, because its subject
is a *slice* of the artifact — the file input and toast (248-253); the sheet (289-399) and the
API panel (400-462) it also drew have both been replaced by Add-song surfaces, so they left
the slice — and neither the rest of that screen nor the artifact's own `ADD NEW SONG`
pill was ported. Stricter, because it is the one gate in the project that passes with **no
deviations at all**: everything it covers is in `src/` verbatim. The slice is generated, so
it lives in the gitignored `_extract-add-music/` beside the region it came from; the `sed`
line above is the whole recipe.

`parity_check.py` strips comments before it compares, so a value that survives only
inside a comment cannot satisfy the gate — otherwise the file that *documents* a
deviation would be the file that hides it. Sanity-check it by pointing `--src` at an
empty directory; it must report every token missing. It does.

Everything that changed for Playlist v6 was syntax-checked with the project's own
`node_modules/.bin/esbuild` (Vite's copy) — that catches syntax, not types. The type
gate is `npm run typecheck`.
