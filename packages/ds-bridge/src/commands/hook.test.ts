/* The half of the tool that speaks without being asked.
 *
 * Everything here is a pure function over a hook's input, because the whole
 * point of the runtime is that it fires on every write: a bug in it is a bug
 * the agent meets hundreds of times a day, and the only way to hold that still
 * is to test the decision separately from the process that carries it.
 */
import { describe, expect, it } from "vitest";
import { buildContext, type BuildOptions } from "../context.js";
import { loadGraph } from "../graph.js";
import { fileURLToPath } from "node:url";
import { baselineOf } from "./baseline.js";
import { applyEdit, attributable, pendingWrite, regression, sessionBrief, warning } from "./hook.js";
import { loadChoosing } from "../choosing.js";
import type { Finding } from "../rules/types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));

const finding = (over: Partial<Finding> = {}): Finding => ({
  rule: "no-literal-length",
  file: "src/Card.module.css",
  line: 4,
  message: "13px is not on the scale",
  ...over,
});

describe("the text a tool is about to write", () => {
  it("takes Write at its word", () => {
    const held = pendingWrite(
      { tool_name: "Write", tool_input: { file_path: "src/Card.module.css", content: ".card {}" } },
      () => undefined,
    );
    expect(held).toEqual({ file: "src/Card.module.css", source: ".card {}" });
  });

  it("performs an Edit against what is on disk, since the input holds only the diff", () => {
    const held = pendingWrite(
      {
        tool_name: "Edit",
        tool_input: { file_path: "src/Card.module.css", old_string: "4px", new_string: "13px" },
      },
      () => ".card { padding: 4px; margin: 4px; }",
    );
    expect(held?.source).toBe(".card { padding: 13px; margin: 4px; }");
  });

  it("honours replace_all", () => {
    const held = pendingWrite(
      {
        tool_name: "Edit",
        tool_input: {
          file_path: "src/Card.module.css",
          old_string: "4px",
          new_string: "13px",
          replace_all: true,
        },
      },
      () => ".card { padding: 4px; margin: 4px; }",
    );
    expect(held?.source).toBe(".card { padding: 13px; margin: 13px; }");
  });

  it("applies a MultiEdit in order", () => {
    const held = pendingWrite(
      {
        tool_name: "MultiEdit",
        tool_input: {
          file_path: "src/Card.module.css",
          edits: [
            { old_string: "4px", new_string: "13px" },
            { old_string: "margin", new_string: "gap" },
          ],
        },
      },
      () => ".card { padding: 4px; margin: 4px; }",
    );
    expect(held?.source).toBe(".card { padding: 13px; gap: 4px; }");
  });

  it("says nothing about a file no rule reads", () => {
    const held = pendingWrite(
      { tool_name: "Write", tool_input: { file_path: "README.md", content: "# hi" } },
      () => undefined,
    );
    expect(held).toBeUndefined();
  });

  it("says nothing about a tool that writes nothing", () => {
    expect(pendingWrite({ tool_name: "Bash", tool_input: { command: "ls" } }, () => "")).toBeUndefined();
  });

  it("says nothing when the edit does not apply, rather than guessing at it", () => {
    const held = pendingWrite(
      {
        tool_name: "Edit",
        tool_input: { file_path: "src/Card.module.css", old_string: "nowhere", new_string: "x" },
      },
      () => ".card {}",
    );
    expect(held).toBeUndefined();
  });

  it("keeps a dollar sign in the replacement, which String.replace would eat", () => {
    expect(applyEdit("a b", { old_string: "b", new_string: "$&" })).toBe("a $&");
  });
});

const context = (over: Partial<BuildOptions> = {}) =>
  buildContext({
    root: "/app",
    kind: "app",
    graph: loadGraph({ system: SYSTEM }),
    sheets: [],
    ...over,
  });

