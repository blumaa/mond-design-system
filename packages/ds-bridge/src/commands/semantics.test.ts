import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildContext } from "../context.js";
import { loadGraph } from "../graph.js";
import { loadSemantics, type SemanticsFile } from "../semantics.js";
import { planSemantics, renderSemantics } from "./semantics.js";
import type { Component } from "../structure.js";
import type { Config } from "../context.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const graph = loadGraph({ system: SYSTEM });

const published: SemanticsFile = {
  version: 1,
  components: {
    ConfirmDialog: { roles: ["alertdialog"] },
    Sheet: {},
    Toast: { roles: ["status"] },
  },
};

const component = (name: string): Component => ({
  name,
  file: `src/${name}/${name}.tsx`,
  imports: [],
});

const context = (
  app: Record<string, string>,
  options: { config?: Config; declared?: boolean } = {},
) =>
  buildContext({
    root: "/app",
    kind: "app",
    graph,
    sheets: [],
    components: Object.keys(app).map(component),
    sources: Object.entries(app).map(([name, source]) => ({ file: `src/${name}/${name}.tsx`, source })),
    semantics: loadSemantics(options.declared === false ? undefined : published),
    ...(options.config ? { config: options.config } : {}),
  });

describe("planSemantics", () => {
  it("names what the app announces and the system does not, by the same name", () => {
    const plan = planSemantics(
      context({ ConfirmDialog: `const C = () => <div role="dialog" />;` }),
    );
    expect(plan.differences).toEqual([
      { from: "ConfirmDialog", to: "ConfirmDialog", what: "role", was: "dialog", becomes: "alertdialog" },
    ]);
  });

  it("pairs a rename through the config, because a name change is the app's decision", () => {
    const plan = planSemantics(
      context(
        { ModalSheet: `const S = () => <section><h2>{title}</h2></section>;` },
        { config: { replaces: { ModalSheet: "Sheet" } } },
      ),
    );
    expect(plan.differences).toEqual([
      { from: "ModalSheet", to: "Sheet", what: "title", was: "h2", becomes: "—" },
    ]);
  });

  it("counts a pair that already agrees rather than printing it", () => {
    const plan = planSemantics(context({ Toast: `const T = () => <div role="status" />;` }));
    expect(plan).toMatchObject({ differences: [], agreed: 1, unpaired: [] });
  });

  it("reads the role off the component the app's own markup opens with", () => {
    /* Kinbaku's ConfirmDialog said nothing itself: the role was on the
       ModalSheet it wrapped. Reading the file alone reports the app announcing
       nothing, which is a worse lie than the difference it was hiding. */
    const plan = planSemantics(
      context({
        ConfirmDialog: `const C = () => <ModalSheet placement="dialog">{children}</ModalSheet>;`,
        ModalSheet: `const M = () => <div role="dialog"><h2>{title}</h2></div>;`,
      }),
      );
    expect(plan.differences).toContainEqual({
      from: "ConfirmDialog",
      to: "ConfirmDialog",
      what: "role",
      was: "dialog",
      becomes: "alertdialog",
    });
  });

  it("stops at what the file states — a nested component is not the root", () => {
    const plan = planSemantics(
      context({
        Toast: `const T = () => <div className={s.viewport}><Spinner /></div>;`,
        Spinner: `const S = () => <div role="status" />;`,
      }),
    );
    expect(plan.differences).toEqual([
      { from: "Toast", to: "Toast", what: "role", was: "—", becomes: "status" },
    ]);
  });

  it("survives a component that opens with itself", () => {
    const plan = planSemantics(context({ Toast: `const T = () => <Toast />;` }));
    expect(plan.differences).toHaveLength(1);
  });

  it("names the components the system describes nothing for", () => {
    const plan = planSemantics(context({ PostCard: `const P = () => <article />;` }));
    expect(plan).toMatchObject({ differences: [], agreed: 0, unpaired: ["PostCard"] });
  });
});

describe("renderSemantics", () => {
  it("prints the app's side then the system's, one line per difference", () => {
    const ctx = context({
      ConfirmDialog: `const C = () => <div role="dialog" />;`,
      Toast: `const T = () => <div role="alert" />;`,
    });
    const out = renderSemantics(planSemantics(ctx), ctx, { color: false });
    expect(out).toContain("ConfirmDialog  role  dialog → alertdialog");
    expect(out).toContain("Toast          role  alert → status");
  });

  it("prints the pair on both sides when the name changes", () => {
    const ctx = context(
      { ModalSheet: `const S = () => <h2>{title}</h2>;` },
      { config: { replaces: { ModalSheet: "Sheet" } } },
    );
    expect(renderSemantics(planSemantics(ctx), ctx, { color: false })).toContain(
      "ModalSheet → Sheet  title  h2 → —",
    );
  });

  it("says the system published nothing rather than reporting no differences", () => {
    const ctx = context({ Toast: `const T = () => <div role="alert" />;` }, { declared: false });
    const out = renderSemantics(planSemantics(ctx), ctx, { color: false });
    expect(out).toContain("no semantics.json");
    expect(out).not.toContain("difference");
  });

  it("says so when every pair agrees", () => {
    const ctx = context({ Toast: `const T = () => <div role="status" />;` });
    expect(renderSemantics(planSemantics(ctx), ctx, { color: false })).toContain("already does");
  });
});
