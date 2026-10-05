#!/usr/bin/env python3
"""Split a bundled single-file React artifact into readable, extractable parts.

Extracts (without altering content):
  _extract/style-NN.css   -> every <style> block
  _extract/script-NN.js   -> every <script> block (inline only)
  _extract/head.html      -> the <head> inner HTML
  _extract/body.inline.html -> body HTML with script/style bodies replaced by markers
  _extract/INDEX.json     -> sizes, counts, markers
"""
import json
import os
import re
import sys

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

raw = open(SRC, encoding="utf-8", errors="replace").read()

style_re = re.compile(r"<style\b([^>]*)>(.*?)</style>", re.S | re.I)
script_re = re.compile(r"<script\b([^>]*)>(.*?)</script>", re.S | re.I)
head_re = re.compile(r"<head\b[^>]*>(.*?)</head>", re.S | re.I)
body_re = re.compile(r"<body\b[^>]*>(.*?)</body>", re.S | re.I)

index = {"source": SRC, "bytes": len(raw), "styles": [], "scripts": []}

for i, (attrs, body) in enumerate(style_re.findall(raw), 1):
    p = os.path.join(OUT, f"style-{i:02d}.css")
    open(p, "w", encoding="utf-8").write(body.strip())
    index["styles"].append({"file": os.path.basename(p), "attrs": attrs.strip(),
                            "chars": len(body), "lines_raw": body.count("\n") + 1})

for i, (attrs, body) in enumerate(script_re.findall(raw), 1):
    p = os.path.join(OUT, f"script-{i:02d}.js")
    open(p, "w", encoding="utf-8").write(body.strip())
    index["scripts"].append({"file": os.path.basename(p), "attrs": attrs.strip(),
                             "chars": len(body), "src": bool(re.search(r"\bsrc\s*=", attrs, re.I))})

m = head_re.search(raw)
if m:
    open(os.path.join(OUT, "head.html"), "w", encoding="utf-8").write(m.group(1).strip())

m = body_re.search(raw)
if m:
    body = m.group(1)
    body = style_re.sub(lambda x: "<style%s>/*<STYLE %d>*/</style>" % (x.group(1), 0), body)
    body = script_re.sub("<!--<SCRIPT %s>-->", body)
    open(os.path.join(OUT, "body.inline.html"), "w", encoding="utf-8").write(body.strip())

# whole-document skeleton: tags in order
skel = [{"tag": t, "attrs": a.strip()} for t, a in
        re.findall(r"<(script|style|div|html|head|body|link|meta)\b([^>]*)", raw, re.I)]
index["skeleton"] = skel[:60]
index["doc_lines"] = raw.count("\n") + 1
index["max_line_len"] = max((len(l) for l in raw.split("\n")), default=0)

open(os.path.join(OUT, "INDEX.json"), "w", encoding="utf-8").write(
    json.dumps(index, indent=2, ensure_ascii=False))
print(json.dumps({k: v for k, v in index.items() if k != "skeleton"}, indent=2, ensure_ascii=False))
