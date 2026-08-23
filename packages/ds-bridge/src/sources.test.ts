/* Finding the two things every command needs: the design system's stylesheets,
   and the app's own brand file. Wrong here and every finding downstream is
   measured against the wrong values, so both failures are loud. */
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findBrandFiles, findStylesheets, resolveSystem, type Resolver } from "./sources.js";

const APP = join(__dirname, "__fixtures__", "consumer");
const REPO = join(__dirname, "..", "..", "..");

describe("resolveSystem", () => {
  const INSTALLED = join(__dirname, "__fixtures__", "installed");
  const missing = () => {
    throw new Error("MODULE_NOT_FOUND");
  };
  const resolves = (...ids: string[]): Resolver =>
    (id) => {
      if (!ids.includes(id)) throw new Error("MODULE_NOT_FOUND");
      return `/node_modules/${id}`;
    };

  it("finds the design system among the packages the app installed", () => {
    expect(resolveSystem(INSTALLED, resolves("@acme/ds/styles.css"))).toBe(
      "/node_modules/@acme/ds/styles.css",
    );
  });

  it("names no design system of its own when it cannot find one", () => {
    expect(() => resolveSystem(INSTALLED, missing)).toThrow(/dsbridge\.config\.json/);
    expect(() => resolveSystem(INSTALLED, missing)).not.toThrow(/mond/);
  });

  /* A design system ships its components as a second package, and that one
     publishes a stylesheet too — one that reads tokens rather than declaring
     any. Declaring them is what makes a stylesheet the system's entry. */
  it("takes the package that declares the tokens over the one that spends them", () => {
    const onDisk: Resolver = (id) => join(INSTALLED, "node_modules", id);
    expect(resolveSystem(INSTALLED, onDisk)).toBe(join(INSTALLED, "node_modules", "@acme/ds/styles.css"));
  });

  it("asks which one, rather than picking, when two could be it", () => {
    const both = resolves("@acme/ds/styles.css", "react/styles.css");
    expect(() => resolveSystem(INSTALLED, both)).toThrow(/@acme\/ds/);
    expect(() => resolveSystem(INSTALLED, both)).toThrow(/react/);
  });

  it("says so when there is no package.json to read", () => {
    expect(() => resolveSystem(join(REPO, "no-such-dir"), missing)).toThrow(/dsbridge\.config\.json/);
  });

  /* A workspace installs a dependency beside the package that declared it, so
     the root has no node_modules and nothing in its manifest. Looking only there
     reports that no design system is installed, in a repo that installed one. */
  const WORKSPACE = join(__dirname, "__fixtures__", "workspace");
  const installedUnder: Resolver = (id, from) => {
    const path = join(from, "node_modules", id);
    if (!existsSync(path)) throw new Error("MODULE_NOT_FOUND");
    return path;
  };

  it("looks where the sources say the repo keeps its packages", () => {
    expect(resolveSystem(WORKSPACE, installedUnder, ["apps/web/src/**"])).toBe(
      join(WORKSPACE, "apps", "web", "node_modules", "@acme", "ds", "styles.css"),
    );
  });

  it("still finds nothing when nothing says where to look", () => {
    expect(() => resolveSystem(WORKSPACE, installedUnder)).toThrow(/dsbridge\.config\.json/);
  });

  /* Two workspace packages depending on the same design system is the normal
     case, and each has its own copy installed beside it. That is one dependency
     found twice, not two candidates to ask the repo about. */
  it("counts one dependency once, however many packages install it", () => {
    expect(
      resolveSystem(WORKSPACE, installedUnder, ["apps/web/src/**", "packages/ui/src/**"]),
    ).toBe(join(WORKSPACE, "apps", "web", "node_modules", "@acme", "ds", "styles.css"));
  });
});

describe("findBrandFiles", () => {
  const found = findBrandFiles(APP);

  it("finds the stylesheet that declares design system tokens", () => {
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(/brand-app\.css$/);
  });

  it("ignores a stylesheet that only reads tokens", () => {
    expect(found.join()).not.toContain("component.module.css");
  });

  /* Every exclusion below passes by finding nothing if the fixture is missing
     the files it is meant to exclude — which is exactly how these went green on
     one machine and red in CI, with `node_modules/` and `dist/` gitignored. */
  it("has on disk the files it claims to skip", () => {
    for (const path of ["dist/bundle.css", "node_modules/x/vendor.css", "playwright/.cache/bundle.css"]) {
      expect(existsSync(join(APP, path)), `${path} is not in the fixture`).toBe(true);
    }
  });

  it("ignores dependencies and build output, which are not the app's to change", () => {
    expect(found.join()).not.toContain("node_modules");
    expect(found.join()).not.toContain("dist");
  });

  it("ignores a cache, where a copy of the brand file would read as a second one", () => {
    /* fairplay keeps a built bundle under playwright/.cache; it declares every
       token the brand file does, because it *is* the brand file, compiled. */
    expect(found.join()).not.toContain(".cache");
  });
});

describe("findStylesheets", () => {
  it("collects the app's own stylesheets, brand file included", () => {
    const all = findStylesheets(APP).map((f) => f.replace(/^.*[/\\]/, ""));
    expect(all).toContain("component.module.css");
    expect(all).toContain("brand-app.css");
    expect(all.join()).not.toContain("bundle.css");
  });
});
