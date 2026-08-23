import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import {
  breakpointIsDeclared,
  mobileFirstMedia,
  noOuterMargin,
  reachForThePrimitive,
  screenEdgeClearsTheSafeArea,
  scrollerContainsItsOverscroll,
  touchTargets,
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

/* Both of these were judgement until the numbers said otherwise: a tap target
   is a measurement, and a flex container that does nothing but stack things
   with a gap is a primitive somebody rewrote. */
describe("touch-targets", () => {
  const tap = (source: string) => run(touchTargets, source).map((f) => f.message);

  it("flags a pressable shorter than the tap minimum", () => {
    const [finding] = run(touchTargets, ".chip {\n  cursor: pointer;\n  height: 32px;\n}");
    expect(finding).toMatchObject({ rule: "touch-targets", line: 3 });
    expect(finding?.message).toContain("32px");
  });

  it("reads through a token to the value it holds", () => {
    expect(tap(".chip {\n  cursor: pointer;\n  min-height: var(--mds-control-h-md);\n}")).toHaveLength(1);
  });

  it("passes a pressable that reaches it", () => {
    expect(tap(".chip {\n  cursor: pointer;\n  height: var(--mds-tap-min);\n}")).toEqual([]);
  });

  it("takes a control selector as pressable without a cursor", () => {
    expect(tap("button.icon {\n  height: 24px;\n}")).toHaveLength(1);
    expect(tap('[role="tab"] {\n  height: 24px;\n}')).toHaveLength(1);
  });

  it("says nothing about a field that fills the row, which nobody misses", () => {
    expect(tap(".trigger {\n  cursor: pointer;\n  width: 100%;\n  height: 38px;\n}")).toEqual([]);
    expect(tap(".trigger {\n  cursor: pointer;\n  min-width: 48px;\n  height: 38px;\n}")).toEqual([]);
  });

  it("says nothing about a short thing nobody taps", () => {
    expect(tap(".divider {\n  height: 1px;\n}")).toEqual([]);
  });

  it("says nothing about a height it cannot measure", () => {
    expect(tap(".chip {\n  cursor: pointer;\n  height: auto;\n}")).toEqual([]);
    expect(tap(".chip {\n  cursor: pointer;\n  height: 100%;\n}")).toEqual([]);
    expect(tap(".chip {\n  cursor: pointer;\n  height: var(--app-own-size);\n}")).toEqual([]);
  });

  it("skips a system that names no tap minimum", () => {
    const context = buildContext({ root: ROOT, kind: "system", graph, sheets: [] });
    expect(touchTargets.needs!({ ...context, prefix: "--other-" })).toContain("tap");
  });

  it("passes a small control whose own pseudo-element grows the target", () => {
    expect(
      tap(
        ".remove {\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n}\n" +
          ".remove::before {\n  content: \"\";\n  width: max(100%, var(--mds-tap-min));\n" +
          "  height: max(100%, var(--mds-tap-min));\n}",
      ),
    ).toEqual([]);
  });

  it("still flags a pseudo-element that grows only one axis", () => {
    expect(
      tap(
        ".remove {\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n}\n" +
          ".remove::before {\n  content: \"\";\n  width: var(--mds-tap-min);\n  height: 100%;\n}",
      ),
    ).toHaveLength(1);
  });

  it("follows composes to the target the other stylesheet holds", () => {
    const sheets = [
      makeSheet(
        join(ROOT, "src/Tag/Tag.module.css"),
        '.remove {\n  composes: hitArea from "../internal/hit-area.module.css";\n' +
          "  cursor: pointer;\n  height: 20px;\n}",
        ROOT,
        "--mds-",
      ),
      makeSheet(
        join(ROOT, "src/internal/hit-area.module.css"),
        '.hitArea::before {\n  content: "";\n  width: max(100%, var(--mds-tap-min));\n' +
          "  height: max(100%, var(--mds-tap-min));\n}",
        ROOT,
        "--mds-",
      ),
    ];
    expect(touchTargets.check!(buildContext({ root: ROOT, kind: "system", graph, sheets }))).toEqual([]);
  });

  it("reports the control when the composed stylesheet is not one it can read", () => {
    expect(
      tap(
        '.remove {\n  composes: hitArea from "@acme/ds/hit-area.module.css";\n' +
          "  cursor: pointer;\n  height: 20px;\n}",
      ),
    ).toHaveLength(1);
  });
});

describe("reach-for-the-primitive", () => {
  const primitives = ["Stack", "Inline"];

  const app = (source: string, file = "src/components/Feed/Feed.module.css") =>
    reachForThePrimitive.check!(
      buildContext({
        root: ROOT,
        kind: "app",
        graph,
        sheets: [makeSheet(join(ROOT, file), source, ROOT, "--mds-")],
        config: { primitives },
      }),
    );

  it("flags a block that only stacks things with a gap", () => {
    const [finding] = app(".list {\n  display: flex;\n  flex-direction: column;\n  gap: var(--mds-gap-tight);\n}");
    expect(finding).toMatchObject({ rule: "reach-for-the-primitive", line: 1 });
    expect(finding?.message).toContain("Stack");
  });

  it("passes a block that does something else as well", () => {
    expect(app(".card {\n  display: flex;\n  gap: 8px;\n  padding: 8px;\n}")).toEqual([]);
    expect(app(".row {\n  display: flex;\n  gap: 8px;\n  position: sticky;\n}")).toEqual([]);
  });

  it("passes flex without a gap, which is alignment rather than spacing", () => {
    expect(app(".row {\n  display: flex;\n  align-items: center;\n}")).toEqual([]);
  });

  it("skips a repo whose system names no primitives", () => {
    const context = buildContext({ root: ROOT, kind: "app", graph, sheets: [] });
    expect(reachForThePrimitive.needs!(context)).toContain("primitives");
  });

  it("says nothing in the system's own repo, which is where the primitives are written", () => {
    expect(reachForThePrimitive.target).toBe("app");
  });
});

describe("scroller-contains-its-overscroll", () => {
  it("flags a box that scrolls and says nothing about the chain", () => {
    const [finding] = run(scrollerContainsItsOverscroll, ".content {\n  overflow-y: auto;\n}");
    expect(finding).toMatchObject({ rule: "scroller-contains-its-overscroll", line: 1 });
  });

  it("passes a box that contains it on the axis it scrolls", () => {
    expect(
      run(scrollerContainsItsOverscroll, ".content {\n  overflow-y: auto;\n  overscroll-behavior-y: contain;\n}"),
    ).toEqual([]);
  });

  it("takes the shorthand on either side", () => {
    expect(run(scrollerContainsItsOverscroll, ".a {\n  overflow: auto;\n  overscroll-behavior: contain;\n}")).toEqual(
      [],
    );
  });

  it("says nothing about a box that only clips", () => {
    expect(run(scrollerContainsItsOverscroll, ".a {\n  overflow: hidden;\n}")).toEqual([]);
  });

  it("reads the axis — a sideways scroller is not answered by the vertical one", () => {
    const [finding] = run(
      scrollerContainsItsOverscroll,
      ".rail {\n  overflow-x: auto;\n  overscroll-behavior-y: contain;\n}",
    );
    expect(finding?.message).toContain("overflow-x");
  });
});
