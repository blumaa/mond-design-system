/* Layout, responsiveness and the phone.
 *
 * The guidance was already written — it is the prose in `core/layout.css`,
 * where the breakpoints say what they mean and `--mds-vvh` explains why it is
 * not `100dvh`. Prose in a stylesheet is guidance nobody runs, so this file
 * turns the enforceable half into rules and keeps the rest as judgement.
 *
 * The mobile failures are all silent in the same way: the layout looks right
 * on the machine it was written on. A `max-width` query is a desktop design
 * with a phone exception bolted on; `100vh` is the wrong height for the whole
 * time a software keyboard is open; a bar pinned to `bottom: 0` sits under the
 * home indicator on every phone made since 2017.
 */
import type { Block, Property } from "../css/parse.js";
import type { Context, Finding, Rule, Sheet } from "./types.js";
import { componentSheets, findingsIn } from "./types.js";

const finding = (rule: string, sheet: Sheet, line: number, message: string): Finding => ({
  rule,
  file: sheet.file,
  line,
  message,
});

/** Every block in every component stylesheet, with the sheet it came from. */
const componentBlocks = (context: Context): { sheet: Sheet; block: Block }[] =>
  componentSheets(context).flatMap((sheet) => sheet.blocks.map((block) => ({ sheet, block })));

const declared = (context: Context, group: string) =>
  context.graph.tokens().filter((token) => token.name.startsWith(`${context.prefix}${group}`));

/** The values the system's breakpoints resolve to, e.g. `600px`. */
const breakpoints = (context: Context) =>
  new Set(
    declared(context, "bp-")
      .map((token) => token.effective.light?.trim())
      .filter((value): value is string => value !== undefined),
  );

export const mobileFirstMedia: Rule = {
  id: "mobile-first-media",
  title: "A media query widens the layout; it never narrows it.",
  why:
    "A `max-width` query says the desktop layout is the real one and the phone " +
    "gets an exception. The exceptions then multiply, and the narrowest screen — " +
    "the one most people are holding — ends up as the least designed.",
  instead:
    "Write the phone layout as the plain rules, and add `min-width` queries for " +
    "the room a wider screen gives you. One layout widened, never two maintained.",
  target: "both",
  reads: "stylesheet",
  check: (context) =>
    context.sheets.flatMap((sheet) =>
      context.exempt("mobile-first-media", sheet.file)
        ? []
        : findingsIn(sheet, "mobile-first-media", (line) =>
            /@media[^{]*\bmax-width\b/.test(line)
              ? ["max-width query — state the phone layout plainly and widen it with min-width"]
              : [],
          ),
    ),
};

export const breakpointIsDeclared: Rule = {
  id: "breakpoint-is-declared",
  title: "Every media query breaks at a declared breakpoint.",
  why:
    "A query is resolved before custom properties exist, so the number has to be " +
    "written out — which makes it the one length the token graph cannot keep " +
    "honest. Two components breaking at 600px and 640px is a layout that changes " +
    "shape twice on the way across a desk.",
  instead:
    "Break at a `*-bp-*` value. If the layout genuinely needs a width no breakpoint " +
    "names, that width is a new breakpoint: declare it, say what it means, and use " +
    "the name everywhere.",
  target: "both",
  reads: "stylesheet",
  needs: (context) =>
    breakpoints(context).size === 0 ? `no ${context.prefix}bp-* token is declared` : undefined,
  check: (context) => {
    const widths = breakpoints(context);
    const names = declared(context, "bp-")
      .map((token) => `${token.name} (${token.effective.light})`)
      .join(", ");
    return context.sheets.flatMap((sheet) =>
      context.exempt("breakpoint-is-declared", sheet.file)
        ? []
        : findingsIn(sheet, "breakpoint-is-declared", (line) =>
            line.trimStart().startsWith("@media")
              ? [...line.matchAll(/\b[0-9.]+px\b/g)]
                  .map((match) => match[0])
                  .filter((px) => !widths.has(px))
                  .map((px) => `breaks at ${px}, which no breakpoint names — the declared set is ${names}`)
              : [],
          ),
    );
  },
};

export const zIndexIsAToken: Rule = {
  id: "z-index-is-a-token",
  title: "Stacking order comes from the scale, not from a number.",
  why:
    "Raw z-indexes are a bidding war. Nobody can see the whole stack from one " +
    "component, so each new layer picks a bigger number, and the modal that has " +
    "to be on top ends up underneath a sticky header written later.",
  instead:
    "Read a `*-z-*` token. The scale is the whole stack written down once, so a " +
    "new layer is a decision about where it sits, taken where the others are visible.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const names = declared(context, "z-")
      .map((token) => token.name)
      .join(", ");
    return componentBlocks(context)
      .filter(({ sheet }) => !context.exempt("z-index-is-a-token", sheet.file))
      .flatMap(({ sheet, block }) =>
        block.declarations
          .filter((d) => d.property === "z-index")
          .filter((d) => !d.value.includes(`var(${context.prefix}z-`))
          .filter((d) => !/^(?:0|auto)$/.test(d.value))
          .map((d) =>
            finding(
              "z-index-is-a-token",
              sheet,
              d.line,
              `z-index: ${d.value} — take a place in the stack instead: ${names || `declare ${context.prefix}z-*`}`,
            ),
          ),
      );
  },
};

