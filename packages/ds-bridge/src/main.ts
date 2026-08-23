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
import { anyGlob } from "./glob.js";
import { plural } from "./text.js";
import { loadGraph } from "./graph.js";
import { findBrandFiles, resolveSystem } from "./sources.js";
import { loadContext, type Config } from "./context.js";
import { renderTokens, selectTokens, type RenderOptions } from "./commands/tokens.js";
import { renderTokensHtml } from "./commands/tokensHtml.js";
import { renderCheck, runCheck, unrecordedSkips } from "./commands/check.js";
import { aboveBaseline, readBaseline, updateBaseline, NO_BASELINE } from "./commands/baseline.js";
import { applyFixes } from "./commands/fix.js";
import { renderRules, ruleData, rulesForFile, selectRules } from "./commands/rules.js";
import { renderRoles, roleData } from "./commands/roles.js";
import { renderChoosing, choosingData } from "./commands/choosing.js";
import { nextItem, renderNext } from "./commands/next.js";
import { planMigration, renderMigration } from "./commands/migrate.js";
import { isHookEvent, runHook, type HookInput } from "./commands/hook.js";
import type { Kind, Layer } from "./graph.js";
import type { Theme } from "./css/parse.js";
import type { Target } from "./rules/types.js";
import { RULES } from "./rules/index.js";

