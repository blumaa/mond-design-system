/* A rule is data.
 *
 * `dsbridge check` runs the `check` half; `dsbridge rules` prints the prose half. They
 * cannot drift, because they are the same object — which is the point. A
 * design system whose written guidance lives beside its enforcement ends up
 * with guidance nobody enforces and enforcement nobody explained.
 */
import { dirname, resolve } from "node:path";
import type { Suppressed } from "../context.js";
import type { Block } from "../css/parse.js";
import type { Confidence } from "./suggest.js";
import type { Graph } from "../graph.js";
import type { Component } from "../structure.js";
import type { Roles } from "../roles.js";
import type { Semantics } from "../semantics.js";
import type { Choosing } from "../choosing.js";
import type { Surface } from "../surface.js";

/** Who a rule is aimed at: the design system's own source, or an app using it. */
export type Target = "system" | "app" | "both";

/**
 * The question a rule answers, and so where `dsbridge report` files it.
 *
 * `check` prints one line per finding, which is the right shape for a work list
 * and the wrong shape for "how are we doing". A person asking that is asking
 * three separate questions — is this app on the system, can everyone use it,
 * and is the scale complete — and a list of 464 lines answers none of them.
 * Declaring it on the rule rather than in the report keeps the two from
 * drifting: a rule cannot be added without saying which question it speaks to.
 */
export type Concern =
  /** Is this app using the system, or working around it. */
  | "alignment"
  /** What somebody cannot see, read, tap or reach. */
  | "accessibility"
  /** Values written by hand rather than read from the scale, and the rungs the
      scale turns out not to have. */
  | "scale"
  /** The repo's own shape: its taxonomy, its brand wiring, what it ships. */
  | "structure";

/**
 * What a rule reads, and so which file it has anything to say about.
 *
 * `dsbridge rules --for <file>` is the path an agent takes mid-edit, and it can
 * only be short if a rule declares its own subject. `repo` is the rest: rules
 * about the token graph, the fonts, or the shape of the whole repo, which no
 * single file query should return.
 */
export type Reads = "stylesheet" | "component" | "repo";

/**
 * One thing wrong, as data.
 *
 * `message` is the sentence a person reads. Everything under it is the same
 * finding without the English: a consumer that wants the tokens a value could
 * have been should not have to regex them back out of a sentence, and a fix
 * cannot be written at all until `confidence` says which findings have one
 * right answer.
 */
export type Finding = {
  rule: string;
  /** Repo-relative. */
  file: string;
  /** 1-based, absent when the finding is about the file as a whole. */
  line?: number;
  /** 1-based, where the offending text starts. */
  col?: number;
  message: string;
  /** The CSS property or style-prop key the value was written for. */
  property?: string;
  /** The literal, as written. */
  value?: string;
  /** Every token that could be meant, best first. */
  candidates?: string[];
  confidence?: Confidence;
  /** What to write instead — present only where exactly one thing can be meant. */
  autofix?: string;
  /** Above the baseline: this one was not there when the debt was recorded. */
  new?: boolean;
};

/** A finding before it knows where it is: what a scan over one line returns. */
export type Detail = Omit<Finding, "rule" | "file" | "line">;

export type Sheet = {
  /** Absolute. */
  path: string;
  /** Relative to the checked root — what a finding prints. */
  file: string;
  /** Comments blanked, line numbers preserved. */
  source: string;
  lines: string[];
  /** Every rule block in the file, with everything it sets. */
  blocks: Block[];
  /** Tokens this sheet declares. */
  declares: Set<string>;
  /** It declares tokens for the whole document, so it is a value source rather
      than a component's stylesheet — the app's own scale, or its brand. */
  isTokens: boolean;
  /** It re-points design system tokens, so brand rules apply to it. */
  isBrand: boolean;
};

/** A TypeScript source file, read once for every rule that looks at one. */
export type Source = {
  /** Relative to the checked root — what a finding prints. */
  file: string;
  /** Comments blanked, line numbers preserved. */
  source: string;
};

