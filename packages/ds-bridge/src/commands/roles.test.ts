/* The roles listing is how a system finds out what it never said. Half the
   value is the second half of the report — the tokens no role claims. */
import { describe, expect, it } from "vitest";
import { loadRoles, type RolesFile } from "../roles.js";
import { renderRoles, roleData } from "./roles.js";

const TOKENS = ["--mds-pad-tight", "--mds-pad-loose", "--mds-space-1", "--mds-shadow-rgb"];

const FILE: RolesFile = {
  version: 1,
  roles: {
    padding: { properties: ["padding", "padding-*"], tokens: ["--mds-pad-*"] },
    rung: { properties: [], tokens: ["--mds-space-*"] },
  },
};

const roles = loadRoles(FILE, TOKENS);

describe("roleData", () => {
  it("resolves every role to the tokens the globs reached", () => {
    const { roles: listed } = roleData(roles, TOKENS);
    expect(listed).toContainEqual({
      role: "padding",
      properties: ["padding", "padding-*"],
      tokens: ["--mds-pad-tight", "--mds-pad-loose"],
    });
  });

  it("counts a token in no role, and a token in a role that answers nothing, as unclaimed", () => {
    const { claimed, unclaimed } = roleData(roles, TOKENS);
    expect(claimed).toEqual(["--mds-pad-tight", "--mds-pad-loose"]);
    expect(unclaimed).toEqual(["--mds-space-1", "--mds-shadow-rgb"]);
  });
});

describe("renderRoles", () => {
  it("lists each role with what it answers and how many tokens it holds", () => {
    const out = renderRoles(roles, TOKENS, { color: false });
    expect(out).toContain("padding");
    expect(out).toContain("padding, padding-*");
    expect(out).toContain("2 of 4");
  });

  it("says a role answering no property answers nothing rather than printing a blank", () => {
    expect(renderRoles(roles, TOKENS, { color: false })).toContain("answers nothing");
  });

  it("names the unclaimed tokens only when asked for coverage", () => {
    expect(renderRoles(roles, TOKENS, { color: false })).not.toContain("--mds-shadow-rgb");
    expect(renderRoles(roles, TOKENS, { color: false, coverage: true })).toContain("--mds-shadow-rgb");
  });

  /* Nothing published is a state to report, not an empty table: the system can
     still be checked, and every suggestion falls back to the value alone. */
  it("says so when the system published no roles at all", () => {
    const out = renderRoles(loadRoles(undefined, TOKENS), TOKENS, { color: false });
    expect(out).toContain("publishes no roles");
  });
});
