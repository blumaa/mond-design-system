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
  /** Every token holding this value, best first — when the caller knows more
      than the value, as a migration does: it also knows the name. */
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

  return {
    length: (value) => forLength(value)[0]?.name,
    color: (value) => forColor(value)[0]?.name,
    candidates: (value) => [...forLength(value), ...forColor(value)].map((token) => token.name),
  };
}

/** The tail of a finding: the token that already holds the value, or the advice. */
export const orAdvice = (token: string | undefined, advice: string) =>
  token === undefined ? advice : `var(${token}) has that value`;
