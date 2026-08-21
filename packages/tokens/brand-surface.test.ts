/* The brand-settable geometry surface, held to the manifest that names it.
 *
 * A brand may move shape and size; it may not move an accessibility floor. The
 * line between the two is a file rather than a paragraph — src/brand-surface.json
 * names every role an app may re-point, the kind of value each one takes, and
 * the floors it may not touch. These tests keep that file and the template the
 * same document: a role in one and not the other is either a role no app can
 * find or a promise the system does not keep.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const at = (...path: string[]) => readFileSync(join(__dirname, ...path), "utf8");
const core = (file: string) => at("src", "core", file);
const template = at("src", "brand-template.css");

type Role = { token: string; kind: "step" | "length"; why: string };
type Floor = { token: string; why: string };
const manifest = JSON.parse(at("src", "brand-surface.json")) as {
  version: number;
  note: string;
  settable: Role[];
  floors: Floor[];
};

const CORE = ["radius.css", "spacing.css", "layout.css", "typography.css", "elevation.css", "motion.css"];

/** Every token a stylesheet declares, by name. */
const declares = (source: string) =>
  new Set([...source.matchAll(/^\s*(--mds-[a-z0-9-]+)\s*:/gm)].map((found) => found[1]!));

/** What a stylesheet sets a token to, verbatim. */
const value = (source: string, token: string) => {
  const found = new RegExp(`${token}:\\s*([^;]+);`).exec(source);
  if (found === null) throw new Error(`${token} is not declared here`);
  return found[1]!.trim();
};

const coreTokens = new Set(CORE.flatMap((file) => [...declares(core(file))]));
const settable = manifest.settable.map((role) => role.token);

it("names a role only the system actually has", () => {
  for (const token of settable) expect(coreTokens).toContain(token);
});

it("gives every role and every floor its reason", () => {
  for (const entry of [...manifest.settable, ...manifest.floors]) {
    expect(entry.why.length, `${entry.token} has no reason on record`).toBeGreaterThan(20);
  }
});

/* The template is what an app copies, so it is the only place a brand learns a
   role exists. A role missing from it falls through to the mond default and the
   app is branded everywhere except there; a geometry line in the template that
   the manifest does not name is a surface nobody agreed to support. */
it("offers exactly the roles the manifest names, no more and no fewer", () => {
  const geometry = [...declares(template)].filter((token) => coreTokens.has(token));
  expect(geometry.sort()).toEqual([...settable].sort());
});

it("re-points a step role at a rung rather than a length", () => {
  for (const role of manifest.settable.filter((r) => r.kind === "step")) {
    expect(value(template, role.token)).toMatch(/^var\(--mds-(space|radius)-\d+\)$/);
  }
});

/* A length sits on no scale in either system — three control heights are not a
   ladder — so the number is the decision, and forcing it onto the spacing scale
   would corrupt a rung every unrelated component reads. */
it("states a length role as a length", () => {
  for (const role of manifest.settable.filter((r) => r.kind === "length")) {
    expect(value(template, role.token)).toMatch(/^\d+px$/);
  }
});

it("holds every role to a kind it can be checked against", () => {
  for (const role of manifest.settable) expect(["step", "length"]).toContain(role.kind);
});

it("keeps every floor out of the template", () => {
  for (const floor of manifest.floors) expect(template).not.toContain(floor.token);
});

it("names a floor only the system actually has", () => {
  for (const floor of manifest.floors) expect(coreTokens).toContain(floor.token);
});

/* Below 16px, iOS Safari zooms the page the moment a field takes focus, and the
   layout is never the same again. The reading scale's base step is 15, so the
   floor cannot be an alias — it has to survive a brand re-pointing the step. */
it("floors the type in an editable control at 16px", () => {
  const typography = core("typography.css");
  const floored = (token: string): boolean => {
    const set = value(typography, token);
    if (set.startsWith("max(1rem,")) return true;
    const alias = /^var\((--mds-[a-z0-9-]+)\)$/.exec(set);
    return alias === null ? false : floored(alias[1]!);
  };
  const controls = [...declares(typography)].filter((token) => token.startsWith("--mds-text-control"));
  expect(controls.length).toBeGreaterThan(0);
  for (const token of controls) expect(floored(token), `${token} is not floored`).toBe(true);
});

/* A manifest that ships only by accident is one an app resolves in the repo and
   not from the package it installed. */
it("ships the manifest to the apps that are held to it", () => {
  const pkg = JSON.parse(at("package.json")) as {
    files: string[];
    exports: Record<string, string>;
  };
  expect(pkg.files).toContain("src");
  expect(pkg.exports["./brand-surface.json"]).toBe("./src/brand-surface.json");
});
