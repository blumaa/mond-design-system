import { describe, expect, it } from "vitest";
import { usageRules } from "./usage.js";
import { runCheck, skippedRules } from "../commands/check.js";
import { importsIn, type Component } from "../structure.js";
import type { Context } from "./types.js";

const file = (name: string) => `src/components/${name}.tsx`;
const uses = (name: string) => `import { ${name} } from "@mond-design-system/react";`;

const app = (
  components: Record<string, string>,
  exported: string[] = ["Card", "Sheet", "Icon", "Button", "Tab"],
): Context =>
  ({
    kind: "app",
    components: Object.entries(components).map(
      ([name, source]): Component => ({ name, file: file(name), imports: importsIn(source) }),
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

  it("says nothing about a component that renders the system's export of that name", () => {
    const bound = `import { Icon as SystemIcon } from "@mond-design-system/react";`;
    expect(check(app({ Icon: bound }))).toEqual([]);
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

  it("follows a wrapper the repo owns: a Card reached through one is still a Card", () => {
    const through = `import { RailCard } from "./RailCard";`;
    const found = check(
      app({ EventCard: uses("Card"), VenueCard: uses("Card"), RailCard: uses("Card"), NudgeCard: through }),
    );
    expect(found).toEqual([]);
  });

  it("stops on a cycle rather than following it round", () => {
    const found = check(
      app({
        EventCard: uses("Card"),
        VenueCard: uses("Card"),
        PlaceCard: uses("Card"),
        NudgeCard: `import { LoopCard } from "./LoopCard";`,
        LoopCard: `import { NudgeCard } from "./NudgeCard";`,
      }),
    );
    expect(found.map((f) => f.file).sort()).toEqual([
      "src/components/LoopCard.tsx",
      "src/components/NudgeCard.tsx",
    ]);
  });

  it("skips both with a reason when nothing says what the system exports", () => {
    const blind = app({ Icon: "" }, []);
    const skipped = skippedRules(blind, { only: ids });
    for (const id of ids) expect(skipped.get(id)).toContain("components");
    expect(check(blind)).toEqual([]);
  });
});
