import { describe, expect, it } from "vitest";
import { aboveBaseline, baselineOf, changed, coverageOf } from "./baseline.js";
import type { Finding } from "../rules/types.js";

const finding = (file: string, rule: string, line: number): Finding => ({
  rule,
  file,
  line,
  message: `${rule} at ${line}`,
});

const debt = [
  finding("src/Card.module.css", "no-literal-length", 3),
  finding("src/Card.module.css", "no-literal-length", 9),
  finding("src/Card.module.css", "no-literal-color", 4),
  finding("src/Button.module.css", "no-literal-length", 2),
];

describe("a baseline", () => {
  it("counts what is there, per file and per rule", () => {
    expect(baselineOf(debt).counts).toEqual({
      "src/Button.module.css": { "no-literal-length": 1 },
      "src/Card.module.css": { "no-literal-color": 1, "no-literal-length": 2 },
    });
  });

  it("holds everything it recorded, so a repo that stands still passes", () => {
    expect(aboveBaseline(debt, baselineOf(debt))).toEqual([]);
  });

  it("reports only what is above it, marked as new", () => {
    const worse = [...debt, finding("src/Card.module.css", "no-literal-length", 20)];
    const above = aboveBaseline(worse, baselineOf(debt));
    expect(above).toHaveLength(1);
    expect(above[0]).toMatchObject({ line: 20, new: true });
  });

  it("records which rules it ran, so a rule added later is not read as new debt", () => {
    expect(baselineOf(debt, ["no-literal-length", "no-literal-color"]).rules).toEqual([
      "no-literal-color",
      "no-literal-length",
    ]);
  });

  it("tells a rule it ran and found nothing from one it never ran", () => {
    const recorded = baselineOf(debt, ["no-literal-length", "no-literal-color", "touch-targets"]);
    expect(coverageOf(recorded, "touch-targets")).toBe("covered");
    expect(coverageOf(recorded, "scroller-contains-its-overscroll")).toBe("outside");
  });

  it("says it cannot tell when the baseline predates the record", () => {
    expect(coverageOf(baselineOf(debt), "touch-targets")).toBe("unknown");
  });

  it("reports a rule that never fired in this file before", () => {
    const worse = [...debt, finding("src/Button.module.css", "no-literal-color", 7)];
    expect(aboveBaseline(worse, baselineOf(debt)).map((f) => f.rule)).toEqual(["no-literal-color"]);
  });

  it("holds nothing when there is no baseline to hold it", () => {
    expect(aboveBaseline(debt, { version: 1, counts: {} })).toHaveLength(4);
  });

  it("never rewards a repo for fixing one file by letting another get worse", () => {
    const moved = [
      finding("src/Card.module.css", "no-literal-length", 3),
      finding("src/Button.module.css", "no-literal-length", 2),
      finding("src/Button.module.css", "no-literal-length", 8),
    ];
    expect(aboveBaseline(moved, baselineOf(debt))).toHaveLength(1);
  });

  it("says what moved, in both directions", () => {
    const fixed = debt.slice(1);
    expect(changed(baselineOf(debt), baselineOf(fixed))).toEqual({ added: 0, removed: 1 });
    expect(changed(baselineOf(fixed), baselineOf(debt))).toEqual({ added: 1, removed: 0 });
  });
});
