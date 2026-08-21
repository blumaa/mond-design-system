/* The rule set, in the order a reader should meet it: what a component may
   contain first, then what the bridge between an app and the system must say. */
import { tokenDisciplineRules } from "./tokenDiscipline.js";
import { brandRules } from "./brand.js";
import { contrastRules } from "./contrast.js";
import { layoutRules } from "./layout.js";
import { structureRules } from "./structure.js";
import { componentRules } from "./component.js";
import { textRules } from "./text.js";
import { usageRules } from "./usage.js";
import { stylePropRules } from "./styleProp.js";
import { philosophyRules } from "./philosophy.js";
import type { Context, Finding, Rule } from "./types.js";
import { appliesTo, isEnforced } from "./types.js";

export const RULES: Rule[] = [
  ...tokenDisciplineRules,
  ...brandRules,
  ...contrastRules,
  ...structureRules,
  ...usageRules,
  ...componentRules,
  ...textRules,
  ...layoutRules,
  ...stylePropRules,
  ...philosophyRules,
];

export const ruleById = (id: string): Rule | undefined => RULES.find((rule) => rule.id === id);

/** The rules that have anything to say about this target. */
export const rulesFor = (context: Context, only?: string[]): Rule[] =>
  RULES.filter((rule) => appliesTo(rule, context.kind)).filter(
    (rule) => only === undefined || only.includes(rule.id),
  );

/** The rules that carry a check, and so can fail a build. */
export const enforcedRules = (): Rule[] => RULES.filter(isEnforced);

/** The rules that carry only an argument, and so can only be read. */
export const advisoryRules = (): Rule[] => RULES.filter((rule) => !isEnforced(rule));

export { isEnforced };
export type { Context, Finding, Rule };
export * from "./tokenDiscipline.js";
export * from "./brand.js";
export * from "./component.js";
export * from "./text.js";
export * from "./usage.js";
export * from "./contrast.js";
export * from "./structure.js";
export * from "./layout.js";
export * from "./styleProp.js";
export * from "./philosophy.js";
