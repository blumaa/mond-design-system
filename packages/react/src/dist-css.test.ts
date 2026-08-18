import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

// The dist stylesheet loads into apps beside other libraries' stylesheets.
// PLAN.md picked CSS Modules to be collision-proof, but esbuild's local-css
// loader scopes a name only as `File_local` — and any other library built the
// same way emits the same names. Fairplay's outgoing component-lib does
// exactly that, and whichever stylesheet loaded later silently restyled the
// other's components (its `.Sheet_panel` zeroed our Sheet's safe-area
// padding). Namespacing every emitted class and keyframe makes the bundle
// safe to load in any cascade order.
const raw = readFileSync(join(__dirname, "..", "dist", "index.css"), "utf8");
// Comments carry source paths ("Sheet.module.css") that read as class tokens.
const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");

it("namespaces every class the bundle emits", () => {
  const classes = [...new Set(css.match(/\.-?[A-Za-z_][\w-]*/g) ?? [])];
  const bare = classes.filter((c) => !c.startsWith(".mds-"));
  expect(bare).toEqual([]);
});

it("namespaces every keyframe animation it defines", () => {
  const keyframes = [...new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1] ?? ""))];
  const bare = keyframes.filter((k) => !k.startsWith("mds-"));
  expect(bare).toEqual([]);
});