const VIEWPORT_HEIGHT = /\b100(?:d|l|s)?vh\b/g;

export const viewportHeightIsAToken: Rule = {
  id: "viewport-height-is-a-token",
  title: "Full-height means the token, not the viewport unit.",
  why:
    "`100vh` is taller than the screen on every mobile browser with a retracting " +
    "toolbar, and none of the viewport units shrink when the software keyboard " +
    "opens — the submit button ends up behind the keyboard that is being used to " +
    "fill the form.",
  instead:
    "Read the viewport-height token. It defaults to `100dvh` and a host that knows " +
    "better — one watching `visualViewport.height` — can re-point it to the height " +
    "the user can actually see.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const token = `${context.prefix}vvh`;
    return componentSheets(context).flatMap((sheet) =>
      context.exempt("viewport-height-is-a-token", sheet.file)
        ? []
        : findingsIn(sheet, "viewport-height-is-a-token", (line) =>
            [...line.matchAll(VIEWPORT_HEIGHT)].map(
              (match) => `${match[0]} — read var(${token}), which a host can correct for the keyboard`,
            ),
          ),
    );
  },
};

/** Edges on the axis the notch and the home indicator are on. */
const VERTICAL_EDGES = ["top", "bottom"];

export const screenEdgeClearsTheSafeArea: Rule = {
  id: "screen-edge-clears-the-safe-area",
  title: "Anything pinned to the top or bottom of the screen clears the safe area.",
  why:
    "`bottom: 0` on a phone is behind the home indicator, and `top: 0` is under " +
    "the notch. The element renders, so nothing looks broken in a browser — it is " +
    "only unreachable in the hand.",
  instead:
    "Add the safe inset to the edge, or pad the element by it: " +
    "`bottom: calc(var(--…-toast-inset) + var(--…-safe-bottom))`. The tokens hold " +
    "`env(safe-area-inset-*)`, which is 0 everywhere it is not needed.",
  target: "both",
  reads: "stylesheet",
  check: (context) => {
    const safe = `${context.prefix}safe-`;
    const clears = (declarations: Property[]) => declarations.some((d) => d.value.includes(safe));
    return componentBlocks(context)
      .filter(({ sheet }) => !context.exempt("screen-edge-clears-the-safe-area", sheet.file))
      .filter(({ block }) => block.declarations.some((d) => d.property === "position" && d.value === "fixed"))
      .filter(({ block }) => block.declarations.some((d) => VERTICAL_EDGES.includes(d.property)))
      .filter(({ block }) => !clears(block.declarations))
      .map(({ sheet, block }) =>
        finding(
          "screen-edge-clears-the-safe-area",
          sheet,
          block.line,
          `${block.selector} is pinned to a screen edge with no var(${safe}*) — it will sit under the notch or the home indicator`,
        ),
      );
  },
};

/** `Button.module.css` styles `.button`: the class that is the component itself. */
const rootClass = (file: string) => (file.split("/").pop() ?? "").split(".")[0]?.toLowerCase() ?? "";

/** The first class a selector names, when the selector is one element's. */
const subject = (selector: string): string | undefined => {
  if (/[\s>+~]/.test(selector.trim())) return undefined;
  return /^\.([A-Za-z0-9_-]+)/.exec(selector.trim())?.[1]?.toLowerCase();
};

/** `0`, `0px` and `auto` in any combination: a reset or a centring, not spacing. */
const isBlank = (value: string) => value.split(/\s+/).every((part) => /^(?:auto|-?0[a-z%]*)$/.test(part));

export const noOuterMargin: Rule = {
  id: "no-outer-margin",
  title: "A component ships no margin on its own root.",
  why:
    "A margin is an opinion about a neighbour the component has never met. Two of " +
    "them collapse into one, a third does not, and the parent that wanted them " +
    "evenly spaced now has to fight each child's idea of its own surroundings.",
  instead:
    "Let the parent space its children — `gap` on the Stack or Inline that holds " +
    "them. `margin: 0` and `margin-inline: auto` are fine: one is a reset of the " +
    "browser's opinion, the other is centring, which is about the element itself.",
  target: "both",
  reads: "stylesheet",
  check: (context) =>
    componentBlocks(context)
      .filter(({ sheet }) => !context.exempt("no-outer-margin", sheet.file))
      .flatMap(({ sheet, block }) =>
        subject(block.selector) === rootClass(sheet.file)
          ? block.declarations
              .filter((d) => d.property === "margin" || d.property.startsWith("margin-"))
              .filter((d) => !isBlank(d.value))
              .map((d) =>
                finding(
                  "no-outer-margin",
                  sheet,
                  d.line,
                  `${d.property}: ${d.value} on the component's own root — let the parent's gap do the spacing`,
                ),
              )
          : [],
      ),
};


