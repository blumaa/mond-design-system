import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import {
  breakpointIsDeclared,
  mobileFirstMedia,
  noOuterMargin,
  screenEdgeClearsTheSafeArea,
  viewportHeightIsAToken,
  zIndexIsAToken,
} from "./layout.js";
import type { Rule } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const ROOT = "/app";
const graph = loadGraph({ system: SYSTEM });

const run = (rule: Rule, source: string, file = "src/Button/Button.module.css") =>
  rule.check!(
    buildContext({
      root: ROOT,
      kind: "system",
      graph,
      sheets: [makeSheet(join(ROOT, file), source, ROOT, "--mds-")],
    }),
  );

const messages = (rule: Rule, source: string, file?: string) => run(rule, source, file).map((f) => f.message);

describe("mobile-first-media", () => {
  it("flags a max-width query", () => {
    const [finding] = run(mobileFirstMedia, "@media (max-width: 600px) {\n  .a { top: 0; }\n}");
    expect(finding).toMatchObject({ rule: "mobile-first-media", line: 1 });
  });

  it("passes a min-width query", () => {
    expect(run(mobileFirstMedia, "@media (min-width: 600px) {\n  .a { top: 0; }\n}")).toEqual([]);
  });

  it("leaves a feature query alone", () => {
    expect(run(mobileFirstMedia, "@media (prefers-reduced-motion: reduce) {\n  .a { top: 0; }\n}")).toEqual([]);
  });
});

describe("breakpoint-is-declared", () => {
  it("passes a query on a declared breakpoint", () => {
    expect(run(breakpointIsDeclared, "@media (min-width: 600px) {\n  .a { top: 0; }\n}")).toEqual([]);
  });

  it("flags a width no token names", () => {
    expect(messages(breakpointIsDeclared, "@media (min-width: 640px) {\n  .a { top: 0; }\n}")[0]).toContain(
      "640px",
    );
  });

  it("says so when the system declares no breakpoints", () => {
    const context = buildContext({ root: ROOT, kind: "system", graph: loadGraph({ system: SYSTEM }), sheets: [] });
    expect(breakpointIsDeclared.needs?.({ ...context, prefix: "--none-" })).toBeDefined();
  });
});

describe("z-index-is-a-token", () => {
  it("flags a number", () => {
    expect(messages(zIndexIsAToken, ".a { z-index: 300; }")[0]).toContain("300");
  });

  it("passes a token", () => {
    expect(run(zIndexIsAToken, ".a { z-index: var(--mds-z-modal); }")).toEqual([]);
  });

  it("passes the two values that stack nothing", () => {
    expect(run(zIndexIsAToken, ".a { z-index: 0; }\n.b { z-index: auto; }")).toEqual([]);
  });
});

describe("viewport-height-is-a-token", () => {
  it("flags a raw viewport height", () => {
    expect(messages(viewportHeightIsAToken, ".a { height: 100dvh; }")[0]).toContain("100dvh");
    expect(messages(viewportHeightIsAToken, ".a { min-height: 100vh; }")).toHaveLength(1);
  });

  it("passes the token", () => {
    expect(run(viewportHeightIsAToken, ".a { height: var(--mds-vvh); }")).toEqual([]);
  });
});

describe("screen-edge-clears-the-safe-area", () => {
  it("flags a bar pinned to the bottom with no safe token in sight", () => {
    const [finding] = run(screenEdgeClearsTheSafeArea, ".a {\n  position: fixed;\n  bottom: 0;\n}");
    expect(finding).toMatchObject({ rule: "screen-edge-clears-the-safe-area", line: 1 });
  });

  it("passes when the edge itself clears it", () => {
    expect(
      run(screenEdgeClearsTheSafeArea, ".a {\n  position: fixed;\n  bottom: var(--mds-safe-bottom);\n}"),
    ).toEqual([]);
  });

  it("passes when padding clears it", () => {
    expect(
      run(
        screenEdgeClearsTheSafeArea,
        ".a {\n  position: fixed;\n  bottom: 0;\n  padding-bottom: var(--mds-safe-bottom);\n}",
      ),
    ).toEqual([]);
  });

  it("leaves a full-bleed scrim alone", () => {
    expect(run(screenEdgeClearsTheSafeArea, ".a {\n  position: fixed;\n  inset: 0;\n}")).toEqual([]);
  });

  it("leaves a horizontal edge alone", () => {
    expect(run(screenEdgeClearsTheSafeArea, ".a {\n  position: fixed;\n  left: 0;\n}")).toEqual([]);
  });
});

describe("no-outer-margin", () => {
  it("flags a margin on the component's root class", () => {
    const [finding] = run(noOuterMargin, ".button {\n  margin-top: var(--mds-gap);\n}");
    expect(finding?.message).toContain("margin-top");
  });

  it("passes a margin on something inside the component", () => {
    expect(run(noOuterMargin, ".icon {\n  margin-top: var(--mds-gap);\n}")).toEqual([]);
  });

  it("passes a reset and a centring margin", () => {
    expect(run(noOuterMargin, ".button { margin: 0; }")).toEqual([]);
    expect(run(noOuterMargin, ".button { margin-inline: auto; }")).toEqual([]);
    expect(run(noOuterMargin, ".button { margin: 0 auto; }")).toEqual([]);
  });

  it("still sees the root class under a state or a media query", () => {
    expect(run(noOuterMargin, ".button:hover { margin-top: 1px; }")).toHaveLength(1);
    expect(
      run(noOuterMargin, "@media (min-width: 600px) {\n  .button { margin-top: var(--mds-gap); }\n}"),
    ).toHaveLength(1);
  });
});
