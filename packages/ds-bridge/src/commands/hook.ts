/* dsbridge, speaking without being asked.
 *
 * The same rules the CLI runs, moved to the moment they are cheap to act on:
 * before the write lands, in the turn that wrote it, rather than in a review
 * days later. Nothing here decides whether a tool may run — a hook that blocks
 * on a wrong finding is a hook someone switches off, and then nothing is
 * checked at all. It warns, and the agent decides.
 *
 * The events are the CLI's verbs with a different mouth: `SessionStart` is
 * `tokens` and the taxonomy, `PreToolUse` is `check --pending`, `Stop` is
 * `check --baseline`. No rule and no reasoning lives here.
 */
import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { loadContext, type Config } from "../context.js";
import { aboveBaseline, baselineOf, heldBy, readBaseline, type Baseline } from "./baseline.js";
import { lineList, runCheck } from "./check.js";
import { readsOf } from "./rules.js";
import { plural } from "../text.js";
import type { Context, Finding } from "../rules/types.js";

/** The three moments dsbridge has anything to say. */
export type HookEvent = "session-start" | "pre-tool-use" | "stop";

/** What each is called in the hook protocol; `hookSpecificOutput` requires it. */
const EVENT_NAME: Record<HookEvent, string> = {
  "session-start": "SessionStart",
  "pre-tool-use": "PreToolUse",
  stop: "Stop",
};

export const isHookEvent = (value: string): value is HookEvent => value in EVENT_NAME;

/** Only the fields dsbridge reads. The protocol carries more. */
export type HookInput = {
  cwd?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  /** Set when this Stop is itself the result of a Stop hook blocking. */
  stop_hook_active?: boolean;
};

/**
 * What a hook may say back.
 *
 * Deliberately without `permissionDecision`: emitting `"allow"` would settle
 * the permission question for the tool call, which for Write and Edit means
 * approving every one of them. A warning is not consent.
 */
export type HookOutput = {
  decision?: "block";
  reason?: string;
  hookSpecificOutput?: { hookEventName: string; additionalContext: string };
};

const injected = (event: HookEvent, additionalContext: string): HookOutput => ({
  hookSpecificOutput: { hookEventName: EVENT_NAME[event], additionalContext },
});

const str = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);

export type Replacement = { old_string?: unknown; new_string?: unknown; replace_all?: unknown };

/**
 * One replacement, performed the way Edit performs it.
 *
 * By index rather than `String.replace`, which reads `$&` and `$1` in the
 * replacement as instructions — and a stylesheet full of `$` is exactly what
 * an agent editing SCSS is holding.
 */
export function applyEdit(source: string, edit: Replacement): string | undefined {
  const from = str(edit.old_string);
  const to = str(edit.new_string);
  if (from === undefined || to === undefined || from === "") return undefined;
  if (edit.replace_all === true) return source.includes(from) ? source.split(from).join(to) : undefined;
  const at = source.indexOf(from);
  return at < 0 ? undefined : source.slice(0, at) + to + source.slice(at + from.length);
}

/**
 * The text a tool is about to write, whatever tool it is.
 *
 * `Write` carries it; `Edit` carries only the difference, so the file has to be
 * read and the edit performed to know what is being asked about. Anything that
 * does not resolve — an old string that is not there, a file no rule reads —
 * returns nothing, because a hook that guesses at content warns about content
 * nobody wrote.
 */
export function pendingWrite(
  input: HookInput,
  read: (file: string) => string | undefined,
): { file: string; source: string } | undefined {
  const held = input.tool_input ?? {};
  const file = str(held["file_path"]);
  if (file === undefined || readsOf(file) === undefined) return undefined;

  if (input.tool_name === "Write") {
    const source = str(held["content"]);
    return source === undefined ? undefined : { file, source };
  }
  if (input.tool_name !== "Edit" && input.tool_name !== "MultiEdit") return undefined;

  const edits = Array.isArray(held["edits"]) ? (held["edits"] as Replacement[]) : [held];
  let source = read(file);
  if (source === undefined) return undefined;
  for (const edit of edits) {
    const next = applyEdit(source, edit);
    if (next === undefined) return undefined;
    source = next;
  }
  return { file, source };
}

/** Components named before the rest are counted. */
const NAMED = 40;
/** Findings listed before the rest are counted. */
const LISTED = 10;

const andMore = (shown: number, all: number) => (all > shown ? ` and ${all - shown} more` : "");

const field = (name: string, value: string) => `  ${name.padEnd(11)} ${value}`;

/**
 * What a session should know before it writes anything.
 *
 * The namespace, the size of the vocabulary, the taxonomy, what the repo
 * already has, and how much debt is already forgiven — then how to ask for the
 * rest. Not the rules: 22 KB of them at every session start is a tax on every
 * session that touches no CSS, and `rules --for` costs nothing until it does.
 */
