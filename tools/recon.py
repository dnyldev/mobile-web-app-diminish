#!/usr/bin/env python3
"""Read-only reconnaissance of the extracted artifact parts."""
import json
import re
import sys

D = sys.argv[1] if len(sys.argv) > 1 else "_extract"
r = lambda p: open(f"{D}/{p}", encoding="utf-8", errors="replace").read()

print("=" * 70)
print("HEAD (non style/script content)")
head = r("head.html")
head_wo = re.sub(r"<style\b.*?</style>", "\n<STYLE/>\n", head, flags=re.S | re.I)
head_wo = re.sub(r"<script\b.*?</script>", "\n<SCRIPT/>\n", head_wo, flags=re.S | re.I)
print(head_wo.strip()[:2000])

print("=" * 70)
print("script-03.js (full)")
print(r("script-03.js")[:4000])

print("=" * 70)
print("script-01.js RECON")
js = r("script-01.js")
print("chars:", len(js))
print("import stmts:", re.findall(r'import\s*[^\n;]{0,80}?from\s*["\'][^"\']+["\']', js)[:20])
print("bare imports:", re.findall(r'\bimport\s*["\'][^"\']+["\']', js)[:20])
print("dynamic import:", re.findall(r'import\(["\'][^"\']+["\']\)', js)[:20])
print("has React internals:", {k: js.count(k) for k in
      ["react.element", "react.elementSymbol", "useCallback", "useState", "createElement", "jsx", "Fragment"]})
print("len(js) single line?", js.count("\n"))
with open(f"{D}/script-01.pretty.js", "w", encoding="utf-8") as f:
    f.write(js)

print("=" * 70)
print("style-02.css RECON")
css = r("style-02.css")
print("chars:", len(css), "newlines:", css.count("\n"))
pretty = re.sub(r"\}", "}\n", css)
open(f"{D}/style-02.pretty.css", "w", encoding="utf-8").write(pretty)
print("rule count:", pretty.count("}"))
vars_ = re.findall(r"--[a-zA-Z0-9-]+\s*:", css)
print("custom props:", sorted(set(vars_))[:80])
print("--- @-rules ---")
print(sorted(set(re.findall(r"@[a-z-]+", css))))
print("--- keyframe names ---")
print(sorted(set(re.findall(r"@keyframes\s+([A-Za-z0-9_-]+)", css))))
