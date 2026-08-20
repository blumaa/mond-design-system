/* `dsbridge migrate` — the distance between an app and the system, measured.
 *
 * An app that has not adopted the system yet is silent under `dsbridge check`: it
 * reads none of the system's tokens, so almost no rule has anything to grip.
 * The useful question there is not "what is wrong" but "what maps" — which of
 * the app's own values the system already names, and what the brand file has to
 * carry. This answers that, and writes nothing: which token plays which role is
 * a judgement, and the report is what somebody makes it with.
 */
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { loadGraph } from "../graph.js";
import { valueIndex } from "../rules/suggest.js";
import { isRung } from "../rules/tokenDiscipline.js";
import { runCheck } from "./check.js";
import { brandSheets, tokenSheets, type Context, type Finding } from "../rules/types.js";

/** One of the app's own tokens, and the system token holding the same value. */
export type Mapping = {
  name: string;
  value: string;
  file: string;
  line: number;
  equivalent?: string;
};

export type Migration = {
  own: Mapping[];
  /** App tokens a brand file already reads: these are the migration working. */
  wired: string[];
  /** The app's own token files — where its scale is declared today. */
  files: string[];
  /** How much of the semantic contract a brand file already re-points. */
  contract: { total: number; repointed: number };
  literals: Finding[];
  /** The brand file the system ships to be copied, when it ships one. */
  template?: string;
};

const LITERAL_RULES = ["no-literal-color", "no-literal-length"];

const segments = (name: string) => name.replace(/^--[a-z0-9]+-/, "").split("-");

/* Several system tokens can hold one value, and then the value cannot choose
   between them — but the app's own name usually can: --k-surface-card is
   telling us which role it plays. Shared words break the tie; when nothing is
   shared, the value index's own ranking stands. */
const closest = (name: string, candidates: string[]): string | undefined => {
  const words = new Set(segments(name));
  const shared = (other: string) => segments(other).filter((word) => words.has(word)).length;
  return [...candidates].sort((a, b) => shared(b) - shared(a))[0];
};

export function planMigration(context: Context): Migration {
  const sheets = tokenSheets(context).filter((sheet) => !sheet.isBrand);
  /* The app's tokens are not in the system's graph — loading them as a brand is
     what makes their values resolvable, and their names stay their own. */
  const graph =
    context.system === undefined
      ? context.graph
      : loadGraph({ system: context.system, prefix: context.prefix, brand: sheets.map((s) => s.path) });
  const index = valueIndex(context.graph, "light", (name) => isRung(name, context.prefix));
  const owned = new Set(sheets.flatMap((sheet) => [...sheet.declares]));

  const own: Mapping[] = [];
  for (const token of graph.tokens()) {
    if (!owned.has(token.name) || token.name.startsWith(context.prefix)) continue;
    const declaration = token.declarations[0] ?? token.overriddenBy[0];
    if (declaration === undefined) continue;
    let value: string;
    try {
      value = graph.resolve(token.name, "light").trim();
    } catch {
      continue;
    }
    const equivalent = closest(token.name, index.candidates(value));
    own.push({
      name: token.name,
      value,
      file: relative(context.root, declaration.file),
      line: declaration.line,
      ...(equivalent ? { equivalent } : {}),
    });
  }

  /* A brand file pointing --mds-accent at --fp-lime is the whole mechanism, so
     the app tokens it reads are not a parallel scale — they are the brand. */
  const read = new Set(
    brandSheets(context).flatMap((sheet) =>
      [...sheet.source.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]!),
    ),
  );
  const semantic = context.graph.tokens().filter((token) => token.layer === "semantic");
  const template = context.system === undefined ? undefined : join(dirname(context.system), "brand-template.css");

  return {
    own,
    wired: own.filter((token) => read.has(token.name)).map((token) => token.name),
    files: sheets.map((sheet) => sheet.file),
    contract: {
      total: semantic.length,
      repointed: semantic.filter((token) => token.overriddenBy.length > 0).length,
    },
    literals: runCheck(context, { only: LITERAL_RULES }),
    ...(template !== undefined && existsSync(template) ? { template } : {}),
  };
}

const ESC = "\u001b[";
const dim = (s: string, on: boolean) => (on ? `${ESC}2m${s}${ESC}0m` : s);
const bold = (s: string, on: boolean) => (on ? `${ESC}1m${s}${ESC}0m` : s);

const LIST = 10;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Inside the app, say where; outside it — an installed system — say the path. */
const shown = (root: string, path: string) => {
  const near = relative(root, path);
  return near.startsWith("..") ? path : near;
};

/** A long list is a report nobody reads; --json carries all of it. */
const capped = <T>(items: T[], show: (item: T) => string, color: boolean): string[] => [
  ...items.slice(0, LIST).map((item) => `    ${show(item)}`),
  ...(items.length > LIST ? [dim(`    … and ${items.length - LIST} more (--json for all)`, color)] : []),
];

export function renderMigration(plan: Migration, context: Context, options: { color?: boolean } = {}): string {
  const color = options.color ?? true;
  const wired = new Set(plan.wired);
  const loose = plan.own.filter((token) => !wired.has(token.name));
  const mapped = loose.filter((token) => token.equivalent !== undefined);
  const unmapped = loose.filter((token) => token.equivalent === undefined);
  const width = Math.max(1, ...mapped.map((token) => `${token.name}: ${token.value}`.length));
  const lines: string[] = [
    `${bold("migration plan", color)} — ${relative(dirname(context.root), context.root)}`,
    "",
    `${bold("the app's own scale", color)}  ${plural(plan.own.length, "token")} in ${plural(plan.files.length, "file")}`,
    ...(plan.wired.length > 0
      ? [dim(`  ${plan.wired.length} are already read by a brand file — that is the mechanism working`, color)]
      : []),
    dim(`  ${mapped.length} hold a value the system already names — read the system's instead`, color),
    ...capped(mapped, (t) => `${`${t.name}: ${t.value}`.padEnd(width)}  ${t.equivalent}`, color),
    dim(`  ${unmapped.length} do not — each is a brand value, or a role the contract is missing`, color),
    ...capped(unmapped, (t) => `${t.name}: ${t.value}`, color),
    "",
    `${bold("the contract", color)}  ${plan.contract.total} semantic tokens, ${plan.contract.repointed} re-pointed by this app`,
  ];

  if (plan.template !== undefined && plan.contract.repointed < plan.contract.total) {
    lines.push(dim(`    copy ${shown(context.root, plan.template)} into the app, load it after the`, color));
    lines.push(dim("    system's stylesheet, and point its values at the app's own tokens", color));
  }

  const files = new Set(plan.literals.map((finding) => finding.file));
  lines.push(
    "",
    `${bold("literals in components", color)}  ${plan.literals.length} in ${plural(files.size, "file")}`,
    ...capped(plan.literals, (f) => `${f.file}:${f.line ?? ""}  ${f.message}`, color),
    "",
    dim("next: dsbridge rules --markdown   the reasoning, for an agent", color),
    dim("      dsbridge check              the same rules, as a work list", color),
  );
  return lines.join("\n") + "\n";
}
