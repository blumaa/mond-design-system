/* Token discipline: what a stylesheet that *styles something* may contain.
 *
 * The brand promise — a rebrand is one CSS file and nothing else moves — only
 * holds if no component ever writes a raw value or reaches for a token that is
 * not there. Both failures are silent: a literal hex just works until the brand
 * lands, and an undefined custom property drops the declaration with no error
 * anywhere.
 *
 * These four apply to the design system's own components and to a consuming
 * app's components alike, which is why they are the rules an app is checked
 * against first.
 */
import type { Context, Detail, Rule, Sheet } from "./types.js";
import { componentSheets, findingsIn } from "./types.js";
import { suggest, valueIndex, type SuggestOptions } from "./suggest.js";
import { propertyAt } from "../css/parse.js";

const matchAll = (source: string, pattern: RegExp) => [...source.matchAll(pattern)].map((m) => m[0]);

/** The same matches, with where they are: a fix has to know the column. */
const matchesIn = (source: string, pattern: RegExp) =>
  [...source.matchAll(pattern)].map((m) => ({ text: m[0], at: m.index }));

/** One literal, as a finding: the sentence, and the same thing as data. */
function literal(
  context: Context,
  kind: string,
  line: string,
  at: number,
  text: string,
  options: SuggestOptions,
  candidates: string[],
): Detail {
  /* The property before the suggestion: it is half of what the suggestion is. */
  const property = propertyAt(line, at);
  const claims = property === undefined ? undefined : context.roles.forProperty(property);
  const found = suggest(candidates, { ...options, ...(claims ? { claims } : {}) });
  return {
    message: `literal ${kind} ${text} — ${found.advice}`,
    col: at + 1,
    value: text,
    candidates: found.candidates,
    confidence: found.confidence,
    ...(property !== undefined ? { property } : {}),
    ...(found.autofix !== undefined ? { autofix: found.autofix } : {}),
  };
}

/** `var(--x)` or `var(--x, fallback)` — a token being read rather than declared. */
const readsIn = (line: string, prefix: string) =>
  matchAll(line, new RegExp(`${prefix}[a-z0-9-]+(?=\\s*[,)])`, "g"));

/**
 * A rung on a scale: `--mds-space-2`, `--mds-radius-7`, `--mds-text-lg`.
 *
 * Two segments, and the second one is a position rather than a name — that is
 * what makes it a rung. `--mds-text-control-md` has a role in the middle of it
 * and is an alias *for* a rung, which is exactly what a component should read.
 */
export const isRung = (name: string, prefix: string) => {
  const parts = name.slice(prefix.length).split("-");
  return parts.length === 2 && /^(?:[0-9]+|xs|sm|base|md|lg|xl|[0-9]xl)$/.test(parts[1]!);
};

/** Core groups whose tokens are rungs rather than roles. Overridable per system. */
const SCALES = ["spacing", "radius", "typography"];

/**
 * Every token that is a step on one of the system's scales, by name.
 *
 * A name alone cannot say it: `--mds-icon-md` has the shape of a rung and is a
 * role, so the group the token was declared in decides. Rules on both sides of
 * the line read this — one keeps components off the rungs, the other keeps a
 * brand's shape roles on them.
 */
export const rungsIn = (context: Context): Map<string, string> => {
  const scales = new Set(context.scales ?? SCALES);
  return new Map(
    context.graph
      .tokens()
      .filter(
        (token) => token.layer === "core" && scales.has(token.group) && isRung(token.name, context.prefix),
      )
      .map((token) => [token.name, token.group]),
  );
};

/** An exemption may name the whole rule, or one scale within it. */
const exempted = (context: Context, rule: string, sheet: Sheet, detail?: string) =>
  context.exempt(rule, sheet.file) || (detail !== undefined && context.exempt(`${rule}/${detail}`, sheet.file));

export const noLiteralColor: Rule = {
  id: "no-literal-color",
  title: "A component stylesheet names a color, never writes one.",
  why:
    "A literal color works perfectly until a brand lands, and then it is the one " +
    "thing on the page that did not change. It also never flips for dark mode.",
  instead:
    "Read the semantic alias for the role the color plays — surface, text, border. " +
    "If no alias fits, the role is missing from the contract: add it there.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const index = valueIndex(context.graph, "light", (name) => isRung(name, context.prefix));
    return componentSheets(context).flatMap((sheet) =>
      exempted(context, "no-literal-color", sheet)
        ? []
        : findingsIn(sheet, "no-literal-color", (line) =>
            [
              ...matchesIn(line, /#[0-9a-fA-F]{3,8}\b/g),
              ...matchesIn(line, /\b(?:rgba?|hsla?)\([^)]*\)/g),
            ].map(({ text, at }) =>
              literal(context, "color", line, at, text, { advice: "use a semantic alias" }, index.colors(text)),
            ),
          ),
    );
  },
};

