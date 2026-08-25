/* `dsbridge report` — where this repo stands, in the shape somebody asks it.
 *
 * `check` prints one line per finding, which is what a build and an editor
 * need and what a person cannot read: 464 lines answer "is anything wrong"
 * and nothing else. The questions actually being asked are fewer and older —
 * is this app on the system, can everyone use it, and does the scale have the
 * rungs the app keeps reaching for. Each rule says which of those it speaks
 * to, so the two halves cannot drift: adding a rule files it here as well.
 *
 * Nothing here re-measures anything. It is the same `runCheck` and the same
 * `planMigration` the other commands run, counted instead of listed.
 */
import { ruleById } from "../rules/index.js";
import { runCheck, skippedRules, unrecordedSkips } from "./check.js";
import { planMigration, type Migration } from "./migrate.js";
import type { Concern, Context, Finding } from "../rules/types.js";
import { relative } from "node:path";
import { bold, clip, dim, green, pad, plural, red, visible, wrap } from "../text.js";

/** One rule's failures, counted. The rule's own title says what is not true. */
export type Failure = {
  rule: string;
  title: string;
  count: number;
  files: number;
  /** The criterion the rule names, never one inferred here. */
  wcag?: string;
};

/** A value written by hand that no token holds: a rung the scale is missing. */
export type Missing = { value: string; places: number; files: number };

export type Report = {
  /** The repo, as a person refers to it. */
  name: string;
  /** A design system is not adopting itself: the questions about reaching for
      the system are the app's, and asked of the system they measure nothing. */
  kind: "system" | "app";
  /** What it was measured against: the system package, or its stylesheet. */
  against?: string;
  alignment: {
    /** Absent when nothing said what the system exports. */
    components?: { used: number; total: number };
    contract: { total: number; repointed: number };
    /** The app's own token layer: how much of it the system already names. */
    scale: { own: number; named: number; wired: number };
    literals: { count: number; files: number };
    failures: Failure[];
  };
  accessibility: Failure[];
  scale: { missing: Missing[]; failures: Failure[] };
  structure: Failure[];
  notChecked: { rule: string; reason: string; closeable: boolean }[];
};

const LITERAL_RULES = ["no-literal-color", "no-literal-length"];

/** Findings become failures: one row per rule, with the rule's own words. */
const failures = (findings: Finding[]): Failure[] => {
  const byRule = new Map<string, Finding[]>();
  for (const finding of findings) {
    byRule.set(finding.rule, [...(byRule.get(finding.rule) ?? []), finding]);
  }
  return [...byRule]
    .map(([rule, found]) => {
      const declared = ruleById(rule);
      return {
        rule,
        title: declared?.title ?? rule,
        count: found.length,
        files: new Set(found.map((f) => f.file)).size,
        ...(declared?.wcag ? { wcag: declared.wcag } : {}),
      };
    })
    .sort((a, b) => b.count - a.count || a.rule.localeCompare(b.rule));
};

/**
 * The findings, filed under the question their rule answers.
 *
 * A rule the registry does not know — one from an older version, or a stale
 * baseline — is filed under alignment rather than dropped: a report that
 * silently loses a finding is the failure this command exists to fix.
 */
export function byConcern(findings: Finding[]): Record<Concern, Failure[]> {
  const of = (finding: Finding): Concern => ruleById(finding.rule)?.concern ?? "alignment";
  const filed: Record<Concern, Finding[]> = {
    alignment: [],
    accessibility: [],
    scale: [],
    structure: [],
  };
  for (const finding of findings) filed[of(finding)].push(finding);
  return {
    alignment: failures(filed.alignment),
    accessibility: failures(filed.accessibility),
    scale: failures(filed.scale),
    structure: failures(filed.structure),
  };
}

/** The values nothing in the scale holds, most-written first. */
const missingRungs = (findings: Finding[]): Missing[] => {
  const byValue = new Map<string, Finding[]>();
  for (const finding of findings) {
    if (finding.confidence !== "none" || finding.value === undefined) continue;
    byValue.set(finding.value, [...(byValue.get(finding.value) ?? []), finding]);
  }
  return [...byValue]
    .map(([value, found]) => ({
      value,
      places: found.length,
      files: new Set(found.map((f) => f.file)).size,
    }))
    .sort((a, b) => b.places - a.places || a.value.localeCompare(b.value));
};

export function buildReport(context: Context, findings = runCheck(context)): Report {
  const plan: Migration = planMigration(context);
  const filed = byConcern(findings);
  const literals = findings.filter((finding) => LITERAL_RULES.includes(finding.rule));
  const wired = new Set(plan.wired);
  const skipped = skippedRules(context);
  const unrecorded = unrecordedSkips(context);
  const system = context.system === undefined ? undefined : relative(context.root, context.system);
  const against = context.kind === "system" ? undefined : (context.exportedFrom ?? system);

  return {
    name: context.root.split("/").filter(Boolean).at(-1) ?? context.root,
    kind: context.kind,
    ...(against === undefined ? {} : { against }),
    alignment: {
      ...(plan.components
        ? {
            components: {
              used: plan.components.used.length,
              total: plan.components.used.length + plan.components.unused.length,
            },
          }
        : {}),
      contract: plan.contract,
      scale: {
        own: plan.own.length,
        named: plan.own.filter((token) => !wired.has(token.name) && token.equivalent !== undefined).length,
        wired: plan.wired.length,
      },
      literals: { count: literals.length, files: new Set(literals.map((f) => f.file)).size },
      failures: filed.alignment,
    },
    accessibility: filed.accessibility,
    scale: { missing: missingRungs(findings), failures: filed.scale },
    structure: filed.structure,
    notChecked: [...skipped].map(([rule, reason]) => ({
      rule,
      reason,
      closeable: unrecorded.has(rule),
    })),
  };
}

