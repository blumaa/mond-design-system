/* Rules about the design system an app already has.
 *
 * Every one of these is about a component that exists twice: once in the
 * package the app installed and once in the app's own source. That is the most
 * expensive kind of drift there is — the app's copy misses the focus ring, the
 * loading state and the next release, and nobody notices until a rebrand moves
 * one of them and not the other.
 *
 * Aimed at apps only. A design system's own `Card` is not a duplicate of
 * itself, and asking it to import from the package it *is* would be nonsense.
 */
import { importedNames, type Component } from "../structure.js";
import type { Context, Finding, Rule } from "./types.js";

const target = "app" as const;
const reads = "component" as const;

const needsExports = (context: Context) =>
  context.exported.length === 0
    ? "nothing says what the design system exports — name the package in dsbridge.config.json as components"
    : undefined;

const finding = (rule: string, file: string, message: string): Finding => ({ rule, file, message });

/** The system component an app's name claims, longest first: `EventSheet` is a
    Sheet before it is anything else, and an exact match is not a wrapper. */
const claims = (name: string, exported: string[]): string | undefined =>
  exported.includes(name)
    ? undefined
    : exported.filter((it) => name.endsWith(it)).sort((a, b) => b.length - a.length)[0];

/** How many of a family have to build on their base before the ones that do not
    are outliers rather than a coincidence of English. Fair Play has twelve
    components ending in `Tab` and not one of them is a system Tab. */
const CONVENTION = 2;

export const noDuplicateOfASystemComponent: Rule = {
  id: "no-duplicate-of-a-system-component",
  title: "Do not give an app component the name of one the system exports.",
  why:
    "Two components with one name is a question every reader of the app has to " +
    "answer from the import line: whose Icon is this. One of them gets the " +
    "accessibility work and the next release, and it is not the app's — so the " +
    "app's copy drifts quietly, and the day someone deletes the local import to " +
    "'clean up' the page changes shape.",
  instead:
    "Use the system's, or name yours for what makes it different — `AvatarIcon`, " +
    "`SportIcon`. If the system's is genuinely wrong for the app, say so in the " +
    "system: a second consumer will want the same thing.",
  target,
  reads,
  needs: needsExports,
  check: (context) =>
    context.components
      .filter((component) => context.exported.includes(component.name))
      .filter((component) => !context.exempt("no-duplicate-of-a-system-component", component.file))
      .map((component) =>
        finding(
          "no-duplicate-of-a-system-component",
          component.file,
          `${component.name} is also exported by the design system — rename this one, or use theirs`,
        ),
      ),
};

export const wrapsRatherThanReimplements: Rule = {
  id: "wraps-rather-than-reimplements",
  title: "A component named after a system component builds on it.",
  why:
    "`VenueCard` that renders its own `<div>` is a Card that will not follow the " +
    "system's radius, padding, elevation or dark theme. The name promises a " +
    "family resemblance the code does not keep, and the rebrand that moves every " +
    "other card leaves this one behind. Judged against the repo's own habit: " +
    "this only fires where most of the family already builds on the same base.",
  instead:
    "Render the system's component and pass your content into it. Where it cannot " +
    "do what you need, that is a gap in the system worth naming rather than a " +
    "reason to start again.",
  target,
  reads,
  needs: needsExports,
  check: (context) => {
    const source = new Map(context.sources.map((it) => [it.file, it.source]));
    const wraps = (component: Component, base: string) =>
      importedNames(source.get(component.file) ?? "", context.exportedFrom).has(base);

    /* Grouped before judged: the repo's own convention is the evidence. Where
       most of a family builds on its base, the rest are the outliers; where
       none of it does, the app means a different thing by the word and a rule
       that fired twelve times on it would be a rule someone turns off. */
    const families = new Map<string, Component[]>();
    for (const component of context.components) {
      const base = claims(component.name, context.exported);
      if (base === undefined) continue;
      families.set(base, [...(families.get(base) ?? []), component]);
    }

    const out: Finding[] = [];
    for (const [base, family] of families) {
      const wrapping = family.filter((component) => wraps(component, base));
      if (wrapping.length < CONVENTION || wrapping.length <= family.length / 2) continue;
      for (const component of family) {
        if (wrapping.includes(component)) continue;
        if (context.exempt("wraps-rather-than-reimplements", component.file)) continue;
        out.push(
          finding(
            "wraps-rather-than-reimplements",
            component.file,
            `${component.name} is named after ${base} but does not use it, and ` +
              `${wrapping.length} of its ${family.length} siblings do`,
          ),
        );
      }
    }
    return out;
  },
};

export const usageRules: Rule[] = [noDuplicateOfASystemComponent, wrapsRatherThanReimplements];
