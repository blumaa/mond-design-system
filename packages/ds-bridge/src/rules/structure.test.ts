import { describe, expect, it } from "vitest";
import { structureRules } from "./structure.js";
import { runCheck } from "../commands/check.js";
import type { Component } from "../structure.js";
import type { Context } from "./types.js";

type Overrides = { [K in keyof Component]?: Component[K] | undefined };

/* An override of `undefined` means the file is missing, which under
   exactOptionalPropertyTypes is a key that is not there rather than a key set
   to undefined. */
const component = (name: string, rest: Overrides = {}): Component => {
  const out: Component = {
    name,
    file: `src/components/${name}/${name}.tsx`,
    story: `stories/${name}.stories.tsx`,
    test: `src/components/${name}/${name}.test.tsx`,
    levelLine: 3,
    imports: [],
  };
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) delete (out as Record<string, unknown>)[key];
    else Object.assign(out, { [key]: value });
  }
  return out;
};

const contextWith = (components: Component[]): Context =>
  ({
    kind: "system",
    components,
    levels: ["atom", "molecule", "organism"],
    levelsIgnore: ["Docs"],
    exempt: () => false,
  }) as unknown as Context;

const ids = structureRules.map((rule) => rule.id);
const check = (components: Component[]) => runCheck(contextWith(components), { only: ids });

describe("what a repo is made of", () => {
  it("passes a component that is complete and composed downward", () => {
    expect(
      check([
        component("Button", { level: "atom" }),
        component("Card", { level: "molecule", imports: [{ name: "Button", line: 4 }] }),
      ]),
    ).toEqual([]);
  });

  it("names a component with no story", () => {
    const [finding] = check([component("Overlay", { story: undefined, level: undefined })]);
    expect(finding?.rule).toBe("every-component-has-a-story");
    expect(finding?.file).toBe("src/components/Overlay/Overlay.tsx");
  });

  it("names a component with no test", () => {
    const found = check([component("Overlay", { test: undefined, level: "atom" })]);
    expect(found.map((f) => f.rule)).toEqual(["every-component-has-a-test"]);
  });

  it("names a story whose title says nothing about level", () => {
    const [finding] = check([component("Button", { level: undefined, levelLine: undefined })]);
    expect(finding?.rule).toBe("declares-its-level");
    expect(finding?.file).toBe("stories/Button.stories.tsx");
  });

  it("names a level the taxonomy does not have", () => {
    const [finding] = check([component("Stack", { level: "layout" })]);
    expect(finding?.rule).toBe("level-is-in-the-taxonomy");
    expect(finding?.line).toBe(3);
    expect(finding?.message).toContain("layout");
  });

  it("leaves a title segment the config told it to ignore alone", () => {
    expect(check([component("Tokens", { level: "doc" })])).toEqual([]);
  });

  it("leaves a component that composes a peer alone", () => {
    expect(
      check([
        component("Spinner", { level: "atom" }),
        component("Button", { level: "atom", imports: [{ name: "Spinner", line: 3 }] }),
      ]),
    ).toEqual([]);
  });

  it("names a component that composes upward", () => {
    const [finding] = check([
      component("Card", { level: "molecule" }),
      component("Button", { level: "atom", imports: [{ name: "Card", line: 2 }] }),
    ]);
    expect(finding?.rule).toBe("composes-downward");
    expect(finding?.file).toBe("src/components/Button/Button.tsx");
    expect(finding?.line).toBe(2);
    expect(finding?.message).toContain("Card");
  });

  it("says nothing about an edge whose level nobody declared", () => {
    expect(
      check([
        component("Card", { level: "molecule", imports: [{ name: "Mystery", line: 2 }] }),
        component("Mystery", { level: undefined, levelLine: undefined, story: undefined }),
      ]).map((f) => f.rule),
    ).toEqual(["every-component-has-a-story"]);
  });

  it("reports rather than passes silently when there are no components", () => {
    const context = contextWith([]);
    for (const rule of structureRules) expect(rule.needs?.(context)).toBeTypeOf("string");
  });
});
