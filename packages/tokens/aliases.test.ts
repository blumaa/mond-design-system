/* Role aliases, held to their defaults. An alias exists so a brand has one
 * place to re-point a role; adding one must not move the shipped look, so each
 * default is asserted against the scale step it stands in for.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const core = (file: string) => readFileSync(join(__dirname, "src", "core", file), "utf8");

/* Resolves a token to a number of px, following the aliases down to a literal. */
const px = (name: string, file: string): number => {
  const declaration = new RegExp(`${name}:\\s*([^;]+);`).exec(core(file));
  if (!declaration?.[1]) throw new Error(`${name} is not declared in core/${file}`);
  const value = declaration[1].trim();
  const alias = /^var\((--mds-[a-z0-9-]+)\)$/.exec(value);
  if (alias?.[1]) return px(alias[1], file);
  const literal = /^(-?[\d.]+)px$/.exec(value);
  if (!literal?.[1]) throw new Error(`${name} resolves to ${value}, which is not a px length`);
  return Number(literal[1]);
};

it("declares --mds-text-control at the base reading size", () => {
  expect(core("typography.css")).toMatch(/--mds-text-control:\s*var\(--mds-text-base\);/);
});

it("declares --mds-radius-modal at the same step as a sheet", () => {
  expect(core("radius.css")).toMatch(/--mds-radius-modal:\s*var\(--mds-radius-7\);/);
  expect(core("radius.css")).toMatch(/--mds-radius-sheet:\s*var\(--mds-radius-7\);/);
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

it("declares --mds-pad-button-md on the scale, sm and lg off it", () => {
  expect(core("spacing.css")).toMatch(/--mds-pad-button-md:\s*var\(--mds-space-4\);/);
  const md = px("--mds-space-4", "spacing.css");
  expect(px("--mds-pad-button-sm", "spacing.css")).toBeLessThan(md);
  expect(px("--mds-pad-button-lg", "spacing.css")).toBeGreaterThan(md);
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

it.each(["checkbox", "skeleton", "focus"])(
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

/* Initials are a fraction of the circle, not a step on the reading scale. The
   pair used to be set independently, so a brand that resized its avatars got
   12px initials in a 38px circle — nothing failed, it just looked wrong. */
it.each(["xs", "sm", "md", "lg", "xl"])(
  "derives --mds-avatar-text-%s from the diameter it sits in",
  (size) => {
    expect(core("layout.css")).toMatch(
      new RegExp(
        `--mds-avatar-text-${size}:\\s*calc\\(var\\(--mds-avatar-${size}\\) \\* var\\(--mds-avatar-text-ratio\\)\\);`,
      ),
    );
  },
);

it("keeps initials legible at every size", () => {
  const declared = /--mds-avatar-text-ratio:\s*([\d.]+);/.exec(core("layout.css"));
  const ratio = Number(declared?.[1]);
  expect(ratio).toBeGreaterThan(0.35);
  expect(ratio).toBeLessThan(0.5);
  expect(px("--mds-avatar-xs", "layout.css") * ratio).toBeGreaterThanOrEqual(10);
});

/* A chip is taller than it is grid-aligned and a badge is a two-digit circle.
   Both sat on the 4px grid and both read a size too big beside their type. */
it("pads a chip wider than it is tall", () => {
  const y = px("--mds-pad-pill-y", "spacing.css");
  expect(px("--mds-pad-pill-x", "spacing.css")).toBeGreaterThan(y);
  expect(y).toBeGreaterThan(px("--mds-space-1", "spacing.css"));
});

it("sizes a badge to hold two digits at meta size", () => {
  expect(px("--mds-badge-size", "layout.css")).toBe(18);
});

/* The moving face of a segmented control is a rounded rectangle inside a
   rounded rectangle; at the checkbox radius it read as a square. */
it("rounds a segment face between a checkbox and a control", () => {
  const face = px("--mds-radius-segment", "radius.css");
  expect(face).toBeGreaterThan(px("--mds-radius-checkbox", "radius.css"));
  expect(face).toBeLessThan(px("--mds-radius-control", "radius.css"));
});
