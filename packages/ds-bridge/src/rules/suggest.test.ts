import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { loadGraph } from "../graph.js";
import { valueIndex, orAdvice, suggest } from "./suggest.js";
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

describe("every token that could be meant", () => {
  it("names one when only one holds the value", () => {
    const only = suggest(index.lengths("4px"), { advice: "use a spacing token" });
    expect(only.confidence).toBe("certain");
    expect(only.autofix).toBe("var(--mds-space-1)");
    expect(only.advice).toBe("var(--mds-space-1) has that value");
  });

  it("names them all when more than one does, best first", () => {
    const several = suggest(index.lengths("8px"), { advice: "use a spacing token" });
    expect(several.candidates).toEqual(["--mds-gap", "--mds-space-2"]);
    expect(several.confidence).toBe("value-only");
    expect(several.autofix).toBeUndefined();
    expect(several.advice).toContain("--mds-gap");
    expect(several.advice).toContain("--mds-space-2");
  });

  it("does not assert one of several, which is what made the suggestion wrong", () => {
    expect(suggest(index.lengths("8px"), { advice: "x" }).advice).not.toContain("has that value");
  });

  it("falls back to the advice when nothing holds the value", () => {
    const none = suggest(index.lengths("37px"), { advice: "use a spacing token" });
    expect(none.confidence).toBe("none");
    expect(none.candidates).toEqual([]);
    expect(none.advice).toBe("use a spacing token");
  });

  it("writes the replacement the caller asked for, not always a bare var()", () => {
    const negated = suggest(index.lengths("4px"), { advice: "x", write: (token) => `calc(-1 * var(${token}))` });
    expect(negated.autofix).toBe("calc(-1 * var(--mds-space-1))");
  });

  it("keeps colours and lengths apart, so a length is never answered by a colour", () => {
    expect(index.lengths("#ffffff")).toEqual([]);
    expect(index.colors("#ffffff")).toEqual(["--mds-text-inverse", "--mds-surface-card"]);
  });
});
