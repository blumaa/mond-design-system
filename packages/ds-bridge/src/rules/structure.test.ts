import { describe, expect, it } from "vitest";
import { structureRules } from "./structure.js";
import { loadChoosing, type ChoosingFile } from "../choosing.js";
import { runCheck, skippedRules } from "../commands/check.js";
import type { Component } from "../structure.js";
import { isCloseable, reasonOf, type Context } from "./types.js";

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
    choosing: loadChoosing(undefined),
    exempt: () => false,
    ignored: () => false,
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

  /* And says it is the vacuous kind: a repo with no components is not hiding
     anything by not checking them, where a repo that never named its taxonomy
     has something it could tell the tool. */
  it("reports rather than passes silently when there are no components", () => {
    const context = contextWith([]);
    for (const rule of structureRules) {
      const skip = rule.needs!(context);
      expect(reasonOf(skip!)).toBeTypeOf("string");
      /* An empty repo is the vacuous kind of skip; a missing taxonomy or an
         unpublished choosing.json is the kind the repo could close. */
      expect(isCloseable(skip!)).toBe(!/no component/.test(reasonOf(skip!)));
    }
  });
});

/* The taxonomy is the design system's, and an app's is its own — Fair Play
   groups by feature, so telling it `EventCard` is not an atom would be noise.
   The rules are the same rules; what an app supplies is the vocabulary. */
describe("an app's own taxonomy", () => {
  const TAXONOMY = ["declares-its-level", "level-is-in-the-taxonomy", "composes-downward"];

  const app = (levels: string[], components: Component[]): Context =>
    ({
      kind: "app",
      components,
      levels,
      levelsIgnore: [],
      exempt: () => false,
      ignored: () => false,
    }) as unknown as Context;

  const undeclared = app([], [component("EventCard", { level: undefined })]);

  it("skips the taxonomy rules with a reason when none is declared", () => {
    const skipped = skippedRules(undeclared, { only: ids });
    for (const rule of TAXONOMY) {
      expect(skipped.get(rule)).toContain("levels");
    }
    expect(runCheck(undeclared, { only: ids })).toEqual([]);
  });

  it("still asks the app for a level once the app has said what a level is", () => {
    const declared = app(["primitive", "block", "screen"], [component("EventCard", { level: undefined })]);
    expect(skippedRules(declared, { only: ids }).has("declares-its-level")).toBe(false);
    expect(runCheck(declared, { only: ids }).map((f) => f.rule)).toContain("declares-its-level");
  });

  it("reads an app's levels, not atom/molecule/organism", () => {
    const declared = app(
      ["primitive", "block", "screen"],
      [component("EventCard", { level: "block" }), component("Odd", { level: "molecule" })],
    );
    const found = runCheck(declared, { only: ids });
    expect(found.map((f) => f.rule)).toEqual(["level-is-in-the-taxonomy"]);
    expect(found[0]!.message).toContain("molecule");
  });

  it("holds an app to composing downward, which is what a level is for", () => {
    const declared = app(
      ["primitive", "block", "screen"],
      [
        component("EventCard", { level: "block", imports: [{ name: "EventScreen", line: 4 }] }),
        component("EventScreen", { level: "screen" }),
      ],
    );
    expect(runCheck(declared, { only: ids }).map((f) => f.rule)).toEqual(["composes-downward"]);
  });

  it("leaves stories and tests to the system, which is the repo that publishes", () => {
    const declared = app(
      ["primitive"],
      [component("EventCard", { level: "primitive", story: undefined, test: undefined })],
    );
    expect(runCheck(declared, { only: ids })).toEqual([]);
  });
});

describe("what the system says to choose between", () => {
  const file = (clusters: ChoosingFile["clusters"]): ChoosingFile => ({ version: 1, clusters });

  const withChoosing = (names: string[], choosing: ChoosingFile | undefined): Context =>
    ({
      root: "/repo",
      system: "/repo/packages/tokens/src/styles.css",
      kind: "system",
      components: names.map((name) => component(name, { level: "atom" })),
      levels: ["atom", "molecule", "organism"],
      levelsIgnore: [],
      choosing: loadChoosing(choosing),
      exempt: () => false,
      ignored: () => false,
    }) as unknown as Context;

  const run = (names: string[], choosing: ChoosingFile | undefined) =>
    runCheck(withChoosing(names, choosing), { only: ["choosing-names-a-real-component"] });

  it("passes a choice whose every component the repo has", () => {
    const choosing = file([{ default: "Tag", use: "a label", instead: [{ when: "pressable", prefer: "Chip" }] }]);
    expect(run(["Tag", "Chip"], choosing)).toEqual([]);
  });

  /* Guidance naming something that does not exist is guidance that never fires,
     and nothing else in the repo can notice: the JSON compiles. */
  it("reports a component the choice names and the repo does not have", () => {
    const choosing = file([{ default: "Tag", use: "a label", instead: [{ when: "pressable", prefer: "Chipp" }] }]);
    const found = run(["Tag", "Chip"], choosing);
    expect(found).toHaveLength(1);
    expect(found[0]?.message).toContain("Chipp");
    expect(found[0]?.file).toBe("packages/tokens/src/dsbridge/choosing.json");
  });

  it("skips a system that declared no choices at all", () => {
    const skipped = skippedRules(withChoosing(["Tag"], undefined), {
      only: ["choosing-names-a-real-component"],
    });
    expect(skipped.get("choosing-names-a-real-component")).toMatch(/choosing\.json/);
  });
});
