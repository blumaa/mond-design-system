/* What a check runs against: the token graph, plus every stylesheet the target
   owns, read once. Built from disk by the CLI and from strings by the tests,
   so a rule never touches the filesystem itself. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { expandImports, loadGraph, type Graph } from "./graph.js";
import { findFonts, findSources, findStylesheets, resolveSystem, rootScoped } from "./sources.js";
import { anyGlob } from "./glob.js";
import { loadRoles, type Roles, type RolesFile } from "./roles.js";
import { loadChoosing, type Choosing, type ChoosingFile } from "./choosing.js";
import { readSystemComponents } from "./system.js";
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
  /** The token namespace the design system owns. Read off the system's own
      stylesheet when nothing says — the commonest first segment it declares. */
  prefix?: string;
  /** The design system's entry stylesheet, relative to the root. For a repo
      whose system is a folder it owns rather than a package it installed. */
  system?: string;
  /** The package whose exports are the design system's components — or a path
      to its type declarations. Without it an app cannot be told it has rebuilt
      something it already has. */
  components?: string;
  /** The taxonomy, simplest first. A component composes strictly lower levels. */
  levels?: string[];
  /** Story-title segments that name something other than a level. */
  levelsIgnore?: string[];
  /** The layout components the design system ships — Stack, Inline, whatever
      this one calls them. Named rather than guessed: a tool that assumed the
      names would be telling every design system what its own parts are. */
  primitives?: string[];
};

/** The taxonomy a design system gets when it declares none. An app gets none:
    its levels are its own, and a default would be a guess. */
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
  /** What the design system exports, read from the package the repo installed. */
  exported?: string[];
  sources?: Source[];
  fonts?: string[];
  prefix?: string;
  config?: Config;
  contract?: Contract;
  roles?: Roles;
  choosing?: Choosing;
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
  exported = [],
  sources = [],
  fonts = [],
  prefix,
  system,
  config = {},
  contract,
  roles,
  choosing,
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
    exported,
    sources,
    fonts,
    prefix: prefix ?? graph.prefix,
    ...(system ? { system } : {}),
    /* A system without a stated taxonomy still has the common one; an app does
       not, and inventing one for it would be this tool telling a repo what its
       own parts are called. The rules that read levels skip a repo with none. */
    levels: config.levels ?? (kind === "system" ? LEVELS : []),
    levelsIgnore: config.levelsIgnore ?? [],
    primitives: config.primitives ?? [],
    ...(config.scales ? { scales: config.scales } : {}),
    ...(contract ? { contract } : {}),
    roles: roles ?? loadRoles(undefined, graph.names()),
    choosing: choosing ?? loadChoosing(undefined),
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
  /**
   * Content an editor holds but has not written yet.
   *
   * A hook that fires before the write is the only place a finding can be
   * answered without a commit, and at that moment the text exists nowhere on
   * disk. The rest of the repo is still read normally: a pending stylesheet is
   * judged against the same token graph as a saved one.
   */
  pending?: { file: string; source: string };
};

/** The same context, read off disk. */
export function loadContext({
  root,
  system,
  config,
  prefix,
  includeTests,
  pending,
}: LoadContextOptions): Context {
  const at = resolve(root);
  const held = pending === undefined ? undefined : resolve(at, pending.file);
  /* The pending file wins over whatever is on disk, and counts as present even
     when nothing is: a file being written for the first time is the case a
     pre-write hook exists for. */
  const contents = (file: string) => (file === held ? pending!.source : readFileSync(file, "utf8"));
  const withHeld = (files: string[], wanted: (file: string) => boolean) =>
    held !== undefined && wanted(held) && !files.includes(held) ? [...files, held] : files;
  const told = prefix ?? config?.prefix;
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
  const unbranded = loadGraph({ system: entry, ...(told ? { prefix: told } : {}) });
  const namespace = unbranded.prefix;
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
  const isSheet = (file: string) => /\.(?:css|scss|sass|less)$/.test(file);
  const isSource = (file: string) => /\.(?:tsx|ts|jsx|js|mjs|cjs)$/.test(file);
  /* Held content is being written now, so a story or test file holding it is
     read: the agent is asking about the file in front of it. */
  const wanted = (file: string) => file === held || scanned(file);
  const sheets = withHeld(findStylesheets(at), isSheet)
    .filter((file) => !systemFiles.has(file) && wanted(file))
    .map((file) => makeSheet(file, noting(relative(at, file), contents(file)), at, namespace, systemDeclares));
  const tsx = withHeld(findSources(at), isSource).filter((file) => !ignored(relative(at, file)));
  const sources = tsx
    .filter(wanted)
    .map((file) => ({ file: relative(at, file), source: noting(relative(at, file), contents(file)) }));
  /* A component's story is what names its level, and its test is how the
     structure rules know it has one — so those two are read whether or not
     any rule scans their bodies. */
  const read = new Map(tsx.map((file) => [relative(at, file), contents(file)]));
  const components = readComponents([...read.keys()], (file) => read.get(file) ?? "");
  /* Named, never guessed: the tool has no way to tell which of an app's
     dependencies is its design system, and the rules that read this say so
     rather than passing silently when nothing named one. */
  const exported = config?.components === undefined ? undefined : readSystemComponents(config.components, at);
  const fonts = findFonts(at)
    .filter(scanned)
    .map((file) => relative(at, file));
  const brand = sheets.filter((s) => s.isBrand).map((s) => s.path);
  const graph = brand.length > 0 ? loadGraph({ system: entry, prefix: namespace, brand }) : unbranded;
  /* What the system declares travels with the system: an app is answered from
     the copy of it that it installed, not from whatever the tool was built
     knowing. `dsbridge/` beside the entry stylesheet is where it publishes it,
     and the file beside the entry is the older place the contract sat. */
  const published = <T,>(name: string): T | undefined => {
    for (const at of [resolve(dirname(entry), "dsbridge", name), resolve(dirname(entry), name)]) {
      if (existsSync(at)) return JSON.parse(readFileSync(at, "utf8")) as T;
    }
    return undefined;
  };
  const contract = published<Contract>("contract.json");
  const roles = loadRoles(published<RolesFile>("roles.json"), graph.names());
  const choosing = loadChoosing(published<ChoosingFile>("choosing.json"));
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
    ...(exported ? { exported } : {}),
    ...(config ? { config } : {}),
    ...(contract ? { contract } : {}),
    roles,
    choosing,
    suppressed,
    ignores,
  });
}
