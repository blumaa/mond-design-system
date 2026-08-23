import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildContext } from "../context.js";
import { loadGraph } from "../graph.js";
import { userFacingTextIsAProp } from "./text.js";
import type { Component } from "../structure.js";
import { reasonOf, type Context } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const ROOT = "/app";
const graph = loadGraph({ system: SYSTEM });

const component = (name: string, source: string): { component: Component; file: string; source: string } => {
  const file = `src/components/${name}/${name}.tsx`;
  return { component: { name, file, imports: [] }, file, source };
};

const repo = (source: string, exempt?: Context["exempt"]): Context => {
  const it = component("Widget", source);
  const context = buildContext({
    root: ROOT,
    kind: "system",
    graph,
    sheets: [],
    components: [it.component],
    sources: [{ file: it.file, source: it.source }],
  });
  return exempt === undefined ? context : { ...context, exempt };
};

const said = (source: string) => userFacingTextIsAProp.check!(repo(source)).map((finding) => finding.message);

describe("a string written into an attribute that speaks", () => {
  it("flags a literal aria-label", () => {
    expect(said('<button aria-label="Clear search" />')).toHaveLength(1);
  });

  it("names the attribute and the words in it", () => {
    const [finding] = userFacingTextIsAProp.check!(repo('<button aria-label="Clear search" />'));
    expect(finding).toMatchObject({
      rule: "user-facing-text-is-a-prop",
      property: "aria-label",
      value: '"Clear search"',
      line: 1,
    });
  });

  it("flags both halves of a ternary, because both are words", () => {
    expect(said('<button aria-label={visible ? "Hide password" : "Show password"} />')).toHaveLength(2);
  });

  it("flags the static half of a template literal", () => {
    expect(said("<button aria-label={`Remove ${text}`} />")).toHaveLength(1);
  });

  it("passes an attribute given a prop", () => {
    expect(said("<button aria-label={removeLabel} />")).toEqual([]);
  });

  it("passes the empty alt that marks a picture decorative", () => {
    expect(said('<img alt="" src={src} />')).toEqual([]);
  });

  it("flags alt, title and placeholder as well", () => {
    expect(said('<img alt="A cat" />\n<abbr title="World Health" />\n<input placeholder="Search" />')).toHaveLength(3);
  });

  it("says nothing about an attribute nobody hears", () => {
    expect(said('<div className="row" data-testid="widget" />')).toEqual([]);
  });
});

describe("a string written between the tags", () => {
  it("flags words standing on their own", () => {
    expect(said("<span>Loading</span>")).toHaveLength(1);
  });

  it("passes an expression", () => {
    expect(said("<span>{children}</span>")).toEqual([]);
  });

  it("passes punctuation, which is not a word", () => {
    expect(said("<span>—</span>")).toEqual([]);
  });

  it("reads a generic as a type and not as a tag", () => {
    expect(said("const ref = useRef<HTMLDivElement>(null);")).toEqual([]);
  });

  it("names the line the words are on", () => {
    const [finding] = userFacingTextIsAProp.check!(repo("<div>\n  <span>Loading</span>\n</div>"));
    expect(finding).toMatchObject({ line: 2, value: "Loading" });
  });
});

describe("a string a prop falls back to", () => {
  it("flags a text prop given a default", () => {
    expect(said('export function Spinner({ label = "Loading" }: Props) {}')).toHaveLength(1);
  });

  it("names the prop and what it falls back to", () => {
    const [finding] = userFacingTextIsAProp.check!(repo('function S({ label = "Loading" }) {}'));
    expect(finding).toMatchObject({ property: "label", value: '"Loading"' });
  });

  it("flags every name that says it carries words", () => {
    expect(
      said('function S({ hint = "Work email", dismissLabel = "Dismiss", placeholder = "Search" }) {}'),
    ).toHaveLength(3);
  });

  it("says nothing about a variant, which is a choice and not copy", () => {
    expect(said('function S({ variant = "primary", size = "md", as = "div" }) {}')).toEqual([]);
  });

  it("says nothing about a prop passed through", () => {
    expect(said("function S({ label = props.label }) {}")).toEqual([]);
  });

  it("reports an attribute once, not twice", () => {
    expect(said('<Field label="Email" />')).toHaveLength(1);
  });
});

describe("a bag of strings the component keeps", () => {
  it("flags every string in an object whose name says it is copy", () => {
    expect(said('const DEFAULT_LABELS = { today: "Today", done: "Done" };')).toHaveLength(2);
  });

  it("reads the name through its type annotation", () => {
    expect(said('const LABELS: PickerLabels = { next: "Next month" };')).toHaveLength(1);
  });

  it("says nothing about a map of variants", () => {
    expect(said('const DEFAULT_TONE = { body: "primary", label: "secondary" };')).toEqual([]);
  });
});

describe("what the rule needs", () => {
  it("says so when the repo has no components to read", () => {
    const empty = buildContext({ root: ROOT, kind: "system", graph, sheets: [] });
    expect(reasonOf(userFacingTextIsAProp.needs!(empty)!)).toMatch(/no components/);
  });

  it("honours an exemption on the file", () => {
    const context = repo('<button aria-label="Clear search" />', () => true);
    expect(userFacingTextIsAProp.check!(context)).toEqual([]);
  });
});
