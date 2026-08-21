/* Choosing is the one declaration that holds something no code can: which of
   three components that all compile is the one this case wants. */
import { describe, expect, it } from "vitest";
import { loadChoosing, members, type ChoosingFile } from "./choosing.js";

const FILE: ChoosingFile = {
  version: 1,
  clusters: [
    {
      default: "Sheet",
      use: "a transient panel on a phone",
      instead: [
        { when: "the viewport is md or wider", prefer: "Modal" },
        { when: "confirming something destructive", prefer: "ConfirmDialog" },
      ],
    },
    { default: "Tag", use: "a label the reader cannot press", instead: [{ when: "it is pressable", prefer: "Chip" }] },
  ],
  deprecated: [{ component: "Button", prop: "kind", use: "variant", why: "two names for one prop" }],
};

describe("loadChoosing", () => {
  const choosing = loadChoosing(FILE);

  /* The cluster is the default plus everything the exceptions prefer. Writing
     it out as well would be a second copy of the same list, free to drift. */
  it("reads the choice off the entry rather than being told it twice", () => {
    expect(members(FILE.clusters[0]!)).toEqual(["Sheet", "Modal", "ConfirmDialog"]);
  });

  it("answers with the cluster a component is in, wherever it sits in it", () => {
    expect(choosing.for("Sheet")[0]?.default).toBe("Sheet");
    expect(choosing.for("ConfirmDialog")[0]?.default).toBe("Sheet");
  });

  it("has nothing to say about a component in no cluster", () => {
    expect(choosing.for("Divider")).toEqual([]);
  });

  it("holds the deprecations, filtered to one component when asked", () => {
    expect(choosing.deprecations()).toHaveLength(1);
    expect(choosing.deprecations("Button")[0]?.use).toBe("variant");
    expect(choosing.deprecations("Card")).toEqual([]);
  });

  /* A cluster naming a component that does not exist is intent that silently
     answers nothing — the typo compiles, and the guidance never fires. */
  it("names what it mentions and the system does not have", () => {
    expect(choosing.unknown(["Sheet", "Modal", "ConfirmDialog", "Chip", "Tag", "Button"])).toEqual([]);
    expect(choosing.unknown(["Sheet", "Modal", "Chip", "Tag"]).sort()).toEqual(["Button", "ConfirmDialog"]);
  });

  it("is empty, and says so, when the system published nothing", () => {
    const none = loadChoosing(undefined);
    expect(none.declared).toBe(false);
    expect(none.clusters()).toEqual([]);
    expect(none.for("Sheet")).toEqual([]);
    expect(none.unknown(["Sheet"])).toEqual([]);
  });

  it("refuses a schema it does not read", () => {
    expect(() => loadChoosing({ ...FILE, version: 2 })).toThrow(/version 2/);
  });

  /* Preferring the default under some condition says the default is not the
     default. It reads as guidance and answers nothing. */
  it("refuses an exception that prefers the thing it is an exception to", () => {
    const wrong: ChoosingFile = {
      version: 1,
      clusters: [{ default: "Tag", use: "x", instead: [{ when: "always", prefer: "Tag" }] }],
    };
    expect(() => loadChoosing(wrong)).toThrow(/Tag/);
  });
});