/** Rules named per section; `check` has every one of them. */
const ROWS = 6;
/** Missing rungs named on the line they share. */
const RUNGS = 6;

/**
 * A line of the report.
 *
 * `{ left }` is prose across the whole width, with a verdict pinned right where
 * a heading has one. `{ count }` is a row of the findings table, which is the
 * one part with columns: a number, and what is not true beside it.
 * `"divider"` is a horizontal rule, and it works out its own junctions.
 */
type Row = "divider" | { left: string; right?: string } | { count: string; text: string };

/** Printed width of the count column, the space either side of it included. */
const COUNT = 6;

const ruled = (row?: Row): boolean => typeof row === "object" && "count" in row;

/** Wide enough for a rule's own words, never wider than the terminal. */
export const widthOf = (columns?: number): number => Math.max(56, Math.min((columns ?? 80) - 1, 84));

/*
 * The frame.
 *
 * The sections are one document rather than five outputs, and on a terminal
 * nothing else says so: the shell's scrollback runs straight into the top of
 * whatever printed last. The border is the only thing marking where this
 * answer begins and ends, so it draws with or without colour.
 *
 * Where a rule meets the table's column it has to turn a corner, and which
 * corner depends on what is above and below it — so a divider is written as a
 * divider everywhere and the junction is worked out here. Nothing that emits
 * one has to know what it is sitting between.
 */
function frame(title: string, body: Row[], width: number, color: boolean): string[] {
  /* Two rules in a row draw two lines and mean one thing: the end of a table
     and the start of a section are the same edge. */
  const rows = body.filter((row, i) => !(row === "divider" && body[i + 1] === "divider"));
  const text = width - COUNT - 5;
  const inner = width - 4;
  const bar = dim("\u2502", color);
  const line = (left: string, middle: string, right: string) =>
    dim(left + "\u2500".repeat(COUNT) + middle + "\u2500".repeat(width - COUNT - 3) + right, color);
  /* The title lives in the top border, so nothing else may be drawn in it. */
  const label = ` ${bold(title, color)} `;
  const fill = Math.max(2, width - 3 - visible(label));
  const out = [
    dim("\u250c\u2500", color) + label + dim("\u2500".repeat(fill) + "\u2510", color),
  ];

  rows.forEach((row, i) => {
    if (row === "divider") {
      const above = ruled(rows[i - 1]);
      const below = ruled(rows[i + 1]);
      const middle = above && below ? "\u253c" : above ? "\u2534" : below ? "\u252c" : "\u2500";
      out.push(line("\u251c", middle, "\u2524"));
      return;
    }
    if ("count" in row) {
      out.push(`${bar} ${pad(row.count.padStart(COUNT - 2), COUNT - 2)} ${bar} ${pad(clip(row.text, text), text)} ${bar}`);
      return;
    }
    const right = row.right ?? "";
    /* The verdict is the part that has to survive: what is left after it is
       what the text gets, and a rule title longer than that is cut to fit. */
    const room = Math.max(0, inner - visible(right) - (right === "" ? 0 : 2));
    out.push(`${bar} ${pad(clip(row.left, room), inner - visible(right))}${right} ${bar}`);
  });

  out.push(line("\u2514", ruled(rows.at(-1)) ? "\u2534" : "\u2500", "\u2518"));
  return out;
}

const total = (rows: Failure[]) => rows.reduce((sum, it) => sum + it.count, 0);

const heading = (title: string, verdict: string, color: boolean): Row => ({
  left: bold(title.toUpperCase(), color),
  right: verdict,
});

const fact = (label: string, said: string): Row => ({ left: `  ${label.padEnd(13)}${said}` });

/** Prose, broken to the frame rather than to a width guessed when it was
    written: the box is as wide as the terminal allows, and this follows it. */
const note = (text: string, color: boolean, width: number): Row[] =>
  wrap(text, width - 6).map((line) => ({ left: dim(`  ${line}`, color) }));

/**
 * The findings table: one rule per row, in the rule's own words.
 *
 * The count is a column rather than an indent because it is the number a
 * person sorts on, and the rule id sits under the title it belongs to so the
 * row reads as one thing — the id is what `dsbridge rules` takes.
 */