/** The accessibility contract the design system publishes beside its stylesheet. */
export type ContrastPair = { fg: string; bg: string[]; ratio: number };
export type Contract = { contrast: ContrastPair[] };

export type Context = {
  root: string;
  kind: "system" | "app";
  graph: Graph;
  sheets: Sheet[];
  /** What the repo is made of: one entry per component directory. */
  components: Component[];
  /** What the design system this repo uses exports, when it says. Empty in the
      system's own repo, and in an app whose config never named the package. */
  exported: string[];
  /** The specifier those names are imported under, when it is known. Two systems
      are installed at once for the length of a migration and they share component
      names by design, so a count that cannot tell them apart counts nothing. */
  exportedFrom?: string;
  /** Every `.tsx` the repo owns, read: where CSS-in-JS hides. */
  sources: Source[];
  /** Repo-relative paths of any typeface the repo carries. */
  fonts: string[];
  /** The design system's entry stylesheet, wherever it was resolved from. */
  system?: string;
  /** The token namespace the design system owns, e.g. `--mds-`. */
  prefix: string;
  /** Core groups whose tokens are rungs on a scale rather than named roles. */
  scales?: string[];
  /** The taxonomy, simplest first: a component composes strictly lower levels. */
  levels: string[];
  /** Story-title segments that name something other than a level. */
  levelsIgnore: string[];
  /** The layout components the design system ships, when the config names them. */
  primitives: string[];
  /** What the system promises about contrast, when it publishes one. */
  contract?: Contract;
  /** What each token is for, when the system says. Empty otherwise, and an
      empty set answers no property — which is the honest answer. */
  roles: Roles;
  /** What each component announces, when the system says. Empty otherwise: a
      role read off one side alone is not a comparison. */
  semantics: Semantics;
  /** What the app's own components are called on the system's side, for the
      pairs whose names differ. Empty when the app never said. */
  replaces: Record<string, string>;
  /** Which of two components that both compile this case wants, when the system
      says. Empty otherwise — nothing in the code can answer it. */
  choosing: Choosing;
  /** What a brand may set and what belongs to nobody, when the system says.
      Empty otherwise, and an empty surface holds a brand to nothing — which is
      the honest answer when the system never drew the line. */
  surface: Surface;
  /** Files found and not scanned. A check that quietly halved its own scope
      reads exactly like a clean one, so the count is printed either way. */
  suppressed: Suppressed;
  /** Rules the repo has recorded as unable to run here. A skip outside this
      list fails the check rather than printing below it. */
  allowSkipped: string[];
  /**
   * Per-rule opt-outs from the config, each with a reason on record. A rule may
   * also ask about a narrower key of its own — `no-raw-scale-step/typography`
   * exempts one scale rather than the whole rule.
   */
  exempt(rule: string, file: string): boolean;
  /** A line a comment took out of the check, reason and all. Applied once, to
      every finding, so no rule can forget to honour it. */
  ignored(file: string, line?: number): boolean;
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
  /** Which of the report's questions this rule speaks to. Required: a rule
      that does not say is a rule the report silently drops. */
  concern: Concern;
  /**
   * The WCAG success criterion this rule speaks to, where one covers it.
   *
   * Named so the report can say which criterion a failure sits under. It is
   * never a conformance claim: this tool reads source, not a rendered page, so
   * a criterion with no failures here has not been tested — only not violated
   * in the ways source can show.
   */
  wcag?: string;
  target: Target;
  /** The kind of file this rule is about. Required: a rule that does not say
      is a rule `--for` silently never mentions. */
  reads: Reads;
  /** A reason this rule cannot run here, when there is one. Silence from a rule
      that never ran reads exactly like a pass, so it is reported instead. */
  needs?(context: Context): Skip | undefined;
  /** Absent when the rule is advisory: some of what a design system asks for is
      judgement, and a rule that cannot prove itself says so rather than
      pretending. `dsbridge rules` prints it either way. */
  check?(context: Context): Finding[];
};

