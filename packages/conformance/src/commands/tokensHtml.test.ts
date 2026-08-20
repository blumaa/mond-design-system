/* The page you look at. Same graph as the terminal listing, drawn so that a
   color is a swatch, a space is a bar, and a face is set in itself. */
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { loadGraph } from "../graph.js";
import { escapeHtml, renderTokensHtml } from "./tokensHtml.js";

const DS = join(__dirname, "..", "__fixtures__", "ds", "styles.css");
const BRAND = join(__dirname, "..", "__fixtures__", "app", "brand.css");
const html = renderTokensHtml(loadGraph({ system: DS }));

describe("renderTokensHtml", () => {
  it("is a whole document, openable from disk with nothing else", () => {
    expect(html).toMatch(/^<!doctype html>/i);
    expect(html).not.toMatch(/<script src=|<link rel="stylesheet"/);
  });

  it("draws every token it was given", () => {
    for (const name of ["--mds-space-1", "--mds-gray-900", "--mds-text-primary"]) {
      expect(html).toContain(name);
    }
  });

  it("carries both themes, so the page can flip without being regenerated", () => {
    expect(html).toContain("#232323");
    expect(html).toContain("#f6f6f4");
    expect(html).toMatch(/data-theme/);
  });

  it("groups under a heading per layer and group", () => {
    expect(html).toMatch(/core<\/[a-z]+>|core ·/);
    expect(html).toContain("spacing");
    expect(html).toContain("surface");
  });

  it("escapes a value rather than letting it close a tag", () => {
    /* A token value is text from a file on disk, and this page is opened in a
       browser — so it is escaped on the way in, like any other input. */
    expect(escapeHtml('</style><script>alert(1)</script>')).toBe(
      "&lt;/style&gt;&lt;script&gt;alert(1)&lt;/script&gt;",
    );
    expect(html).not.toContain("<script>alert");
  });

  it("says which tokens the brand re-pointed", () => {
    const branded = renderTokensHtml(loadGraph({ system: DS, brand: [BRAND] }));
    expect(branded).toMatch(/brand/i);
    expect(branded).toContain("#fffdf7");
  });

  it("obeys the same filters as the listing", () => {
    const core = renderTokensHtml(loadGraph({ system: DS }), { layer: "core" });
    expect(core).toContain("--mds-space-1");
    expect(core).not.toContain("--mds-text-primary");
  });
});
