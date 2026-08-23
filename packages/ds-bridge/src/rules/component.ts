/* Rules about what a component hands back to the caller.
 *
 * A design system component is a promise that the thing inside it is reachable:
 * the caller can measure it, focus it, and see the focus. None of that needs a
 * declaration file — the source says whether the ref goes anywhere, and the
 * stylesheet says whether the ring survives.
 */
import { openingTags } from "../jsx.js";
import { componentSheets, nothingToCheck, type Context, type Finding, type Rule } from "./types.js";

const finding = (rule: string, file: string, message: string, line?: number): Finding => ({
  rule,
  file,
  message,
  ...(line !== undefined ? { line } : {}),
});

/* A capitalised tag is usually another component, but `const Root = "li"` makes
   one a DOM element under a name — which is how a component picks its own tag.
   Anything bound to a quoted lowercase word counts. */
const elementNames = (source: string): Set<string> => {
  const out = new Set<string>();
  for (const match of source.matchAll(/\b(?:const|let)\s+([A-Z]\w*)[^=\n]*=\s*([^;\n]+)/g)) {
    if (/["'][a-z][\w-]*["']/.test(match[2] ?? "")) out.add(match[1]!);
  }
  return out;
};

/**
 * The line a rest spread lands on a DOM element, if it lands on one.
 *
 * A spread onto `<Surface>` is that component's problem; a spread onto `<div>`
 * is this one's.
 */
export function spreadOntoAnElement(source: string): number | undefined {
  const named = elementNames(source);
  for (const tag of openingTags(source)) {
    if (/^[A-Z]/.test(tag.name) && !named.has(tag.name)) continue;
    const spread = tag.attributes.find((it) => it.name === "" && it.value?.startsWith("{..."));
    if (spread !== undefined) return spread.line;
  }
  return undefined;
}

/* `ref?: Ref<HTMLDivElement>` is how React 19 takes one; `forwardRef` is how it
   used to, and `ComponentProps<"div">` inherits it without naming it. */
const ACCEPTS_REF = /\bref\s*\?\s*:|\bref\s*:\s*(React\.)?\w*Ref\b|\bforwardRef\b|\bComponentProps(WithRef)?\s*</;

const needsComponents = (context: Context) =>
  context.components.length === 0 ? nothingToCheck("no components under this root") : undefined;

export const forwardsItsRef: Rule = {
  id: "forwards-its-ref",
  title: "A component that spreads the rest onto an element takes a ref too.",
  why:
    "Spreading the rest props onto a `<div>` tells the caller this is that div: " +
    "`id`, `aria-*`, `onClick` and every other attribute reach it. `ref` is the " +
    "one that silently does not, and it is the one a tooltip, a popover, a scroll " +
    "target, an intersection observer and a focus manager all need. The caller " +
    "who needs it wraps the component in a spare div, and the layout that div " +
    "breaks is discovered somewhere else entirely.",
  instead:
    "Take `ref?: Ref<HTMLDivElement>` in the props — in React 19 it is an ordinary " +
    "prop — and put it on the same element the rest is spread onto. A component " +
    "that genuinely has no single element to hand back should say so with an " +
    "exemption rather than leave the caller guessing.",
  target: "both",
  reads: "component",
  needs: needsComponents,
  check: (context) => {
    const source = new Map(context.sources.map((it) => [it.file, it.source]));
    const out: Finding[] = [];
    for (const component of context.components) {
      const text = source.get(component.file);
      if (text === undefined || ACCEPTS_REF.test(text)) continue;
      const line = spreadOntoAnElement(text);
      if (line === undefined) continue;
      if (context.exempt("forwards-its-ref", component.file)) continue;
      out.push(
        finding(
          "forwards-its-ref",
          component.file,
          `${component.name} spreads the rest onto an element but takes no ref`,
          line,
        ),
      );
    }
    return out;
  },
};

/* A selector may mention `:focus-visible` in order to opt out of it. The reset
   that hides the ring from a mouse is the opposite of the bug. */
const OPTS_OUT = /:not\(\s*:focus-visible\s*\)/;
const REMOVES = /^(none|0)$/;

export const interactiveHasFocusVisible: Rule = {
  id: "interactive-has-focus-visible",
  title: "A stylesheet that takes the focus ring away puts one back.",
  why:
    "`outline: none` is the single most common way a codebase becomes unusable by " +
    "keyboard. It is almost never written to remove focus — it is written because " +
    "the default ring looked wrong — and the replacement is what gets forgotten. " +
    "Nothing else fails: the component looks right, the tests pass, and the only " +
    "person who finds out is the one who cannot see where they are.",
  instead:
    "If the system styles `:focus-visible` once for the whole document, leave the " +
    "outline alone and inherit it. If this component really needs its own " +
    "treatment, write `:focus-visible` in the same file. To hide the ring from a " +
    "mouse and keep it for a keyboard, the selector is `:focus:not(:focus-visible)`.",
  target: "both",
  reads: "stylesheet",
  check: (context) =>
    componentSheets(context).flatMap((sheet) => {
      const restores = sheet.blocks.some(
        (block) => block.selector.includes(":focus-visible") && !OPTS_OUT.test(block.selector),
      );
      if (restores || context.exempt("interactive-has-focus-visible", sheet.file)) return [];
      return sheet.blocks
        .filter((block) => !OPTS_OUT.test(block.selector))
        .flatMap((block) =>
          block.declarations
            .filter((it) => it.property === "outline" && REMOVES.test(it.value))
            .map((it) =>
              finding(
                "interactive-has-focus-visible",
                sheet.file,
                `${block.selector} removes the outline and nothing in this file styles :focus-visible`,
                it.line,
              ),
            ),
        );
    }),
};

export const acceptsAClassName: Rule = {
  id: "accepts-a-class-name",
  title: "A component the caller is meant to place takes a className.",
  why:
    "Without one there is no way to say where a component sits, so the caller " +
    "wraps it in a div and puts the margin there. That div is not in the system, " +
    "nobody reviews it, and the spacing it holds is the spacing the scale can no " +
    "longer move.",
  instead:
    "Take `className` and merge it after the component's own classes, so the " +
    "caller's declaration wins. This is a judgement and not a check: a Modal, a " +
    "Sheet or a Toast positions itself, and letting a caller restyle that box is " +
    "how the overlay ends up half off-screen. Those refuse a className on purpose.",
  target: "system",
  reads: "component",
};

export const componentRules: Rule[] = [forwardsItsRef, interactiveHasFocusVisible, acceptsAClassName];