/**
 * Why a rule could not run, and whether that is anybody's fault.
 *
 * A bare string is a gap the repo could close: something it has not told the
 * tool, or a design system too old to publish what the rule reads. Those fail
 * the check unless the repo records them, because a rule that could not run
 * reads exactly like a rule with nothing to say.
 *
 * `nothingToCheck` is the other kind — the repo holds no file of the sort this
 * rule reads. There is nothing to close and nothing to record.
 */
export type Skip = string | { reason: string; nothingToCheck: true };

export const nothingToCheck = (reason: string): Skip => ({ reason, nothingToCheck: true });

export const reasonOf = (skip: Skip): string => (typeof skip === "string" ? skip : skip.reason);

/** Whether the repo could do something about it. */
export const isCloseable = (skip: Skip): boolean => typeof skip === "string";

/** A rule earns "enforced" by carrying its own proof, not by claiming it. */
export const isEnforced = (rule: Rule): rule is Rule & { check: NonNullable<Rule["check"]> } =>
  rule.check !== undefined;

export const appliesTo = (rule: Rule, kind: "system" | "app") =>
  rule.target === "both" || rule.target === kind;

/** Sheets a component rule looks at: the ones that style something.
    A file whose job is to declare values is not one of them — writing `8px`
    there is what it is for. */
export const componentSheets = (context: Context) => context.sheets.filter((s) => !s.isTokens && !s.isBrand);

/** A block's selector without the pseudo-element it ends in. */
const base = (selector: string) => selector.replace(/::?[a-zA-Z-]+$/, "");

/** What `composes: a b from "./x.css"` names, and where it names it. */
const composedIn = (block: Block): { names: string[]; from?: string }[] =>
  block.declarations
    .filter((d) => d.property === "composes")
    .map((d) => {
      const split = /^([\s\S]+?)\s+from\s+["']([^"']+)["']\s*$/.exec(d.value.trim());
      const names = (split?.[1] ?? d.value).trim().split(/\s+/).filter(Boolean);
      return split === null ? { names } : { names, from: split[2]! };
    });

/**
 * Every block that styles the element this one styles.
 *
 * A block is not the whole of what an element gets: a pseudo-element attached
 * to the class paints part of it, and CSS Modules `composes` puts another
 * class's rules on it as well — from another file, which a rule reading one
 * sheet never sees. Anything that measures an element has to follow both or it
 * measures a fraction of it.
 *
 * A `composes` pointing outside what was scanned — a package the app installed —
 * resolves to nothing, and the caller sees only what it can actually read.
 */
export const sameElement = (
  context: Context,
  sheet: Sheet,
  block: Block,
  seen = new Set<string>(),
): { sheet: Sheet; block: Block }[] => {
  const key = `${sheet.path} ${block.selector}`;
  if (seen.has(key)) return [];
  seen.add(key);

  const here = base(block.selector);
  const mine = sheet.blocks.filter((b) => base(b.selector) === here);
  return [
    ...mine.map((b) => ({ sheet, block: b })),
    ...composedIn(block).flatMap(({ names, from }) => {
      const target =
        from === undefined
          ? sheet
          : context.sheets.find((s) => s.path === resolve(dirname(sheet.path), from));
      if (target === undefined) return [];
      return names.flatMap((name) =>
        target.blocks
          .filter((b) => base(b.selector) === `.${name}`)
          .flatMap((b) => sameElement(context, target, b, seen)),
      );
    }),
  ];
};

/** Sheets that declare values for the whole document: the app's own token layer. */
export const tokenSheets = (context: Context) => context.sheets.filter((s) => s.isTokens);

/** Sheets a brand rule looks at: the ones that re-point the contract. */
export const brandSheets = (context: Context) => context.sheets.filter((s) => s.isBrand);

/** A rule with nothing structured to say returns the sentence and no more. */
export const findingsIn = (
  sheet: Sheet,
  rule: string,
  scan: (line: string, number: number) => (string | Detail)[],
): Finding[] =>
  sheet.lines.flatMap((line, i) =>
    scan(line, i + 1).map((found) => ({
      rule,
      file: sheet.file,
      line: i + 1,
      ...(typeof found === "string" ? { message: found } : found),
    })),
  );
