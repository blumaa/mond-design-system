import { describe, expect, it } from "vitest";
import { RULES, advisoryRules, enforcedRules, isEnforced, rulesFor } from "./index.js";
import { runCheck } from "../commands/check.js";
import type { Context, Rule } from "./types.js";

const advisory: Rule = {
  id: "test-advisory",
  title: "Guidance the tool cannot prove.",
  why: "Some of what a design system asks for is judgement.",
  instead: "Read the reasoning and decide.",
  concern: "structure",
  target: "both",
  reads: "component",
};

const context = { kind: "system", exempt: () => false } as unknown as Context;

describe("the rule model", () => {
  it("calls a rule with a check enforced and one without it advisory", () => {
    expect(isEnforced(RULES[0]!)).toBe(true);
    expect(isEnforced(advisory)).toBe(false);
  });

  it("splits the registry both ways with nothing lost", () => {
    expect(enforcedRules().length + advisoryRules().length).toBe(RULES.length);
    expect(enforcedRules().every(isEnforced)).toBe(true);
    expect(advisoryRules().some(isEnforced)).toBe(false);
  });

  it("keeps advisory rules in the set a reader asks for", () => {
    expect(rulesFor(context).map((rule) => rule.id)).toContain("belongs-in-the-system");
  });

  it("has every rule say which of the report's questions it answers", () => {
    const concerns = new Set(["alignment", "accessibility", "scale", "structure"]);
    const silent = RULES.filter((rule) => !concerns.has(rule.concern));
    expect(silent.map((rule) => rule.id)).toEqual([]);
  });

  it("does not try to run a rule that has no check", () => {
    expect(() => runCheck(context, { only: ["belongs-in-the-system"] })).not.toThrow();
  });
});
