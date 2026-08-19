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

it.each([
  ["sm", 2],
  ["lg", 4],
])("declares --mds-pad-control-%s at step %i", (size, step) => {
  expect(core("spacing.css")).toMatch(
    new RegExp(`--mds-pad-control-${size}:\\s*var\\(--mds-space-${step}\\);`),
  );
});

it("keeps --mds-pad-control-md on the alias it renames", () => {
  expect(core("spacing.css")).toMatch(/--mds-pad-control-md:\s*var\(--mds-pad-control\);/);
});

it.each([
  ["pad-pill-y", 1],
  ["pad-pill-x", 3],
  ["pad-tag-y", 1],
  ["pad-tag-x", 2],
  ["pad-badge-x", 2],
  ["pad-count-y", 1],
  ["pad-count-x", 2],
  ["pad-item-y", 3],
  ["pad-empty-y", 10],
  ["pad-tab-y", 2],
  ["pad-tab-x", 3],
  ["pad-segment", 1],
  ["pad-toast-y", 3],
  ["pad-toast-x", 4],
  ["toast-inset", 4],
])("declares --mds-%s at step %i", (name, step) => {
  expect(core("spacing.css")).toMatch(new RegExp(`--mds-${name}:\\s*var\\(--mds-space-${step}\\);`));
});

it.each([
  ["badge-size", 5],
  ["avatar-overlap", 2],
  ["switch-inset", 1],
  ["progress-h", 2],
  ["skeleton-h", 10],
  ["fade-w", 6],
])("declares --mds-%s at step %i", (name, step) => {
  expect(core("layout.css")).toMatch(new RegExp(`--mds-${name}:\\s*var\\(--mds-space-${step}\\);`));
});

it("declares --mds-toast-w at the modal width", () => {
  expect(core("layout.css")).toMatch(/--mds-toast-w:\s*var\(--mds-modal-w\);/);
});

it.each(["checkbox", "segment", "skeleton", "focus"])(
  "declares --mds-radius-%s at step 1",
  (name) => {
    expect(core("radius.css")).toMatch(new RegExp(`--mds-radius-${name}:\\s*var\\(--mds-radius-1\\);`));
  },
);

it("declares --mds-button-border at the control border", () => {
  const semantic = readFileSync(join(__dirname, "src", "semantic.css"), "utf8");
  expect(semantic).toMatch(/--mds-button-border:\s*var\(--mds-control-border\);/);
});

it.each([
  ["sm", "sm"],
  ["md", "control"],
  ["lg", "control"],
])("declares --mds-text-control-%s at the %s size", (size, target) => {
  expect(core("typography.css")).toMatch(
    new RegExp(`--mds-text-control-${size}:\\s*var\\(--mds-text-${target}\\);`),
  );
});

it.each([
  ["sm", "sm"],
  ["md", "base"],
  ["lg", "lg"],
])("declares --mds-text-button-%s at the %s step", (size, step) => {
  expect(core("typography.css")).toMatch(
    new RegExp(`--mds-text-button-${size}:\\s*var\\(--mds-text-${step}\\);`),
  );
});

it("declares --mds-text-section at the smallest step", () => {
  expect(core("typography.css")).toMatch(/--mds-text-section:\s*var\(--mds-text-xs\);/);
});

it.each([
  ["xs", "xs"],
  ["sm", "xs"],
  ["md", "sm"],
  ["lg", "xl"],
  ["xl", "2xl"],
])("declares --mds-avatar-text-%s at the %s step", (size, step) => {
  expect(core("layout.css")).toMatch(
    new RegExp(`--mds-avatar-text-${size}:\\s*var\\(--mds-text-${step}\\);`),
  );
});
