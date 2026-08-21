import { describe, expect, it } from "vitest";
import { componentsIn, readSystemComponents } from "./system.js";

describe("what a design system package says it exports", () => {
  it("reads a bundled export list, types and all", () => {
    const source = "export { Button, type ButtonProps, Card, type CardTone, Chip };";
    expect(componentsIn(source)).toEqual(["Button", "Card", "Chip"]);
  });

  it("leaves out a type-only block, which exports nothing to render", () => {
    expect(componentsIn(`export type { ButtonProps, CardTone };`)).toEqual([]);
  });

  it("leaves out a hook and a helper, which are not components", () => {
    expect(componentsIn(`export { Button, cx, useToast, usePresence };`)).toEqual(["Button"]);
  });

  it("takes the name a consumer would write, not the one inside", () => {
    expect(componentsIn(`export { InternalCard as Card };`)).toEqual(["Card"]);
  });

  it("reads a source package too, which declares one export at a time", () => {
    const source = [
      `export { Button } from "./components/Button/Button";`,
      `export type { ButtonProps } from "./components/Button/Button";`,
      `export declare const Card: (props: CardProps) => JSX.Element;`,
      `export declare function Chip(props: ChipProps): JSX.Element;`,
    ].join("\n");
    expect(componentsIn(source)).toEqual(["Button", "Card", "Chip"]);
  });

  it("says nothing twice", () => {
    expect(componentsIn(`export { Button };\nexport { Button };`)).toEqual(["Button"]);
  });
});

describe("finding the package that holds them", () => {
  const files: Record<string, string> = {
    "/app/node_modules/ds/package.json": JSON.stringify({
      exports: { ".": { types: "./dist/index.d.ts" } },
    }),
    "/app/node_modules/ds/dist/index.d.ts": "export { Button, type ButtonProps };",
    "/app/node_modules/old/package.json": JSON.stringify({ types: "types/index.d.ts" }),
    "/app/node_modules/old/types/index.d.ts": "export { Card };",
    "/app/node_modules/untyped/package.json": JSON.stringify({ main: "index.js" }),
  };
  const read = (file: string) => files[file];

  it("reads the types entry the package points at", () => {
    expect(readSystemComponents("ds", "/app", read)).toEqual(["Button"]);
  });

  it("reads the older types field as well", () => {
    expect(readSystemComponents("old", "/app", read)).toEqual(["Card"]);
  });

  it("says nothing about a package that ships no types, rather than guessing", () => {
    expect(readSystemComponents("untyped", "/app", read)).toBeUndefined();
    expect(readSystemComponents("missing", "/app", read)).toBeUndefined();
  });

  it("takes a path to a file as readily as a package name", () => {
    expect(readSystemComponents("/app/node_modules/ds/dist/index.d.ts", "/app", read)).toEqual(["Button"]);
  });
});
