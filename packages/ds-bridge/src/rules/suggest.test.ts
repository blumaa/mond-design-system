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

/* The property is the half of the question the value cannot answer. Two tokens
   hold 8px; only one of them is what a `gap` means. */
describe("the property the value was written for", () => {
  const claims = (...tokens: string[]) => new Set(tokens);

  it("settles a tie when one of the tokens answers the property", () => {
    const found = suggest(index.lengths("8px"), { advice: "x", claims: claims("--mds-gap") });
    expect(found.confidence).toBe("certain");
    expect(found.autofix).toBe("var(--mds-gap)");
    expect(found.candidates).toEqual(["--mds-gap"]);
  });

  it("names both, and breaks nothing, when two answer it", () => {
    const found = suggest(index.lengths("8px"), {
      advice: "x",
      claims: claims("--mds-gap", "--mds-space-2"),
    });
    expect(found.confidence).toBe("ambiguous");
    expect(found.autofix).toBeUndefined();
    expect(found.candidates).toEqual(["--mds-gap", "--mds-space-2"]);
    expect(found.advice).toContain("--mds-gap");
    expect(found.advice).toContain("--mds-space-2");
  });

  it("stays value-only when no role claims the property", () => {
    const found = suggest(index.lengths("8px"), { advice: "x", claims: claims() });
    expect(found.confidence).toBe("value-only");
    expect(found.candidates).toEqual(["--mds-gap", "--mds-space-2"]);
  });

  /* The reason the whole file exists: a rung is a step on a scale, and writing
     one into a `width` is exactly the guess roles were added to stop — even
     when it is the only token that happens to hold the value. */
  it("will not answer a claimed property with a token that is for something else", () => {
    const found = suggest(["--mds-space-12"], { advice: "x", claims: claims("--mds-avatar-md") });
    expect(found.confidence).toBe("value-only");
    expect(found.autofix).toBeUndefined();
    expect(found.candidates).toEqual(["--mds-space-12"]);
  });

  it("still answers a property the system says nothing about", () => {
    const found = suggest(["--mds-space-12"], { advice: "x", claims: claims() });
    expect(found).toMatchObject({ confidence: "certain", autofix: "var(--mds-space-12)" });
  });

  /* A role claiming the property is not a licence to invent a token that does
     not hold the value: the intersection is the answer, never the union. */
  it("never offers a token that does not hold the value", () => {
    const found = suggest(index.lengths("8px"), { advice: "x", claims: claims("--mds-space-1") });
    expect(found.candidates).not.toContain("--mds-space-1");
    expect(found.confidence).toBe("value-only");
  });
});
