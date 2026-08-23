import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import {
  brandCoversContract,
  brandLeavesFloorsAlone,
  brandOverridesBothThemes,
  brandRoleTakesItsKind,
  brandShipsDark,
  noForeignNamespaceToken,
} from "./brand.js";
import { loadSurface, SURFACE_VERSION, type SurfaceFile } from "../surface.js";
import { reasonOf, type Context, type Rule } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));

const context = (name: string, surface?: SurfaceFile): Context => {
  const path = fileURLToPath(new URL(`../__fixtures__/brands/${name}`, import.meta.url));
  const root = dirname(path);
  const graph = loadGraph({ system: SYSTEM, brand: [path] });
  const sheet = makeSheet(path, readFileSync(path, "utf8"), root, "--mds-", new Set(graph.names()));
  return buildContext({ root, kind: "app", graph, sheets: [sheet], surface: loadSurface(surface) });
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
    expect(reasonOf(brandCoversContract.needs!(context)!)).toContain("no brand");
  });
});

/* The fixture system's own line: one role on a scale, one that is a size of
   its own, and one floor. --mds-pad-control-md aliases a spacing rung, so a
   brand re-pointing it has somewhere to point. */
const SURFACE: SurfaceFile = {
  version: SURFACE_VERSION,
  settable: [
    { token: "--mds-pad-control-md", kind: "step", why: "the padding inside a control, on the shared rhythm" },
    { token: "--mds-control-h-md", kind: "length", why: "control heights sit on no scale" },
  ],
  floors: [{ token: "--mds-tap-min", why: "44px is the smallest target a thumb reliably hits" }],
};

describe("brand-role-takes-its-kind", () => {
  const run = (brand: string) => brandRoleTakesItsKind.check!(context(brand, SURFACE));

  it("flags a step role written as a length", () => {
    const findings = run("geometry-off-scale.css");
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      rule: "brand-role-takes-its-kind",
      file: "geometry-off-scale.css",
      line: 4,
    });
    expect(findings[0]?.message).toContain("--mds-pad-control-md");
    expect(findings[0]?.message).toContain("10px");
  });

  it("passes a step role pointed at a rung and a length role written as one", () => {
    expect(run("geometry.css")).toEqual([]);
  });

  /* Colour is settable in full and is nobody's rung; a rule that read every
     declaration would flag the brand every app actually ships. */
  it("says nothing about a declaration the surface never named", () => {
    expect(run("good.css")).toEqual([]);
  });

  it("says so when the system published no surface", () => {
    expect(brandRoleTakesItsKind.needs?.(context("geometry-off-scale.css"))).toContain("brand-surface.json");
    expect(brandRoleTakesItsKind.needs?.(context("geometry-off-scale.css", SURFACE))).toBeUndefined();
  });
});

describe("brand-leaves-floors-alone", () => {
  const run = (brand: string) => brandLeavesFloorsAlone.check!(context(brand, SURFACE));

  it("flags a floor a brand re-points, with the reason it is one", () => {
    const findings = run("geometry-off-scale.css");
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ file: "geometry-off-scale.css", line: 5 });
    expect(findings[0]?.message).toContain("--mds-tap-min");
    expect(findings[0]?.message).toContain("thumb");
  });

  it("passes a brand that only moves what it may", () => {
    expect(run("geometry.css")).toEqual([]);
    expect(run("good.css")).toEqual([]);
  });

  it("says so when the system published no surface", () => {
    expect(brandLeavesFloorsAlone.needs?.(context("geometry.css"))).toContain("brand-surface.json");
  });
});
