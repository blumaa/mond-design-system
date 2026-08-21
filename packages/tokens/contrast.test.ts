/* WCAG contrast gate. Resolves the token graph from the CSS source itself —
 * semantic.css light + dark — so a value edit cannot pass review while
 * breaking AA. Text 4.5:1, UI (borders, focus ring) 3:1.
 *
 * Handles: hex, rgb()/rgba(), transparent, var() chains, color-mix(in oklab)
 * (premultiplied, per spec), alpha compositing over the backdrop.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "src");

type RGBA = { r: number; g: number; b: number; a: number };
type TokenMap = Map<string, string>;

/* ── CSS parsing ─────────────────────────────────────────────────────────── */

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, " ");

/* Top-level blocks: selector { declarations }. @media blocks skipped —
 * reduced-motion only, no color lives there. */
function blocks(css: string): Array<{ selector: string; body: string }> {
  const out: Array<{ selector: string; body: string }> = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      if (css[j] === "}") depth--;
      j++;
    }
    const selector = css.slice(i, open).trim();
    const body = css.slice(open + 1, j - 1);
    if (!selector.startsWith("@")) out.push({ selector, body });
    i = j;
  }
  return out;
}

function declarations(body: string): TokenMap {
  const map: TokenMap = new Map();
  for (const m of body.matchAll(/(--mds-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(m[1]!, m[2]!.trim());
  }
  return map;
}

/* Build one flat map per theme. Dark overlays light: lazy resolution at
 * lookup time gives the same result as the browser's per-scope re-point for
 * a file that re-declares its derived mixes in the dark scope. */
function themeMaps(css: string): { light: TokenMap; dark: TokenMap } {
  const light: TokenMap = new Map();
  const darkOnly: TokenMap = new Map();
  for (const { selector, body } of blocks(stripComments(css))) {
    const decls = declarations(body);
    const isDark = selector.includes('[data-theme="dark"]');
    for (const [k, v] of decls) (isDark ? darkOnly : light).set(k, v);
  }
  const dark = new Map(light);
  for (const [k, v] of darkOnly) dark.set(k, v);
  return { light, dark };
}

/* ── Color math ──────────────────────────────────────────────────────────── */

function hex(s: string): RGBA | null {
  const m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (!m) return null;
  const h = m[1]!;
  const pick = (i: number, len: number) =>
    len <= 4 ? parseInt(h[i]! + h[i]!, 16) : parseInt(h.slice(i * 2, i * 2 + 2), 16);
  const a = h.length === 4 ? pick(3, 4) / 255 : h.length === 8 ? pick(3, 8) / 255 : 1;
  return { r: pick(0, h.length), g: pick(1, h.length), b: pick(2, h.length), a };
}

function rgbFn(s: string): RGBA | null {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/.exec(s);
  if (!m) return null;
  const a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  return { r: +m[1]!, g: +m[2]!, b: +m[3]!, a };
}

const srgbToLin = (c: number) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};
const linToSrgb = (x: number) => {
  const c = x <= 0.0031308 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, c * 255));
};

function toOklab({ r, g, b }: RGBA): [number, number, number] {
  const [lr, lg, lb] = [srgbToLin(r), srgbToLin(g), srgbToLin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, A, B]: [number, number, number], a: number): RGBA {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: linToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    a,
  };
}

/* color-mix(in oklab, C1 p1%, C2 p2%) — premultiplied alpha, per spec. */
function mixOklab(c1: RGBA, w1: number, c2: RGBA, w2: number): RGBA {
  const a = w1 * c1.a + w2 * c2.a;
  const [l1, a1, b1] = toOklab(c1);
  const [l2, a2, b2] = toOklab(c2);
  const pm = (x1: number, x2: number) =>
    a === 0 ? 0 : (w1 * c1.a * x1 + w2 * c2.a * x2) / a;
  return fromOklab([pm(l1, l2), pm(a1, a2), pm(b1, b2)], a);
}

/* Split "A 30%, B" style args at top-level commas. */
function splitArgs(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function parseColor(value: string, map: TokenMap): RGBA {
  const v = resolveVars(value, map).trim();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (v === "white") return { r: 255, g: 255, b: 255, a: 1 };
  if (v === "black") return { r: 0, g: 0, b: 0, a: 1 };
  const h = hex(v);
  if (h) return h;
  const rgb = rgbFn(v);
  if (rgb) return rgb;
  const mix = /^color-mix\(\s*in\s+oklab\s*,(.+)\)$/s.exec(v);
  if (mix) {
    const [p1, p2] = splitArgs(mix[1]!);
    if (!p1 || !p2) throw new Error(`color-mix needs two colors: ${v}`);
    const pct = (part: string): { color: string; pct: number | null } => {
      const m = /^(.*?)\s+([\d.]+)%$/s.exec(part);
      return m ? { color: m[1]!.trim(), pct: +m[2]! / 100 } : { color: part, pct: null };
    };
    const A = pct(p1);
    const B = pct(p2);
    const wA = A.pct ?? (B.pct !== null ? 1 - B.pct : 0.5);
    const wB = B.pct ?? 1 - wA;
    return mixOklab(parseColor(A.color, map), wA, parseColor(B.color, map), wB);
  }
  throw new Error(`unparseable color: "${value}" -> "${v}"`);
}

function resolveVars(value: string, map: TokenMap, depth = 0): string {
  if (depth > 32) throw new Error(`var() cycle in: ${value}`);
  return value.replace(/var\(\s*(--mds-[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)/g, (_, name, fb) => {
    const next = map.get(name) ?? fb;
    if (next === undefined) throw new Error(`undefined token ${name}`);
    return resolveVars(next, map, depth + 1);
  });
}

/* ── WCAG ────────────────────────────────────────────────────────────────── */

const luminance = ({ r, g, b }: RGBA) =>
  0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);

const composite = (fg: RGBA, bg: RGBA): RGBA => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});

