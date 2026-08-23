/* The published semantics, held to the components.
 *
 * `dsbridge/semantics.json` is a promise read by apps that never see this
 * source: it is what `migrate --semantics` compares an app's components
 * against. A promise nothing checks drifts the moment a component changes its
 * role, and drifts silently — the file still parses, the diff still prints, and
 * what it prints is last year's markup. Same relationship contract.json has
 * with the contrast tests.
 *
 * The check runs in both directions for what the source states outright, and
 * one direction for what it does not: a role a component announces only under a
 * condition — `role={error ? "alert" : undefined}` — cannot be read off the
 * source at all, so the manifest is allowed to name roles the source does not.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { withoutComments } from "./jsx.js";
import { announces, loadSemantics, type SemanticsFile } from "./semantics.js";

const COMPONENTS = fileURLToPath(new URL("../../react/src/components", import.meta.url));
const MANIFEST = fileURLToPath(new URL("../../tokens/src/dsbridge/semantics.json", import.meta.url));

const published = loadSemantics(JSON.parse(readFileSync(MANIFEST, "utf8")) as SemanticsFile);

const sourceOf = (name: string) => {
  const file = join(COMPONENTS, name, `${name}.tsx`);
  return existsSync(file) ? withoutComments(readFileSync(file, "utf8")) : undefined;
};

/** Every component the package owns, by name, the way `announces` reads them. */
const owned = new Map(
  readdirSync(COMPONENTS)
    .map((name) => [name, sourceOf(name)] as const)
    .filter((it): it is [string, string] => it[1] !== undefined),
);

/** What each component states, resolved through the one it opens with. */
const stated = [...owned.keys()].map((name) => ({ name, ...announces(name, owned) }));

describe("the published semantics", () => {
  it("names components that exist", () => {
    expect(published.names().filter((name) => sourceOf(name) === undefined)).toEqual([]);
  });

  it("names every component that announces anything", () => {
    const announcing = stated.filter((it) => it.roles !== undefined || it.heading !== undefined);
    expect(announcing.filter((it) => published.of(it.name) === undefined).map((it) => it.name)).toEqual([]);
  });

  it("lists every role a component states outright", () => {
    const missing = stated.flatMap(({ name, roles }) =>
      (roles ?? [])
        .filter((role) => !(published.of(name)?.roles ?? []).includes(role))
        .map((role) => `${name} announces ${role}`),
    );
    expect(missing).toEqual([]);
  });

  it("names the element each title actually renders as", () => {
    const wrong = stated
      .filter(({ name, heading }) => heading !== undefined && published.of(name)?.heading !== heading)
      .map(({ name, heading }) => `${name} renders its title as ${heading}`);
    expect(wrong).toEqual([]);
  });
});
