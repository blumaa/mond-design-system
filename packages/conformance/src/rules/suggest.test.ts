import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { loadGraph } from "../graph.js";
import { valueIndex, orAdvice } from "./suggest.js";
import { isRung } from "./tokenDiscipline.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const graph = loadGraph({ system: SYSTEM });
const index = valueIndex(graph, "light", (name) => isRung(name, "--mds-"));

describe("what to write instead", () => {
  it("names the token holding a length", () => {
    expect(index.length("4px")).toBe("--mds-space-1");
  });

  it("prefers the alias that names a role over the rung behind it", () => {
    expect(index.length("8px")).toBe("--mds-gap");
  });

  it("prefers a role-named core token over a rung", () => {
    expect(index.length("12px")).toBe("--mds-pad-control-md");
  });

  it("matches a colour through its resolved value, however it was written", () => {
    expect(index.color("#232323")).toBe("--mds-text-primary");
    expect(index.color("rgb(35, 35, 35)")).toBe("--mds-text-primary");
  });

  it("says nothing when no token holds the value", () => {
    expect(index.length("37px")).toBeUndefined();
    expect(index.color("#123456")).toBeUndefined();
    expect(index.color("not a colour")).toBeUndefined();
  });

  it("falls back to the advice when there is no match", () => {
    expect(orAdvice(undefined, "use a spacing token")).toBe("use a spacing token");
    expect(orAdvice("--mds-gap", "use a spacing token")).toBe("var(--mds-gap) has that value");
  });
});
