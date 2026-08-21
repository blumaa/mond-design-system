import { describe, expect, it } from "vitest";
import { usageRules } from "./usage.js";
import { runCheck, skippedRules } from "../commands/check.js";
import type { Component } from "../structure.js";
import type { Context } from "./types.js";

const file = (name: string) => `src/components/${name}.tsx`;
const uses = (name: string) => `import { ${name} } from "@mond-design-system/react";`;

const app = (
  components: Record<string, string>,
  exported: string[] = ["Card", "Sheet", "Icon", "Button", "Tab"],
): Context =>
  ({
    kind: "app",
    components: Object.keys(components).map(
      (name): Component => ({ name, file: file(name), imports: [] }),
    ),
    exported,
    sources: Object.entries(components).map(([name, source]) => ({ file: file(name), source })),
    exempt: () => false,
    ignored: () => false,
  }) as unknown as Context;

const ids = usageRules.map((rule) => rule.id);
const check = (context: Context) => runCheck(context, { only: ids });

describe("what an app has already been given", () => {
  it("passes an app whose components are its own", () => {
    expect(check(app({ EventFeed: "", BottomNav: "" }))).toEqual([]);
  });

  it("names a component the design system already exports", () => {
    const found = check(app({ Icon: "" }));
    expect(found.map((f) => f.rule)).toEqual(["no-duplicate-of-a-system-component"]);
    expect(found[0]!.message).toContain("Icon");
    expect(found[0]!.file).toBe("src/components/Icon.tsx");
  });

  it("names the one Card in a repo whose other Cards build on Card", () => {
    const found = check(
      app({ EventCard: uses("Card"), VenueCard: uses("Card"), NudgeCard: `<div className="card" />` }),
    );
    expect(found.map((f) => f.rule)).toEqual(["wraps-rather-than-reimplements"]);
    expect(found[0]!.file).toBe("src/components/NudgeCard.tsx");
    expect(found[0]!.message).toContain("Card");
  });

  it("says nothing where no sibling builds on it — the app means another word by it", () => {
    expect(check(app({ EventsTab: "", MembersTab: "", ContentTab: "" }))).toEqual([]);
  });

  it("says nothing about a lone component, which has no convention to be outside of", () => {
    expect(check(app({ NudgeCard: "" }))).toEqual([]);
  });

  it("counts an import from anywhere, since the system is not the only place it may come from", () => {
    const local = `import { Card } from "../Card";`;
    expect(check(app({ EventCard: uses("Card"), VenueCard: uses("Card"), NudgeCard: local }))).toEqual([]);
  });

  it("does not read a mention in the body as building on it", () => {
    const found = check(
      app({ EventCard: uses("Card"), VenueCard: uses("Card"), NudgeCard: `/* like a Card */` }),
    );
    expect(found).toHaveLength(1);
  });

  it("takes the whole name first: an exact match is a duplicate, not a wrapper", () => {
    const found = check(app({ EventSheet: "", OtherSheet: uses("Sheet") }, ["Sheet", "EventSheet"]));
    expect(found.map((f) => f.rule)).toEqual(["no-duplicate-of-a-system-component"]);
  });

  it("skips both with a reason when nothing says what the system exports", () => {
    const blind = app({ Icon: "" }, []);
    const skipped = skippedRules(blind, { only: ids });
    for (const id of ids) expect(skipped.get(id)).toContain("components");
    expect(check(blind)).toEqual([]);
  });
});
