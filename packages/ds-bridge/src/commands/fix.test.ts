/* A fix that is ever wrong is worse than no fix at all: it lands in a diff
   nobody reads closely, under a green check. So it acts on one finding shape
   only, and re-reads the file before touching it. */
import { describe, expect, it } from "vitest";
import { fixable, rewrite } from "./fix.js";
import type { Finding } from "../rules/types.js";

/* Unknown rather than Partial<Finding>: half these cases are a field the tool
   did not set, and `exactOptionalPropertyTypes` will not spell that as one. */
const at = (over: Partial<Record<keyof Finding, unknown>> = {}): Finding =>
  ({
    rule: "no-literal-length",
    file: "src/Button.module.css",
    line: 1,
    col: 15,
    message: "",
    value: "8px",
    confidence: "certain",
    autofix: "var(--mds-gap)",
    ...over,
  }) as Finding;

describe("fixable", () => {
  it("takes a finding that names one token", () => {
    expect(fixable([at()])).toHaveLength(1);
  });

  it("leaves everything the tool is not sure about", () => {
    expect(fixable([at({ confidence: "ambiguous" })])).toEqual([]);
    expect(fixable([at({ confidence: "value-only" })])).toEqual([]);
    expect(fixable([at({ autofix: undefined })])).toEqual([]);
  });

  /* A style prop's value is a JavaScript expression and its finding carries no
     column, so there is nothing to replace and no way to quote it correctly. */
  it("leaves a finding that never said where it was", () => {
    expect(fixable([at({ col: undefined })])).toEqual([]);
    expect(fixable([at({ line: undefined })])).toEqual([]);
    expect(fixable([at({ value: undefined })])).toEqual([]);
  });
});

describe("rewrite", () => {
  it("replaces the literal where the finding says it is", () => {
    expect(rewrite(".a { padding: 8px; }", fixable([at()]))).toBe(".a { padding: var(--mds-gap); }");
  });

  it("keeps the columns of the fixes still to come", () => {
    const source = ".a { padding: 8px; margin: 8px; }";
    const fixes = fixable([at(), at({ col: 28, autofix: "var(--mds-space-2)" })]);
    expect(rewrite(source, fixes)).toBe(".a { padding: var(--mds-gap); margin: var(--mds-space-2); }");
  });

  it("changes nothing when the text moved out from under the finding", () => {
    expect(rewrite(".a { color: red; }", fixable([at()]))).toBeUndefined();
    expect(rewrite("", fixable([at()]))).toBeUndefined();
  });

  it("negates in place, because that is what the finding said to write", () => {
    const fixes = fixable([at({ value: "-8px", col: 11, autofix: "calc(-1 * var(--mds-space-2))" })]);
    expect(rewrite(".a { top: -8px; }", fixes)).toBe(".a { top: calc(-1 * var(--mds-space-2)); }");
  });
});
