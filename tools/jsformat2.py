#!/usr/bin/env python3
"""Lossless JS re-indenter for reading minified bundles.

Guarantees: only whitespace OUTSIDE tokens is changed. String/template/regex/
comment bodies are copied byte-for-byte. The script self-verifies by
re-tokenizing its own output and comparing the token stream to the input's;
it exits non-zero on any mismatch.

Usage: jsformat2.py <in.js> <out.js>
"""
import sys

PUNCT_2 = ("=>", "===", "!==", "**", "&&", "||", "??", "?.", "++", "--",
           "+=", "-=", "*=", "/=", "%=", "==", "!=", "<=", ">=", "<<", ">>")
REGEX_PREV_CHARS = set("(,=:[!&|?{};+-*%~^<>")
REGEX_PREV_WORDS = {"return", "typeof", "instanceof", "in", "of", "new", "delete",
                    "void", "do", "else", "case", "yield", "await", "throw"}
IDENT = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$")


def tokenize(src):
    """Return list of (kind, text). Kinds: ws, comment, str, template, regex, num, name, op."""
    out, i, n = [], 0, len(src)
    prev_sig = None  # last non-ws token text

    def push(kind, text):
        nonlocal prev_sig
        out.append((kind, text))
        if kind != "comment":
            prev_sig = text

    def read_string(pos, q):
        j = pos + 1
        while j < n:
            c = src[j]
            if c == "\\":
                j += 2
                continue
            if c == q:
                return j + 1
            if c == "\n":
                return j  # unterminated: stop at newline
            j += 1
        return j

    def read_template(j):
        """j points just after the opening backtick. Handles ${ } nesting."""
        while j < n:
            c = src[j]
            if c == "\\":
                j += 2
                continue
            if c == "`":
                return j + 1
            if c == "$" and j + 1 < n and src[j + 1] == "{":
                j = skip_balanced_braces(j + 1)
                continue
            j += 1
        return j

    def skip_balanced_braces(j):
        """j points at '{'. Returns index just past its matching '}'.
        Recurses into nested strings/templates/regex so braces inside them don't count."""
        depth = 0
        while j < n:
            c = src[j]
            if c in "\"'":
                j = read_string(j, c)
                continue
            if c == "`":
                j = read_template(j + 1)
                continue
            if c == "/" and j + 1 < n and src[j + 1] in "/*":
                j = read_comment(j)
                continue
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return j + 1
            j += 1
        return j

    def read_comment(j):
        if src[j + 1] == "/":
            k = src.find("\n", j)
            return n if k < 0 else k
        k = src.find("*/", j + 2)
        return n if k < 0 else k + 2

    def regex_allowed(p):
        if p is None:
            return True
        if p in REGEX_PREV_WORDS:
            return True
        if len(p) == 1 and p in REGEX_PREV_CHARS:
            return True
        return False

    def read_regex(j):
        """j at '/'. Returns end index or None if it isn't a valid regex literal."""
        k = j + 1
        in_class = False
        while k < n:
            c = src[k]
            if c == "\\":
                k += 2
                continue
            if c == "\n":
                return None
            if c == "[":
                in_class = True
            elif c == "]":
                in_class = False
            elif c == "/" and not in_class:
                k += 1
                while k < n and src[k] in "gimsuyvd":
                    k += 1
                return k
            k += 1
        return None

    while i < n:
        _start_i = i
        c = src[i]
        if c in " \t\r\n\f\v\u00a0\ufeff":
            j = i
            while j < n and src[j] in " \t\r\n\f\v\u00a0\ufeff":
                j += 1
            out.append(("ws", src[i:j]))
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] in "/*":
            j = read_comment(i)
            push("comment", src[i:j])
            i = j
            continue
        if c in "\"'":
            j = read_string(i, c)
            push("str", src[i:j])
            i = j
            continue
        if c == "`":
            j = read_template(i + 1)
            push("template", src[i:j])
            i = j
            continue
        if c == "/" and regex_allowed(prev_sig):
            j = read_regex(i)
            if j:
                push("regex", src[i:j])
                i = j
                continue
        if c.isdigit() or (c == "." and i + 1 < n and src[i + 1].isdigit()):
            j = i
            if src.startswith(("0x", "0X", "0b", "0B", "0o", "0O"), i):
                j = i + 2
                while j < n and src[j] in IDENT:
                    j += 1
            else:
                while j < n and src[j].isdigit():
                    j += 1
                if j < n and src[j] == ".":
                    j += 1
                    while j < n and src[j].isdigit():
                        j += 1
                if j < n and src[j] in "eE":
                    k = j + 1
                    if k < n and src[k] in "+-":
                        k += 1
                    if k < n and src[k].isdigit():
                        j = k
                        while j < n and src[j].isdigit():
                            j += 1
                if j < n and src[j] == "n":
                    j += 1
            push("num", src[i:j])
            i = j
            continue
        if c in IDENT:
            j = i
            while j < n and src[j] in IDENT:
                j += 1
            push("name", src[i:j])
            i = j
            continue
        for p in PUNCT_2:
            if src.startswith(p, i):
                push("op", p)
                i += len(p)
                break
        else:
            push("op", c)
            i += 1
        if i <= _start_i:
            raise RuntimeError(
                f"tokenizer stuck at {_start_i}: {src[max(0,_start_i-60):_start_i+120]!r}"
            )
    return out


