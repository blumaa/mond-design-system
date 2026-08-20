/* A rule is data.
 *
 * `mds check` runs the `check` half; `mds rules` prints the prose half. They
 * cannot drift, because they are the same object — which is the point. A
 * design system whose written guidance lives beside its enforcement ends up
 * with guidance nobody enforces and enforcement nobody explained.
 */
import type { Graph } from "../graph.js";

/** Who a rule is aimed at: the design system's own source, or an app using it. */
export type Target = "system" | "app" | "both";

export type Finding = {
  rule: string;
  /** Repo-relative. */
  file: string;
  /** 1-based, absent when the finding is about the file as a whole. */
  line?: number;
  message: string;
};

export type Sheet = {
  /** Absolute. */
  path: string;
  /** Relative to the checked root — what a finding prints. */
  file: string;
  /** Comments blanked, line numbers preserved. */
  source: string;
  lines: string[];
  /** Tokens this sheet declares. */
  declares: Set<string>;
  /** It declares tokens for the whole document, so it is a value source rather
      than a component's stylesheet — the app's own scale, or its brand. */
  isTokens: boolean;
  /** It re-points design system tokens, so brand rules apply to it. */
  isBrand: boolean;
};

/** The accessibility contract the design system publishes beside its stylesheet. */
export type ContrastPair = { fg: string; bg: string[]; ratio: number };
export type Contract = { contrast: ContrastPair[] };

export type Context = {
  root: string;
  kind: "system" | "app";
  graph: Graph;
  sheets: Sheet[];
  /** The design system's entry stylesheet, wherever it was resolved from. */
  system?: string;
  /** The token namespace the design system owns, e.g. `--mds-`. */
  prefix: string;
  /** Core groups whose tokens are rungs on a scale rather than named roles. */
  scales?: string[];
  /** What the system promises about contrast, when it publishes one. */
  contract?: Contract;
  /**
   * Per-rule opt-outs from the config, each with a reason on record. A rule may
   * also ask about a narrower key of its own — `no-raw-scale-step/typography`
   * exempts one scale rather than the whole rule.
   */
  exempt(rule: string, file: string): boolean;
};

export type Rule = {
  /** Stable, kebab-case; what a config exempts and what a finding names. */
  id: string;
  /** One imperative line: what the rule requires. */
  title: string;
  /** The failure it prevents. An agent reads this to decide, not to obey. */
  why: string;
  /** What to do instead. */
  instead: string;
  target: Target;
  /** A reason this rule cannot run here, when there is one. Silence from a rule
      that never ran reads exactly like a pass, so it is reported instead. */
  needs?(context: Context): string | undefined;
  check(context: Context): Finding[];
};

export const appliesTo = (rule: Rule, kind: "system" | "app") =>
  rule.target === "both" || rule.target === kind;

/** Sheets a component rule looks at: the ones that style something.
    A file whose job is to declare values is not one of them — writing `8px`
    there is what it is for. */
export const componentSheets = (context: Context) => context.sheets.filter((s) => !s.isTokens && !s.isBrand);

/** Sheets that declare values for the whole document: the app's own token layer. */
export const tokenSheets = (context: Context) => context.sheets.filter((s) => s.isTokens);

/** Sheets a brand rule looks at: the ones that re-point the contract. */
export const brandSheets = (context: Context) => context.sheets.filter((s) => s.isBrand);

export const findingsIn = (
  sheet: Sheet,
  rule: string,
  scan: (line: string, number: number) => string[],
): Finding[] =>
  sheet.lines.flatMap((line, i) =>
    scan(line, i + 1).map((message) => ({ rule, file: sheet.file, line: i + 1, message })),
  );
