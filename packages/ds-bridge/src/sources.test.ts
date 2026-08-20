/* Finding the two things every command needs: the design system's stylesheets,
   and the app's own brand file. Wrong here and every finding downstream is
   measured against the wrong values, so both failures are loud. */
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { findBrandFiles, findStylesheets, resolveSystem } from "./sources.js";

const APP = join(__dirname, "__fixtures__", "consumer");
const REPO = join(__dirname, "..", "..", "..");

describe("resolveSystem", () => {
  it("finds the tokens package from inside the repo that builds it", () => {
    expect(resolveSystem(REPO)).toMatch(/packages[/\\]tokens[/\\]src[/\\]styles\.css$/);
  });

  it("says what to install rather than failing blank", () => {
    const missing = () => {
      throw new Error("MODULE_NOT_FOUND");
    };
    expect(() => resolveSystem("/", missing)).toThrow(/@mond-design-system\/tokens/);
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