function contrast(map: TokenMap, fgToken: string, bgToken: string): number {
  let bg = parseColor(map.get(bgToken) ?? bgToken, map);
  if (bg.a < 1) bg = composite(bg, parseColor(map.get("--mds-surface-page")!, map));
  const fg = composite(parseColor(map.get(fgToken) ?? fgToken, map), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

/* ── The matrix ──────────────────────────────────────────────────────────── */

/* The pair list is data the package ships. `dsbridge check` re-runs exactly these
   against a consuming app's brand, which is where the proof has to hold and
   where nothing else re-establishes it: a brand re-points every token in the
   matrix, so the defaults being accessible says nothing about the app. Editing
   contract.json changes both proofs at once. */
type Contract = { contrast: Array<{ fg: string; bg: string[]; ratio: number }> };
const contract = JSON.parse(readFileSync(join(SRC, "dsbridge", "contract.json"), "utf8")) as Contract;
const PAIRS = contract.contrast.flatMap(({ fg, bg, ratio }) => bg.map((b) => [fg, b, ratio] as const));

const semantic = readFileSync(join(SRC, "semantic.css"), "utf8");
const maps = themeMaps(semantic);

describe.each(["light", "dark"] as const)("mond default brand — %s", (theme) => {
  const map = maps[theme];

  it.each(PAIRS)("%s on %s >= %s:1", (fg, bg, ratio) => {
    expect(contrast(map, fg, bg)).toBeGreaterThanOrEqual(ratio);
  });
});

describe("brand template", () => {
  const template = stripComments(readFileSync(join(SRC, "brand-template.css"), "utf8"));

  it("covers the full semantic contract in its light block", () => {
    const contractTokens = [...maps.light.keys()];
    const declared = new Set(
      [...template.matchAll(/(--mds-[a-z0-9-]+)\s*:/g)].map((m) => m[1]!),
    );
    const missing = contractTokens.filter((t) => !declared.has(t));
    expect(missing).toEqual([]);
  });

  it("ships a dark scope", () => {
    expect(template).toContain('[data-theme="dark"]');
  });
});

/* The resolver's own math — paths the mond defaults don't exercise yet
   (color-mix, alpha compositing, var fallbacks) proven here, not on faith. */
describe("color resolution", () => {
  const map = (entries: Record<string, string>): TokenMap => new Map(Object.entries(entries));

  it("resolves var() chains through color-mix(in oklab)", () => {
    const m = map({
      "--mds-surface-page": "#ffffff",
      "--mds-base": "#ffffff",
      "--mds-derived": "color-mix(in oklab, var(--mds-base), #ffffff 100%)",
    });
    expect(contrast(m, "--mds-derived", "#000000")).toBeCloseTo(21, 1);
  });

  it("mixes toward the midpoint in oklab", () => {
    const m = map({ "--mds-surface-page": "#ffffff" });
    const mid = parseColor("color-mix(in oklab, #000000, #ffffff)", m);
    expect(mid.r).toBeCloseTo(mid.g, 3);
    expect(mid.g).toBeCloseTo(mid.b, 3);
    expect(mid.r).toBeGreaterThan(90);
    expect(mid.r).toBeLessThan(130);
  });

  it("premultiplies alpha when mixing with transparent", () => {
    const m = map({ "--mds-surface-page": "#ffffff" });
    const c = parseColor("color-mix(in oklab, #ff0000 50%, transparent)", m);
    expect(c.a).toBeCloseTo(0.5, 5);
    expect(c.r).toBeGreaterThan(250); /* hue survives, only alpha drops */
  });

  it("composites translucent foregrounds over the backdrop", () => {
    const m = map({ "--mds-surface-page": "#ffffff" });
    const ratio = contrast(m, "rgb(0 0 0 / 0.5)", "#ffffff");
    expect(ratio).toBeGreaterThan(3.5);
    expect(ratio).toBeLessThan(4.5);
  });

  it("composites a translucent background over the page first", () => {
    const m = map({
      "--mds-surface-page": "#ffffff",
      "--mds-soft": "rgb(0 0 0 / 0.1)",
    });
    /* black text on a 10% black wash over white — near-max contrast */
    expect(contrast(m, "#000000", "--mds-soft")).toBeGreaterThan(15);
  });
});
