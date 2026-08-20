/* The token graph.
 *
 * One entry stylesheet in, every declaration out, arranged the way the system
 * is arranged: core scales underneath, the semantic contract on top of them,
 * and an app's brand file re-pointing the contract without ever being part of
 * it. Every other command reads this — the listing, the contrast gate, the
 * migration report — so the layering is stated here once and nowhere else.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { declarationsIn, flatten, type Declaration, type Theme } from "./css/parse.js";
import { parseColor, resolveVars, type TokenMap } from "./css/color.js";

export type Layer = "core" | "semantic" | "base" | "brand";
export type Kind = "color" | "length" | "number" | "font" | "other";

export type Token = {
  name: string;
  /** Where the token belongs, which is where the system declared it — a brand
      re-pointing a semantic alias does not move it into the brand layer. */
  layer: Layer;
  group: string;
  kind: Kind;
  /** System declarations, in cascade order. */
  declarations: Declaration[];
  /** Brand declarations that re-point it. Empty for an untouched token. */
  overriddenBy: Declaration[];
  /** Declarations that only apply under an at-rule — a second value, not a replacement. */
  conditional: Declaration[];
  /** As the system wrote it, before any brand. */
  raw: { light?: string; dark?: string };
  /** As it stands once the brand has loaded. */
  effective: { light?: string; dark?: string };
  references: string[];
  referencedBy: string[];
  /** Re-pointed by the dark scope. */
  flips: boolean;
};

export type Graph = {
  prefix: string;
  names(): string[];
  tokens(): Token[];
  get(name: string): Token | undefined;
  /** The value a browser would paint, var() chains followed. */
  resolve(name: string, theme: Theme): string;
  /** One flat map per theme, brand applied — what the color math takes. */
  map(theme: Theme): TokenMap;
  files: string[];
};

export type LoadOptions = {
  /** Entry stylesheet of the design system; its @imports are followed. */
  system: string;
  /** App-owned stylesheets, loaded after the system as the browser loads them. */
  brand?: string[];
  prefix?: string;
};

const IMPORT = /@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?/g;

/** Every file reachable from an entry, entry first, each visited once. */
export function expandImports(entry: string, seen = new Set<string>()): string[] {
  const file = resolvePath(entry);
  if (seen.has(file)) return [];
  seen.add(file);
  const source = readFileSync(file, "utf8");
  const out = [file];
  for (const m of source.matchAll(IMPORT)) {
    out.push(...expandImports(resolvePath(dirname(file), m[1]!), seen));
  }
  return out;
}

/* The layout of the tokens package is the only statement of which layer a file
   is. Nothing about a name says whether it is a scale step or a role. */
function layerOfFile(file: string): Layer {
  if (/[/\\]core[/\\][^/\\]+\.css$/.test(file)) return "core";
  if (/[/\\]semantic\.css$/.test(file)) return "semantic";
  if (/[/\\]base\.css$/.test(file)) return "base";
  return "brand";
}

function groupOf(name: string, layer: Layer, file: string, prefix: string): string {
  /* A core token is grouped by the scale it belongs to, and the file is the
     scale: spacing.css *is* the spacing scale. */
  if (layer === "core") return file.replace(/^.*[/\\]/, "").replace(/\.css$/, "");
  const stem = name.startsWith(prefix) ? name.slice(prefix.length) : name.replace(/^--/, "");
  return stem.split("-")[0] ?? stem;
}

