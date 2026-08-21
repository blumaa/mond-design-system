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

describe("dsbridge check", () => {
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
      "dsbridge.config.json": JSON.stringify({ exempt: { "no-literal-length": ["src/Button.module.css"] } }),
    });
    expect(check(dir).status).toBe(0);
  });

  it("finds the design system where the config says it lives", () => {
    const dir = tree({
      "design/tokens/styles.css": ":root { --k-surface-page: #ffffff; }",
      "src/Card.module.css": ".root { background: var(--k-surface-page); }",
      "dsbridge.config.json": JSON.stringify({ prefix: "--k-", system: "design/tokens/styles.css" }),
    });
    const { status, output } = run(["check", "--root", dir, "--no-color"]);
    expect(status).toBe(0);
    expect(output).toContain("clean");
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
    expect(output).toContain("dsbridge tokens");
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

describe("dsbridge migrate", () => {
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

describe("dsbridge rules", () => {
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

  /* The distinction is the whole model: a reader that cannot tell a proved
     finding from an argument has been given a pile of opinions. */
  it("says which rules are checked when read as JSON", () => {
    const { output } = run(["rules", "--json"]);
    const rules = JSON.parse(output) as Array<{ id: string; enforced: boolean; check?: unknown }>;
    expect(rules.find((rule) => rule.id === "no-literal-color")?.enforced).toBe(true);
    expect(rules.find((rule) => rule.id === "belongs-in-the-system")?.enforced).toBe(false);
    expect(rules.every((rule) => rule.check === undefined)).toBe(true);
  });
});

describe("dsbridge arguments", () => {
  const dirty = ".root { padding: 8px; }";
  const clean = ".root { padding: var(--mds-pad-control-md); }";

  it("takes a path as a filter, and reports only what is under it", () => {
    const dir = tree({ "src/a/A.module.css": dirty, "src/b/B.module.css": dirty });
    const { status, output } = check(dir, "src/a");
    expect(status).toBe(1);
    expect(output).toContain("src/a/A.module.css");
    expect(output).not.toContain("src/b/B.module.css");
  });

  it("is clean when the filtered path holds nothing", () => {
    const dir = tree({ "src/a/A.module.css": clean, "src/b/B.module.css": dirty });
    expect(check(dir, "src/a").status).toBe(0);
  });

  it("filters migrate by path too", () => {
    const dir = tree({ "src/a/A.module.css": dirty, "src/b/B.module.css": dirty });
    const { output } = run(["migrate", "--root", dir, "--system", SYSTEM, "--no-color", "src/a"]);
    expect(output).not.toContain("src/b");
  });

  /* A stack trace is the tool failing to answer, printed as if it were an
     answer. Every verb, every parse failure, one line. */
  const noStack = (output: string) => {
    expect(output).not.toMatch(/\n\s+at /);
    expect(output).not.toContain("ERR_PARSE_ARGS");
  };

  it("says what is wrong with an unknown option, on every verb", () => {
    for (const verb of ["tokens", "check", "rules", "migrate"]) {
      const { status, output } = run([verb, "--nonsense"]);
      expect(status).toBe(1);
      expect(output).toContain("--nonsense");
      noStack(output);
    }
  });

  it("names the verb that does not take the option", () => {
    const { status, output } = run(["tokens", "--root", "/tmp"]);
    expect(status).toBe(1);
    expect(output).toContain("--root");
    expect(output).toContain("tokens");
    noStack(output);
  });

  it("says so when an option is given no value", () => {
    const { status, output } = run(["check", "--rule"]);
    expect(status).toBe(1);
    noStack(output);
  });
});

describe("what a check leaves out", () => {
  const debt = ".root { padding: 13px; }";

  it("says how many files it did not scan, and how to scan them", () => {
    const { output } = check(app(debt, { "src/Button.stories.css": debt, "src/legacy.test.css": debt }));
    expect(output).toContain("2 tests and stories not scanned");
    expect(output).toContain("--include-tests");
    expect(output).toMatch(/1 finding/);
  });

  it("scans them when asked, and then has nothing to report about them", () => {
    const { output } = check(app(debt, { "src/Button.stories.css": debt }), "--include-tests");
    expect(output).toMatch(/2 findings/);
    expect(output).not.toContain("not scanned");
  });

  it("says nothing about exclusions when there were none", () => {
    const { output } = check(app(".root { padding: var(--mds-pad-control-md); }"));
    expect(output).toContain("clean");
    expect(output).not.toContain("not scanned");
  });

  it("reports what a declared scope left out, which no flag restores", () => {
    const root = app(debt, {
      "src/legacy/old.css": debt,
      "dsbridge.config.json": JSON.stringify({ sources: ["src/Button.module.css"] }),
    });
    const { output } = check(root);
    expect(output).toContain("1 file outside sources");
    expect(output).toMatch(/1 finding/);
  });
});

describe("what shape the debt is", () => {
  const tree = `.a { padding: 4px; }
.b { margin: 4px; }
.c { padding: 8px; }
.d { padding: 37px; }
`;

  it("groups the summary by what would have to be decided, not by rule", () => {
    const { output } = check(app(tree));
    expect(output).toContain("one token holds the value");
    expect(output).toContain("several tokens hold the value");
    expect(output).toContain("no token holds it");
  });

  it("counts each value once, with where it is", () => {
    const { output } = check(app(tree, { "src/Other.module.css": ".e { padding: 4px; }" }));
    expect(output).toMatch(/4px\s+.*3 places in 2 files/);
    expect(output).toMatch(/37px\s+.*1 place in 1 file/);
  });

  it("names the tokens to choose between, so the choice is on the page", () => {
    const { output } = check(app(tree));
    expect(output).toMatch(/8px.*--mds-gap.*--mds-space-2/);
    expect(output).toMatch(/4px\s+var\(--mds-space-1\)/);
  });

  it("keeps the count per rule, which is what an exemption is written against", () => {
    const { output } = check(app(tree));
    expect(output).toMatch(/4\s+no-literal-length/);
  });

  it("says nothing about causes when no finding carries one", () => {
    const { output } = check(app(".a { color: var(--mds-nope); }"));
    expect(output).toContain("no-undefined-token");
    expect(output).not.toContain("no token holds it");
  });
});