/* The judgement half. A layout that passes every rule above can still be six
   hand-written flex containers where three primitives would do — so these say
   what good looks like and leave the call to whoever is making it. */

export const reachForThePrimitive: Rule = {
  id: "reach-for-the-primitive",
  title: "Stack, Inline and Container before hand-written flex.",
  why:
    "A hand-written flex container is four declarations that could have been a " +
    "component name, and its gap is a number somebody picked. Repeat it across an " +
    "app and the spacing between things stops being a system and becomes a habit.",
  instead:
    "Stack is a flex column, Inline is a flex row that wraps and aligns, Container " +
    "is a centred column at the content measure. Their gaps are an enum over the " +
    "gap tokens — that restriction is the point, not a limitation to work around. " +
    "Write flex by hand when the layout is genuinely none of those three.",
  target: "both",
  reads: "component",
};

export const flexFirstGridWhenEarned: Rule = {
  id: "flex-first-grid-when-earned",
  title: "Flex is the default; grid is for layouts that are actually two-dimensional.",
  why:
    "Grid used for a row is a template nobody can reflow: the columns are declared " +
    "in one place and the content in another, and a phone that needs the third item " +
    "to wrap cannot get it to.",
  instead:
    "Reach for the flex primitives first — they wrap by themselves, which is what a " +
    "narrow screen needs. Use grid when rows and columns both matter at once: a " +
    "calendar, a form where labels align across rows, a real tiled layout.",
  target: "both",
  reads: "stylesheet",
};

export const oneLayoutWidened: Rule = {
  id: "one-layout-widened",
  title: "One layout, widened. Never two layouts maintained.",
  why:
    "A separate desktop layout is a second implementation of the same screen. They " +
    "drift within a sprint, and the bug is always in the one the person reporting " +
    "it was using.",
  instead:
    "Design at 320px, where the decisions are forced, and let `min-width` queries " +
    "give the same structure more room. If a wide screen needs something the narrow " +
    "one cannot express at all, that is a different screen, not a breakpoint.",
  target: "both",
  reads: "stylesheet",
};

export const whatEachBreakpointMeans: Rule = {
  id: "what-each-breakpoint-means",
  title: "Each breakpoint means something; break where the meaning changes.",
  why:
    "Breakpoints chosen per component are a layout that changes shape three times " +
    "on the way across a desk. Chosen for the app, they are one moment where the " +
    "whole screen becomes a different kind of surface.",
  instead:
    "`md` (600px): a sheet becomes a dialog, and the app becomes a framed column " +
    "rather than the whole window. `lg` (1024px): the bottom bar gives way to a " +
    "sidebar. `xl` (1280px): there is room for a second rail. Break where one of " +
    "those is true.",
  target: "both",
  reads: "stylesheet",
};

export const touchTargets: Rule = {
  id: "touch-targets",
  title: "Anything you can tap is big enough to tap.",
  why:
    "A 32px target is comfortable with a mouse and a coin-flip with a thumb. The " +
    "failure never shows up in a test — the tap simply misses, and the user thinks " +
    "the app ignored them.",
  instead:
    "Reach the minimum tap size on interactive elements, and take control heights " +
    "from the control-height tokens rather than measuring one by hand. A small " +
    "visual control can still pad its hit area out to the minimum.",
  target: "both",
  reads: "stylesheet",
};

export const fixedToAnEdge: Rule = {
  id: "fixed-to-an-edge",
  title: "Pinning to an edge is a mobile decision, not a positioning one.",
  why:
    "The rectangle a browser gives you is not the rectangle the user can see or " +
    "reach. The notch, the home indicator and the software keyboard each take a " +
    "piece of it, and none of them are in the CSS box model.",
  instead:
    "Read the safe-area tokens for anything outside the app chrome, and the " +
    "viewport-height token for anything that has to fit the screen. Better still, " +
    "let the app shell own the pinned regions — a component that pins itself is one " +
    "that cannot be composed.",
  target: "both",
  reads: "stylesheet",
};

export const layoutRules: Rule[] = [
  mobileFirstMedia,
  breakpointIsDeclared,
  zIndexIsAToken,
  viewportHeightIsAToken,
  screenEdgeClearsTheSafeArea,
  noOuterMargin,
  reachForThePrimitive,
  flexFirstGridWhenEarned,
  oneLayoutWidened,
  whatEachBreakpointMeans,
  touchTargets,
  fixedToAnEdge,
];
