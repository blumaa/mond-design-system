import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { loadContext } from "../context.js";
import { buildReport, renderReport, byConcern, widthOf } from "./report.js";
import { visible } from "../text.js";
import type { Finding } from "../rules/types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const APP = fileURLToPath(new URL("../__fixtures__/app", import.meta.url));

const context = () => loadContext({ root: APP, system: SYSTEM });
const report = () => buildReport(context());

describe("byConcern", () => {
  const findings: Finding[] = [
    { rule: "keeps-contrast", file: "a.css", message: "a" },
    { rule: "keeps-contrast", file: "b.css", message: "b" },
    { rule: "no-literal-length", file: "a.css", message: "c" },
  ];

  it("files a finding under the question its rule answers", () => {
    const filed = byConcern(findings);
    expect(filed.accessibility.map((f) => f.rule)).toEqual(["keeps-contrast"]);
    expect(filed.scale.map((f) => f.rule)).toEqual(["no-literal-length"]);
  });

  it("counts the failures of one rule once, with the files they are in", () => {
    const [contrast] = byConcern(findings).accessibility;
    expect(contrast).toMatchObject({ rule: "keeps-contrast", count: 2, files: 2 });
  });

  it("carries the WCAG criterion the rule names, and invents none", () => {
    const filed = byConcern(findings);
    expect(filed.accessibility[0]?.wcag).toContain("1.4.3");
    expect(filed.scale[0]?.wcag).toBeUndefined();
  });

  it("loses nothing to a rule it does not know", () => {
    expect(() => byConcern([{ rule: "not-a-rule", file: "a.css", message: "x" }])).not.toThrow();
  });
});

describe("buildReport", () => {
  it("measures how much of the system the app reaches for", () => {
    const { alignment } = report();
    expect(alignment.contract.total).toBeGreaterThan(0);
    expect(alignment.contract.repointed).toBeLessThanOrEqual(alignment.contract.total);
  });

  it("counts the app's own tokens the system already holds a value for", () => {
    expect(report().alignment.scale.named).toBeGreaterThan(0);
  });

  it("names only the values no token holds — those are the missing rungs", () => {
    const { missing } = report().scale;
    expect(missing.every((it) => it.places > 0)).toBe(true);
    expect(missing.map((it) => it.value)).not.toContain("12px");
  });

  it("asks the adoption questions of an app, and not of a system of itself", () => {
    const own = loadContext({ root: dirname(SYSTEM), system: SYSTEM });
    expect(own.kind).toBe("system");
    expect(renderReport(buildReport(own), own, { color: false })).not.toContain("re-pointed");
    expect(renderReport(report(), context(), { color: false })).toContain("re-pointed");
  });

  it("says which rules could not run here, and why", () => {
    expect(report().notChecked.every((it) => it.reason !== "")).toBe(true);
  });
});

describe("renderReport", () => {
  const out = () => renderReport(report(), context(), { color: false });

  it("answers the three questions by name", () => {
    expect(out()).toContain("ALIGNMENT");
    expect(out()).toContain("ACCESSIBILITY");
    expect(out()).toContain("MISSING FROM THE SCALE");
  });

  it("never claims conformance it did not measure", () => {
    expect(out().toLowerCase()).not.toContain("wcag compliant");
    expect(out()).toContain("no page was rendered");
  });

  it("says what it could not check rather than passing it silently", () => {
    expect(out()).toContain("NOT CHECKED");
  });
});

describe("the frame", () => {
  const framed = (columns?: number) =>
    renderReport(report(), context(), { color: false, ...(columns === undefined ? {} : { columns }) })
      .split("\n")
      .filter((line) => line !== "");

  it("draws a closed box: every line starts and ends on the border", () => {
    const lines = framed();
    expect(lines[0]?.startsWith("\u250c")).toBe(true);
    expect(lines.at(-1)).toMatch(/^\u2514\u2500+\u2518$/);
    for (const line of lines.slice(1, -1)) expect(line).toMatch(/^[\u2502\u251c]/);
  });

  it("holds one width down the whole box, whatever is in a line", () => {
    const widths = new Set(framed().map(visible));
    expect([...widths]).toEqual([widthOf()]);
  });

  it("takes the width from the terminal, within what is readable", () => {
    expect(new Set(framed(120).map(visible))).toEqual(new Set([84]));
    expect(new Set(framed(40).map(visible))).toEqual(new Set([56]));
  });

  it("holds that width with colour on, where the escapes print as nothing", () => {
    const colored = renderReport(report(), context(), { color: true })
      .split("\n")
      .filter((line) => line !== "");
    expect(new Set(colored.map(visible))).toEqual(new Set([widthOf()]));
  });

  it("names the repo in the top border", () => {
    expect(framed()[0]).toContain("app");
  });

  it("keeps the verdict when the line is too long to fit, and cuts the text", () => {
    const narrow = framed(40).find((line) => line.includes("ALIGNMENT"));
    expect(narrow).toContain("partial");
  });
});