describe("what a session opens knowing", () => {
  it("names the namespace, the count, and the taxonomy — not the rules themselves", () => {
    const brief = sessionBrief(context({ kind: "system" }));
    expect(brief).toContain("--mds-");
    expect(brief).toContain("atom, molecule, organism, template");
    expect(brief).toContain("dsbridge rules --for");
    expect(brief).not.toContain("no-literal-length");
  });

  it("says the repo has a baseline, and how much it holds", () => {
    const brief = sessionBrief(context(), baselineOf([finding(), finding({ line: 9 })]));
    expect(brief).toContain("2 findings held");
  });

  it("says how to make one when there is none, so the gate is not silently off", () => {
    expect(sessionBrief(context())).toContain("--update-baseline");
  });

  /* A repo with recorded debt is one somebody is working through; a repo
     without one has not decided to yet, and has nothing to resume. */
  it("offers the resume verb only where there is recorded debt to resume", () => {
    expect(sessionBrief(context())).not.toContain("dsbridge next");
    expect(sessionBrief(context(), baselineOf([finding()]))).toContain("dsbridge next");
  });

  it("says an app has no taxonomy rather than printing an empty line for it", () => {
    const brief = sessionBrief(context());
    expect(brief).toContain("none declared");
    expect(brief).toContain("dsbridge.config.json");
  });

  it("names what the repo already has, so a second Button is a lookup away", () => {
    const brief = sessionBrief(
      context({ components: [{ name: "Button", file: "src/Button/Button.tsx", imports: [] }] }),
    );
    expect(brief).toContain("Button");
  });

  /* The lookup only earns its line where the system published one — an app
     told to run a verb that answers nothing learns to ignore the brief. */
  it("offers the choosing lookup only when the system declared some", () => {
    expect(sessionBrief(context())).not.toContain("dsbridge choosing");
    const declared = context({
      choosing: loadChoosing({
        version: 1,
        clusters: [{ default: "Stack", use: "vertical flow", instead: [{ when: "a row", prefer: "Inline" }] }],
      }),
    });
    expect(sessionBrief(declared)).toContain("dsbridge choosing");
  });

  it("counts the rest rather than listing 156 of them", () => {
    const many = Array.from({ length: 60 }, (_, i) => ({
      name: `C${i}`,
      file: `src/C${i}/C${i}.tsx`,
      imports: [],
    }));
    const brief = sessionBrief(context({ components: many }));
    expect(brief).toContain("60");
    expect(brief).toContain("more");
    expect(brief).not.toContain("C59");
  });
});

describe("what a write is warned about", () => {
  it("is silent when the write adds nothing", () => {
    expect(warning("src/Card.module.css", [], false)).toBeUndefined();
  });

  it("names the line, the reason and the rule, and offers the escape hatch", () => {
    const text = warning("src/Card.module.css", [finding()], false)!;
    expect(text).toContain("src/Card.module.css");
    expect(text).toContain("13px is not on the scale");
    expect(text).toContain("no-literal-length");
    expect(text).toContain("dsbridge-ignore-next-line");
  });

  it("does not tell an agent it may proceed, because that is not the hook's call", () => {
    expect(warning("src/Card.module.css", [finding()], false)).not.toContain("allow");
  });
});

describe("what this session actually did", () => {
  const older = finding({ rule: "scroller-contains-its-overscroll", file: "src/Feed.module.css" });
  const recorded = baselineOf([], ["no-literal-length"]);

  it("holds the session to a rule the baseline ran", () => {
    expect(attributable([finding()], recorded).added.map((f) => f.rule)).toEqual(["no-literal-length"]);
  });

  it("does not blame the session for a rule that did not exist when the baseline was recorded", () => {
    const { added, outside } = attributable([older], recorded);
    expect(added).toEqual([]);
    expect(outside.map((f) => f.rule)).toEqual(["scroller-contains-its-overscroll"]);
  });

  it("will not claim what a baseline that never recorded its rules cannot say", () => {
    const old = baselineOf([]);
    expect(attributable([finding()], old)).toMatchObject({ certain: false });
    expect(attributable([finding()], recorded)).toMatchObject({ certain: true });
  });
});

describe("what a turn is stopped for", () => {
  it("says how many are above the baseline and where", () => {
    const text = regression([finding(), finding({ file: "src/B.module.css", line: 2 })]);
    expect(text).toContain("2 findings");
    expect(text).toContain("src/Card.module.css:4");
    expect(text).toContain("src/B.module.css:2");
  });

  it("offers recording them, so an intended change is not a trap", () => {
    expect(regression([finding()])).toContain("--update-baseline");
  });

  it("says nothing about this session when it cannot tell what this session did", () => {
    const text = regression([finding()], { attributed: false });
    expect(text).not.toContain("added in this session");
    expect(text).toContain("--update-baseline");
  });

  it("names the ones a newer rule found, apart from what the session added", () => {
    const text = regression([finding()], { outside: 3 });
    expect(text).toContain("3 findings");
    expect(text).toContain("since the baseline");
  });

  it("lists a handful and counts the rest", () => {
    const many = Array.from({ length: 30 }, (_, i) => finding({ line: i + 1 }));
    const text = regression(many);
    expect(text).toContain("30 findings");
    expect(text).toContain("more");
  });
});
