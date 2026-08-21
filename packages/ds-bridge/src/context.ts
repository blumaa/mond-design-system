/* What a check runs against: the token graph, plus every stylesheet the target
   owns, read once. Built from disk by the CLI and from strings by the tests,
   so a rule never touches the filesystem itself. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { expandImports, loadGraph, type Graph } from "./graph.js";
import { findFonts, findSources, findStylesheets, resolveSystem, rootScoped } from "./sources.js";
import { anyGlob } from "./glob.js";
import { readComponents, type Component } from "./structure.js";
import { blocksIn, declarationsIn, stripComments } from "./css/parse.js";
import type { Context, Contract, Sheet, Source } from "./rules/types.js";

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
    blocks: blocksIn(blanked),
    declares,
    isTokens: atRoot.length > 0,
    isBrand:
      atRoot.some((d) => d.name.startsWith(prefix)) || [...declares].some((name) => systemDeclares.has(name)),
  };
}

export type Config = {
  /** Rule id to the globs it does not apply to, each with a reason in the file itself. */
  exempt?: Record<string, string[]>;
  /** Core groups that are scales; defaults to spacing, radius and typography. */
  scales?: string[];
  /** Globs whose files are not the repo's own — fixtures, vendored copies. */
  ignore?: string[];
  /** Globs bounding what the repo asks to be checked; everything, when absent. */
  sources?: string[];
  /** The token namespace the design system owns; defaults to `--mds-`. */
  prefix?: string;
  /** The design system's entry stylesheet, relative to the root. For a repo
      whose system is a folder it owns rather than a package it installed. */
  system?: string;
  /** The taxonomy, simplest first. A component composes strictly lower levels. */
  levels?: string[];
  /** Story-title segments that name something other than a level. */
  levelsIgnore?: string[];
};

/** The taxonomy a repo gets when it declares none. */
export const LEVELS = ["atom", "molecule", "organism", "template"];

/* Files that exist to exercise the app rather than to be it. A literal length
   in a story is the point of the story, and Kinbaku's 606 findings are 577
   of them — reporting those buries the 29 that are real. The structure rules
   still see these files; what changes is that no rule scans their bodies. */
export const TEST_GLOBS = ["**/*.stories.*", "**/*.test.*", "**/*.spec.*", "**/__fixtures__", "**/__mocks__"];

/** What a check did not look at, and why — never silently. */
export type Suppressed = {
  /** Left out as a test, a story or a fixture; `--include-tests` restores them. */
  tests: number;
  /** Outside the `sources` the repo declared. */
  scope: number;
  /** Lines a comment took out of the check, each with its reason beside it. */
  lines: number;
};

/**
 * `dsbridge-ignore-next-line: reason` — the escape hatch, in either comment
 * syntax. The reason is required: an agent that meets a false positive with no
 * way past it either loops on the finding or deletes the rule, and a bare
 * suppression is indistinguishable from the second. Without one the comment
 * does nothing, so the finding stands and someone has to look at it.
 */
const IGNORE = /(?:\/\*|\/\/)\s*dsbridge-ignore-next-line\s*:\s*(\S[^*\n]*)/;

/** The 1-based lines a file asked not to be judged on. */
export function ignoredLines(source: string): Set<number> {
  const out = new Set<number>();
  source.split("\n").forEach((line, i) => {
    if (IGNORE.test(line)) out.add(i + 2);
  });
  return out;
}

export type BuildOptions = {
  root: string;
  kind: "system" | "app";
  /** The system's entry stylesheet: what ships beside it is the system's own. */
  system?: string;
  graph: Graph;
  sheets: Sheet[];
  components?: Component[];
  sources?: Source[];
  fonts?: string[];
  prefix?: string;
  config?: Config;
  contract?: Contract;
  suppressed?: Suppressed;
  /** Repo-relative file to the lines a comment took out of the check. */
  ignores?: Map<string, Set<number>>;
};

