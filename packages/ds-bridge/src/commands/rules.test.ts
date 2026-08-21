/* The half an agent reads, narrowed to what it is about to touch.
 *
 * A session that opens with 22 KB of rules pays for them whether or not it
 * writes any CSS, and an agent that has to skim 36 rules to find the four about
 * stylesheets will skim instead of read.
 */
import { describe, expect, it } from "vitest";
import { RULES } from "../rules/index.js";
import { renderRules, rulesAsJson, rulesForFile } from "./rules.js";

describe("the rules about one file", () => {
  it("gives a stylesheet the rules that read stylesheets", () => {
    const ids = rulesForFile("src/components/Card/Card.module.css").map((rule) => rule.id);
    expect(ids).toContain("no-literal-color");
    expect(ids).toContain("no-literal-length");
    expect(ids).toContain("mobile-first-media");
  });

  it("does not hand a stylesheet the rules about component files", () => {
    const ids = rulesForFile("src/components/Card/Card.module.css").map((rule) => rule.id);
    expect(ids).not.toContain("every-component-has-a-story");
    expect(ids).not.toContain("style-prop-needs-a-token");
  });

  it("gives a component the rules that read component source", () => {
    const ids = rulesForFile("src/components/Card/Card.tsx").map((rule) => rule.id);
    expect(ids).toContain("style-prop-needs-a-token");
    expect(ids).toContain("declares-its-level");
    expect(ids).not.toContain("no-literal-length");
  });

  it("says nothing about a file no rule reads", () => {
    expect(rulesForFile("README.md")).toEqual([]);
    expect(rulesForFile("package.json")).toEqual([]);
  });

  it("keeps the target filter, so an app is not told the system's rules", () => {
    const ids = rulesForFile("src/Card.tsx", "app").map((rule) => rule.id);
    expect(ids).not.toContain("every-component-has-a-story");
    expect(ids).toContain("style-prop-needs-a-token");
  });

  it("is a line each, not the whole argument", () => {
    const about = rulesForFile("src/Card.module.css");
    const out = renderRules(about, { color: false });
    /* One line per rule, plus the line saying where the reasoning is. */
    expect(out.split("\n").filter((line) => line !== "")).toHaveLength(about.length + 1);
    expect(out).not.toContain("Instead:");
    expect(out).toContain("dsbridge rules no-literal-color");
  });

  it("says whether each one can fail a build or only be weighed", () => {
    const [rule] = rulesAsJson({ id: "no-literal-color" });
    expect(rule).toMatchObject({ enforced: true, reads: "stylesheet" });
  });
});

describe("what each rule reads", () => {
  it("is declared by every rule, so none is invisible to a file query", () => {
    expect(RULES.filter((rule) => rule.reads === undefined)).toEqual([]);
  });

  it("covers both kinds of file a repo is checked through", () => {
    const kinds = new Set(RULES.map((rule) => rule.reads));
    expect(kinds).toEqual(new Set(["stylesheet", "component", "repo"]));
  });
});
