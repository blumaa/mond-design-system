import { describe, expect, it } from "vitest";
import { styleDeclarations } from "./jsx.js";

describe("reading the style prop", () => {
  it("finds every declaration with the line it is on", () => {
    const source = `const a = (\n  <div style={{ gap: 28, width: 390 }}>\n);`;
    expect(styleDeclarations(source)).toEqual([
      { key: "gap", value: "28", line: 2 },
      { key: "width", value: "390", line: 2 },
    ]);
  });

  it("keeps a declaration split over lines with its own line", () => {
    const source = `<div\n  style={{\n    color: "var(--mds-text-primary)",\n    gap: 4,\n  }}\n/>`;
    expect(styleDeclarations(source).map((d) => [d.key, d.line])).toEqual([
      ["color", 3],
      ["gap", 4],
    ]);
  });

  it("passes over a spread, which is written somewhere else", () => {
    expect(styleDeclarations(`<i style={{ ...vars, ...style }} />`)).toEqual([]);
  });

  it("does not split on a comma or a colon inside a value", () => {
    const source = "<i style={{ font: `var(${token})`, grid: gone ? \"a, b\" : rgb(1, 2, 3) }} />";
    expect(styleDeclarations(source)).toEqual([
      { key: "font", value: "`var(${token})`", line: 1 },
      { key: "grid", value: 'gone ? "a, b" : rgb(1, 2, 3)', line: 1 },
    ]);
  });

  it("reads a custom property key as written", () => {
    const source = '<i style={{ ...({ "--progress": `${n}%` } as CSSProperties) }} />';
    expect(styleDeclarations(source)).toEqual([]);
    expect(styleDeclarations('<i style={{ "--progress": `${n}%` }} />')).toEqual([
      { key: '"--progress"', value: "`${n}%`", line: 1 },
    ]);
  });
});