const rows = (found: Failure[], color: boolean): Row[] => {
  const shown = found.slice(0, ROWS);
  const out: Row[] = [];
  for (const failure of shown) {
    if (out.length > 0) out.push("divider");
    const criterion = failure.wcag === undefined ? "" : dim(`  ${failure.wcag}`, color);
    out.push({ count: String(failure.count), text: `${failure.title}${criterion}` });
    out.push({
      count: "",
      text: dim(`${failure.rule} — ${failure.count} in ${plural(failure.files, "file")}`, color),
    });
  }
  const more = found.length - shown.length;
  if (more > 0) out.push("divider", { count: "", text: dim(`and ${plural(more, "rule")} more`, color) });
  return out.length === 0 ? [] : ["divider", ...out, "divider"];
};

/** What the alignment section adds up to. Three words, and each is earned. */
const verdictOf = (report: Report): string => {
  const { contract, components, literals, failures: broken } = report.alignment;
  const reaches = components === undefined || components.used > 0;
  if (contract.repointed === 0 && !reaches) return "not on the system";
  if (broken.length === 0 && literals.count === 0) return "aligned";
  return "partial";
};

export function renderReport(
  report: Report,
  _context: Context,
  options: { color?: boolean; columns?: number } = {},
): string {
  const color = options.color ?? true;
  const width = widthOf(options.columns);
  const { alignment } = report;
  const verdict = verdictOf(report);
  const failed = total(report.accessibility);
  const body: Row[] = [];

  if (report.against !== undefined) body.push(...note(`measured against ${report.against}`, color, width), "divider");

  body.push(heading("alignment", verdict === "aligned" ? green(verdict, color) : red(verdict, color), color));

  /* Adoption facts, and a system does not adopt itself. */
  if (report.kind === "app") {
    if (alignment.components !== undefined) {
      body.push(fact("components", `${alignment.components.used} of ${alignment.components.total} imported somewhere`));
    }
    body.push(
      fact("contract", `${alignment.contract.repointed} of ${alignment.contract.total} semantic tokens re-pointed`),
    );
    if (alignment.scale.own > 0) {
      body.push(
        fact(
          "own tokens",
          `${alignment.scale.own} declared, ${alignment.scale.named} the system already names` +
            (alignment.scale.wired > 0 ? `, ${alignment.scale.wired} in a brand` : ""),
        ),
      );
    }
  }
  body.push(
    fact(
      "styling",
      alignment.literals.count === 0
        ? "no literal values in component stylesheets"
        : `${plural(alignment.literals.count, "literal value")} in ${plural(alignment.literals.files, "file")}`,
    ),
  );
  if (alignment.failures.length > 0) {
    body.push(...note("what goes around the system:", color, width), ...rows(alignment.failures, color));
  }

  body.push(
    "divider",
    heading(
      "accessibility",
      failed === 0 ? green("nothing source can show", color) : red(plural(failed, "failure"), color),
      color,
    ),
    ...rows(report.accessibility, color),
    ...note(
      "Read from source: no page was rendered. This is what the files show, and it is never a conformance claim.",
      color,
      width,
    ),
  );

  const { missing } = report.scale;
  body.push(
    "divider",
    heading(
      "missing from the scale",
      missing.length === 0 ? green("nothing", color) : plural(missing.length, "value"),
      color,
    ),
  );
  if (missing.length > 0) {
    const shown = missing.slice(0, RUNGS);
    body.push(
      {
        left:
          `  ${shown.map((it) => `${it.value} ${it.places}\u00d7`).join("   ")}` +
          (missing.length > shown.length ? dim(`   and ${missing.length - shown.length} more`, color) : ""),
      },
      ...note(
        "Each is a value written by hand that no token holds — add the rung, or the app goes on writing it.",
        color,
        width,
      ),
    );
  }
  if (report.scale.failures.length > 0) body.push(...rows(report.scale.failures, color));

  if (report.structure.length > 0) {
    body.push(
      "divider",
      heading("structure", plural(total(report.structure), "finding"), color),
      ...rows(report.structure, color),
    );
  }

  const closeable = report.notChecked.filter((it) => it.closeable);
  body.push(
    "divider",
    heading(
      "not checked",
      report.notChecked.length === 0 ? green("every rule ran", color) : plural(report.notChecked.length, "rule"),
      color,
    ),
  );
  /* Three rules blocked on one missing config line is one thing to fix, and
     printing the reason under each of them reads as three. */
  const blocked = new Map<string, { rule: string; closeable: boolean }[]>();
  for (const { rule, reason, closeable: open } of report.notChecked) {
    blocked.set(reason, [...(blocked.get(reason) ?? []), { rule, closeable: open }]);
  }
  for (const [reason, group] of blocked) {
    body.push(
      { left: `  ${group.map((it) => (it.closeable ? red(it.rule, color) : it.rule)).join(", ")}` },
      ...wrap(reason, width - 8).map((line) => ({ left: dim(`    ${line}`, color) })),
    );
  }
  if (closeable.length > 0) {
    body.push(...note(`${plural(closeable.length, "rule")} in red could run — the config has not told it what it needs.`, color, width));
  }

  body.push("divider", ...note("the same findings as a work list: dsbridge check", color, width));

  return frame(report.name, body, width, color).join("\n") + "\n";
}
