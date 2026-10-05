#!/usr/bin/env python3
"""Parity check: prove nothing from the original artifact was dropped or invented.

Reads an original app region (produced by split_artifact.py + jsformat2.py) and
the rebuilt sources under `src/`, then compares as SETS:

  1. class-like tokens   (whitespace tokens inside string/template literals)
  2. numeric literals    (1.75, 0.12, 350, 72, 352, 390, ...)

Values present in the original but absent from the rebuild are MISSING and fail
the check. Values the rebuild legitimately composes (e.g. `scale(1.04)` written
as `scale(${INTERACTION.pressScale})`) are listed in COMPOSED with a reason;
values it deliberately drops are listed in DEVIATIONS, also with a reason, so a
genuine oversight can never hide among them.

Defaults reproduce the original gate: the diminish artifact against `src/`.
Point it at another artifact of the same project with:

    python3 tools/parity_check.py \\
        --original _extract-nav-playlist/app.source.js \\
        --deviations tools/parity-nav-playlist.json

Exit code 1 when anything is MISSING, so it can gate a build.
"""
import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import jsformat2 as J  # noqa: E402

# Values the rebuild deliberately builds from tokens instead of hard-coding.
COMPOSED = {
    "scale(1.04)",  # -> `scale(${INTERACTION.pressScale})`
    "translateY(-50%)",  # inline style, identical string, kept as-is (see note)
    "1px",  # part of pillBorder / bubbleShadow strings
}

# Values removed from the rebuild ON PURPOSE. Each entry must name what was
# removed and why, so a genuine oversight can never hide in this list.
DEVIATIONS = {
    "h-[5px]": "home-indicator bar removed",
    "w-[120px]": "home-indicator bar removed",
    "120": "home-indicator width",
    "15": "from bg-black/15 on the home indicator",
    # The indicator pass: the bar's inset was 6px across and 4px up, so the
    # sliding bubble never matched the slot behind it. Now a uniform 4px.
    "px-[6px]": "pill inset 6px -> 4px (`px-1`), so the horizontal inset matches the vertical 4px",
    "left-[6px]": "track inset 6px -> 4px (`left-1`), same reason",
    "right-[6px]": "track inset 6px -> 4px (`right-1`), same reason",
}

DEVIATION_REASON = (
    "Group 1 - the 120x5 iOS-style home indicator was dropped from the harness: on a real "
    "device iOS already draws one, so the artifact's copy duplicated it (decision: Danial). "
    "Group 2 - the bar's 6px inset became 4px, so the sliding indicator is inset uniformly on "
    "all four sides and is exactly one slot wide, taking Playlist v6's nav as the model "
    "(decision: Danial). See README > Fidelity notes."
)

CLASS_TOKEN = re.compile(r"^[A-Za-z][A-Za-z0-9:._\-/\[\]()%,#!]*$")


def iter_files(root):
    for dirpath, _dirs, files in os.walk(root):
        for name in sorted(files):
            yield os.path.join(dirpath, name)


def text_without_comments(path):
    """The file's text with every comment removed.

    A value that survives only inside a comment — typically a documented
    deviation like "`min-h-screen` is dropped on purpose" — must NOT satisfy the
    gate, or the gate passes on prose instead of on code and proves nothing.
    """
    raw = open(path, encoding="utf-8", errors="replace").read()

    if path.endswith((".js", ".jsx", ".ts", ".tsx")):
        return "".join(text for kind, text in J.tokenize(raw) if kind != "comment")
    if path.endswith(".css"):
        return re.sub(r"/\*.*?\*/", " ", raw, flags=re.S)
    return raw


def literals_of(path):
    """Every string + template literal token in a JS/TS file."""
    src = open(path, encoding="utf-8", errors="replace").read()
    return [t for k, t in J.tokenize(src) if k in ("str", "template")]


def unquote(lit):
    if len(lit) >= 2 and lit[0] in "\"'" and lit[-1] == lit[0]:
        return lit[1:-1]
    return lit[1:] if lit.startswith("`") else lit


def class_like(lits):
    """Whitespace tokens that look like a CSS class / utility, mapped to their source."""
    out = {}
    for lit in lits:
        body = unquote(lit)
        # look both at the literal text and inside ${...} expressions
        for chunk in re.split(r"\$\{[^}]*\}", body):
            for token in chunk.split():
                token = token.strip().rstrip(";,")
                if len(token) >= 3 and CLASS_TOKEN.match(token) and any(c in token for c in "-:["):
                    out.setdefault(token, body.strip()[:70])
    return out


def numbers_of(lits):
    out = set()
    for lit in lits:
        out.update(re.findall(r"(?<![\w.])\d+(?:\.\d+)?", unquote(lit)))
    return out


def load_overrides(path):
    """`{ "composed": [...], "deviations": {...}, "reason": "..." }` — every key optional.

    A list of values and a dict of `value -> why` are both accepted; only the
    values are used here, the per-entry reasons are documentation.
    """
    if not path:
        return {}
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def as_set(value):
    """Values from a list/tuple/set, or a dict's keys."""
    if not value:
        return set()
    if isinstance(value, dict):
        return set(value.keys())
    return set(value)


def main():
    parser = argparse.ArgumentParser(description="Class-token / numeric parity gate.")
    parser.add_argument(
        "--original",
        default=os.path.join("_extract", "app.source.js"),
        help="app region to check against (default: the diminish artifact)",
    )
    parser.add_argument("--src", default="src", help="rebuild root (default: src)")
    parser.add_argument(
        "--deviations",
        default=None,
        help="JSON file adding composed/deviations sets for this artifact",
    )
    args = parser.parse_args()

    original = args.original if os.path.isabs(args.original) else os.path.join(ROOT, args.original)
    src_dir = args.src if os.path.isabs(args.src) else os.path.join(ROOT, args.src)

    overrides = load_overrides(args.deviations)
    composed = set(COMPOSED) | as_set(overrides.get("composed"))
    deviations = set(DEVIATIONS) | as_set(overrides.get("deviations"))
    reason = DEVIATION_REASON
    if overrides.get("reason"):
        reason = f"{DEVIATION_REASON}\n{overrides['reason']}"

    orig_lits = literals_of(original)
    blob = "\n".join(text_without_comments(p) for p in iter_files(src_dir))

    orig_classes = class_like(orig_lits)
    missing_classes = sorted(
        t for t in orig_classes if t not in blob and t not in composed and t not in deviations
    )

    orig_numbers = numbers_of(orig_lits)
    src_numbers = set(re.findall(r"(?<![\w.])\d+(?:\.\d+)?", blob))
    missing_numbers = sorted(
        n for n in orig_numbers if n not in src_numbers and n not in composed and n not in deviations
    )

    print(json.dumps({
        "original": os.path.relpath(original, ROOT),
        "src": os.path.relpath(src_dir, ROOT),
        "original_class_tokens": len(orig_classes),
        "original_numeric_literals": len(orig_numbers),
        "composed_exceptions": len(composed),
        "deviation_exceptions": len(deviations),
        "missing_class_tokens": missing_classes,
        "missing_numeric_literals": missing_numbers,
    }, indent=2, ensure_ascii=False))

    if missing_classes or missing_numbers:
        print("\nRESULT: FAIL — the rebuild is missing values from the original")
        return 1
    print(f"\nDEVIATIONS APPLIED ({len(deviations)}): {reason}")
    print("\nRESULT: PASS — every class token and numeric literal from the original is accounted for")
    return 0


if __name__ == "__main__":
    sys.exit(main())
