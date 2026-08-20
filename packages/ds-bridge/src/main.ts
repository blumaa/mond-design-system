/* The command line, minus the process.
 *
 * Thin on purpose: it resolves what to read, hands it to the graph, and prints
 * what comes back. Every decision worth testing lives in a module beside it —
 * and `main` returns its exit code rather than setting one, so a test can watch
 * the gate fail without spawning anything.
 */
import { parseArgs } from "node:util";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { loadGraph } from "./graph.js";
import { findBrandFiles, resolveSystem } from "./sources.js";
import { loadContext, type Config } from "./context.js";
import { renderTokens, selectTokens, type RenderOptions } from "./commands/tokens.js";
import { renderTokensHtml } from "./commands/tokensHtml.js";
import { renderCheck, runCheck } from "./commands/check.js";
import { renderRules, selectRules } from "./commands/rules.js";
import { planMigration, renderMigration } from "./commands/migrate.js";
import type { Kind, Layer } from "./graph.js";
import type { Theme } from "./css/parse.js";
import type { Target } from "./rules/types.js";

const USAGE = `mds — Mond Design System conformance toolkit

  dsbridge tokens [options]     list the token graph: core scales, the semantic
                           contract, and what your brand re-points
  dsbridge check [options]      run the rules against this repo
  dsbridge rules [id]           what each rule is protecting, for a human or an agent
  dsbridge migrate [options]    what an app would have to move to adopt the system

Options for tokens
  --system <file>   entry stylesheet of the design system (default: the
                    installed @mond-design-system/tokens)
  --brand <file>    app stylesheet that re-points tokens; repeatable
                    (default: every stylesheet under the cwd that declares one)
  --unbranded       the system's own defaults, ignoring the app's brand
  --theme <name>    light | dark            (default: light)
  --layer <name>    core | semantic | base | brand
  --group <name>    spacing, surface, text, …
  --kind <name>     color | length | number | font | other
  --grep <text>     match on the token name
  --html <file>     write a page you can look at

Options for check
  --root <dir>      what to check              (default: the cwd)
  --system <file>   as above
  --rule <id>       run one rule; repeatable

Options for migrate
  --root <dir>      the app to plan for   (default: the cwd)
  --system <file>   as above

Options for rules
  --target <name>   system | app
  --markdown        the whole set, for an agent's instructions

Everywhere
  --json            machine-readable
  --no-color        plain text
`;

const jsonOut = (value: unknown) => process.stdout.write(JSON.stringify(value, null, 2) + "\n");

function readConfig(root: string): Config | undefined {
  const path = resolve(root, "dsbridge.config.json");
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as Config) : undefined;
}

function tokensCommand(rest: string[]): number {
  const { values } = parseArgs({
    args: rest,
    options: {
      system: { type: "string" },
      brand: { type: "string", multiple: true },
      unbranded: { type: "boolean" },
      theme: { type: "string" },
      layer: { type: "string" },
      group: { type: "string" },
      kind: { type: "string" },
      grep: { type: "string" },
      json: { type: "boolean" },
      html: { type: "string" },
      color: { type: "boolean", default: true },
    },
    allowNegative: true,
  });

  const cwd = process.cwd();
  const system = values.system ? resolve(values.system) : resolveSystem(cwd);
  const brand = values.unbranded === true ? [] : (values.brand?.map((b) => resolve(b)) ?? findBrandFiles(cwd));
  const graph = loadGraph({ system, ...(brand.length > 0 ? { brand } : {}) });

  const options: RenderOptions = {
    theme: (values.theme as Theme | undefined) ?? "light",
    color: values.color !== false && process.stdout.isTTY === true,
    ...(values.layer ? { layer: values.layer as Layer } : {}),
    ...(values.group ? { group: values.group } : {}),
    ...(values.kind ? { kind: values.kind as Kind } : {}),
    ...(values.grep ? { grep: values.grep } : {}),
  };

  if (values.json === true) {
    jsonOut(selectTokens(graph, options));
    return 0;
  }

  if (values.html !== undefined) {
    const out = resolve(values.html);
    writeFileSync(out, renderTokensHtml(graph, options));
    process.stdout.write(`wrote ${relative(cwd, out)}\n`);
    return 0;
  }

  if (brand.length > 0) {
    process.stdout.write(`brand: ${brand.map((b) => relative(cwd, b)).join(", ")}\n`);
  }
  process.stdout.write(renderTokens(graph, options));
  return 0;
}

function checkCommand(rest: string[]): number {
  const { values } = parseArgs({
    args: rest,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      rule: { type: "string", multiple: true },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowNegative: true,
  });

  const root = resolve(values.root ?? process.cwd());
  const config = readConfig(root);
  const context = loadContext({
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(config ? { config } : {}),
  });
  const options = {
    ...(values.rule ? { only: values.rule } : {}),
    color: values.color !== false && process.stdout.isTTY === true,
  };
  const findings = runCheck(context, options);

  if (values.json === true) jsonOut(findings);
  else process.stdout.write(renderCheck(findings, context, options));
  return findings.length > 0 ? 1 : 0;
}

function migrateCommand(rest: string[]): number {
  const { values } = parseArgs({
    args: rest,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowNegative: true,
  });

  const root = resolve(values.root ?? process.cwd());
  const config = readConfig(root);
  const context = loadContext({
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(config ? { config } : {}),
  });
  const plan = planMigration(context);

  if (values.json === true) jsonOut(plan);
  else process.stdout.write(renderMigration(plan, context, { color: values.color !== false && process.stdout.isTTY === true }));
  return 0;
}

function rulesCommand(rest: string[]): number {
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      target: { type: "string" },
      markdown: { type: "boolean" },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowNegative: true,
  });

  const options = {
    ...(positionals[0] ? { id: positionals[0] } : {}),
    ...(values.target ? { target: values.target as Target } : {}),
    ...(values.markdown === true ? { markdown: true } : {}),
    color: values.color !== false && process.stdout.isTTY === true,
  };

  if (values.json === true) {
    jsonOut(selectRules(options).map(({ check: _check, ...rule }) => rule));
    return 0;
  }
  process.stdout.write(renderRules(options));
  return 0;
}

export function main(argv: string[]): number {
  const [command, ...rest] = argv;
  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(USAGE);
    return command ? 0 : 1;
  }
  if (command === "tokens") return tokensCommand(rest);
  if (command === "check") return checkCommand(rest);
  if (command === "rules") return rulesCommand(rest);
  if (command === "migrate") return migrateCommand(rest);
  process.stderr.write(`unknown command "${command}"\n\n${USAGE}`);
  return 1;
}
