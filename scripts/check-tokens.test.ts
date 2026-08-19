// The gate, seen failing. A gate never observed to fail is indistinguishable
// from one that cannot. Builds throwaway trees and runs check-tokens.mjs
// against them via --root.
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT = fileURLToPath(new URL("./check-tokens.mjs", import.meta.url));

let root: string;

function tree(files: Record<string, string>) {
  root = mkdtempSync(join(tmpdir(), "mds-gate-"));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
});

function run(dir: string): { status: number; output: string } {
  try {
    const output = execFileSync("node", [SCRIPT, "--root", dir], { encoding: "utf8" });
    return { status: 0, output };
  } catch (error) {
    const failed = error as { status: number; stderr: string };
    return { status: failed.status, output: failed.stderr };
  }
}

const SYSTEM = `:root {
  --mds-surface-card: #ffffff;
  --mds-space-2: 8px;
  --mds-pad-tight: var(--mds-space-2);
  --mds-text-sm: 0.8125rem;
  --mds-text-button-sm: var(--mds-text-sm);
  --mds-bp-md: 768px;
}`;

describe("check-tokens gate", () => {
  it("passes a clean tree", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        ".root { background: var(--mds-surface-card); padding: var(--mds-pad-tight); font-size: var(--mds-text-button-sm); }",
    });
    expect(run(dir).status).toBe(0);
  });

  it("fails a raw scale step in a component sheet", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        ".root { padding: var(--mds-space-2); }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("raw scale step --mds-space-2");
  });

  it("fails a raw text step in a component sheet", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        ".root { font-size: var(--mds-text-sm); }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("raw scale step --mds-text-sm");
  });

  it("allows the text scale in the one sheet whose size prop names the step", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Link/Link.module.css":
        ".size-sm { font-size: var(--mds-text-sm); }",
    });
    expect(run(dir).status).toBe(0);
  });

  it("fails a literal hex in a component sheet", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css": ".root { color: #ff0000; }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("literal color #ff0000");
  });

  it("fails a literal px outside a breakpoint prelude", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css": ".root { padding: 8px; }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("literal length 8px");
  });

  it("allows a declared breakpoint in a @media prelude", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        "@media (min-width: 768px) { .root { display: flex; } }",
    });
    expect(run(dir).status).toBe(0);
  });

  it("fails an undeclared breakpoint in a @media prelude", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        "@media (min-width: 900px) { .root { display: flex; } }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("off the breakpoint list");
  });

  it("fails an undefined token", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        ".root { color: var(--mds-text-primry); }",
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("undefined token --mds-text-primry");
  });

  it("allows a component-local token declared and consumed in the same sheet", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        ".root { --mds-button-gap: var(--mds-pad-tight); gap: var(--mds-button-gap); }",
    });
    expect(run(dir).status).toBe(0);
  });

  it("ignores raw values inside comments", () => {
    const dir = tree({
      "packages/tokens/src/core/layout.css": SYSTEM,
      "packages/react/src/components/Button/Button.module.css":
        "/* chosen because 32px cleared #ffffff on the mock */\n.root { padding: var(--mds-pad-tight); }",
    });
    expect(run(dir).status).toBe(0);
  });

  it("fails a brand file missing a semantic contract token", () => {
    const dir = tree({
      "packages/tokens/src/semantic.css":
        ":root { --mds-text-primary: #111111; --mds-surface-page: #ffffff; }",
      "packages/tokens/src/brands/testbrand.css":
        '[data-brand="testbrand"] { --mds-text-primary: #222222; }\n' +
        '[data-brand="testbrand"][data-theme="dark"] { --mds-text-primary: #eeeeee; }',
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain("missing semantic token --mds-surface-page");
  });

  it("fails a brand file with no dark scope", () => {
    const dir = tree({
      "packages/tokens/src/semantic.css": ":root { --mds-text-primary: #111111; }",
      "packages/tokens/src/brands/testbrand.css":
        '[data-brand="testbrand"] { --mds-text-primary: #222222; }',
    });
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.output).toContain('no [data-theme="dark"] scope');
  });
});
