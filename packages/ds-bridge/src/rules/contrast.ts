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

export const contrastRules: Rule[] = [keepsContrast];
