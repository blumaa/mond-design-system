/* Role aliases, held to their defaults. An alias exists so a brand has one
 * place to re-point a role; adding one must not move the shipped look, so each
 * default is asserted against the scale step it stands in for.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const core = (file: string) => readFileSync(join(__dirname, "src", "core", file), "utf8");

it("declares --mds-text-control at the base reading size", () => {
  expect(core("typography.css")).toMatch(/--mds-text-control:\s*var\(--mds-text-base\);/);
});

it("declares --mds-radius-modal at step 3", () => {
  expect(core("radius.css")).toMatch(/--mds-radius-modal:\s*var\(--mds-radius-3\);/);
});