def significant(tokens):
    return [(k, t) for k, t in tokens if k != "ws"]


def _needs_space(prev, nxt):
    """True when dropping the whitespace between two tokens would change their meaning."""
    if not prev or not nxt:
        return False
    pc, nc = prev[-1], nxt[0]
    if pc in IDENT and nc in IDENT:
        return True
    if pc == "+" and nc == "+":
        return True
    if pc == "-" and nc == "-":
        return True
    if pc == "/" and nc in "/*":
        return True
    return False


def reindent(src, indent="  "):
    toks = significant(tokenize(src))
    lines, cur, depth = [], [], 0
    MAX = 118

    def flush():
        if cur:
            lines.append(indent * depth + "".join(cur))
            cur.clear()

    def add(text):
        if cur and _needs_space(cur[-1], text):
            cur.append(" ")
        cur.append(text)

    i = 0
    while i < len(toks):
        kind, text = toks[i]
        if kind == "comment":
            add(text)
            flush()
            i += 1
            continue

        if text == "}" and kind == "op":
            flush()
            depth = max(0, depth - 1)
            add("}")
            i += 1
            # trailing , ; ) etc. attach
            continue

        # one JSX element per line: break before L(...) / Me(...) / createElement(...)
        if (kind == "name" and text in ("L", "Me", "createElement")
                and i + 1 < len(toks) and toks[i + 1][1] == "(" and cur):
            flush()

        add(text)

        if kind == "op" and text in (";", "{", "}"):
            flush()
            if text == "{":
                depth += 1
            i += 1
            continue

        if kind == "op" and text == ",":
            if len("".join(cur)) > MAX:
                flush()
            i += 1
            continue

        i += 1
        if len("".join(cur)) > MAX + 40:
            flush()
    flush()
    return "\n".join(lines) + "\n"


def verify(original, formatted):
    a = significant(tokenize(original))
    b = significant(tokenize(formatted))
    if a == b:
        return True, None
    for idx, (x, y) in enumerate(zip(a, b)):
        if x != y:
            return False, (idx, x, y, a[max(0, idx - 3):idx + 3], b[max(0, idx - 3):idx + 3])
    return False, ("length mismatch", len(a), len(b), a[len(b):len(b) + 5], b[len(a):len(a) + 5])


if __name__ == "__main__":
    src = open(sys.argv[1], encoding="utf-8").read()
    out_src = reindent(src)
    open(sys.argv[2], "w", encoding="utf-8").write(out_src)
    ok, detail = verify(src, out_src)
    print("LOSSLESS:", ok)
    if not ok:
        print("MISMATCH:", detail)
        sys.exit(1)
    print("in_tokens:", len(significant(tokenize(src))), "out_tokens:", len(significant(tokenize(out_src))))
    print("lines:", out_src.count("\n"))
