/* The gate, seen failing.
 *
 * A gate never observed to fail is indistinguishable from one that cannot, so
 * these run the whole command — argument parsing, discovery, rules, exit code —
 * against throwaway trees. `main` returns the code instead of setting it, which
 * is the only reason no subprocess is needed here.
 */
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { main } from "./main.js";

let root: string | undefined;

function tree(files: Record<string, string>): string {
  root = mkdtempSync(join(tmpdir(), "mds-check-"));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = undefined;
  vi.restoreAllMocks();
});

/* The same fixture system the rule tests use: one statement of what a design
   system looks like, checked from both ends. */
const SYSTEM = fileURLToPath(new URL("./__fixtures__/system/styles.css", import.meta.url));

/** The command, run; its exit code and everything it printed. */
function run(argv: string[]): { status: number; output: string } {
  let output = "";
  const capture = (chunk: string | Uint8Array) => {
    output += String(chunk);
    return true;
  };
  vi.spyOn(process.stdout, "write").mockImplementation(capture);
  vi.spyOn(process.stderr, "write").mockImplementation(capture);
  const status = main(argv);
  return { status, output };
}

const check = (dir: string, ...rest: string[]) =>
  run(["check", "--root", dir, "--system", SYSTEM, "--no-color", ...rest]);

const app = (component: string, extra: Record<string, string> = {}) =>
  tree({ "src/Button.module.css": component, ...extra });

describe("mds check", () => {
  it("passes a clean tree and says what it looked at", () => {
    const { status, output } = check(
      app(".root { background: var(--mds-surface-card); padding: var(--mds-pad-control-md); }"),
    );
    expect(status).toBe(0);
    expect(output).toContain("clean");
    expect(output).toContain("stylesheets");
  });

  it("fails a literal hex, and names the token that already holds it", () => {
    const { status, output } = check(app(".root { color: #232323; }"));
    expect(status).toBe(1);
    expect(output).toContain("#232323");
    expect(output).toContain("--mds-text-primary");
    expect(output).toContain("no-literal-color");
  });

  it("fails a literal px outside a breakpoint prelude", () => {
    expect(check(app(".root { padding: 8px; }")).status).toBe(1);
  });

  it("allows a declared breakpoint in a @media prelude, and refuses an undeclared one", () => {
    expect(check(app("@media (min-width: 600px) { .root { display: flex; } }")).status).toBe(0);
    rmSync(root!, { recursive: true, force: true });
    expect(check(app("@media (min-width: 900px) { .root { display: flex; } }")).status).toBe(1);
  });

  it("fails a raw scale step", () => {
    const { status, output } = check(app(".root { padding: var(--mds-space-2); }"));
    expect(status).toBe(1);
    expect(output).toContain("no-raw-scale-step");
  });

  it("fails an undefined token, and accepts one read with a fallback", () => {
    expect(check(app(".root { color: var(--mds-text-primry); }")).status).toBe(1);
    rmSync(root!, { recursive: true, force: true });
    expect(check(app(".root { width: var(--mds-icon-slot, var(--mds-pad-control-md)); }")).status).toBe(0);
  });

  it("ignores raw values inside comments", () => {
    const source = "/* chosen because 32px cleared #ffffff */\n.root { padding: var(--mds-pad-control-md); }";
    expect(check(app(source)).output).toContain("clean");
  });

  it("runs one rule when asked", () => {
    const { output } = check(app(".root { padding: 8px; color: #ff0000; }"), "--rule", "no-literal-color");
    expect(output).toContain("no-literal-color");
    expect(output).not.toContain("no-literal-length");
  });

  it("honours an exemption from the config, and says nothing about the file", () => {
    const dir = app(".root { padding: 8px; }", {
      "mds.config.json": JSON.stringify({ exempt: { "no-literal-length": ["src/Button.module.css"] } }),
    });
    expect(check(dir).status).toBe(0);
  });

  it("emits findings as JSON", () => {
    const { output } = check(app(".root { background: #ff0000; }"), "--json");
    const findings = JSON.parse(output) as Array<{ rule: string; file: string; line: number }>;
    expect(findings[0]).toMatchObject({ rule: "no-literal-color", file: "src/Button.module.css", line: 1 });
  });
});

describe("mds", () => {
  it("prints usage with no command, and fails", () => {
    const { status, output } = run([]);
    expect(status).toBe(1);
    expect(output).toContain("mds tokens");
  });

  it("prints usage on request, and passes", () => {
    expect(run(["help"]).status).toBe(0);
  });

  it("refuses an unknown command", () => {
    const { status, output } = run(["lint"]);
    expect(status).toBe(1);
    expect(output).toContain('unknown command "lint"');
  });
});

describe("mds migrate", () => {
  it("reports what an app would have to move", () => {
    const dir = app(".card { padding: 12px; }", {
      "tokens.css": ":root { --app-gap: 8px; --app-brand: #7b3fe4; }",
    });
    const { status, output } = run(["migrate", "--root", dir, "--system", SYSTEM, "--no-color"]);
    expect(status).toBe(0);
    expect(output).toContain("--app-gap");
    expect(output).toContain("--mds-gap");
    expect(output).toContain("brand-template.css");
    expect(output).toContain("12px");
  });

  it("emits the plan as JSON", () => {
    const dir = app(".card { color: #232323; }", { "tokens.css": ":root { --app-ink: #232323; }" });
    const { output } = run(["migrate", "--root", dir, "--system", SYSTEM, "--json"]);
    const plan = JSON.parse(output) as { own: Array<{ name: string; equivalent?: string }> };
    expect(plan.own[0]).toMatchObject({ name: "--app-ink", equivalent: "--mds-text-primary" });
  });
});

describe("mds rules", () => {
  it("lists every rule", () => {
    const { status, output } = run(["rules", "--no-color"]);
    expect(status).toBe(0);
    expect(output).toContain("no-literal-color");
    expect(output).toContain("keeps-contrast");
  });

  it("prints the reasoning for one", () => {
    const { output } = run(["rules", "no-literal-color", "--no-color"]);
    expect(output).toContain("Instead:");
  });

  it("says so when the id is not a rule", () => {
    const { output } = run(["rules", "no-such-rule", "--no-color"]);
    expect(output).toContain("no rule called");
  });

  it("writes the whole set as markdown for an agent", () => {
    const { output } = run(["rules", "--markdown"]);
    expect(output).toContain("## no-literal-color");
    expect(output).toContain("**Instead.**");
  });
});