function kindOf(resolved: string | undefined, map: TokenMap): Kind {
  if (resolved === undefined) return "other";
  try {
    parseColor(resolved, map);
    return "color";
  } catch {
    /* not a color; fall through to the shapes below */
  }
  if (/^-?[\d.]+(px|rem|em|ch|vh|vw|dvh|svh|%|s|ms|deg)$/.test(resolved)) return "length";
  if (/^calc\(/.test(resolved)) return "length";
  if (/^-?[\d.]+$/.test(resolved)) return "number";
  if (/(serif|sans-serif|monospace|system-ui|ui-)/.test(resolved)) return "font";
  return "other";
}

const referencesIn = (value: string | undefined): string[] =>
  value === undefined ? [] : [...value.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((m) => m[1]!);

export function loadGraph({ system, brand = [], prefix = "--mds-" }: LoadOptions): Graph {
  const systemFiles = expandImports(system);
  /* One `seen` across every brand entry: an app that passes both its token
     entry and the files that entry imports would otherwise read them twice. */
  const brandSeen = new Set(systemFiles);
  const brandFiles = brand.flatMap((b) => expandImports(b, brandSeen));

  const read = (file: string) => declarationsIn(readFileSync(file, "utf8"), file);
  const systemDecls = systemFiles.flatMap(read);
  const brandDecls = brandFiles.flatMap(read);
  const all = [...systemDecls, ...brandDecls];

  const maps: Record<Theme, TokenMap> = {
    light: flatten(all, "light"),
    dark: flatten(all, "dark"),
  };
  const systemMaps: Record<Theme, TokenMap> = {
    light: flatten(systemDecls, "light"),
    dark: flatten(systemDecls, "dark"),
  };

  const tokens = new Map<string, Token>();
  const layerOfName = new Map<string, Layer>();
  const fileOfName = new Map<string, string>();
  for (const d of systemDecls) {
    /* First declaration wins the layer: semantic.css aliasing a core step does
       not claim it, and a later re-declaration in the same file changes only
       the value. */
    if (!layerOfName.has(d.name)) {
      layerOfName.set(d.name, layerOfFile(d.file));
      fileOfName.set(d.name, d.file);
    }
  }

  for (const d of all) {
    const isBrand = !layerOfName.has(d.name) ? layerOfFile(d.file) === "brand" : brandFiles.includes(d.file);
    const layer = layerOfName.get(d.name) ?? layerOfFile(d.file);
    let token = tokens.get(d.name);
    if (!token) {
      token = {
        name: d.name,
        layer,
        group: groupOf(d.name, layer, fileOfName.get(d.name) ?? d.file, prefix),
        kind: "other",
        declarations: [],
        overriddenBy: [],
        conditional: [],
        raw: {},
        effective: {},
        references: [],
        referencedBy: [],
        flips: false,
      };
      tokens.set(d.name, token);
    }
    if (d.conditions.length > 0) token.conditional.push(d);
    else if (isBrand) token.overriddenBy.push(d);
    else token.declarations.push(d);
  }

  for (const token of tokens.values()) {
    for (const theme of ["light", "dark"] as const) {
      const raw = systemMaps[theme].get(token.name);
      const effective = maps[theme].get(token.name);
      if (raw !== undefined) token.raw[theme] = raw;
      if (effective !== undefined) token.effective[theme] = effective;
    }
    token.flips = token.effective.light !== token.effective.dark;
    token.references = [
      ...new Set([...referencesIn(token.effective.light), ...referencesIn(token.effective.dark)]),
    ].sort();
    let resolved: string | undefined;
    try {
      resolved = resolveVars(token.effective.light ?? "", maps.light);
    } catch {
      /* an unresolvable value has no kind; `dsbridge check` is where that is a finding */
    }
    token.kind = kindOf(resolved, maps.light);
  }

  for (const token of tokens.values()) {
    for (const ref of token.references) {
      tokens.get(ref)?.referencedBy.push(token.name);
    }
  }
  for (const token of tokens.values()) token.referencedBy.sort();

  return {
    prefix,
    files: [...systemFiles, ...brandFiles],
    names: () => [...tokens.keys()],
    tokens: () => [...tokens.values()],
    get: (name) => tokens.get(name),
    resolve: (name, theme) => {
      const value = maps[theme].get(name);
      if (value === undefined) throw new Error(`undeclared token ${name}`);
      return resolveVars(value, maps[theme]);
    },
    map: (theme) => maps[theme],
  };
}
