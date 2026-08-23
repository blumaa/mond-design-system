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
import { brandSheets, nothingToCheck } from "./types.js";
import { rungsIn } from "./tokenDiscipline.js";

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
  reads: "stylesheet",
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
  reads: "stylesheet",
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
  reads: "stylesheet",
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
  reads: "stylesheet",
  needs: (context) =>
    shippedBrands(context).length === 0
      ? nothingToCheck(
          "this repo ships no brand file beside its stylesheet, so there is nothing to compare the contract against",
        )
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

/* The roles a brand file sets, paired with the declaration that sets each one.
   A rule about how a value is written has to read the value as written, so it
   works from the blocks rather than from the graph, which has already resolved
   them. */
const geometryIn = (context: Context) =>
  brandSheets(context).flatMap((sheet) =>
    sheet.blocks.flatMap((block) =>
      block.declarations.map((declaration) => ({ sheet, declaration })),
    ),
  );

export const brandRoleTakesItsKind: Rule = {
  id: "brand-role-takes-its-kind",
  title: "A shape role is re-pointed at a rung; only a size role is written as a length.",
  why:
    "A step role names a rung on a scale that unrelated components share, and the " +
    "scale is what keeps them in proportion to each other. Writing a length there " +
    "gives one role a value no other role can reach: the card is 12px and the rung " +
    "it used to sit on is still 18px, so the next component to ask for a card corner " +
    "gets the old one and nothing says the two ever agreed.",
  instead:
    "Point the role at the rung that holds the value — `--mds-radius-card: " +
    "var(--mds-radius-4)`. If no rung holds it, the honest fix is a rung, in the " +
    "system, where every role can see it.",
  target: "both",
  reads: "stylesheet",
  needs: (context) =>
    context.surface.declared
      ? undefined
      : "the design system installed here publishes no brand-surface.json, so nothing says which roles take a rung",
  check: (context) => {
    const rungs = rungsIn(context);
    return geometryIn(context)
      .filter(({ declaration }) => context.surface.kindOf(declaration.property) === "step")
      .filter(({ declaration }) => {
        const named = [
          ...declaration.value.matchAll(new RegExp(`var\\((${context.prefix}[a-z0-9-]+)`, "g")),
        ].map((found) => found[1]!);
        return !named.some((name) => rungs.has(name));
      })
      .map(({ sheet, declaration }) => ({
        rule: "brand-role-takes-its-kind",
        file: sheet.file,
        line: declaration.line,
        message:
          `${declaration.property} is a step role and this sets it to ${declaration.value.trim()} — ` +
          "point it at a rung on the scale instead",
      }))
      .filter((finding) => !context.exempt("brand-role-takes-its-kind", finding.file));
  },
};

export const brandLeavesFloorsAlone: Rule = {
  id: "brand-leaves-floors-alone",
  title: "A brand does not re-point an accessibility floor.",
  why:
    "A floor is the value below which the app stops working for somebody, and it is " +
    "always the value a design wants back: the target that is too big, the focus ring " +
    "that is too loud, the field type that is a pixel off the paragraph beside it. " +
    "Nothing on screen looks wrong afterwards, which is why it survives review.",
  instead:
    "Leave the token to the system. If the floor is in the way of something the brand " +
    "genuinely needs, that is a conversation with the design system, not a line in a " +
    "brand file — and the answer is usually a new role beside the floor.",
  target: "both",
  reads: "stylesheet",
  needs: (context) =>
    context.surface.declared
      ? undefined
      : "the design system installed here publishes no brand-surface.json, so nothing says which tokens are floors",
  check: (context) =>
    geometryIn(context)
      .flatMap(({ sheet, declaration }) => {
        const why = context.surface.floorOf(declaration.property);
        if (why === undefined) return [];
        return [
          {
            rule: "brand-leaves-floors-alone",
            file: sheet.file,
            line: declaration.line,
            message: `${declaration.property} is a floor, not a role — ${why}`,
          },
        ];
      })
      .filter((finding) => !context.exempt("brand-leaves-floors-alone", finding.file)),
};

export const brandRules: Rule[] = [
  noForeignNamespaceToken,
  brandShipsDark,
  brandOverridesBothThemes,
  brandCoversContract,
  brandRoleTakesItsKind,
  brandLeavesFloorsAlone,
];
