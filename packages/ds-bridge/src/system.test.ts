import { describe, expect, it } from "vitest";
import { componentsIn, readSystemComponents, searchRoots } from "./system.js";

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
      name: "@scope/ds",
      exports: { ".": { types: "./dist/index.d.ts" } },
    }),
    "/app/node_modules/ds/dist/index.d.ts": "export { Button, type ButtonProps };",
    "/app/node_modules/old/package.json": JSON.stringify({ types: "types/index.d.ts" }),
    "/app/node_modules/old/types/index.d.ts": "export { Card };",
    "/app/node_modules/untyped/package.json": JSON.stringify({ main: "index.js" }),
  };
  const read = (file: string) => files[file];

  it("reads the types entry the package points at", () => {
    expect(readSystemComponents("ds", "/app", read)?.names).toEqual(["Button"]);
  });

  it("reads the older types field as well", () => {
    expect(readSystemComponents("old", "/app", read)?.names).toEqual(["Card"]);
  });

  it("says nothing about a package that ships no types, rather than guessing", () => {
    expect(readSystemComponents("untyped", "/app", read)).toBeUndefined();
    expect(readSystemComponents("missing", "/app", read)).toBeUndefined();
  });

  it("takes a path to a file as readily as a package name", () => {
    expect(readSystemComponents("/app/node_modules/ds/dist/index.d.ts", "/app", read)?.names).toEqual([
      "Button",
    ]);
  });

  /* Whose Button it is, not just that there is one. Told a package, that is the
     answer; told a path, the package holding the file states its own name, and a
     file in no package leaves the question open rather than answered wrongly. */
  it("names the package the components are imported from", () => {
    expect(readSystemComponents("ds", "/app", read)?.id).toBe("ds");
    expect(readSystemComponents("/app/node_modules/ds/dist/index.d.ts", "/app", read)?.id).toBe(
      "@scope/ds",
    );
  });

  /* A workspace installs its dependencies beside the package that declared
     them, not at the repo root the tool is pointed at. Resolving from the root
     alone reports that nothing named a system, which blames the config for
     something the config did right. */
  it("looks where a workspace put the package, not only at the root", () => {
    const workspace: Record<string, string> = {
      "/repo/apps/web/node_modules/ds/package.json": JSON.stringify({
        name: "ds",
        exports: { ".": { types: "./dist/index.d.ts" } },
      }),
      "/repo/apps/web/node_modules/ds/dist/index.d.ts": "export { Button };",
    };
    const inWorkspace = (file: string) => workspace[file];
    expect(readSystemComponents("ds", "/repo", inWorkspace)).toBeUndefined();
    expect(readSystemComponents("ds", "/repo", inWorkspace, ["/repo/apps/web"])?.names).toEqual([
      "Button",
    ]);
  });

  it("takes the root's copy over a workspace one when both are installed", () => {
    const both: Record<string, string> = {
      "/repo/node_modules/ds/package.json": JSON.stringify({ name: "ds", types: "./root.d.ts" }),
      "/repo/node_modules/ds/root.d.ts": "export { Button };",
      "/repo/apps/web/node_modules/ds/package.json": JSON.stringify({ name: "ds", types: "./web.d.ts" }),
      "/repo/apps/web/node_modules/ds/web.d.ts": "export { Card };",
    };
    expect(readSystemComponents("ds", "/repo", (f) => both[f], ["/repo/apps/web"])?.names).toEqual([
      "Button",
    ]);
  });

  it("leaves the package unnamed for a file that sits in none", () => {
    const loose = { "/app/types.d.ts": "export { Button };" };
    expect(readSystemComponents("/app/types.d.ts", "/app", (f) => loose[f as keyof typeof loose])?.id)
      .toBeUndefined();
  });
});

/* Where a package might be installed, given what the config already says. A
   workspace's dependencies sit beside the package that declared them, and the
   config names both places without meaning to: the entry stylesheet is read out
   of one, and the source globs are rooted in the other. */
describe("where to look for the package", () => {
  it("takes the package that holds the entry stylesheet", () => {
    expect(
      searchRoots("/repo/apps/web/node_modules/@ds/tokens/src/styles.css", []),
    ).toEqual(["/repo/apps/web"]);
  });

  it("takes the fixed part of each source glob", () => {
    expect(searchRoots(undefined, ["apps/web/**", "brand/**"])).toEqual([
      "apps/web",
      "apps",
      "brand",
    ]);
  });

  /* A glob names the source, not the package holding it. `apps/web/src` has no
     manifest and `apps/web` does, and only the disk knows which. */
  it("offers every directory above the glob, nearest first", () => {
    expect(searchRoots(undefined, ["apps/web/src/**"])).toEqual(["apps/web/src", "apps/web", "apps"]);
  });

  it("says nothing about a glob that starts with one", () => {
    expect(searchRoots(undefined, ["**/*.css", "*.tsx"])).toEqual([]);
  });

  it("says nothing about an entry that is not installed anywhere", () => {
    expect(searchRoots("/repo/packages/tokens/src/styles.css", [])).toEqual([]);
  });

  it("says each place once", () => {
    expect(
      searchRoots("/repo/apps/web/node_modules/@ds/tokens/src/styles.css", ["/repo/apps/web/**"]),
    ).toEqual(["/repo/apps/web", "/repo/apps", "/repo"]);
  });
});
