import { describe, expect, it } from "vitest";
import { loadChoosing, type ChoosingFile } from "../choosing.js";
import { choosingData, renderChoosing } from "./choosing.js";

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
    { default: "Tag", use: "a passive label", instead: [{ when: "it is pressable", prefer: "Chip" }] },
  ],
  deprecated: [{ component: "Button", prop: "kind", use: "variant", why: "two names for one prop" }],
};

const CHOOSING = loadChoosing(FILE);
const COMPONENTS = ["Sheet", "Modal", "ConfirmDialog", "Tag", "Chip", "Button", "Divider"];
const plain = { color: false };

describe("renderChoosing", () => {
  it("puts the default first and the exceptions under it, each with its case", () => {
    const out = renderChoosing(CHOOSING, COMPONENTS, plain);
    expect(out).toContain("Sheet");
    expect(out).toContain("a transient panel on a phone");
    expect(out).toContain("Modal");
    expect(out).toContain("the viewport is md or wider");
    expect(out.indexOf("Sheet")).toBeLessThan(out.indexOf("Modal"));
  });

  it("counts the components a choice covers against the ones there are", () => {
    expect(renderChoosing(CHOOSING, COMPONENTS, plain)).toContain("5 of 7 components");
  });

  it("prints only the choices that name a component, when asked for one", () => {
    const out = renderChoosing(CHOOSING, COMPONENTS, { ...plain, component: "Modal" });
    expect(out).toContain("the viewport is md or wider");
    expect(out).not.toContain("a passive label");
  });

  it("says so rather than printing nothing for a component no choice names", () => {
    expect(renderChoosing(CHOOSING, COMPONENTS, { ...plain, component: "Divider" })).toMatch(
      /Divider.*no choice|no choice.*Divider/s,
    );
  });

  it("prints a deprecation with what to write instead", () => {
    const out = renderChoosing(CHOOSING, COMPONENTS, plain);
    expect(out).toContain("Button kind");
    expect(out).toContain("variant");
  });

  /* Silence from a system that declared nothing reads exactly like a system
     whose components nobody confuses. */
  it("says the system published nothing rather than printing an empty list", () => {
    expect(renderChoosing(loadChoosing(undefined), COMPONENTS, plain)).toContain("publishes no choosing.json");
  });

  it("hands the same thing to a consumer as JSON", () => {
    const data = choosingData(CHOOSING, COMPONENTS);
    expect(data.declared).toBe(true);
    expect(data.clusters[0]?.members).toEqual(["Sheet", "Modal", "ConfirmDialog"]);
    expect(data.covered).toBe(5);
    expect(data.unknown).toEqual([]);
  });
});
