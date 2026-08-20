/* `dsbridge check` — the rules, run.
 *
 * A finding names the file, the line and the rule, and nothing else: the
 * argument for why it matters lives in the rule itself, where `dsbridge rules` can
 * print it. The output is a work list, not an essay.
 */
import { rulesFor } from "../rules/index.js";
import { isEnforced } from "../rules/types.js";
import type { Context, Finding } from "../rules/types.js";

export type CheckOptions = {
  /** Rule ids to run; all of them when absent. */
  only?: string[];
  color?: boolean;
};

const ESC = "\u001b[";
const dim = (s: string, on: boolean) => (on ? `${ESC}2m${s}${ESC}0m` : s);
const bold = (s: string, on: boolean) => (on ? `${ESC}1m${s}${ESC}0m` : s);
const red = (s: string, on: boolean) => (on ? `${ESC}31m${s}${ESC}0m` : s);
const green = (s: string, on: boolean) => (on ? `${ESC}32m${s}${ESC}0m` : s);

const place = (a: Finding, b: Finding) => a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0);

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
    .sort(place);
}

export function renderCheck(findings: Finding[], context: Context, options: CheckOptions = {}): string {
  const color = options.color ?? true;
  const skipped = skippedRules(context, options);
  const ran = rulesFor(context, options.only).filter(isEnforced).length - skipped.size;
  const scope = `${context.sheets.length} stylesheets, ${context.graph.tokens().length} tokens, ${ran} rules`;
  const notes = [...skipped].map(([rule, reason]) => dim(`  skipped ${rule}: ${reason}`, color));
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
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  lines.push(`${red(plural(findings.length, "finding"), color)} in ${plural(files.size, "file")} — ${scope}`);
  for (const [rule, count] of [...byRule].sort((a, b) => b[1] - a[1])) {
    lines.push(dim(`  ${String(count).padStart(4)}  ${rule}`, color));
  }
  lines.push(...notes);
  lines.push(dim(`\nWhy each of these matters: dsbridge rules ${[...byRule.keys()][0]}`, color));
  return lines.join("\n") + "\n";
}
