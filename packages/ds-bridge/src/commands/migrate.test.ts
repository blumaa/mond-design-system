import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { loadContext } from "../context.js";
import { planMigration, renderMigration } from "./migrate.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const APP = fileURLToPath(new URL("../__fixtures__/app", import.meta.url));

const plan = () => planMigration(loadContext({ root: APP, system: SYSTEM }));

describe("planMigration", () => {
  it("reads the app's own scale, whatever prefix it uses", () => {
    expect(plan().own.map((token) => token.name)).toEqual([
      "--app-gap",
      "--app-ink",
      "--app-brand",
      "--app-surface-card",
    ]);
  });

  it("names the system token holding the same value, preferring the one that names a role", () => {
    const own = plan().own;
    /* --mds-gap and --mds-space-2 are both 8px; the alias is the one to read. */
    expect(own.find((t) => t.name === "--app-gap")?.equivalent).toBe("--mds-gap");
    expect(own.find((t) => t.name === "--app-ink")?.equivalent).toBe("--mds-text-primary");
  });

  it("leaves a value the system does not have unmapped — it is a brand value", () => {
    expect(plan().own.find((t) => t.name === "--app-brand")?.equivalent).toBeUndefined();
  });

  it("counts the contract the app has not re-pointed yet", () => {
    const { contract } = plan();
    expect(contract.total).toBe(7);
    expect(contract.repointed).toBe(1);
  });

  it("lists the literals in component sheets, with what already holds them", () => {
    const { literals } = plan();
    expect(literals).toHaveLength(1);
    expect(literals[0]?.message).toContain("12px");
    expect(literals[0]?.message).toContain("--mds-pad-control-md");
  });

  it("prefers the candidate whose name plays the same role", () => {
    /* --mds-surface-card and --mds-text-inverse are both #ffffff; the name decides. */
    const own = plan().own;
    expect(own.find((t) => t.name === "--app-surface-card")?.equivalent).toBe("--mds-surface-card");
  });

  it("points at the brand template the system ships", () => {
    expect(plan().template).toContain("brand-template.css");
  });
});

describe("renderMigration", () => {
  it("reports each part, in one screen", () => {
    const context = loadContext({ root: APP, system: SYSTEM });
    const out = renderMigration(planMigration(context), context, { color: false });
    expect(out).toContain("--app-gap");
    expect(out).toContain("--mds-gap");
    expect(out).toContain("brand-template.css");
    expect(out).toContain("dsbridge rules");
  });
});

/* A system nobody imports from is a system in name only, and the count of what
   an app has never reached for is the one number that says so. Judgement, not
   a finding: eighteen unused components can be eighteen the app does not need. */
describe("what of the system the app actually uses", () => {
  const config = { components: "../system/index.d.ts" };
  const context = () => loadContext({ root: APP, system: SYSTEM, config });

  it("splits what the system exports into used and never imported", () => {
    const { components } = planMigration(context());
    expect(components?.used).toEqual(["Card"]);
    expect(components?.unused).toEqual(["Button", "Stack", "Switch"]);
  });

  it("says nothing at all when no package was named", () => {
    expect(planMigration(loadContext({ root: APP, system: SYSTEM })).components).toBeUndefined();
  });

  it("reports the count and names the unused", () => {
    const at = context();
    const out = renderMigration(planMigration(at), at, { color: false });
    expect(out).toContain("1 of 4");
    expect(out).toContain("Switch");
  });
});