export function buildContext({
  root,
  kind,
  graph,
  sheets,
  components = [],
  sources = [],
  fonts = [],
  prefix,
  system,
  config = {},
  contract,
  suppressed = { tests: 0, scope: 0, lines: 0 },
  ignores = new Map(),
}: BuildOptions): Context {
  const exempt = config.exempt ?? {};
  return {
    root,
    kind,
    graph,
    sheets,
    components,
    sources,
    fonts,
    prefix: prefix ?? graph.prefix,
    ...(system ? { system } : {}),
    levels: config.levels ?? LEVELS,
    levelsIgnore: config.levelsIgnore ?? [],
    ...(config.scales ? { scales: config.scales } : {}),
    ...(contract ? { contract } : {}),
    suppressed,
    exempt: (rule, file) => anyGlob(exempt[rule] ?? [])(file),
    ignored: (file, line) => line !== undefined && (ignores.get(file)?.has(line) ?? false),
  };
}

export type LoadContextOptions = {
  root: string;
  /** Entry stylesheet of the design system; discovered from the root when absent. */
  system?: string;
  config?: Config;
  prefix?: string;
  /** Scan tests, stories and fixtures too. */
  includeTests?: boolean;
};

/** The same context, read off disk. */
export function loadContext({ root, system, config, prefix, includeTests }: LoadContextOptions): Context {
  const at = resolve(root);
  const namespace = prefix ?? config?.prefix ?? "--mds-";
  const declared = config?.system;
  const entry = system ? resolve(system) : declared ? resolve(at, declared) : resolveSystem(at);
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
  const ignored = anyGlob(config?.ignore ?? []);
  const bounds = config?.sources ?? [];
  const inScope = bounds.length > 0 ? anyGlob(bounds) : () => true;
  const isTest = anyGlob(TEST_GLOBS);
  const suppressed: Suppressed = { tests: 0, scope: 0, lines: 0 };
  const ignores = new Map<string, Set<number>>();
  /* Read off the raw text: `makeSheet` blanks comments before anything parses
     them, so by the time a rule sees a stylesheet the comment is gone. */
  const noting = (file: string, source: string) => {
    const lines = ignoredLines(source);
    if (lines.size > 0) {
      ignores.set(file, lines);
      suppressed.lines += lines.size;
    }
    return source;
  };
  /* Counted where it happens, so the reason a file went unread is the reason
     reported, not one inferred afterwards from a difference of two numbers. */
  const scanned = (file: string) => {
    const path = relative(at, file);
    if (ignored(path)) return false;
    if (!inScope(path)) {
      suppressed.scope += 1;
      return false;
    }
    if (includeTests !== true && isTest(path)) {
      suppressed.tests += 1;
      return false;
    }
    return true;
  };
  const sheets = findStylesheets(at)
    .filter((file) => !systemFiles.has(file) && scanned(file))
    .map((file) =>
      makeSheet(file, noting(relative(at, file), readFileSync(file, "utf8")), at, namespace, systemDeclares),
    );
  const tsx = findSources(at).filter((file) => !ignored(relative(at, file)));
  const sources = tsx
    .filter(scanned)
    .map((file) => ({ file: relative(at, file), source: noting(relative(at, file), readFileSync(file, "utf8")) }));
  /* A component's story is what names its level, and its test is how the
     structure rules know it has one — so those two are read whether or not
     any rule scans their bodies. */
  const read = new Map(tsx.map((file) => [relative(at, file), readFileSync(file, "utf8")]));
  const components = readComponents([...read.keys()], (file) => read.get(file) ?? "");
  const fonts = findFonts(at)
    .filter(scanned)
    .map((file) => relative(at, file));
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
    components,
    sources,
    fonts,
    prefix: namespace,
    system: entry,
    ...(config ? { config } : {}),
    ...(contract ? { contract } : {}),
    suppressed,
    ignores,
  });
}
