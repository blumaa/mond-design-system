/* `next` is a projection, not a plan. Everything here is derived from the
   findings as they stand, so it cannot disagree with the repo. */
import { describe, expect, it } from "vitest";
import { nextItem, renderNext } from "./next.js";
import type { Finding } from "../rules/types.js";

const at = (over: Partial<Finding> = {}): Finding => ({
  rule: "no-literal-length",
  file: "src/Card.module.css",
  line: 3,
  message: "literal length",
  ...over,
});

const certain = (n: number) =>
  Array.from({ length: n }, (_, i) =>
    at({ line: i, value: "1px", confidence: "certain", autofix: "var(--mds-border-width)" }),
  );

const ambiguous = (n: number, value: string) =>
  Array.from({ length: n }, (_, i) =>
    at({ line: i, value, confidence: "ambiguous", candidates: ["--mds-icon-md", "--mds-switch-knob"] }),
  );

const unnamed = (n: number, value: string) =>
  Array.from({ length: n }, (_, i) => at({ line: i, value, confidence: "none", candidates: [] }));

describe("nextItem", () => {
  it("has nothing to say about a repo with no findings", () => {
    expect(nextItem([])).toBeUndefined();
  });

  /* One command closes every one of them and cannot be wrong, so nothing that
     needs a decision competes with it. */
  it("puts the findings with one answer first, however few there are", () => {
    const item = nextItem([...ambiguous(20, "20px"), ...certain(2)]);
    expect(item?.kind).toBe("fix");
    expect(item?.closes).toBe(2);
    expect(item?.command).toBe("dsbridge check --fix");
  });

  it("then takes the value that costs the most places, not the commonest rule", () => {
    const item = nextItem([...ambiguous(13, "20px"), ...ambiguous(4, "8px")]);
    expect(item?.kind).toBe("decide");
    expect(item?.closes).toBe(13);
    expect(item?.title).toContain("20px");
    expect(item?.tokens).toContain("--mds-switch-knob");
  });

  /* A value no token holds is the system's backlog rather than this repo's
     debt: one token named there closes every place here. */
  it("says the scale is missing a rung when nothing holds the value", () => {
    const item = nextItem(unnamed(14, "10px"));
    expect(item?.kind).toBe("name");
    expect(item?.closes).toBe(14);
    expect(item?.tokens).toEqual([]);
  });

  it("falls back to the rule with the most findings when nothing carries a value", () => {
    const item = nextItem([
      at({ rule: "no-outer-margin", file: "a.css" }),
      at({ rule: "no-outer-margin", file: "b.css" }),
      at({ rule: "z-index-is-a-token", file: "c.css" }),
    ]);
    expect(item?.kind).toBe("rule");
    expect(item?.closes).toBe(2);
    expect(item?.command).toBe("dsbridge rules no-outer-margin");
  });

  it("counts the files the work is in, not only the findings", () => {
    const item = nextItem([
      ...ambiguous(2, "20px").map((f) => ({ ...f, file: "a.css" })),
      ...ambiguous(1, "20px").map((f) => ({ ...f, file: "b.css" })),
    ]);
    expect(item?.files).toEqual(["a.css", "b.css"]);
  });
});

describe("renderNext", () => {
  const plain = { color: false };

  it("prints the one thing to do and the command that does it", () => {
    const out = renderNext(certain(106), 413, plain);
    expect(out).toContain("dsbridge check --fix");
    expect(out).toContain("106 of 413");
  });

  it("says a clean repo is clean rather than inventing work", () => {
    expect(renderNext([], 0, plain)).toContain("nothing");
  });

  /* Something added this session outranks debt that was already forgiven, and
     the output has to say which of the two it is looking at. */
  it("says when the work it picked is above the baseline", () => {
    const out = renderNext(certain(3), 3, { ...plain, regression: true });
    expect(out).toContain("above the baseline");
  });
});
