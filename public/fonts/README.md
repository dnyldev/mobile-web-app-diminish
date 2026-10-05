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

Note: Tailwind's preflight sets `html { font-family: <sans stack> }`, which outranks the
original's zero-specificity `:where(html)` rule — so even with the fonts present, the
sans stack wins for body text unless you also add `font-family` via a Tailwind theme
override. That is the same behaviour the artifact had.
