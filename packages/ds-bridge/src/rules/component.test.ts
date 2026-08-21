import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import { acceptsAClassName, forwardsItsRef, interactiveHasFocusVisible } from "./component.js";
import type { Component } from "../structure.js";
import type { Context } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const ROOT = "/app";
const graph = loadGraph({ system: SYSTEM });

const sheet = (source: string, file = "src/components/Button/Button.module.css") =>
  buildContext({
    root: ROOT,
    kind: "system",
    graph,
    sheets: [makeSheet(join(ROOT, file), source, ROOT, "--mds-")],
  });

const rings = (source: string, file?: string) =>
  interactiveHasFocusVisible.check!(sheet(source, file)).map((finding) => finding.message);

/* A component's file, and nothing else about it: these rules read the source
   and the file name, which is all a repo of either shape agrees on. */
const component = (name: string, source: string): { component: Component; file: string; source: string } => {
  const file = `src/components/${name}/${name}.tsx`;
  return { component: { name, file, imports: [] }, file, source };
};

const repo = (...files: ReturnType<typeof component>[]): Context =>
  buildContext({
    root: ROOT,
    kind: "system",
    graph,
    sheets: [],
    components: files.map((it) => it.component),
    sources: files.map(({ file, source }) => ({ file, source })),
  });

const refs = (...files: ReturnType<typeof component>[]) =>
  forwardsItsRef.check!(repo(...files)).map((finding) => finding.file);

describe("taking the focus ring away", () => {
  it("flags a stylesheet that removes the outline and puts nothing back", () => {
    expect(rings(".field:focus {\n  outline: none;\n}")).toHaveLength(1);
  });

  it("names the line the outline was removed on", () => {
    const [finding] = interactiveHasFocusVisible.check!(sheet(".a { color: red; }\n.field {\n  outline: 0;\n}"));
    expect(finding).toMatchObject({ rule: "interactive-has-focus-visible", line: 3 });
  });

  it("passes a stylesheet that removes it and styles :focus-visible itself", () => {
    expect(rings(".field:focus {\n  outline: none;\n}\n.field:focus-visible {\n  outline: 2px solid red;\n}")).toEqual(
      [],
    );
  });

  it("passes the reset that only hides the ring from a mouse", () => {
    expect(rings(".field:focus:not(:focus-visible) {\n  outline: none;\n}")).toEqual([]);
  });

  it("says nothing about a token file, whose job is to declare the treatment", () => {
    expect(rings(":root {\n  --mds-x: 1px;\n}\n:focus:not(:focus-visible) {\n  outline: none;\n}", "src/tokens/base.css")).toEqual([]);
  });

  it("passes a stylesheet that never touches the outline", () => {
    expect(rings(".field {\n  border: none;\n}")).toEqual([]);
  });
});

describe("handing the caller a ref", () => {
  const spreads = `export function Card({ className, ...rest }: CardProps) {\n  return <div className={className} {...rest} />;\n}`;

  it("flags a component that spreads the rest onto an element but takes no ref", () => {
    expect(refs(component("Card", spreads))).toEqual(["src/components/Card/Card.tsx"]);
  });

  it("passes a component that declares one", () => {
    const source = `type CardProps = { ref?: Ref<HTMLDivElement> };\n${spreads}`;
    expect(refs(component("Card", source))).toEqual([]);
  });

  it("passes a component that forwards it the old way", () => {
    expect(refs(component("Card", `const Card = forwardRef((props, ref) => <div {...props} ref={ref} />);`))).toEqual(
      [],
    );
  });

  it("passes a component that spreads onto another component, which owns the element", () => {
    expect(refs(component("Card", `export const Card = (props: CardProps) => <Surface {...props} />;`))).toEqual([]);
  });

  it("finds the spread when the tag is written over several lines", () => {
    const source = `export const Card = (props: CardProps) => (\n  <div\n    className={styles.root}\n    {...props}\n  />\n);`;
    expect(refs(component("Card", source))).toEqual(["src/components/Card/Card.tsx"]);
  });

  it("finds the spread when the component picks its own tag", () => {
    const source = `const Root = inGroup ? "li" : "div";\nexport const Card = (props: CardProps) => <Root {...props} />;`;
    expect(refs(component("Card", source))).toEqual(["src/components/Card/Card.tsx"]);
  });

  it("honours an exemption, for the component that has no one element to hand back", () => {
    const context = repo(component("Card", spreads));
    const exempt = { ...context, exempt: (rule: string) => rule === "forwards-its-ref" } as Context;
    expect(forwardsItsRef.check!(exempt)).toEqual([]);
  });
});

describe("letting the caller add a class", () => {
  it("is a judgement: a Modal that owns its own box is right to refuse one", () => {
    expect(acceptsAClassName.check).toBeUndefined();
  });
});
