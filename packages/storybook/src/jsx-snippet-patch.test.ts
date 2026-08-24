import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Storybook builds a story's "Show code" snippet by stringifying the element the
 * story rendered. `simplifyNodeForStringify` first strips the `_owner` fiber
 * React attaches to every element in development, but it only walks elements and
 * arrays — an element sitting inside a plain object prop keeps its owner. A
 * carousel slide's `cover`, a table column's `header`: stringifying the props
 * then walks that fiber, and through it the whole React tree and the Storybook
 * context behind it. In Safari the page pins a core and grows past 2GB rather
 * than coming back.
 *
 * `patches/@storybook__react@…patch` teaches it to descend into plain objects as
 * well. The patch is pinned to one version, so a Storybook bump drops it; these
 * read what is installed rather than what the patch file says.
 */
const require_ = createRequire(import.meta.url);
const pkgDir = dirname(require_.resolve("@storybook/react/package.json"));
const chunks = join(pkgDir, "dist", "_browser-chunks");

const carrying = readdirSync(chunks)
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(join(chunks, f), "utf8"))
  .filter((s) => s.includes("function simplifyNodeForStringify"));

describe("the story-snippet stringifier Storybook ships", () => {
  it("is somewhere to be read", () => {
    expect(carrying).toHaveLength(1);
  });

  it("descends into a plain object, so an element inside one loses its owner", () => {
    expect(carrying[0]).toContain("Object.getPrototypeOf(node) === Object.prototype");
  });

  it("holds what it has already simplified, so a cycle in the args ends", () => {
    expect(carrying[0]).toMatch(/simplifyNodeForStringify\(node, seen = .*WeakMap\(\)\)/);
  });

  it("is the version the patch is pinned to", () => {
    const root = JSON.parse(readFileSync(join(import.meta.dirname, "../../../package.json"), "utf8"));
    const installed = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;
    expect(Object.keys(root.pnpm.patchedDependencies)).toContain(`@storybook/react@${installed}`);
  });
});