export function sessionBrief(context: Context, baseline?: Baseline): string {
  const names = context.components.map((component) => component.name).sort();
  const shown = names.slice(0, NAMED);
  const held = baseline
    ? `${plural(heldBy(baseline), "finding")} held — only what is above it is new`
    : "none — dsbridge check --update-baseline records the debt this repo already has";
  return [
    "dsbridge — this repo is checked against a design system.",
    "",
    field("tokens", `${context.graph.tokens().length} under ${context.prefix}`),
    field("levels", context.levels.join(", ")),
    ...(names.length > 0
      ? [field("components", `${names.length} — ${shown.join(", ")}${andMore(shown.length, names.length)}`)]
      : []),
    field("baseline", held),
    "",
    "Before writing a stylesheet or a component, ask about the file itself:",
    "  dsbridge rules --for <path>     the rules that read that kind of file, one line each",
    "  dsbridge tokens --grep <text>   what the system already names",
    "  dsbridge check <path>           what is wrong in it now",
    "",
  ].join("\n");
}

/**
 * What one write is warned about: only what it adds.
 *
 * A file already holding forty findings would otherwise report all forty on
 * every edit to it, and the one line just written would be lost in them.
 */
export const addedBy = (before: Finding[], after: Finding[]): Finding[] =>
  aboveBaseline(after, baselineOf(before));

export function warning(file: string, findings: Finding[], color: boolean): string | undefined {
  if (findings.length === 0) return undefined;
  return [
    `dsbridge — ${plural(findings.length, "finding")} in what you are about to write to ${file}`,
    "",
    ...lineList(findings.slice(0, LISTED), color),
    ...(findings.length > LISTED ? [`  ${andMore(LISTED, findings.length).trim()}`] : []),
    "",
    "Fix them in this write. dsbridge rules <id> says what each one protects, and",
    "/* dsbridge-ignore-next-line: reason */ is there for the ones that are wrong here.",
    "",
  ].join("\n");
}

/** Why a turn is being held open: what it made worse, and the two ways out. */
export function regression(findings: Finding[]): string {
  const shown = findings.slice(0, LISTED);
  return [
    `dsbridge — ${plural(findings.length, "finding")} above the baseline, added in this session.`,
    "",
    ...shown.map((f) => `  ${f.file}:${f.line ?? 0}  ${f.message}  ${f.rule}`),
    ...(findings.length > shown.length ? [` ${andMore(shown.length, findings.length)}`] : []),
    "",
    "Fix them, or record them as intended with dsbridge check --update-baseline.",
    "dsbridge rules <id> says what each one protects.",
  ].join("\n");
}

/** Everything the hook needs that the process, not the protocol, decides. */
export type HookScope = { root: string; system?: string; config?: Config };

const load = (scope: HookScope, pending?: { file: string; source: string }) =>
  loadContext({
    root: scope.root,
    ...(scope.system ? { system: scope.system } : {}),
    ...(scope.config ? { config: scope.config } : {}),
    ...(pending ? { pending } : {}),
  });

function preToolUse(input: HookInput, scope: HookScope): HookOutput | undefined {
  const pending = pendingWrite(input, (file) => {
    const path = resolve(scope.root, file);
    return existsSync(path) ? readFileSync(path, "utf8") : undefined;
  });
  if (pending === undefined) return undefined;

  const file = relative(scope.root, resolve(scope.root, pending.file));
  const mine = (finding: Finding) => finding.file === file;
  /* The repo as it stands, then the repo with this text in it. The difference
     is what the write is answerable for; everything else was already true. */
  const before = existsSync(resolve(scope.root, file)) ? runCheck(load(scope)).filter(mine) : [];
  const after = runCheck(load(scope, pending)).filter(mine);
  const text = warning(file, addedBy(before, after), false);
  return text === undefined ? undefined : injected("pre-tool-use", text);
}

/**
 * The gate at the end of a turn, guarded.
 *
 * `stop_hook_active` is set when this stop is itself the result of the last
 * one blocking. Ignoring it traps the session in a loop, and Claude Code
 * overrides the hook after a handful of them anyway — so the agent gets one
 * turn to answer, which is what it needed.
 */
function stop(input: HookInput, scope: HookScope): HookOutput | undefined {
  if (input.stop_hook_active === true) return undefined;
  const recorded = readBaseline(scope.root);
  /* No baseline is no claim about what this repo owes, and a gate with nothing
     to measure against would fail every repo on its first session. */
  if (recorded === undefined) return undefined;
  const above = aboveBaseline(runCheck(load(scope)), recorded);
  if (above.length === 0) return undefined;
  return { decision: "block", reason: regression(above) };
}

/**
 * The hook, run.
 *
 * Never throws and never blocks on its own failure: a repo with no design
 * system resolvable, or a config that does not parse, is a repo this tool has
 * nothing to say about — not one whose session should end.
 */
export function runHook(event: HookEvent, input: HookInput, scope: HookScope): HookOutput | undefined {
  try {
    if (event === "session-start") return injected(event, sessionBrief(load(scope), readBaseline(scope.root)));
    if (event === "pre-tool-use") return preToolUse(input, scope);
    return stop(input, scope);
  } catch (error) {
    process.stderr.write(`dsbridge hook ${event}: ${error instanceof Error ? error.message : String(error)}\n`);
    return undefined;
  }
}
