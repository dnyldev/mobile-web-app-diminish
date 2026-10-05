/**
 * The v6 demo catalogue.
 *
 * The original generated its 79 rows inline:
 *
 *   e = Array.from({ length: 79 }, (m, S) => {
 *     let N = Ll[S % Ll.length],
 *         z = S >= Ll.length ? ` ${Math.floor(S / Ll.length) + 1}` : "",
 *         M = N + z,
 *         x = $c[S % $c.length],
 *         Re = Hc[S % Hc.length],
 *         Tl = M[0].toUpperCase(),
 *         Rl = Math.floor(138 + Math.random() * 152),
 *         Yc = Math.floor(Rl / 60),
 *         Xc = Rl % 60,
 *         Gc = `${Yc}:${String(Xc).padStart(2, "0")}`;
 *     return { id: S, title: M, artist: x, gradient: Re, letter: Tl, durationStr: Gc, durationSec: Rl };
 *   }, [])
 *
 * `buildV6Tracks` reproduces that generator with the original's own JS
 * semantics, so the table it produces is identical row for row — except the
 * durations, which the original drew from `Math.random()` on every load and so
 * were never stable to begin with.
 *
 * Note on the source arrays: the original shipped **82** titles but asked for
 * only **79** rows, so `S % Ll.length` never wrapped and the `" 2"` overflow
 * branch never fired. Both are kept exactly as written — they are dead only
 * *given this row count*, so `buildV6Tracks(count)` stays correct for any count.
 */

/** Original `Ll` — 82 track titles. */
export const V6_TITLES = [
  "sang", "mamnoon", "pooste shir", "mamnoonam", "ghaf", "roze sefid",
  "khooneye arezoo", "parvaze ghooha", "betars", "midnight drift", "neon pulse", "amber haze",
  "cold river", "velvet morning", "static love", "afterglow", "paper planes", "hollow nights",
  "iron sky", "lumen", "echoes", "mercury retro", "saffron", "lone signal",
  "crystal", "north", "arcade", "silhouette", "parallax", "void",
  "atlas", "cinder", "nova", "obsidian", "halcyon", "driftwood",
  "kinetic", "moire", "solar", "lucid", "cerulean", "monolith",
  "oxide", "quartz", "cascade", "horizon", "nimbus", "sora",
  "helios", "aether", "vanta", "lattice", "prism", "umbra",
  "kairo", "tide", "fracture", "orbit", "ion", "pulse",
  "sable", "wren", "cobalt", "ember", "flint", "dusk",
  "aurora", "yara", "meridian", "zenith", "solace", "vertex",
  "lunar", "opal", "thicket", "boreal", "strata", "quill",
  "vessel", "ink", "mirage", "isle",
] as const;

/** Original `$c` — 25 artists; the index wraps. */
export const V6_ARTISTS = [
  "mojtaba daghighy", "shadmehr aghili", "ebi", "saman jalili", "alireza talischi",
  "haamim", "moein", "alireza ghorbani", "mohsen yegane", "arctic tones",
  "nova lane", "lumen field", "atlas club", "velvet cove", "solaris",
  "kairo", "halo drift", "cerulean", "opal", "thicket",
  "boreal", "sora bloom", "aether", "midnight society", "neon veil",
] as const;

/** Original `Hc` — 12 cover gradients; the index wraps. */
export const V6_GRADIENTS = [
  "linear-gradient(135deg,#3f3f46 0%,#18181b 55%,#09090b 100%)",
  "linear-gradient(135deg,#be123c 0%,#881337 55%,#4c0519 100%)",
  "linear-gradient(135deg,#991b1b 0%,#7c2d12 100%)",
  "linear-gradient(135deg,#065f46 0%,#022c22 50%,#111111 100%)",
  "linear-gradient(135deg,#166534 0%,#052e16 100%)",
  "linear-gradient(135deg,#27272a 0%,#000000 100%)",
  "linear-gradient(135deg,#78716c 0%,#1c1917 100%)",
  "linear-gradient(135deg,#1e293b 0%,#0f172a 100%)",
  "linear-gradient(135deg,#262626 0%,#0a0a0a 100%)",
  "linear-gradient(135deg,#4a044e 0%,#19011a 100%)",
  "linear-gradient(135deg,#0c4a6e 0%,#082f49 100%)",
  "linear-gradient(135deg,#365314 0%,#1a2e05 100%)",
] as const;

/** Original `Array.from({ length: 79 })`. */
export const V6_TRACK_COUNT = 79;

export interface V6Track {
  /** `id: S` — the row index, which is also the array index the sheet looks up. */
  id: number;
  title: string;
  artist: string;
  /** CSS `background` for the cover tile. */
  gradient: string;
  /** `M[0].toUpperCase()` */
  letter: string;
  /** `m:ss` */
  durationStr: string;
  /** length in seconds */
  durationSec: number;
}

/** Original: `Math.floor(138 + Math.random() * 152)` → 2:18 … 4:49. */
export function randomDurationSec(): number {
  return Math.floor(138 + Math.random() * 152);
}

export function buildV6Tracks(count: number = V6_TRACK_COUNT): V6Track[] {
  return Array.from({ length: count }, (_row, index) => {
    const base = V6_TITLES[index % V6_TITLES.length];
    const suffix =
      index >= V6_TITLES.length ? ` ${Math.floor(index / V6_TITLES.length) + 1}` : "";
    const title = base + suffix;
    const durationSec = randomDurationSec();

    return {
      id: index,
      title,
      artist: V6_ARTISTS[index % V6_ARTISTS.length],
      gradient: V6_GRADIENTS[index % V6_GRADIENTS.length],
      letter: title[0].toUpperCase(),
      durationSec,
      durationStr: `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`,
    };
  });
}

/**
 * `m:ss` for a position — the sheet's own expression:
 *   `${Math.floor(i/100*a.durationSec/60)}:${String(Math.floor(i/100*a.durationSec%60)).padStart(2,"0")}`
 */
export function elapsedLabel(progress: number, durationSec: number): string {
  const seconds = (progress / 100) * durationSec;
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
