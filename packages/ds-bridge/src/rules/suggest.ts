/* What to write instead of the literal.
 *
 * A finding that only says "use a token" leaves the reader to search for which
 * one. The graph already knows every token's resolved value, so an exact match
 * is a lookup — and an exact match is the honest bar: a token that happens to
 * hold the same value is a candidate, not a verdict, which is why the message
 * says the token *has* that value rather than telling anyone to use it.
 */
import { parseColor } from "../css/color.js";
import type { Graph, Token } from "../graph.js";
import type { Theme } from "../css/parse.js";

/** Rungs are the last resort: naming a role is the point of the suggestion. */
const rank = (token: Token, isRung: boolean): number =>
  ({ semantic: 0, base: 1, core: isRung ? 3 : 2, brand: 4 })[token.layer];

const LENGTH = /^-?[0-9.]+(?:px|rem|em)$/;

export type Index = {
  /** A token holding exactly this length, if one does. */
  length(value: string): string | undefined;
  /** A token painting exactly this colour, if one does. */
  color(value: string): string | undefined;
  /** Every token holding this length, best first. */
  lengths(value: string): string[];
  /** Every token painting this colour, best first. */
  colors(value: string): string[];
  /** Both, for a caller that knows the name as well as the value — a migration
      matching `--app-gap` against the system does. */
  candidates(value: string): string[];
};

export function valueIndex(
  graph: Graph,
  theme: Theme = "light",
  isRung: (name: string) => boolean = () => false,
): Index {
  const lengths = new Map<string, Token[]>();
  const colors = new Map<string, Token[]>();

  /* Ranked, not reduced: the head is the suggestion, the tail is the choice. */
  const keep = (into: Map<string, Token[]>, key: string, token: Token) => {
    const kept = [...(into.get(key) ?? []), token];
    kept.sort((a, b) => rank(a, isRung(a.name)) - rank(b, isRung(b.name)));
    into.set(key, kept);
  };

  const map = graph.map(theme);
  for (const token of graph.tokens()) {
    if (!token.name.startsWith(graph.prefix)) continue;
    let value: string;
    try {
      value = graph.resolve(token.name, theme).trim();
    } catch {
      continue;
    }
    if (LENGTH.test(value)) keep(lengths, value, token);
    if (token.kind === "color") {
      try {
        const { r, g, b, a } = parseColor(value, map);
        keep(colors, `${Math.round(r)},${Math.round(g)},${Math.round(b)},${a}`, token);
      } catch {
        /* A colour that will not resolve cannot be suggested. */
      }
    }
  }

  const colorKey = (value: string) => {
    try {
      const { r, g, b, a } = parseColor(value.trim(), map);
      return `${Math.round(r)},${Math.round(g)},${Math.round(b)},${a}`;
    } catch {
      return undefined;
    }
  };
  const forColor = (value: string) => {
    const key = colorKey(value);
    return key === undefined ? [] : (colors.get(key) ?? []);
  };
  const forLength = (value: string) => lengths.get(value.trim()) ?? [];

  const names = (tokens: Token[]) => tokens.map((token) => token.name);
  return {
    length: (value) => forLength(value)[0]?.name,
    color: (value) => forColor(value)[0]?.name,
    lengths: (value) => names(forLength(value)),
    colors: (value) => names(forColor(value)),
    candidates: (value) => names([...forLength(value), ...forColor(value)]),
  };
}

/** The tail of a finding: the token that already holds the value, or the advice. */
export const orAdvice = (token: string | undefined, advice: string) =>
  token === undefined ? advice : `var(${token}) has that value`;

/**
 * How sure the tool is about what was meant.
 *
 * `certain` is the only one a fix may act on. `value-only` is the honest name
 * for the match this tool made before any token declared what it is *for*:
 * several tokens hold the value and nothing yet distinguishes them, so naming
 * one of them would be a coin flip printed with the authority of a fact.
 */
export type Confidence = "certain" | "ambiguous" | "value-only" | "none";

export type Suggestion = {
  /** Every token that could be meant, best first. */
  candidates: string[];
  confidence: Confidence;
  /** What to write instead, when exactly one thing can be meant. */
  autofix?: string;
  /** The tail of the finding's message. */
  advice: string;
};

/** Named in the message; the rest are counted. The whole list is in the JSON. */
const NAMED = 4;

export type SuggestOptions = {
  /** What to say when no token holds the value at all. */
  advice: string;
  /** How a token becomes the replacement: `var(--x)` for nearly everything,
      `calc(-1 * var(--x))` where the literal was negative. */
  write?: (token: string) => string;
  /** How to say it when exactly one token can be meant. */
  say?: (replacement: string) => string;
};

/** A finding's tail, from the tokens that hold the value. */
export function suggest(candidates: string[], options: SuggestOptions): Suggestion {
  const { advice, write = (token: string) => `var(${token})`, say = (r: string) => `${r} has that value` } =
    options;
  const [first, ...rest] = candidates;
  if (first === undefined) return { candidates, confidence: "none", advice };
  if (rest.length === 0) {
    return { candidates, confidence: "certain", autofix: write(first), advice: say(write(first)) };
  }
  const shown = candidates.slice(0, NAMED);
  const more = candidates.length - shown.length;
  const tail = more > 0 ? `, and ${more} more` : "";
  return {
    candidates,
    confidence: "value-only",
    advice: `${candidates.length} tokens hold it: ${shown.join(", ")}${tail} — use the one that names the role`,
  };
}
