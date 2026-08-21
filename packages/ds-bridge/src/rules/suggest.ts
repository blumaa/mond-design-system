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
  /** The tokens whose role answers the property this value was written for.
      Absent where there is no property to ask about — a `style` prop holding a
      string, a system that published no roles. */
  claims?: Set<string>;
  /** How a token becomes the replacement: `var(--x)` for nearly everything,
      `calc(-1 * var(--x))` where the literal was negative. */
  write?: (token: string) => string;
  /** How to say it when exactly one token can be meant. */
  say?: (replacement: string) => string;
};

/** The first few, and a count for the rest — the whole list is in the JSON. */
const listed = (tokens: string[]) => {
  const shown = tokens.slice(0, NAMED);
  const more = tokens.length - shown.length;
  return `${shown.join(", ")}${more > 0 ? `, and ${more} more` : ""}`;
};

/** A finding's tail, from the tokens that hold the value. */
export function suggest(candidates: string[], options: SuggestOptions): Suggestion {
  const { advice, write = (token: string) => `var(${token})`, say = (r: string) => `${r} has that value` } =
    options;
  const answer = (token: string, held = candidates): Suggestion => ({
    candidates: held,
    confidence: "certain",
    autofix: write(token),
    advice: say(write(token)),
  });
  if (candidates.length === 0) return { candidates, confidence: "none", advice };

  /* The intersection, never the union: a role claiming `width` does not make a
     token that holds 12px an answer to `width: 20px`. */
  const claims = options.claims;
  const claimed = claims === undefined ? [] : candidates.filter((token) => claims.has(token));
  const [only, ...others] = claimed;
  if (only !== undefined && others.length === 0) return answer(only, claimed);
  if (others.length > 0) {
    return {
      candidates: claimed,
      confidence: "ambiguous",
      advice: `${claimed.length} tokens answer this property: ${listed(claimed)} — pick the role you mean`,
    };
  }

  /* The system named tokens for this property and none of them holds the value.
     Whatever else does hold it is for something else — a rung, or another
     role's token — so it is reported and never written. That is the gap report:
     the value the app needed and the scale has no name for. */
  if (claims !== undefined && claims.size > 0) {
    return {
      candidates,
      confidence: "value-only",
      advice:
        candidates.length === 1
          ? `${write(candidates[0]!)} has that value, but it is not one of this property's tokens`
          : `${candidates.length} tokens hold it: ${listed(candidates)} — none of them is one of this property's tokens`,
    };
  }

  /* Nothing is declared about this property, so the value is all there is. */
  if (candidates.length === 1) return answer(candidates[0]!);
  return {
    candidates,
    confidence: "value-only",
    advice: `${candidates.length} tokens hold it: ${listed(candidates)} — use the one that names the role`,
  };
}
