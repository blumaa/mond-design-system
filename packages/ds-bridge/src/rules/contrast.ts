/* The accessibility contract, re-proved against the brand that is actually shipping.
 *
 * The design system proves its own defaults meet WCAG. A brand file then
 * re-points every colour in that proof, and nothing re-establishes it: the
 * package's own test still passes, on values the app does not use. This is the
 * rule that closes that gap, and it is the reason the tool resolves colours at
 * all rather than pattern-matching them.
 */
import { relative } from "node:path";
import { contrast } from "../css/color.js";
import type { Theme } from "../css/parse.js";
import { componentSheets, sameElement } from "./types.js";
import type { Context, Finding, Rule } from "./types.js";

const THEMES: Theme[] = ["light", "dark"];

/** Where to point: the declaration the app is responsible for, if there is one. */
function place(context: Context, tokens: string[]): { file: string; line?: number } {
  for (const name of tokens) {
    const declaration = context.graph.get(name)?.overriddenBy[0];
    if (declaration) return { file: relative(context.root, declaration.file), line: declaration.line };
  }
  const fallback = context.graph.get(tokens[0] ?? "")?.declarations[0];
  return { file: fallback ? relative(context.root, fallback.file) : "" };
}

const round = (n: number) => Math.round(n * 100) / 100;

export const keepsContrast: Rule = {
  id: "keeps-contrast",
  title: "Every pair in the contract clears its ratio, in both themes, with the brand applied.",
  why:
    "The design system's own proof runs on the system's own colours. A brand " +
    "re-points all of them, so that proof says nothing about what the app renders " +
    "— and a failure here is not a style opinion, it is text somebody cannot read.",
  instead:
    "Move the brand value until it clears the ratio, or re-point the paired token " +
    "with it: a colour and the surface it sits on are one decision. `dsbridge tokens " +
    "--theme dark` shows what each side currently resolves to.",
  target: "both",
  reads: "repo",
  needs: (context) =>
    context.contract === undefined
      ? "the design system installed here publishes no contract.json, so there is nothing to prove against"
      : undefined,
  check: (context) => {
    const contract = context.contract;
    if (contract === undefined) return [];
    const findings: Finding[] = [];
    for (const theme of THEMES) {
      const map = context.graph.map(theme);
      for (const { fg, bg: backgrounds, ratio } of contract.contrast) {
        for (const bg of backgrounds) {
          let measured: number;
          try {
            measured = contrast(map, fg, bg);
          } catch (error) {
            findings.push({
              rule: "keeps-contrast",
              ...place(context, [fg, bg]),
              message: `${fg} on ${bg} cannot be measured in ${theme}: ${(error as Error).message}`,
            });
            continue;
          }
          if (measured >= ratio) continue;
          findings.push({
            rule: "keeps-contrast",
            ...place(context, [fg, bg]),
            message: `${fg} on ${bg} is ${round(measured)}:1 in ${theme} — the contract requires ${ratio}:1`,
          });
        }
      }
    }
    return findings.filter((finding) => !context.exempt("keeps-contrast", finding.file));
  },
};

/* A photograph is not a colour, so nothing about it can be measured. Every rule
   above this one compares a pair the contract names; over media there is no
   pair — the surface is whatever the picture happens to be under the text. The
   only thing that can be asked for is that the box brings a surface of its
   own. */

/** Out of flow, so it is laid over whatever is behind it rather than following
    it. Text painted on-media that sits in the flow is a primitive painting a
    colour — `Text` with `tone="on-media"` — and the scrim is owed by whoever
    puts it over a picture, not by the paint. */
const OVER = new Set(["absolute", "fixed", "sticky"]);

/** A surface of the box's own: a scrim, a fill, a blur of what is behind, or an
    outline drawn around the letters themselves. */
const BACKING = new Set([
  "background",
  "background-color",
  "background-image",
  "backdrop-filter",
  "-webkit-backdrop-filter",
  "text-shadow",
  "-webkit-text-stroke",
  "-webkit-text-stroke-color",
]);

/** Written, but painting nothing. */
const NOTHING = new Set(["none", "transparent", "initial", "unset", "0"]);

/** A pointer or a keyboard is on it right now — which is not a surface it has
    at rest, and at rest is when it has to be readable. */
const STATE = /:(hover|active|focus|focus-visible|focus-within|target)\b/;

/** The colours the system names for what sits over a picture. */
const onMedia = (context: Context, value: string) =>
  value.includes(`${context.prefix}text-on-media`) || value.includes(`${context.prefix}on-media-`);

export const overMediaCarriesItsOwnBacking: Rule = {
  id: "over-media-carries-its-own-backing",
  title: "A box laid over media brings its own scrim or its own fill.",
  why:
    "Contrast is a ratio between two colours, and a photograph is not one. A caption " +
    "over a bright frame and the same caption over a dark one are two different " +
    "results from the same stylesheet, and neither is what the contract proved: " +
    "`keeps-contrast` measures the pairs the system names, and this pair does not " +
    "exist. What the reader gets is decided by the picture the app was handed that " +
    "day — which is how a video's controls and a fullscreen image's controls both " +
    "went invisible in a build every automated check called clean.",
  instead:
    "Give the box a surface before the text lands on it: `background: var(--mds-scrim)` " +
    "on the box or on a pseudo-element filling it, a `backdrop-filter`, or a solid " +
    "fill. Where the system already ships the composition — a button with `onMedia`, " +
    "a carousel's own caption — use it and the scrim comes with it.",
  target: "both",
  reads: "stylesheet",
  check: (context) =>
    componentSheets(context)
      .filter((sheet) => !context.exempt("over-media-carries-its-own-backing", sheet.file))
      .flatMap((sheet) =>
        sheet.blocks.flatMap((block) => {
          /* A state is the same element with a finger on it, and the element is
             already being asked once. */
          if (STATE.test(block.selector)) return [];

          /* Paint the reader has to see *through* nothing: a colour, a border, a
             glyph's fill. An on-media value written as a background is the box
             bringing its own surface, which is the thing this rule asks for. */
          const [paint] = block.declarations.filter(
            (d) => onMedia(context, d.value) && !BACKING.has(d.property),
          );
          if (paint === undefined) return [];

          /* What the same element gets from everywhere: the block itself, a
             pseudo-element painting part of it, and any class `composes` puts on
             it — a scrim written in another file is still a scrim. */
          const element = sameElement(context, sheet, block);
          const declarations = (only: (selector: string) => boolean) =>
            element.filter((it) => only(it.block.selector)).flatMap((it) => it.block.declarations);

          const laidOver = declarations((selector) => !selector.includes("::")).some(
            (d) => d.property === "position" && OVER.has(d.value.trim()),
          );
          if (!laidOver) return [];

          const backed = declarations((selector) => !STATE.test(selector)).some(
            (d) => BACKING.has(d.property) && !NOTHING.has(d.value.trim()),
          );
          if (backed) return [];

          return [
            {
              rule: "over-media-carries-its-own-backing",
              file: sheet.file,
              line: paint.line,
              property: paint.property,
              value: paint.value,
              message:
                `${block.selector} is laid over what is behind it and paints ` +
                `${paint.property}: ${paint.value} — give it a scrim or a fill of its own, ` +
                `since the surface under it is a picture and no ratio can be measured against one`,
            } satisfies Finding,
          ];
        }),
      ),
};

export const contrastRules: Rule[] = [keepsContrast, overMediaCarriesItsOwnBacking];
