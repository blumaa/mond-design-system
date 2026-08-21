/* CSS written in JavaScript, held to the same standard as CSS written in CSS.
 *
 * Thirty of this system's components accept a `style` prop, because dropping
 * the `HTMLAttributes` passthrough would take `id`, `aria-*` and `data-*` with
 * it. So the gate goes at the other end: a component may forward a style, and
 * code that *writes* one has to carry a token. Flexible about what you pass,
 * never about where the value came from.
 */
import { styleDeclarations } from "../jsx.js";
import { isRung } from "./tokenDiscipline.js";
import { suggest, valueIndex } from "./suggest.js";
import type { Context, Finding, Rule, Source } from "./types.js";

const unquoted = (text: string) => text.replace(/^["'`]|["'`]$/g, "");

/** A style prop's key as CSS spells it: `maxHeight` is `max-height`, and a
    vendor key keeps the dash it starts with — `WebkitLineClamp` is
    `-webkit-line-clamp`. */
const cssName = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Properties React leaves as a bare number: `flex: 1` is not one pixel. */
const UNITLESS = new Set([
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
  "zIndex",
  "opacity",
  "lineHeight",
  "fontWeight",
  "columnCount",
  "tabSize",
]);

/** A number React will turn into px, or a length written out. */
const asLength = (key: string, value: string): string | undefined => {
  const bare = unquoted(value.trim());
  if (/^-?[0-9.]+$/.test(bare)) return UNITLESS.has(unquoted(key)) ? undefined : `${bare}px`;
  return /^-?[0-9.]+(?:px|rem|em)$/.test(bare) ? bare : undefined;
};

const sourcesOf = (context: Context, rule: string): Source[] =>
  context.sources.filter((source) => !context.exempt(rule, source.file));

export const stylePropNeedsAToken: Rule = {
  id: "style-prop-needs-a-token",
  title: "A style prop sets a custom property or carries a token value.",
  why:
    "A stylesheet is checkable and a style prop is not: the same `gap: 28` that " +
    "would be caught in a `.module.css` file is invisible in JSX, so this is " +
    "where token discipline quietly stops. It is also where responsiveness " +
    "stops — an inline value beats every media query and every theme, so a " +
    "layout written this way cannot be re-themed, cannot flip for dark mode and " +
    "cannot answer to a breakpoint.",
  instead:
    "For a fixed value, read the token: `color: \"var(--mds-text-primary)\"`. For " +
    "a genuinely dynamic quantity, pass it as a custom property and let the " +
    "stylesheet decide what to do with it — `style={{ \"--progress\": `${n}%` }}`. " +
    "Skeleton, Spinner and ProgressBar already do exactly this; they are the " +
    "reference, not the exception. For layout, the primitive is the answer: " +
    "Stack, Inline and Container take gaps that are already tokens.",
  target: "both",
  reads: "component",
  check: (context) => {
    const index = valueIndex(context.graph, "light", (name) => isRung(name, context.prefix));
    return sourcesOf(context, "style-prop-needs-a-token").flatMap((source) =>
      styleDeclarations(source.source)
        .filter((declaration) => !unquoted(declaration.key).startsWith("--"))
        .filter((declaration) => !declaration.value.includes("var("))
        .map((declaration): Finding => {
          const length = asLength(declaration.key, declaration.value);
          const advice = "pass it as a custom property and let the stylesheet use it";
          const property = cssName(unquoted(declaration.key));
          /* Anything that is not a length is a value no token was ever going to
             hold — a `display` or a computed string — so nothing is offered. */
          const found = suggest(length === undefined ? [] : index.lengths(length), {
            advice,
            claims: context.roles.forProperty(property),
          });
          return {
            rule: "style-prop-needs-a-token",
            file: source.file,
            line: declaration.line,
            message: `${declaration.key}: ${declaration.value.trim()} reaches no token — ${found.advice}`,
            property,
            value: length ?? unquoted(declaration.value.trim()),
            candidates: found.candidates,
            confidence: found.confidence,
            ...(found.autofix !== undefined ? { autofix: found.autofix } : {}),
          };
        }),
    );
  },
};

export const fontsLiveInTheApp: Rule = {
  id: "fonts-live-in-the-app",
  title: "The design system asks for a typeface; the app supplies it.",
  why:
    "A face shipped inside the system is bytes every consumer downloads whether " +
    "or not it uses them, a licence the system now has to hold on their behalf, " +
    "and a brand decision made in the one place that is supposed to have no " +
    "brand. An app that has its own face ends up shipping both.",
  instead:
    "Declare the font stack as a token — `--mds-font-sans` — and let the brand " +
    "file re-point it. `@font-face`, the files themselves and the preloading all " +
    "belong to the app, next to the rest of its assets.",
  target: "system",
  reads: "repo",
  check: (context) => {
    const carried: Finding[] = context.fonts
      .filter((file) => !context.exempt("fonts-live-in-the-app", file))
      .map((file) => ({ rule: "fonts-live-in-the-app", file, message: "a typeface ships inside the system" }));
    const declared = sourcesOf(context, "fonts-live-in-the-app").flatMap((source) =>
      source.source
        .split("\n")
        .map((line, i): Finding | undefined =>
          line.includes("@font-face")
            ? {
                rule: "fonts-live-in-the-app",
                file: source.file,
                line: i + 1,
                message: "@font-face in the system — the app declares its own face",
              }
            : undefined,
        )
        .filter((finding): finding is Finding => finding !== undefined),
    );
    return [...carried, ...declared];
  },
};

/** The elements a design system exists to replace, and what it replaces them with. */
const INSTEAD: Record<string, string> = {
  button: "Button",
  input: "Input",
  select: "Select",
  textarea: "Textarea",
};

export const noRawElementOverComponent: Rule = {
  id: "no-raw-element-over-component",
  title: "An app renders the system's component, not the element under it.",
  why:
    "A raw `<button>` is the point where every promise stops: no focus ring, no " +
    "44px target, no disabled or loading state, no token behind any of its " +
    "colours, and nothing to update when the system changes. It looks close " +
    "enough on the day it is written, which is why there are usually nineteen of " +
    "them before anyone notices.",
  instead:
    "Import the component. When it will not do what the element does, that is a " +
    "gap in the system worth reporting — a prop it is missing, or a component it " +
    "does not have yet. The design system's own source is exempt: it is the one " +
    "place the raw element has to be written.",
  target: "app",
  reads: "component",
  check: (context) =>
    sourcesOf(context, "no-raw-element-over-component").flatMap((source) =>
      source.source.split("\n").flatMap((line, i) =>
        Object.entries(INSTEAD)
          .filter(([element]) => new RegExp(`<${element}[\\s/>]`).test(line))
          .map(
            (pair): Finding => ({
              rule: "no-raw-element-over-component",
              file: source.file,
              line: i + 1,
              message: `raw <${pair[0]}> — the system exports ${pair[1]}`,
            }),
          ),
      ),
    ),
};

export const stylePropRules: Rule[] = [stylePropNeedsAToken, fontsLiveInTheApp, noRawElementOverComponent];