export const noLiteralLength: Rule = {
  id: "no-literal-length",
  title: "A component stylesheet reads its lengths from the scale.",
  why:
    "A hard-coded px is a decision made once, in one place, that the scale can no " +
    "longer move. Twenty of them are a layout nobody can retune.",
  instead:
    "Use a spacing, radius or layout token. A `@media` prelude is the one place a " +
    "length has to be written out — the query is resolved before custom properties " +
    "exist — and `breakpoint-is-declared` holds those to the breakpoint list.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const index = valueIndex(context.graph, "light", (name) => isRung(name, context.prefix));
    return componentSheets(context).flatMap((sheet) =>
      exempted(context, "no-literal-length", sheet)
        ? []
        : findingsIn(sheet, "no-literal-length", (line) => {
            /* A prelude split over two lines fails here — write it on one. */
            if (line.trimStart().startsWith("@media")) return [];
            return matchesIn(line, /-?\b[0-9.]+px\b/g).map(({ text, at }) => {
              /* No token holds a negative value; -4px is a token negated. */
              const negated = text.startsWith("-");
              const options: SuggestOptions = {
                advice: "use a spacing, radius or layout token",
                ...(negated
                  ? {
                      write: (token: string) => `calc(-1 * var(${token}))`,
                      say: (replacement: string) => `negate the token: ${replacement}`,
                    }
                  : {}),
              };
              return literal(
                context,
                "length",
                line,
                at,
                text,
                options,
                index.lengths(negated ? text.slice(1) : text),
              );
            });
          }),
    );
  },
};

export const noRawScaleStep: Rule = {
  id: "no-raw-scale-step",
  title: "A component reads the alias that names the role, not the step behind it.",
  why:
    "A step is a rung. Every component that reads the same rung shares its fate, so " +
    "a brand nudging one of them moves all the others too — including the ones it " +
    "had no opinion about.",
  instead:
    "Name the role the value plays and alias the step once, in the system's core " +
    "layer. Components read the role. The exception is a component whose public " +
    "size prop *is* the step, where the consumer chose it rather than the component.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const steps = rungsIn(context);
    return componentSheets(context).flatMap((sheet) =>
      findingsIn(sheet, "no-raw-scale-step", (line) =>
        readsIn(line, context.prefix)
          .filter((name) => steps.has(name) && !sheet.declares.has(name))
          .filter((name) => !exempted(context, "no-raw-scale-step", sheet, steps.get(name)))
          .map((name) => `raw scale step ${name} — name the role it plays and alias the step in the core layer`),
      ),
    );
  },
};

export const noUndefinedToken: Rule = {
  id: "no-undefined-token",
  title: "Every token a stylesheet reads is declared somewhere.",
  why:
    "An undefined custom property does not error — the declaration is simply dropped, " +
    "and the element renders with whatever it inherited. A typo and a missing token " +
    "look identical, and both look like a styling bug.",
  instead:
    "Check the name against `dsbridge tokens`. A token published at runtime by whichever " +
    "component owns it is declared nowhere on purpose; read it with a fallback, and " +
    "let the fallback say what the element is worth on its own.",
  target: "both",
  reads: "stylesheet",
  check: (context) =>
    componentSheets(context).flatMap((sheet) =>
      exempted(context, "no-undefined-token", sheet)
        ? []
        : findingsIn(sheet, "no-undefined-token", (line) =>
            readsIn(line, context.prefix)
              .filter((name) => !sheet.declares.has(name) && context.graph.get(name) === undefined)
              .filter((name) => !line.includes(`var(${name},`))
              .map(
                (name) =>
                  `undefined token ${name} — nothing declares it; read it with a fallback ` +
                  "if a component publishes it at runtime",
              ),
          ),
    ),
};

export const tokenDisciplineRules: Rule[] = [
  noLiteralColor,
  noLiteralLength,
  noRawScaleStep,
  noUndefinedToken,
];
