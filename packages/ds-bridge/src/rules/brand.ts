/* The bridge: what an app's brand file may say, and what it must not leave out.
 *
 * A brand file is the one place an app is allowed to write values. Everything
 * these rules protect is invisible when it breaks — a token re-pointed in light
 * and forgotten in dark still renders, in the system's colour, on a page that is
 * otherwise the app's.
 */
import { dirname, relative, sep } from "node:path";
import type { Declaration } from "../css/parse.js";
import type { Context, Finding, Rule } from "./types.js";
import { brandSheets } from "./types.js";

const at = (context: Context, declaration: Declaration) => ({
  file: relative(context.root, declaration.file),
  line: declaration.line,
});

/** Tokens the app re-points, with the declarations that do it. */
const overrides = (context: Context) => context.graph.tokens().filter((token) => token.overriddenBy.length > 0);

/** A token the system gives two values: forgetting one of them is what shows. */
const systemFlips = (raw: { light?: string; dark?: string }) =>
  raw.light !== undefined && raw.dark !== undefined && raw.light !== raw.dark;

export const noForeignNamespaceToken: Rule = {
  id: "no-foreign-namespace-token",
  title: "An app re-points the design system's tokens; it does not invent new ones in its namespace.",
  why:
    "A token in the system's prefix that the system does not define reads as part " +
    "of the contract and is not. Nothing in the design system will ever set it, so " +
    "it silently becomes the app's alone — and it collides the day the system does " +
    "define that name, which is the one upgrade nobody will connect to the breakage.",
  instead:
    "Declare app-owned values under the app's own prefix and point the system's " +
    "token at them: `--mds-accent: var(--fp-accent)`. If the value names a role the " +
    "system should own, the right fix is to add it to the contract instead.",
  target: "both",
  check: (context) =>
    context.graph
      .tokens()
      .filter(
        (token) =>
          token.name.startsWith(context.prefix) && token.layer === "brand" && token.declarations.length === 0,
      )
      .flatMap((token) => {
        const declaration = token.overriddenBy[0];
        if (declaration === undefined) return [];
        return [
          {
            rule: "no-foreign-namespace-token",
            ...at(context, declaration),
            message:
              `${token.name} is declared in the design system's namespace but the system ` +
              `does not define it — use the app's own prefix, or add the role to the contract`,
          },
        ];
      })
      .filter((finding) => !context.exempt("no-foreign-namespace-token", finding.file)),
};

export const brandShipsDark: Rule = {
  id: "brand-ships-dark",
  title: "A brand file carries both themes.",
  why:
    "The design system gives most of its colours a second value for dark. A brand " +
    "that re-points only the light one leaves the app half-branded in dark mode, " +
    "with the system's neutral defaults sitting beside the app's colours — usually " +
    "at a contrast nobody checked.",
  instead:
    "Give the brand a `[data-theme=\"dark\"]` block that re-points every token the " +
    "light block does.",
  target: "both",
  check: (context) => {
    const flipping = new Set(
      overrides(context)
        .filter((token) => systemFlips(token.raw))
        .flatMap((token) => token.overriddenBy.map((d) => d.file)),
    );
    return brandSheets(context)
      .filter((sheet) => flipping.has(sheet.path) && !context.exempt("brand-ships-dark", sheet.file))
      .filter((sheet) => !/\[data-theme=["']?dark["']?\]|prefers-color-scheme:\s*dark/.test(sheet.source))
      .map((sheet) => ({
        rule: "brand-ships-dark",
        file: sheet.file,
        message: "no dark scope — the tokens this file re-points have a second value in dark mode",
      }));
  },
};

export const brandOverridesBothThemes: Rule = {
  id: "brand-overrides-both-themes",
  title: "A token re-pointed in one theme is re-pointed in the other.",
  why:
    "Half an override is worse than none: the token keeps the system's value in the " +
    "theme the brand forgot, so the app's colour and the system's neutral sit next " +
    "to each other and only one of them was chosen.",
  instead:
    "Re-point the token in both the light and the dark block of the brand file, even " +
    "when the two values are the same.",
  target: "both",
  check: (context) => {
    /* A file with no dark scope at all is one finding, not one per token. */
    const noDarkScope = new Set(
      brandSheets(context)
        .filter((sheet) => !/\[data-theme=["']?dark["']?\]/.test(sheet.source))
        .map((sheet) => sheet.path),
    );
    const findings: Finding[] = [];
    for (const token of overrides(context)) {
      if (!systemFlips(token.raw)) continue;
      /* Per file: two brand files loading together must each be complete, or
         one of them covers for the other and only one app ever loads both. */
      const byFile = new Map<string, Declaration[]>();
      for (const declaration of token.overriddenBy) {
        byFile.set(declaration.file, [...(byFile.get(declaration.file) ?? []), declaration]);
      }
      for (const [file, declarations] of byFile) {
        const themes = new Set(declarations.map((d) => d.theme));
        if (themes.size === 2 || noDarkScope.has(file)) continue;
        const missing = themes.has("dark") ? "light" : "dark";
        const finding = {
          rule: "brand-overrides-both-themes",
          ...at(context, declarations[0]!),
          message: `${token.name} is re-pointed for ${[...themes][0]} only — in ${missing} it keeps the system's value`,
        };
        if (!context.exempt("brand-overrides-both-themes", finding.file)) findings.push(finding);
      }
    }
    return findings;
  },
};

/* The template ships inside the package, beside the stylesheet it is a template
   for. A brand file elsewhere in the repo — a storybook demo — is somebody's
   example, and an example is allowed to re-point three tokens. */
const shippedBrands = (context: Context) => {
  const dir = context.system === undefined ? undefined : dirname(context.system) + sep;
  return dir === undefined ? [] : brandSheets(context).filter((sheet) => sheet.path.startsWith(dir));
};

export const brandCoversContract: Rule = {
  id: "brand-covers-contract",
  title: "The brand the system ships declares every semantic token.",
  why:
    "This file is what an app copies, so a token missing from it is a token no " +
    "app will ever know it can set: the alias quietly falls through to the mond " +
    "default and the app is branded everywhere except there. Adding a semantic " +
    "token without adding the line here is the way that happens.",
  instead:
    "Add the token to the template with the system's own default as its value. " +
    "The dark block only needs the tokens that flip.",
  target: "system",
  needs: (context) =>
    shippedBrands(context).length === 0
      ? "this repo ships no brand file beside its stylesheet, so there is nothing to compare the contract against"
      : undefined,
  check: (context) => {
    const semantic = context.graph.tokens().filter((token) => token.layer === "semantic");
    return shippedBrands(context)
      .filter((sheet) => !context.exempt("brand-covers-contract", sheet.file))
      .flatMap((sheet) =>
        semantic
          .filter((token) => !sheet.declares.has(token.name))
          .map((token) => ({
            rule: "brand-covers-contract",
            file: sheet.file,
            message: `${token.name} is in the contract but not in this file — an app copying it never sees the token`,
          })),
      );
  },
};

export const brandRules: Rule[] = [
  noForeignNamespaceToken,
  brandShipsDark,
  brandOverridesBothThemes,
  brandCoversContract,
];
