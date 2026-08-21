import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { loadContext, makeSheet } from "./context.js";

const SYSTEM = fileURLToPath(new URL("./__fixtures__/system/styles.css", import.meta.url));

const sheet = (source: string, system: string[] = []) =>
  makeSheet("/app/src/x.module.css", source, "/app", "--mds-", new Set(system));

describe("brand or component", () => {
  it("a sheet declaring a token on itself is a component's", () => {
    expect(sheet(".button { --mds-icon-slot: 1em; }").isBrand).toBe(false);
  });

  it("a sheet declaring one at the document root is a brand file", () => {
    expect(sheet(":root { --mds-accent: #f60; }").isBrand).toBe(true);
    expect(sheet('[data-theme="dark"] { --mds-accent: #f93; }').isBrand).toBe(true);
    expect(sheet("html, body { --mds-accent: #f60; }").isBrand).toBe(true);
  });

  it("re-pointing a contract token is a brand file wherever it is written", () => {
    expect(sheet(".theme-warm { --mds-surface-page: #fff; }", ["--mds-surface-page"]).isBrand).toBe(true);
  });

  it("a file that declares the app's own scale is a value source, not a component's", () => {
    const s = sheet(":root { --fp-space-2: 8px; }");
    expect(s.isTokens).toBe(true);
    expect(s.isBrand).toBe(false);
  });

  it("a sheet that only reads tokens is a component's", () => {
    const s = sheet(".card { color: var(--mds-text-primary); }");
    expect(s.isBrand).toBe(false);
    expect(s.isTokens).toBe(false);
  });

  it("records what it declares and keeps line numbers through comments", () => {
    const s = sheet("/* a\n   comment */\n.button { --mds-icon-slot: 1em; }");
    expect([...s.declares]).toEqual(["--mds-icon-slot"]);
    expect(s.lines).toHaveLength(3);
    expect(s.file).toBe("src/x.module.css");
  });
});

/* An app whose tests and stories carry exactly the debt its source does: the
   only question is which of it gets reported. */
const app = (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), "dsbridge-"));
  for (const [name, source] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), source);
  }
  return root;
};

const APP = {
  "src/Card.tsx": "export const Card = () => <div />;",
  "src/Card.test.tsx": "it('renders', () => {});",
  "src/Card.stories.tsx": "export const Default = () => <Card />;",
  "src/Card.module.css": ".card { padding: 13px; }",
  "src/__fixtures__/legacy.css": ".old { padding: 13px; }",
};

describe("what a check reads", () => {
  it("leaves out tests, stories and fixtures, and says how many", () => {
    const context = loadContext({ root: app(APP), system: SYSTEM });
    expect(context.sources.map((s) => s.file)).toEqual(["src/Card.tsx"]);
    expect(context.sheets.map((s) => s.file)).toEqual(["src/Card.module.css"]);
    expect(context.suppressed.tests).toBe(3);
  });

  it("reads them when asked to", () => {
    const context = loadContext({ root: app(APP), system: SYSTEM, includeTests: true });
    expect(context.sources.map((s) => s.file).sort()).toEqual([
      "src/Card.stories.tsx",
      "src/Card.test.tsx",
      "src/Card.tsx",
    ]);
    expect(context.suppressed.tests).toBe(0);
  });

  it("reads only what `sources` names, when a repo names any", () => {
    const config = { sources: ["src/components/**"] };
    const context = loadContext({
      root: app({ ...APP, "src/components/Button.tsx": "export const Button = () => <button />;" }),
      system: SYSTEM,
      config,
    });
    expect(context.sources.map((s) => s.file)).toEqual(["src/components/Button.tsx"]);
  });

  it("takes a glob in `ignore`, and a path prefix still means the directory", () => {
    const context = loadContext({
      root: app(APP),
      system: SYSTEM,
      config: { ignore: ["**/*.module.css"] },
    });
    expect(context.sheets).toHaveLength(0);
  });

  it("takes a glob in `exempt`, so one rule can be lifted off a directory", () => {
    const context = loadContext({
      root: app(APP),
      system: SYSTEM,
      config: { exempt: { "no-literal-length": ["src/**"] } },
    });
    expect(context.exempt("no-literal-length", "src/Card.module.css")).toBe(true);
    expect(context.exempt("no-literal-length", "other/Card.module.css")).toBe(false);
  });
});

describe("content that is not on disk yet", () => {
  it("checks the pending text in place of the file", () => {
    const root = app({ "src/Card.module.css": ".card { padding: var(--mds-pad-control-md); }" });
    const context = loadContext({
      root,
      system: SYSTEM,
      pending: { file: "src/Card.module.css", source: ".card { padding: 13px; }" },
    });
    const sheet = context.sheets.find((s) => s.file === "src/Card.module.css");
    expect(sheet?.source).toContain("13px");
  });

  it("checks a file that does not exist yet, which is the whole point of Write", () => {
    const root = app({ "src/Card.module.css": ".card { color: var(--mds-text-primary); }" });
    const context = loadContext({
      root,
      system: SYSTEM,
      pending: { file: "src/New.module.css", source: ".new { padding: 13px; }" },
    });
    expect(context.sheets.map((s) => s.file)).toContain("src/New.module.css");
  });

  it("takes an absolute path, because a hook is given one", () => {
    const root = app({ "src/Card.module.css": ".card { padding: 4px; }" });
    const context = loadContext({
      root,
      system: SYSTEM,
      pending: { file: join(root, "src/Card.module.css"), source: ".card { padding: 13px; }" },
    });
    expect(context.sheets).toHaveLength(1);
    expect(context.sheets[0]?.source).toContain("13px");
  });

  it("scans a pending test file, since the agent is writing it right now", () => {
    const root = app({ "src/Card.module.css": ".card { padding: 4px; }" });
    const context = loadContext({
      root,
      system: SYSTEM,
      pending: { file: "src/Card.stories.tsx", source: "export const a = 1;" },
    });
    expect(context.sources.map((s) => s.file)).toContain("src/Card.stories.tsx");
  });
});
