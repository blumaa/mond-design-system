import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import {
  brandCoversContract,
  brandOverridesBothThemes,
  brandShipsDark,
  noForeignNamespaceToken,
} from "./brand.js";
import type { Context, Rule } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));

const context = (name: string): Context => {
  const path = fileURLToPath(new URL(`../__fixtures__/brands/${name}`, import.meta.url));
  const root = dirname(path);
  const graph = loadGraph({ system: SYSTEM, brand: [path] });
  const sheet = makeSheet(path, readFileSync(path, "utf8"), root, "--mds-", new Set(graph.names()));
  return buildContext({ root, kind: "app", graph, sheets: [sheet] });
};

const run = (rule: Rule, brand: string) => rule.check!(context(brand));

describe("no-foreign-namespace-token", () => {
  it("flags a token invented in the system's namespace", () => {
    const [finding] = run(noForeignNamespaceToken, "foreign.css");
    expect(finding).toMatchObject({ rule: "no-foreign-namespace-token", file: "foreign.css", line: 3 });
    expect(finding?.message).toContain("--mds-text-md");
  });

  it("passes a brand that only re-points what the system defines", () => {
    expect(run(noForeignNamespaceToken, "good.css")).toEqual([]);
  });

  it("passes app-owned values under the app's own prefix", () => {
    expect(run(noForeignNamespaceToken, "good.css").map((f) => f.message)).not.toContain("--fp-ink");
  });
});

describe("brand-ships-dark", () => {
  it("flags a brand with no dark scope", () => {
    const [finding] = run(brandShipsDark, "no-dark.css");
    expect(finding).toMatchObject({ rule: "brand-ships-dark", file: "no-dark.css" });
    expect(finding?.line).toBeUndefined();
  });

  it("passes a brand that has one", () => {
    expect(run(brandShipsDark, "good.css")).toEqual([]);
    expect(run(brandShipsDark, "light-only.css")).toEqual([]);
  });
});

describe("brand-overrides-both-themes", () => {
  it("flags a token re-pointed in light only", () => {
    const findings = run(brandOverridesBothThemes, "light-only.css");
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("--mds-text-primary");
    expect(findings[0]?.message).toContain("light only");
  });

  it("passes a brand that re-points both", () => {
    expect(run(brandOverridesBothThemes, "good.css")).toEqual([]);
  });

  it("leaves a brand with no dark scope to brand-ships-dark", () => {
    expect(run(brandOverridesBothThemes, "no-dark.css")).toEqual([]);
  });

  it("says nothing about a token the system does not flip", () => {
    expect(run(brandOverridesBothThemes, "foreign.css")).toEqual([]);
  });

  /* Two brand files load together; each has to be complete on its own. */
  it("does not let one brand file cover for another's missing dark value", () => {
    const paths = ["good.css", "light-only.css"].map((name) =>
      fileURLToPath(new URL(`../__fixtures__/brands/${name}`, import.meta.url)),
    );
    const root = dirname(paths[0]!);
    const graph = loadGraph({ system: SYSTEM, brand: paths });
    const sheets = paths.map((path) =>
      makeSheet(path, readFileSync(path, "utf8"), root, "--mds-", new Set(graph.names())),
    );
    const findings = brandOverridesBothThemes.check!(buildContext({ root, kind: "app", graph, sheets }));
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ file: "light-only.css" });
    expect(findings[0]?.message).toContain("--mds-text-primary");
  });
});

describe("brand-covers-contract", () => {
  /* A brand that ships beside the system's stylesheet is the template apps copy. */
  const shipped = (name: string, dir = "system") => {
    const path = fileURLToPath(new URL(`../__fixtures__/${dir}/${name}`, import.meta.url));
    const root = fileURLToPath(new URL("../__fixtures__", import.meta.url));
    const graph = loadGraph({ system: SYSTEM, brand: [path] });
    const sheet = makeSheet(path, readFileSync(path, "utf8"), root, "--mds-", new Set(graph.names()));
    return buildContext({ root, kind: "system", graph, sheets: [sheet], system: SYSTEM });
  };

  it("flags every semantic token the template leaves out", () => {
    const findings = brandCoversContract.check!(shipped("brand-partial.css"));
    expect(findings).toHaveLength(5);
    expect(findings.map((f) => f.message).join(" ")).toContain("--mds-surface-card");
    expect(findings[0]).toMatchObject({ rule: "brand-covers-contract", file: "system/brand-partial.css" });
  });

  it("passes a template that declares the whole contract", () => {
    expect(brandCoversContract.check!(shipped("brand-template.css"))).toEqual([]);
  });

  it("leaves brand files outside the package alone — a demo is allowed to be partial", () => {
    expect(brandCoversContract.check!(shipped("good.css", "brands"))).toEqual([]);
  });

  it("says so when the repo ships no brand beside its stylesheet", () => {
    const graph = loadGraph({ system: SYSTEM });
    const root = fileURLToPath(new URL("../__fixtures__", import.meta.url));
    const context = buildContext({ root, kind: "system", graph, sheets: [], system: SYSTEM });
    expect(brandCoversContract.needs?.(context)).toContain("no brand");
  });
});
