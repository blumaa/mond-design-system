/* `dsbridge check --fix` — the findings with exactly one right answer.
 *
 * Every other confidence is a choice, and a tool that makes a choice on
 * someone's behalf in a file it also edits is a tool nobody can review. So this
 * acts on `certain` alone, and even then it proves the literal is still where
 * the finding said it was before replacing it: a rule ran against the file as
 * it was read, and anything else means the file moved underneath it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Finding } from "../rules/types.js";

export type Fix = {
  file: string;
  /** 1-based, both. */
  line: number;
  col: number;
  /** The literal, exactly as the finding read it. */
  value: string;
  /** What to write in its place. */
  autofix: string;
};

/** The findings that name one token and say where it is. */
export const fixable = (findings: Finding[]): Fix[] =>
  findings.flatMap((finding) => {
    const { file, line, col, value, autofix, confidence } = finding;
    if (confidence !== "certain" || autofix === undefined) return [];
    if (line === undefined || col === undefined || value === undefined) return [];
    return [{ file, line, col, value, autofix }];
  });

/** One file's source with its fixes applied, or nothing when one no longer fits. */
export function rewrite(source: string, fixes: Fix[]): string | undefined {
  const lines = source.split("\n");
  /* Right to left: an earlier replacement of a different width would move every
     column after it, and the findings were measured against the file as it is. */
  const ordered = [...fixes].sort((a, b) => b.line - a.line || b.col - a.col);
  for (const fix of ordered) {
    const line = lines[fix.line - 1];
    if (line === undefined) return undefined;
    const at = fix.col - 1;
    if (line.slice(at, at + fix.value.length) !== fix.value) return undefined;
    lines[fix.line - 1] = line.slice(0, at) + fix.autofix + line.slice(at + fix.value.length);
  }
  return lines.join("\n");
}

/** The fixes that landed, per file. A file whose text moved is left alone. */
export function applyFixes(root: string, findings: Finding[]): { file: string; fixed: number }[] {
  const byFile = new Map<string, Fix[]>();
  for (const fix of fixable(findings)) byFile.set(fix.file, [...(byFile.get(fix.file) ?? []), fix]);

  const done: { file: string; fixed: number }[] = [];
  for (const [file, fixes] of byFile) {
    const path = resolve(root, file);
    const written = rewrite(readFileSync(path, "utf8"), fixes);
    if (written === undefined) continue;
    writeFileSync(path, written);
    done.push({ file, fixed: fixes.length });
  }
  return done;
}
