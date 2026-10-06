# Fonts

The original artifact declares two faces (see `src/styles/index.css`):

```
Optimistic       -> /fonts/OptimisticAI_VF_Optimized.woff2        (weight 400 600, variable)
Optimistic Mono  -> /fonts/OptimisticMono_W_TextRegular.woff2     (weight 400)
```

These are Anthropic's proprietary UI fonts and were only ever served from the artifact's
own host, so the file rendered with the `system-ui` fallback. The declarations are kept
exactly as they were.

To restore the original lettering, drop the two files here, named exactly:

```
public/fonts/OptimisticAI_VF_Optimized.woff2
public/fonts/OptimisticMono_W_TextRegular.woff2
```

Nothing else needs to change. If you would rather ship a self-contained single file,
base64-inline them into `src/styles/index.css` with `url("data:font/woff2;base64,…")` —
but note the variable font is large, and the current build already renders correctly
without it.

## Vazirmatn (the Add music flow)

`Add music.html` declared its faces with an `@import` from Google Fonts and applied the
stack `'Geist','Vazirmatn',system-ui,sans-serif`. Geist is bundled (see the v6 note
above); Vazirmatn is **not**, and there is deliberately no `@font-face` for it.

That is not an oversight. Unlike Optimistic, `Vazirmatn` is a family fontconfig may
already have installed — and a `@font-face` whose `src` 404s SHADOWS that installed face
instead of falling through to it. So the family is listed and left to resolve from the
system; where it is missing, the Persian copy falls back to `system-ui`, which is also
what the artifact itself did everywhere its Google import had not (yet) loaded.

The flow's Persian copy is the only thing that depends on it: the sheet's title and body,
both path cards, the note and the toast. To pin the lettering, drop the woff2 here and
declare it exactly the way the two faces above are declared.

Note: Tailwind's preflight sets `html { font-family: <sans stack> }`, which outranks the
original's zero-specificity `:where(html)` rule — so even with the fonts present, the
sans stack wins for body text unless you also add `font-family` via a Tailwind theme
override. That is the same behaviour the artifact had.
