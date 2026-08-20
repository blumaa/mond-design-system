/* What a check runs against: the token graph, plus every stylesheet the target
   owns, read once. Built from disk by the CLI and from strings by the tests,
   so a rule never touches the filesystem itself. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { expandImports, loadGraph, type Graph } from "./graph.js";
import { findStylesheets, resolveSystem, rootScoped } from "./sources.js";
import { declarationsIn, stripComments } from "./css/parse.js";
import type { Context, Contract, Sheet } from "./rules/types.js";

/**
 * One stylesheet, read.
 *
 * `systemDeclares` is what the design system itself defines: a file that
 * re-points one of those names is a brand file wherever it writes it, because
 * scoping a contract token to a class is still re-pointing the contract.
 */
export function makeSheet(
  path: string,
  source: string,
  root: string,
  prefix: string,
  systemDeclares: ReadonlySet<string> = new Set(),
): Sheet {
  const blanked = stripComments(source);
  const declarations = declarationsIn(blanked, path);
  const declares = new Set(declarations.map((d) => d.name));
  const atRoot = declarations.filter((d) => rootScoped(d.selector));
  return {
    path,
    file: relative(root, path),
    source: blanked,
    lines: blanked.split("\n"),
    declares,
    isTokens: atRoot.length > 0,
    isBrand:
      atRoot.some((d) => d.name.startsWith(prefix)) || [...declares].some((name) => systemDeclares.has(name)),
  };
}

export type Config = {
  /** Rule id to the files it does not apply to, each with a reason in the file itself. */
  exempt?: Record<string, string[]>;
  /** Core groups that are scales; defaults to spacing, radius and typography. */
  scales?: string[];
  /** Path fragments whose stylesheets are not the repo's own — fixtures, vendored copies. */
  ignore?: string[];
  /** The token namespace the design system owns; defaults to `--mds-`. */
  prefix?: string;
  /** The taxonomy, simplest first. A component composes strictly lower levels. */
  levels?: string[];
  /** Story-title segments that name something other than a level. */
  levelsIgnore?: string[];
};

/** The taxonomy a repo gets when it declares none. */
export const LEVELS = ["atom", "molecule", "organism", "template"];

export type BuildOptions = {
  root: string;
  kind: "system" | "app";
  /** The system's entry stylesheet: what ships beside it is the system's own. */
  system?: string;
  graph: Graph;
  sheets: Sheet[];
  prefix?: string;
  config?: Config;
  contract?: Contract;
};

export function buildContext({
  root,
  kind,
  graph,
  sheets,
  prefix,
  system,
  config = {},
  contract,
}: BuildOptions): Context {
  const exempt = config.exempt ?? {};
  return {
    root,
    kind,
    graph,
    sheets,
    prefix: prefix ?? graph.prefix,
    ...(system ? { system } : {}),
    levels: config.levels ?? LEVELS,
    levelsIgnore: config.levelsIgnore ?? [],
    ...(config.scales ? { scales: config.scales } : {}),
    ...(contract ? { contract } : {}),
    exempt: (rule, file) => (exempt[rule] ?? []).includes(file),
  };
}

export type LoadContextOptions = {
  root: string;
  /** Entry stylesheet of the design system; discovered from the root when absent. */
  system?: string;
  config?: Config;
  prefix?: string;
};

/** The same context, read off disk. */
export function loadContext({ root, system, config, prefix }: LoadContextOptions): Context {
  const at = resolve(root);
  const namespace = prefix ?? config?.prefix ?? "--mds-";
  const entry = system ? resolve(system) : resolveSystem(at);
  /* The system's own token files are the graph, never sheets to be judged:
     declaring the contract is what they are for. Checking the design system
     against itself is therefore checking its component stylesheets. */
  const systemFiles = new Set(expandImports(entry));
  /* The design system's own repo is the one whose entry stylesheet is its
     source. An app that installed it has the same file under node_modules, and
     is checked as an app. */
  const vendored = entry.includes(`${sep}node_modules${sep}`);
  const kind = entry.startsWith(at + sep) && !vendored ? "system" : "app";
  const unbranded = loadGraph({ system: entry, prefix: namespace });
  const systemDeclares = new Set(unbranded.names());
  const ignored = (file: string) => (config?.ignore ?? []).some((fragment) => relative(at, file).includes(fragment));
  const sheets = findStylesheets(at)
    .filter((file) => !systemFiles.has(file) && !ignored(file))
    .map((file) => makeSheet(file, readFileSync(file, "utf8"), at, namespace, systemDeclares));
  const brand = sheets.filter((s) => s.isBrand).map((s) => s.path);
  const graph = brand.length > 0 ? loadGraph({ system: entry, prefix: namespace, brand }) : unbranded;
  /* The contract travels with the system: an app checks itself against the copy
     of it that it installed, not against whatever the tool was built knowing. */
  const contractPath = resolve(dirname(entry), "contract.json");
  const contract = existsSync(contractPath)
    ? (JSON.parse(readFileSync(contractPath, "utf8")) as Contract)
    : undefined;
  return buildContext({
    root: at,
    kind,
    graph,
    sheets,
    prefix: namespace,
    system: entry,
    ...(config ? { config } : {}),
    ...(contract ? { contract } : {}),
  });
}