const USAGE = `dsbridge — design system conformance, for the system and the apps that use it

  dsbridge tokens [options]     list the token graph: core scales, the semantic
                           contract, and what your brand re-points
  dsbridge check [path] [opts]  run the rules against this repo, or one path in it
  dsbridge rules [id]           what each rule is protecting, for a human or an agent
  dsbridge roles                what the system says its tokens are for
  dsbridge choosing [name]      which of two that both compile this case wants
  dsbridge next                 the one piece of work to do now, and what closes it
  dsbridge migrate [path]       what an app would have to move to adopt the system
  dsbridge hook <event>         answer a Claude Code hook, protocol JSON on stdin

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
  --components <p>  the system's components: a package name, or a path to its
                    type declarations (default: what the config names)
  --rule <id>       run one rule; repeatable
  --include-tests   scan tests, stories and fixtures too
  --pending <file>  judge this file as the text on stdin, not as it is on disk
  --fix             rewrite the findings that name exactly one token
  --baseline        report only what is above .dsbridge/baseline.json
  --update-baseline record what is there now as the debt to hold
  --allow-skipped   rule ids, or "all": pass a run whose rules could not run.
                    A repo records this in its config; the flag is for one run

Options for next
  --root <dir>      what to look at            (default: the cwd)
  --system <file>   as above
  --components <p>  as above
  --include-tests   as above

Options for migrate
  --root <dir>      the app to plan for   (default: the cwd)
  --system <file>   as above
  --components <p>  as above — the pair names the system being migrated to,
                    which the app has not installed and its config cannot name
  --include-tests   as above

Events for hook
  session-start     the namespace, the taxonomy and what the repo already has
  pre-tool-use      what the pending Write or Edit adds, and nothing already there
  stop              hold the turn open while it is above the baseline

Options for roles
  --root <dir>      the repo to answer for  (default: the cwd)
  --system <file>   as above
  --coverage        name the tokens no role claims

Options for choosing
  --root <dir>      the repo to answer for  (default: the cwd)
  --system <file>   as above
  --components <p>  as above
  <name>            only the choices that name this component

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
  /* Same order as every other verb: the flag, then what the repo declared,
     then discovery — a repo that had to name its own stylesheet for `check`
     should not have to name it again here. */
  const config = readConfig(cwd);
  const declared = config?.system;
  const system = values.system
    ? resolve(values.system)
    : declared !== undefined
      ? resolve(cwd, declared)
      : resolveSystem(cwd);
  /* Honour the same `ignore` the check honours. A fixture stylesheet declaring
     a token for a test to read is not this repo's brand, and reported as one it
     puts the wrong provenance on a real token. */
  const ignored = anyGlob(config?.ignore ?? []);
  const brand =
    values.unbranded === true
      ? []
      : (values.brand?.map((b) => resolve(b)) ??
        findBrandFiles(cwd).filter((file) => !ignored(relative(cwd, file))));
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
      components: { type: "string" },
      rule: { type: "string", multiple: true },
      "include-tests": { type: "boolean" },
      pending: { type: "string" },
      fix: { type: "boolean" },
      baseline: { type: "boolean" },
      "update-baseline": { type: "boolean" },
      "allow-skipped": { type: "string" },
      json: { type: "boolean" },
      color: { type: "boolean", default: true },
    },
    allowPositionals: true,
    allowNegative: true,
  });

  const root = resolve(values.root ?? process.cwd());
  const read = readConfig(root);
  /* A repo records what it cannot run in its config, where the choice is read
     by everyone. The flag is for a single run — a migration in progress, or a
     rule suite being tried out — and says so by having to be typed each time. */
  const config = allowing(read, values["allow-skipped"]);
  /* The pending file is the only thing being asked about: everything else in
     the repo is either already known or not this edit's business. */
  const held = values.pending;
  const pending = held === undefined ? undefined : { file: held, source: stdin ?? "" };
  const context = loadContext({
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(values.components ? { components: resolve(values.components) } : {}),
    ...(config ? { config } : {}),
    ...(values["include-tests"] === true ? { includeTests: true } : {}),
    ...(pending ? { pending } : {}),
  });
  const options = {
    ...(values.rule ? { only: values.rule } : {}),
    color: values.color !== false && process.stdout.isTTY === true,
  };
  const asked = held === undefined ? positionals : [held];
  const scan = (at: ReturnType<typeof loadContext>) =>
    runCheck(at, options).filter((finding) => pathFilter(root, asked)(finding.file));
  let all = scan(context);

  /* Write, then read the tree back: what remains is what a second run would
     say, and a fix that closed nothing is a fix worth seeing not reported. */
  if (values.fix === true) {
    if (held !== undefined) {
      process.stderr.write("--fix writes the files on disk; drop --pending\n");
      return 1;
    }
    const done = applyFixes(root, all);
    const fixed = done.reduce((n, file) => n + file.fixed, 0);
    if (fixed > 0) {
      process.stdout.write(`fixed ${plural(fixed, "finding")} in ${plural(done.length, "file")}\n\n`);
      all = scan(
        loadContext({
          root,
          ...(values.system ? { system: resolve(values.system) } : {}),
          ...(values.components ? { components: resolve(values.components) } : {}),
          ...(config ? { config } : {}),
          ...(values["include-tests"] === true ? { includeTests: true } : {}),
        }),
      );
    }
  }

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
  /* A rule that could not run fails the run. The alternative is a report that
     says clean about a question it never asked. */
  return findings.length > 0 || unrecordedSkips(context, options).size > 0 ? 1 : 0;
}

/** The config, plus whatever this one run was told to forgive. */
function allowing(config: Config | undefined, flag: string | undefined): Config | undefined {
  if (flag === undefined) return config;
  const named = flag === "all" ? RULES.map((rule) => rule.id) : flag.split(",").map((id) => id.trim());
  return { ...(config ?? {}), allowSkipped: [...(config?.allowSkipped ?? []), ...named] };
}

function nextCommand(rest: string[]): number {
  const { values } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      components: { type: "string" },
      "include-tests": { type: "boolean" },
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
    ...(values.components ? { components: resolve(values.components) } : {}),
    ...(config ? { config } : {}),
    ...(values["include-tests"] === true ? { includeTests: true } : {}),
  });
  const all = runCheck(context);

  /* Something added since the debt was recorded outranks the debt itself, and
     when nothing is above the baseline the work is whatever is largest under
     it — said as such, so the two are never mistaken for each other. */
  const recorded = readBaseline(root);
  const above = recorded ? aboveBaseline(all, recorded) : [];
  const regression = above.length > 0;
  const pool = regression ? above : all;

  if (values.json === true) {
    jsonOut({ regression, total: all.length, item: nextItem(pool) ?? null });
    return 0;
  }
  process.stdout.write(
    renderNext(pool, regression ? pool.length : all.length, {
      regression,
      color: values.color !== false && process.stdout.isTTY === true,
    }),
  );
  return 0;
}

function migrateCommand(rest: string[]): number {
  const { values, positionals } = parseArgs({
    args: rest,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      components: { type: "string" },
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
    ...(values.components ? { components: resolve(values.components) } : {}),
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

/* The protocol, and nothing else: `runHook` decides, this resolves where. The
   exit code is always 0 — a hook says what it wants in the JSON, and a tool
   that fails a session because it could not read a stylesheet is a worse
   outcome than one that says nothing. */
function hookCommand(rest: string[], stdin?: string): number {
  const { values, positionals } = parseArgs({
    args: rest,
    options: { root: { type: "string" }, system: { type: "string" } },
    allowPositionals: true,
    allowNegative: true,
  });

  const event = positionals[0];
  if (event === undefined || !isHookEvent(event)) {
    process.stderr.write("dsbridge hook: one of session-start, pre-tool-use, stop\n");
    return 1;
  }
  const input = (stdin ?? "").trim() === "" ? {} : (JSON.parse(stdin!) as HookInput);
  const root = resolve(values.root ?? input.cwd ?? process.cwd());
  const config = readConfig(root);
  const output = runHook(event, input, {
    root,
    ...(values.system ? { system: resolve(values.system) } : {}),
    ...(config ? { config } : {}),
  });
  if (output !== undefined) jsonOut(output);
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

/* The roles are the system's, not this repo's: an app is answered from the copy
   of the system it installed, which is what `loadContext` already resolves. */
function rolesCommand(rest: string[]): number {
  const { values } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      coverage: { type: "boolean" },
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
  const tokens = context.graph.names().filter((name) => name.startsWith(context.prefix));

  if (values.json === true) {
    jsonOut(roleData(context.roles, tokens));
    return 0;
  }
  process.stdout.write(
    renderRoles(context.roles, tokens, {
      ...(values.coverage === true ? { coverage: true } : {}),
      color: values.color !== false && process.stdout.isTTY === true,
    }),
  );
  return 0;
}

function choosingCommand(rest: string[]): number {
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      root: { type: "string" },
      system: { type: "string" },
      components: { type: "string" },
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
    ...(values.components ? { components: resolve(values.components) } : {}),
    ...(config ? { config } : {}),
  });
  /* In an app the choice is between the system's components, not the app's own;
     in the system's repo there is nothing installed to ask, so it is its own. */
  const components =
    context.exported.length > 0 ? context.exported : context.components.map((it) => it.name);

  if (values.json === true) {
    jsonOut(choosingData(context.choosing, components));
    return 0;
  }
  process.stdout.write(
    renderChoosing(context.choosing, components, {
      ...(positionals[0] !== undefined ? { component: positionals[0] } : {}),
      color: values.color !== false && process.stdout.isTTY === true,
    }),
  );
  return 0;
}

/* A stack trace is the tool failing to answer, printed as if it were one. The
   frames are still there behind DSBRIDGE_DEBUG for whoever is fixing dsbridge. */
function failed(command: string, error: unknown): number {
  const whole = error instanceof Error ? error.message : String(error);
  const parseFailure = String((error as NodeJS.ErrnoException).code ?? "").startsWith("ERR_PARSE_ARGS");
  /* parseArgs appends advice about `--` that is wrong for most failures, and it
     is the only message whose first full stop ends a sentence. Everywhere else
     the first one is inside a filename, and cutting there loses the answer. */
  const message = parseFailure ? (/^[^.]+\./.exec(whole)?.[0] ?? whole) : whole;
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
    if (command === "roles") return rolesCommand(rest);
    if (command === "choosing") return choosingCommand(rest);
    if (command === "next") return nextCommand(rest);
    if (command === "migrate") return migrateCommand(rest);
    if (command === "hook") return hookCommand(rest, stdin);
  } catch (error) {
    return failed(command, error);
  }
  process.stderr.write(`unknown command "${command}"\n\n${USAGE}`);
  return 1;
}
