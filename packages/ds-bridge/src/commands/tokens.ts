/* `dsbridge tokens` — the listing.
 *
 * Every token, in the layers they stack in, with the value the browser paints
 * and the alias it came through. The alias is the part worth reading: a
 * semantic token whose value is a literal rather than a core step is a token
 * that a brand cannot move, and that only shows up next to its resolved value.
 */
import { parseColor, type RGBA } from "../css/color.js";
import type { Graph, Kind, Layer, Token } from "../graph.js";
import type { Theme } from "../css/parse.js";
import { bold, dim, ESC } from "../text.js";

export type RenderOptions = {
  theme?: Theme;
  layer?: Layer;
  group?: string;
  kind?: Kind;
  /** Substring match on the name. */
  grep?: string;
  color?: boolean;
};

/** The order the layers load in, which is the order they override in. */
const LAYERS: Layer[] = ["core", "semantic", "base", "brand"];

const swatch = ({ r, g, b }: RGBA, on: boolean) =>
  on ? `${ESC}48;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m  ${ESC}0m ` : "";

export function selectTokens(graph: Graph, options: RenderOptions): Token[] {
  return graph.tokens().filter((t) => {
    if (options.layer && t.layer !== options.layer) return false;
    if (options.group && t.group !== options.group) return false;
    if (options.kind && t.kind !== options.kind) return false;
    if (options.grep && !t.name.includes(options.grep)) return false;
    return true;
  });
}

export function renderTokens(graph: Graph, options: RenderOptions = {}): string {
  const theme = options.theme ?? "light";
  const color = options.color ?? true;
  const chosen = selectTokens(graph, options);
  if (chosen.length === 0) return "no tokens match that filter\n";

  const width = Math.max(...chosen.map((t) => t.name.length));
  const lines: string[] = [];
  const groups = new Map<string, Token[]>();
  for (const token of chosen) {
    const key = `${token.layer} ${token.group}`;
    groups.set(key, [...(groups.get(key) ?? []), token]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => {
    const [la, ga] = a.split(" ") as [Layer, string];
    const [lb, gb] = b.split(" ") as [Layer, string];
    return LAYERS.indexOf(la) - LAYERS.indexOf(lb) || ga.localeCompare(gb);
  });

  for (const [key, tokens] of ordered) {
    const [layer, group] = key.split(" ");
    lines.push("");
    lines.push(bold(`${layer} · ${group} (${tokens.length})`, color));
    for (const token of tokens) lines.push(line(graph, token, theme, width, color));
  }

  lines.push("");
  lines.push(dim(`${chosen.length} tokens · ${ordered.length} groups · ${theme}`, color));
  return lines.join("\n") + "\n";
}

function line(graph: Graph, token: Token, theme: Theme, width: number, color: boolean): string {
  const raw = token.effective[theme] ?? token.effective.light;
  let value: string;
  let mark = "";
  try {
    value = graph.resolve(token.name, theme);
    if (token.kind === "color") mark = swatch(parseColor(value, graph.map(theme)), color);
  } catch {
    value = `${raw ?? "?"} (unresolved)`;
  }

  const notes: string[] = [];
  /* The alias, not the value it landed on: a brand moves aliases, so this is
     the column that says whether it can. */
  if (raw !== undefined && raw !== value) notes.push(dim(`← ${raw}`, color));
  if (token.overriddenBy.length > 0) {
    notes.push(dim(`[brand: ${token.overriddenBy[0]!.file.replace(/^.*[/\\]/, "")}]`, color));
  }
  if (token.referencedBy.length > 0) {
    const n = token.referencedBy.length;
    notes.push(dim(`${n} reader${n === 1 ? "" : "s"}`, color));
  }
  const head = `  ${token.name.padEnd(width)}  ${mark}${value}`;
  const body = notes.length > 0 ? `${head}  ${notes.join("  ")}` : head;
  const conditions = token.conditional.map(
    (d) => `\n  ${" ".repeat(width)}  ${dim(`${d.conditions.join(" ")} → ${d.value}`, color)}`,
  );
  return body + conditions.join("");
}
