/* `dsbridge next` — the one thing to do now.
 *
 * A projection, never a plan. Nothing here is stored, so there is no list to
 * fall out of date the moment somebody fixes something outside it: the item is
 * recomputed from the findings as they stand, and the way to close it is to
 * make the findings go away.
 *
 * The order is by what the work costs, not by what it is worth. Findings with
 * exactly one answer come first however few there are — one command closes
 * them and none of them is a judgement call. After that the biggest single
 * decision, because every place a value is written is the same decision made
 * again, and reading the roles once settles all of them.
 */
import type { Finding } from "../rules/types.js";
import { bold, dim, plural } from "../text.js";

/** What kind of work the item is, which is what decides who does it. */
export type WorkKind = "fix" | "decide" | "name" | "rule";

export type WorkItem = {
  kind: WorkKind;
  title: string;
  /** Findings this closes. */
  closes: number;
  files: string[];
  rules: string[];
  /** The tokens the work is between; empty where none holds the value. */
  tokens: string[];
  command: string;
  why: string;
};

const places = (findings: Finding[]) => [...new Set(findings.map((f) => f.file))].sort();
const rulesIn = (findings: Finding[]) => [...new Set(findings.map((f) => f.rule))].sort();

/** Groups, biggest first; ties broken by name so the answer never wobbles. */
function biggest(findings: Finding[], key: (f: Finding) => string | undefined): [string, Finding[]] | undefined {
  const groups = new Map<string, Finding[]>();
  for (const finding of findings) {
    const of = key(finding);
    if (of === undefined) continue;
    groups.set(of, [...(groups.get(of) ?? []), finding]);
  }
  const ordered = [...groups].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  return ordered[0];
}

const item = (kind: WorkKind, findings: Finding[], rest: Pick<WorkItem, "title" | "tokens" | "command" | "why">): WorkItem => ({
  kind,
  closes: findings.length,
  files: places(findings),
  rules: rulesIn(findings),
  ...rest,
});

/** The cheapest work that is still real, or nothing when there is none. */
export function nextItem(findings: Finding[]): WorkItem | undefined {
  const certain = findings.filter((f) => f.confidence === "certain" && f.autofix !== undefined);
  if (certain.length > 0) {
    return item("fix", certain, {
      title: `rewrite ${plural(certain.length, "literal")} that can only mean one token`,
      tokens: [...new Set(certain.map((f) => f.candidates?.[0]).filter((t): t is string => t !== undefined))],
      command: "dsbridge check --fix",
      why: "One command closes every one of them, and not one is a judgement call.",
    });
  }

  const undecided = findings.filter((f) => f.confidence !== undefined && f.value !== undefined);
  const worst = biggest(undecided, (f) => f.value);
  if (worst !== undefined) {
    const [value, group] = worst;
    const tokens = [...new Set(group.flatMap((f) => f.candidates ?? []))];
    const where = `${plural(group.length, "place")} in ${plural(places(group).length, "file")}`;
    if (tokens.length === 0) {
      return item("name", group, {
        title: `${value} is written in ${where} and no token holds it`,
        tokens,
        command: `dsbridge check --rule ${rulesIn(group)[0]}`,
        why:
          "This is the system's backlog rather than this repo's debt: one token named " +
          "in the scale closes every place here, and nothing this repo can write will.",
      });
    }
    return item("decide", group, {
      title: `${value} is written in ${where} and ${plural(tokens.length, "token")} could be meant`,
      tokens,
      command: "dsbridge roles",
      why:
        "Every place is the same decision made again. Read what the tokens are for " +
        "once, and the rest of them follow from it.",
    });
  }

  const rule = biggest(findings, (f) => f.rule);
  if (rule === undefined) return undefined;
  const [id, group] = rule;
  return item("rule", group, {
    title: `${plural(group.length, "finding")} from ${id}`,
    tokens: [],
    command: `dsbridge rules ${id}`,
    why: "Nothing left carries a value to sort by, so the largest single rule is the cheapest thing to clear.",
  });
}

export type NextOptions = {
  color?: boolean;
  /** The work is above the baseline — new since the debt was recorded. */
  regression?: boolean;
};

const NOTHING = "nothing to do — every rule this repo runs is clean\n";

/** Named in the line; the rest are counted. The whole list is in the JSON. */
const NAMED = 4;

const listed = (tokens: string[]) => {
  const shown = tokens.slice(0, NAMED);
  const more = tokens.length - shown.length;
  return `${shown.join(" | ")}${more > 0 ? ` and ${more} more` : ""}`;
};

/** `findings` is what the item is chosen from; `total` is the whole repo, so
    the item can say how much of it one piece of work closes. */
export function renderNext(findings: Finding[], total: number, options: NextOptions = {}): string {
  const color = options.color ?? true;
  const work = nextItem(findings);
  if (work === undefined) return NOTHING;

  const out = [
    "",
    `  ${bold(work.title, color)}`,
    dim(`  closes ${work.closes} of ${total}, in ${plural(work.files.length, "file")}`, color),
    "",
    `  ${work.command}`,
    "",
    dim(`  ${work.why}`, color),
  ];
  if (work.tokens.length > 0) out.push("", dim(`  ${listed(work.tokens)}`, color));
  if (options.regression === true) {
    out.push("", dim("  this is above the baseline — it was not there when the debt was recorded", color));
  }
  return `${out.join("\n")}\n`;
}
