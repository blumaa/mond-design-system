import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildContext } from "../context.js";
import { loadGraph } from "../graph.js";
import { loadRoles, type RolesFile } from "../roles.js";
import { fontsLiveInTheApp, noRawElementOverComponent, stylePropNeedsAToken } from "./styleProp.js";
import type { Rule } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const graph = loadGraph({ system: SYSTEM });

const run = (
  rule: Rule,
  source: string,
  {
    kind = "system",
    file = "src/Button.tsx",
    fonts = [] as string[],
    roles,
  }: { kind?: string; file?: string; fonts?: string[]; roles?: RolesFile } = {},
) =>
  rule.check!(
    buildContext({
      root: "/app",
      kind: kind as "system" | "app",
      graph,
      sheets: [],
      sources: [{ file, source }],
      fonts,
      ...(roles ? { roles: loadRoles(roles, graph.names()) } : {}),
    }),
  );

describe("style-prop-needs-a-token", () => {
  it("passes a declaration that sets a custom property", () => {
    expect(run(stylePropNeedsAToken, '<i style={{ "--progress": `${n}%` }} />')).toEqual([]);
  });

  it("passes a value read from a token", () => {
    expect(run(stylePropNeedsAToken, '<i style={{ color: "var(--mds-text-primary)" }} />')).toEqual([]);
  });

  it("passes a var whose name is chosen at runtime", () => {
    expect(run(stylePropNeedsAToken, "<i style={{ font: `var(${token})` }} />")).toEqual([]);
  });

  it("flags a literal length and names every token holding that value", () => {
    const [finding] = run(stylePropNeedsAToken, "<i style={{ gap: 8 }} />");
    expect(finding).toMatchObject({ rule: "style-prop-needs-a-token", file: "src/Button.tsx", line: 1 });
    expect(finding?.message).toContain("--mds-gap");
    expect(finding?.message).toContain("--mds-space-2");
  });

  it("names the one token when only one holds the value", () => {
    const [finding] = run(stylePropNeedsAToken, "<i style={{ gap: 4 }} />");
    expect(finding?.message).toMatch(/var\(--mds-[a-z0-9-]+\) has that value/);
  });

  it("flags a runtime value that reaches no token", () => {
    const messages = run(stylePropNeedsAToken, "<i style={{ maxHeight: gone ? 0 : undefined }} />").map(
      (f) => f.message,
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("custom property");
  });

  it("does not read a unitless number as a length", () => {
    const [finding] = run(stylePropNeedsAToken, "<i style={{ flex: 1 }} />");
    expect(finding?.message).not.toContain("has that value");
  });

  it("flags a keyword, which is still a decision the stylesheet should own", () => {
    expect(run(stylePropNeedsAToken, '<i style={{ display: "flex" }} />')).toHaveLength(1);
  });

  it("says nothing about a style it is only passing on", () => {
    expect(run(stylePropNeedsAToken, "<i style={{ ...vars, ...style }} />")).toEqual([]);
  });

  /* A style prop is written in the DOM's spelling and roles are written in the
     stylesheet's, so the key is translated once, here, and the finding carries
     the CSS name every other rule reports. */
  it("names the property as CSS spells it", () => {
    const [finding] = run(stylePropNeedsAToken, "<i style={{ maxHeight: 8 }} />");
    expect(finding?.property).toBe("max-height");
  });

  it("takes the property into account once the system says what a token is for", () => {
    const roles: RolesFile = {
      version: 1,
      roles: { gap: { properties: ["gap"], tokens: ["--mds-gap*"] } },
    };
    const [finding] = run(stylePropNeedsAToken, "<i style={{ gap: 8 }} />", { roles });
    expect(finding).toMatchObject({ confidence: "certain", autofix: "var(--mds-gap)" });
  });
});

describe("fonts-live-in-the-app", () => {
  it("flags a typeface the system carries", () => {
    const [finding] = run(fontsLiveInTheApp, "", { fonts: ["packages/react/src/Inter.woff2"] });
    expect(finding).toMatchObject({ rule: "fonts-live-in-the-app", file: "packages/react/src/Inter.woff2" });
  });

  it("flags a face the system declares", () => {
    const found = run(fontsLiveInTheApp, "@font-face { font-family: Inter; }", { file: "src/type.tsx" });
    expect(found).toHaveLength(1);
  });

  it("passes a system that carries none", () => {
    expect(run(fontsLiveInTheApp, "")).toEqual([]);
  });
});

describe("no-raw-element-over-component", () => {
  const app = { kind: "app" as const, file: "src/Signup.tsx" };

  it("flags a raw element the system has a component for", () => {
    const [finding] = run(noRawElementOverComponent, "<button onClick={go}>Go</button>", app);
    expect(finding).toMatchObject({ rule: "no-raw-element-over-component", line: 1 });
    expect(finding?.message).toContain("Button");
  });

  it("passes the component itself", () => {
    expect(run(noRawElementOverComponent, "<Button onClick={go}>Go</Button>", app)).toEqual([]);
  });

  it("passes an anchor that is not a link in disguise", () => {
    expect(run(noRawElementOverComponent, "<article><p>text</p></article>", app)).toEqual([]);
  });

  it("is aimed at apps: the system is where the raw element has to be written", () => {
    expect(noRawElementOverComponent.target).toBe("app");
  });
});

describe("a style-prop finding as data", () => {
  it("carries the key, the value and every token that could be meant", () => {
    const [finding] = run(stylePropNeedsAToken, "<i style={{ padding: 8 }} />");
    expect(finding).toMatchObject({
      property: "padding",
      value: "8px",
      candidates: ["--mds-gap", "--mds-space-2"],
      confidence: "value-only",
    });
  });

  it("carries a replacement only when one token can be meant", () => {
    const [finding] = run(stylePropNeedsAToken, '<i style={{ padding: "4px" }} />');
    expect(finding).toMatchObject({ confidence: "certain", autofix: "var(--mds-space-1)" });
  });

  it("says none for a value the scale does not hold, and for one that is not a length", () => {
    const [length] = run(stylePropNeedsAToken, "<i style={{ padding: 37 }} />");
    expect(length).toMatchObject({ confidence: "none", candidates: [] });
    const [other] = run(stylePropNeedsAToken, '<i style={{ display: "flex" }} />');
    expect(other).toMatchObject({ confidence: "none", value: "flex" });
  });
});
