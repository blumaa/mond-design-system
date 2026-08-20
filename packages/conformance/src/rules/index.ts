/* The rule set, in the order a reader should meet it: what a component may
   contain first, then what the bridge between an app and the system must say. */
import { tokenDisciplineRules } from "./tokenDiscipline.js";
import { brandRules } from "./brand.js";
import { contrastRules } from "./contrast.js";
import type { Context, Finding, Rule } from "./types.js";
import { appliesTo } from "./types.js";

export const RULES: Rule[] = [...tokenDisciplineRules, ...brandRules, ...contrastRules];

export const ruleById = (id: string): Rule | undefined => RULES.find((rule) => rule.id === id);

/** The rules that have anything to say about this target. */
export const rulesFor = (context: Context, only?: string[]): Rule[] =>
  RULES.filter((rule) => appliesTo(rule, context.kind)).filter(
    (rule) => only === undefined || only.includes(rule.id),
  );

export type { Context, Finding, Rule };
export * from "./tokenDiscipline.js";
export * from "./brand.js";
export * from "./contrast.js";
