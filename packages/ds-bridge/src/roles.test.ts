/* Roles are the half of a suggestion the value cannot supply. Wrong here and
   the tool goes back to naming whichever token happened to sort first. */
import { describe, expect, it } from "vitest";
import { loadRoles, type RolesFile } from "./roles.js";

const TOKENS = [
  "--mds-pad-tight",
  "--mds-pad-loose",
  "--mds-gap-loose",
  "--mds-icon-md",
  "--mds-icon-lg",
  "--mds-switch-knob",
  "--mds-space-5",
];

const FILE: RolesFile = {
  version: 1,
  roles: {
    padding: { properties: ["padding", "padding-*"], tokens: ["--mds-pad-*"] },
    gap: { properties: ["gap", "row-gap", "column-gap"], tokens: ["--mds-gap-*"] },
    "icon-size": { properties: ["width", "height"], tokens: ["--mds-icon-*"] },
    rung: { properties: [], tokens: ["--mds-space-*"] },
  },
  roleOf: { "--mds-switch-knob": "icon-size" },
};

describe("loadRoles", () => {
  const roles = loadRoles(FILE, TOKENS);

  it("puts a token in the role whose glob claims it", () => {
    expect(roles.of("--mds-pad-tight")).toEqual(["padding"]);
    expect(roles.of("--mds-gap-loose")).toEqual(["gap"]);
  });

  it("takes a hand-placed token over what the globs would have said", () => {
    expect(roles.of("--mds-switch-knob")).toEqual(["icon-size"]);
  });

  it("answers a property with every token of every role that claims it", () => {
    expect([...roles.forProperty("width")].sort()).toEqual([
      "--mds-icon-lg",
      "--mds-icon-md",
      "--mds-switch-knob",
    ]);
    expect([...roles.forProperty("padding-left")]).toContain("--mds-pad-tight");
  });

  it("claims nothing for a property no role names", () => {
    expect(roles.forProperty("box-shadow").size).toBe(0);
  });

  /* A rung is a step on a scale, not an answer to a question. It exists so the
     scale is complete, and a role that claims no property never suggests. */
  it("holds a role that answers nothing", () => {
    expect(roles.of("--mds-space-5")).toEqual(["rung"]);
    expect(roles.forProperty("padding").has("--mds-space-5")).toBe(false);
  });

  it("counts a token as covered only when its role answers something", () => {
    const { claimed, unclaimed } = roles.coverage();
    expect(claimed).toContain("--mds-icon-md");
    expect(unclaimed).toContain("--mds-space-5");
  });

  it("is empty, and says so, when the system published nothing", () => {
    const none = loadRoles(undefined, TOKENS);
    expect(none.declared).toBe(false);
    expect(none.forProperty("width").size).toBe(0);
    expect(none.coverage().unclaimed).toEqual(TOKENS);
  });

  /* The version is the promise. A file written for a later schema is refused
     by name rather than half-read into a wrong answer. */
  it("refuses a schema it does not read", () => {
    expect(() => loadRoles({ ...FILE, version: 2 }, TOKENS)).toThrow(/version 2/);
  });
});
