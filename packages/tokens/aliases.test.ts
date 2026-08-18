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

it.each(["panel-title", "card-title"])("declares --mds-type-%s at the subtitle role", (name) => {
  expect(core("typography.css")).toMatch(
    new RegExp(`--mds-type-${name}:\\s*var\\(--mds-type-subtitle\\);`),
  );
});

it.each(["item-title", "pill"])("declares --mds-type-%s at the label role", (name) => {
  expect(core("typography.css")).toMatch(
    new RegExp(`--mds-type-${name}:\\s*var\\(--mds-type-label\\);`),
  );
});

it.each([
  ["sm", 3],
  ["md", 4],
  ["lg", 5],
])("declares --mds-pad-button-%s at step %i", (size, step) => {
  expect(core("spacing.css")).toMatch(
    new RegExp(`--mds-pad-button-${size}:\\s*var\\(--mds-space-${step}\\);`),
  );
});
