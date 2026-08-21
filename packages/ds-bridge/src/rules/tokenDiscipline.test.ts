import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet, type Config } from "../context.js";
import { loadGraph } from "../graph.js";
import { noLiteralColor, noLiteralLength, noRawScaleStep, noUndefinedToken } from "./tokenDiscipline.js";
import type { Rule } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const ROOT = "/app";
const graph = loadGraph({ system: SYSTEM });

const run = (rule: Rule, source: string, file = "src/Button.module.css", config?: Config) =>
  rule.check!(
    buildContext({
      root: ROOT,
      kind: "system",
      graph,
      sheets: [makeSheet(join(ROOT, file), source, ROOT, "--mds-")],
      ...(config ? { config } : {}),
    }),
  );

const messages = (rule: Rule, source: string, file?: string, config?: Config) =>
  run(rule, source, file, config).map((f) => f.message);

describe("no-literal-color", () => {
  it("flags a hex", () => {
    const [finding] = run(noLiteralColor, ".a { color: #ff0000; }");
    expect(finding).toMatchObject({ rule: "no-literal-color", file: "src/Button.module.css", line: 1 });
    expect(finding?.message).toContain("#ff0000");
  });

  it("flags rgba and hsl", () => {
    expect(messages(noLiteralColor, ".a { box-shadow: 0 0 rgba(0, 0, 0, 0.4); }")).toHaveLength(1);
    expect(messages(noLiteralColor, ".a { color: hsl(200 50% 40%); }")).toHaveLength(1);
  });

  it("passes a semantic alias", () => {
    expect(run(noLiteralColor, ".a { color: var(--mds-text-primary); }")).toEqual([]);
  });

  it("ignores a hex written in a comment", () => {
    expect(run(noLiteralColor, ".a { /* was #ff0000 */ color: var(--mds-text-primary); }")).toEqual([]);
  });

  it("reports the line the literal is on", () => {
    const source = ".a {\n  color: var(--mds-text-primary);\n}\n.b {\n  color: #123456;\n}";
    expect(run(noLiteralColor, source)[0]?.line).toBe(5);
  });
});

describe("no-literal-length", () => {
  it("flags a px length", () => {
    expect(messages(noLiteralLength, ".a { padding: 12px; }")[0]).toContain("12px");
  });

  it("flags a px fallback inside var()", () => {
    expect(messages(noLiteralLength, ".a { gap: var(--mds-gap, 8px); }")).toHaveLength(1);
  });

  /* A prelude has to spell the number out, so the length in one is not this
     rule's to judge — breakpoint-is-declared holds it to the breakpoint list. */
  it("leaves a media prelude alone", () => {
    expect(run(noLiteralLength, "@media (min-width: 600px) {\n  .a { gap: var(--mds-gap); }\n}")).toEqual([]);
    expect(run(noLiteralLength, "@media (min-width: 640px) { .a { gap: 0 } }")).toEqual([]);
  });

  it("flags a declared breakpoint used outside a prelude", () => {
    expect(messages(noLiteralLength, ".a { width: 600px; }")).toHaveLength(1);
  });

  it("passes a token", () => {
    expect(run(noLiteralLength, ".a { padding: var(--mds-gap); }")).toEqual([]);
  });

  /* A negative offset read as positive is the one finding whose advice moves the
     element to the other side of the box — and it applies clean. */
  it("keeps the sign on a negative length", () => {
    expect(messages(noLiteralLength, ".a { top: -4px; }")[0]).toContain("-4px");
  });

  it("never offers a bare token for a negative length", () => {
    expect(messages(noLiteralLength, ".a { top: -4px; }")[0]).not.toMatch(/var\(--mds-[a-z0-9-]+\) has that value/);
  });

  it("offers the negated token when one holds the magnitude", () => {
    expect(messages(noLiteralLength, ".a { top: -4px; }")[0]).toMatch(/calc\(-1 \* var\(--mds-[a-z0-9-]+\)\)/);
  });

  it("advises without a token when nothing holds the magnitude", () => {
    expect(messages(noLiteralLength, ".a { top: -37px; }")[0]).toContain("-37px");
  });
});

describe("no-raw-scale-step", () => {
  it("flags a spacing step", () => {
    expect(messages(noRawScaleStep, ".a { gap: var(--mds-space-2); }")[0]).toContain("--mds-space-2");
  });

  it("flags a typographic step", () => {
    expect(messages(noRawScaleStep, ".a { font-size: var(--mds-text-sm); }")).toHaveLength(1);
  });

  it("passes a semantic alias built on a step", () => {
    expect(run(noRawScaleStep, ".a { gap: var(--mds-gap); }")).toEqual([]);
  });

  it("passes a core token that names a role rather than a rung", () => {
    expect(run(noRawScaleStep, ".a { height: var(--mds-control-h-md); }")).toEqual([]);
    expect(run(noRawScaleStep, ".a { padding: var(--mds-pad-control-md); }")).toEqual([]);
    expect(run(noRawScaleStep, ".a { font-weight: var(--mds-weight-semibold); }")).toEqual([]);
  });

  it("passes a step the sheet declares an alias for itself", () => {
    expect(run(noRawScaleStep, ".a { --mds-space-2: 8px; gap: var(--mds-space-2); }")).toEqual([]);
  });

  it("exempts one scale in one file without exempting the rule", () => {
    const config = { exempt: { "no-raw-scale-step/typography": ["src/Link.module.css"] } };
    const source = ".a { font-size: var(--mds-text-sm); gap: var(--mds-space-2); }";
    expect(messages(noRawScaleStep, source, "src/Link.module.css", config)).toEqual([
      expect.stringContaining("--mds-space-2"),
    ]);
  });

  it("takes the set of scales from the config", () => {
    const config = { scales: ["spacing"] };
    expect(run(noRawScaleStep, ".a { font-size: var(--mds-text-sm); }", undefined, config)).toEqual([]);
  });
});

describe("no-undefined-token", () => {
  it("flags a token nothing declares", () => {
    expect(messages(noUndefinedToken, ".a { color: var(--mds-text-primry); }")[0]).toContain("--mds-text-primry");
  });

  it("passes a token declared in the same sheet", () => {
    expect(run(noUndefinedToken, ".a { --mds-button-h: 40px; height: var(--mds-button-h); }")).toEqual([]);
  });

  it("passes an undeclared token read with a fallback", () => {
    expect(run(noUndefinedToken, ".a { width: var(--mds-icon-slot, 1em); }")).toEqual([]);
  });

  it("flags the same runtime token read without one", () => {
    expect(messages(noUndefinedToken, ".a { width: var(--mds-icon-slot); }")).toHaveLength(1);
  });

  it("passes tokens the system declares", () => {
    expect(run(noUndefinedToken, ".a { color: var(--mds-text-primary); gap: var(--mds-space-1); }")).toEqual([]);
  });
});

describe("as prose", () => {
  it("every rule says what it prevents and what to do instead", () => {
    for (const rule of [noLiteralColor, noLiteralLength, noRawScaleStep, noUndefinedToken]) {
      expect(rule.id).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(rule.title.endsWith(".")).toBe(true);
      expect(rule.why.length).toBeGreaterThan(40);
      expect(rule.instead.length).toBeGreaterThan(40);
    }
  });
});
