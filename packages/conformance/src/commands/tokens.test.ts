/* The token listing. What a member of the team runs to answer "what have we
   got, what does it come out as, and who is reading it". */
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { loadGraph } from "../graph.js";
import { renderTokens } from "./tokens.js";

const DS = join(__dirname, "..", "__fixtures__", "ds", "styles.css");
const BRAND = join(__dirname, "..", "__fixtures__", "app", "brand.css");
const graph = loadGraph({ system: DS });
const branded = loadGraph({ system: DS, brand: [BRAND] });

const render = (g = graph, options = {}) => renderTokens(g, { color: false, ...options });

describe("renderTokens", () => {
  it("organizes by layer and group, and counts each", () => {
    const out = render();
    expect(out).toMatch(/core · spacing \(2\)/);
    expect(out).toMatch(/semantic · surface \(1\)/);
  });

  it("puts core before semantic, since that is the order they stack in", () => {
    const out = render();
    expect(out.indexOf("core · spacing")).toBeLessThan(out.indexOf("semantic · surface"));
  });

  it("shows the value the browser paints", () => {
    expect(render()).toMatch(/--mds-text-primary\s+#232323/);
  });

  it("shows the alias beside it, because the alias is the thing being reviewed", () => {
    expect(render()).toContain("var(--mds-gray-900)");
  });

  it("counts the readers of a token", () => {
    expect(render()).toMatch(/--mds-gray-900.*2 readers/s);
  });

  it("reads the dark theme when asked", () => {
    expect(render(graph, { theme: "dark" })).toMatch(/--mds-text-primary\s+#f6f6f4/);
  });

  it("filters to one layer", () => {
    const out = render(graph, { layer: "core" });
    expect(out).toContain("--mds-space-1");
    expect(out).not.toContain("--mds-text-primary");
  });

  it("filters to one group", () => {
    const out = render(graph, { group: "surface" });
    expect(out).toContain("--mds-surface-page");
    expect(out).not.toContain("--mds-space-1");
  });

  it("filters by kind, so `what colors do we have` is one question", () => {
    const out = render(graph, { kind: "color" });
    expect(out).toContain("--mds-gray-900");
    expect(out).not.toContain("--mds-space-1");
  });

  it("filters by name", () => {
    const out = render(graph, { grep: "surface" });
    expect(out).toContain("--mds-surface-page");
    expect(out).not.toContain("--mds-text-primary");
  });

  it("says so when a brand has re-pointed a token", () => {
    const out = renderTokens(branded, { color: false });
    expect(out).toMatch(/--mds-surface-page.*#fffdf7/);
    expect(out).toMatch(/brand/);
  });

  it("ends with a count of what it showed", () => {
    expect(render()).toMatch(/7 tokens/);
  });

  it("says when a filter matched nothing rather than printing an empty list", () => {
    expect(render(graph, { grep: "nothing-like-this" })).toMatch(/no tokens match/i);
  });
});
