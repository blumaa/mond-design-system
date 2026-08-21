/* Finding the two things every command needs: the design system's stylesheets,
   and the app's own brand file. Wrong here and every finding downstream is
   measured against the wrong values, so both failures are loud. */
import { describe, expect, it } from "vitest";
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
