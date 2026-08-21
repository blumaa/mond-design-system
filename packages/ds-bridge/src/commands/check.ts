/* `dsbridge check` — the rules, run.
 *
 * A finding names the file, the line and the rule, and nothing else: the
 * argument for why it matters lives in the rule itself, where `dsbridge rules` can
 * print it. The output is a work list, not an essay.
 */
import { rulesFor } from "../rules/index.js";
import { isEnforced } from "../rules/types.js";
import type { Context, Finding } from "../rules/types.js";
import type { Confidence } from "../rules/suggest.js";
import { bold, dim, green, plural, red } from "../text.js";

export type CheckOptions = {
  /** Rule ids to run; all of them when absent. */
  only?: string[];
  color?: boolean;
  /** Findings the baseline already holds, so the debt is never invisible. */
  held?: number;
};

const place = (a: Finding, b: Finding) => a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0);

/** What the check did not look at. Silence here reads as a pass, so it is
    printed whether the run was clean or not, and names what would restore it. */
function exclusions(context: Context, color: boolean): string[] {
  const { tests, scope, lines } = context.suppressed;
  const out: string[] = [];
  if (tests > 0) {
    const what = tests === 1 ? "test or story" : "tests and stories";
    out.push(dim(`  ${tests} ${what} not scanned — run --include-tests`, color));
  }
  if (scope > 0) out.push(dim(`  ${plural(scope, "file")} outside sources not scanned`, color));
  if (lines > 0) out.push(dim(`  ${plural(lines, "line")} suppressed by comment`, color));
  return out;
}

/* What a person actually decides, in the order they can decide it: the ones
   with a single answer, then the ones needing a choice, then the ones that are
   the system's gap rather than the app's debt. Grouping by rule cannot say
   this — one rule produces all three. */
const CAUSES: { confidence: Confidence; title: string }[] = [
  { confidence: "certain", title: "one token holds the value" },
  { confidence: "ambiguous", title: "several tokens claim the property" },
  { confidence: "value-only", title: "several tokens hold the value" },
  { confidence: "none", title: "no token holds it — the scale is missing a rung" },
];

/** Values named per cause; the rest are counted. */
const ROWS = 5;
/** Candidates named per value. */
const NAMED = 4;

const row = (parts: string[]) => parts.filter((part) => part !== "").join("  ");

/** The same findings, grouped by what would have to be decided about them. */
function causes(findings: Finding[], color: boolean): string[] {
  const carried = findings.filter((f) => f.confidence !== undefined && f.value !== undefined);
  if (carried.length === 0) return [];
  const lines: string[] = [];
  for (const { confidence, title } of CAUSES) {
    const group = carried.filter((f) => f.confidence === confidence);
    if (group.length === 0) continue;
    lines.push(`  ${String(group.length).padStart(4)}  ${title}`);

    const byValue = new Map<string, Finding[]>();
    for (const finding of group) {
      byValue.set(finding.value!, [...(byValue.get(finding.value!) ?? []), finding]);
    }
    const ordered = [...byValue].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    const shown = ordered.slice(0, ROWS);
    const width = Math.max(...shown.map(([value]) => value.length));
    for (const [value, found] of shown) {
      const first = found[0]!;
      const files = new Set(found.map((f) => f.file)).size;
      const tokens = first.autofix ?? (first.candidates ?? []).slice(0, NAMED).join(" | ");
      const where = `${plural(found.length, "place")} in ${plural(files, "file")}`;
      lines.push(dim(`        ${row([value.padEnd(width), tokens, where])}`, color));
    }
    const more = ordered.length - shown.length;
    if (more > 0) lines.push(dim(`        and ${more} more ${more === 1 ? "value" : "values"}`, color));
  }
  return lines;
}

/** Rule id to the reason it could not run here. */
export const skippedRules = (context: Context, options: CheckOptions = {}): Map<string, string> => {
  const out = new Map<string, string>();
  for (const rule of rulesFor(context, options.only).filter(isEnforced)) {
    const reason = rule.needs?.(context);
    if (reason !== undefined) out.set(rule.id, reason);
  }
  return out;
};

export function runCheck(context: Context, options: CheckOptions = {}): Finding[] {
  const skipped = skippedRules(context, options);
  return rulesFor(context, options.only)
    .filter(isEnforced)
    .filter((rule) => !skipped.has(rule.id))
    .flatMap((rule) => rule.check(context))
    .filter((finding) => !context.ignored(finding.file, finding.line))
    .sort(place);
}

export function renderCheck(findings: Finding[], context: Context, options: CheckOptions = {}): string {
  const color = options.color ?? true;
  const skipped = skippedRules(context, options);
  const ran = rulesFor(context, options.only).filter(isEnforced).length - skipped.size;
  const scope = `${context.sheets.length} stylesheets, ${context.graph.tokens().length} tokens, ${ran} rules`;
  const held = options.held ?? 0;
  const notes = [
    ...(held > 0 ? [dim(`  ${plural(held, "finding")} held by the baseline`, color)] : []),
    ...exclusions(context, color),
    ...[...skipped].map(([rule, reason]) => dim(`  skipped ${rule}: ${reason}`, color)),
  ];
  if (findings.length === 0) return [`${green("clean", color)} — ${scope}`, ...notes, ""].join("\n");

  const files = new Map<string, Finding[]>();
  for (const finding of findings) files.set(finding.file, [...(files.get(finding.file) ?? []), finding]);

  const lines: string[] = [];
  for (const [file, found] of files) {
    lines.push(bold(file, color));
    const width = Math.max(...found.map((f) => String(f.line ?? "").length));
    for (const finding of found) {
      const at = String(finding.line ?? "").padStart(width);
      lines.push(`  ${dim(at, color)}  ${finding.message}  ${dim(finding.rule, color)}`);
    }
    lines.push("");
  }

  const byRule = new Map<string, number>();
  for (const finding of findings) byRule.set(finding.rule, (byRule.get(finding.rule) ?? 0) + 1);
  lines.push(`${red(plural(findings.length, "finding"), color)} in ${plural(files.size, "file")} — ${scope}`);
  for (const [rule, count] of [...byRule].sort((a, b) => b[1] - a[1])) {
    lines.push(dim(`  ${String(count).padStart(4)}  ${rule}`, color));
  }
  lines.push(...causes(findings, color));
  lines.push(...notes);
  lines.push(dim(`\nWhy each of these matters: dsbridge rules ${[...byRule.keys()][0]}`, color));
  return lines.join("\n") + "\n";
}
