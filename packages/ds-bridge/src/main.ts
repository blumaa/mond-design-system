/* The command line, minus the process.
 *
 * Thin on purpose: it resolves what to read, hands it to the graph, and prints
 * what comes back. Every decision worth testing lives in a module beside it —
 * and `main` returns its exit code rather than setting one, so a test can watch
 * the gate fail without spawning anything.
 */
import { parseArgs } from "node:util";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { loadGraph } from "./graph.js";
import { findBrandFiles, resolveSystem } from "./sources.js";
import { loadContext, type Config } from "./context.js";
import { renderTokens, selectTokens, type RenderOptions } from "./commands/tokens.js";
import { renderTokensHtml } from "./commands/tokensHtml.js";
import { renderCheck, runCheck } from "./commands/check.js";
import { aboveBaseline, readBaseline, updateBaseline, NO_BASELINE } from "./commands/baseline.js";
import { renderRules, ruleData, rulesForFile, selectRules } from "./commands/rules.js";
import { planMigration, renderMigration } from "./commands/migrate.js";
import type { Kind, Layer } from "./graph.js";
import type { Theme } from "./css/parse.js";
import type { Target } from "./rules/types.js";

const USAGE = `dsbridge — design system conformance, for the system and the apps that use it

  dsbridge tokens [options]     list the token graph: core scales, the semantic
                           contract, and what your brand re-points
  dsbridge check [path] [opts]  run the rules against this repo, or one path in it
  dsbridge rules [id]           what each rule is protecting, for a human or an agent
  dsbridge migrate [path]       what an app would have to move to adopt the system

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
  <path>            report only what lives under this path; repeatable
  --system <file>   as above
  --rule <id>       run one rule; repeatable
  --include-tests   scan tests, stories and fixtures too
  --pending <file>  judge this file as the text on stdin, not as it is on disk
  --baseline        report only what is above .dsbridge/baseline.json
  --update-baseline record what is there now as the debt to hold

Options for migrate
  --root <dir>      the app to plan for   (default: the cwd)
  --system <file>   as above
  --include-tests   as above

Options for rules
  --for <file>      only the rules that read this kind of file
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

/** A positional is a path filter: report only what lives under it. */
function pathFilter(root: string, paths: string[]): (file: string) => boolean {
  if (paths.length === 0) return () => true;
  const wanted = paths.map((p) => (isAbsolute(p) ? relative(root, p) : p).replace(/\/+$/, ""));
  return (file) => wanted.some((w) => file === w || file.startsWith(`${w}/`));
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
    allowPositionals: true,
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

function checkCommand(rest: string[], stdin?: string): number {
  const { values, positionals } = parseArgs({
    args: rest,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      rule: { type: "string", multiple: true },
      "include-tests": { type: "boolean" },
      pending: { type: "string" },
      baseline: { type: "boolean" },
      "update-baseline": { type: "boolean" },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowPositionals: true,
    allowNegative: true,
  });

  const root = resolve(values.root ?? process.cwd());
  const config = readConfig(root);
  /* The pending file is the only thing being asked about: everything else in
     the repo is either already known or not this edit's business. */
  const held = values.pending;
  const pending = held === undefined ? undefined : { file: held, source: stdin ?? "" };
  const context = loadContext({
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(config ? { config } : {}),
    ...(values["include-tests"] === true ? { includeTests: true } : {}),
    ...(pending ? { pending } : {}),
  });
  const options = {
    ...(values.rule ? { only: values.rule } : {}),
    color: values.color !== false && process.stdout.isTTY === true,
  };
  const asked = held === undefined ? positionals : [held];
  const all = runCheck(context, options).filter((finding) => pathFilter(root, asked)(finding.file));

  /* Recording half a repo would drop the other half from the baseline. */
  if (values["update-baseline"] === true) {
    if (positionals.length > 0 || values.rule !== undefined) {
      process.stderr.write("--update-baseline records the whole repo; drop the path and --rule\n");
      return 1;
    }
    process.stdout.write(updateBaseline(root, all));
    return 0;
  }

  const recorded = values.baseline === true ? readBaseline(root) : undefined;
  if (values.baseline === true && recorded === undefined) process.stdout.write(`${NO_BASELINE}\n\n`);
  const findings = recorded ? aboveBaseline(all, recorded) : all;

  if (values.json === true) jsonOut(findings);
  else process.stdout.write(renderCheck(findings, context, { ...options, held: all.length - findings.length }));
  return findings.length > 0 ? 1 : 0;
}

function migrateCommand(rest: string[]): number {
  const { values, positionals } = parseArgs({
    args: rest,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      "include-tests": { type: "boolean" },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowPositionals: true,
    allowNegative: true,
  });

  const root = resolve(values.root ?? process.cwd());
  const config = readConfig(root);
  const context = loadContext({
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(config ? { config } : {}),
    ...(values["include-tests"] === true ? { includeTests: true } : {}),
  });
  const keep = pathFilter(root, positionals);
  const whole = planMigration(context);
  const plan =
    positionals.length === 0
      ? whole
      : { ...whole, literals: whole.literals.filter((f) => keep(f.file)), files: whole.files.filter(keep) };

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
      for: { type: "string" },
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

  const target = values.target as Target | undefined;
  const chosen =
    values.for !== undefined
      ? rulesForFile(values.for, target)
      : selectRules(options);

  if (values.json === true) {
    jsonOut(ruleData(chosen));
    return 0;
  }
  process.stdout.write(renderRules(chosen, options));
  return 0;
}

/* A stack trace is the tool failing to answer, printed as if it were one. The
   frames are still there behind DSBRIDGE_DEBUG for whoever is fixing dsbridge. */
function failed(command: string, error: unknown): number {
  /* parseArgs appends advice about `--` that is wrong for most failures. */
  const whole = error instanceof Error ? error.message : String(error);
  const message = /^[^.]+\./.exec(whole)?.[0] ?? whole;
  const parseFailure = String((error as NodeJS.ErrnoException).code ?? "").startsWith("ERR_PARSE_ARGS");
  process.stderr.write(`dsbridge ${command}: ${message}\n`);
  if (parseFailure) process.stderr.write(`\nrun dsbridge help for the options ${command} takes\n`);
  if (process.env["DSBRIDGE_DEBUG"] !== undefined && error instanceof Error) {
    process.stderr.write(`${error.stack ?? ""}\n`);
  }
  return 1;
}

export function main(argv: string[], stdin?: string): number {
  const [command, ...rest] = argv;
  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(USAGE);
    return command ? 0 : 1;
  }
  try {
    if (command === "tokens") return tokensCommand(rest);
    if (command === "check") return checkCommand(rest, stdin);
    if (command === "rules") return rulesCommand(rest);
    if (command === "migrate") return migrateCommand(rest);
  } catch (error) {
    return failed(command, error);
  }
  process.stderr.write(`unknown command "${command}"\n\n${USAGE}`);
  return 1;
}
