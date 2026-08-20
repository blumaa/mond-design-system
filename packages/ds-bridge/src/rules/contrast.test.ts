import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, loadContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import { keepsContrast } from "./contrast.js";
import type { Contract } from "./types.js";

const SYSTEM = fileURLToPath(new URL("../__fixtures__/system/styles.css", import.meta.url));
const CONTRACT = JSON.parse(
  readFileSync(fileURLToPath(new URL("../__fixtures__/system/contract.json", import.meta.url)), "utf8"),
) as Contract;

const context = (brand?: string, contract: Contract | null = CONTRACT) => {
  const path = brand ? fileURLToPath(new URL(`../__fixtures__/brands/${brand}`, import.meta.url)) : undefined;
  const root = dirname(SYSTEM);
  const graph = loadGraph({ system: SYSTEM, ...(path ? { brand: [path] } : {}) });
  const sheets = path ? [makeSheet(path, readFileSync(path, "utf8"), root, "--mds-", new Set(graph.names()))] : [];
  return buildContext({ root, kind: "app", graph, sheets, ...(contract ? { contract } : {}) });
};

describe("keeps-contrast", () => {
  it("passes the system's own defaults", () => {
    expect(keepsContrast.check(context())).toEqual([]);
  });

  it("passes a brand that keeps the ratio", () => {
    expect(keepsContrast.check(context("good.css"))).toEqual([]);
  });

  it("fails a brand that breaks it, in the theme it breaks in", () => {
    const findings = keepsContrast.check(context("low-contrast.css"));
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.rule === "keeps-contrast")).toBe(true);
    expect(findings.map((f) => f.message)).toContainEqual(
      expect.stringContaining("--mds-text-primary on --mds-surface-page"),
    );
    expect(findings.map((f) => f.message).join(" ")).toContain("the contract requires 4.5:1");
  });

  it("points at the line of the brand declaration it is about", () => {
    const [finding] = keepsContrast.check(context("low-contrast.css"));
    expect(finding).toMatchObject({ file: "../brands/low-contrast.css", line: 2 });
  });

  it("says nothing when the system publishes no contract", () => {
    expect(keepsContrast.check(context("low-contrast.css", null))).toEqual([]);
  });

  it("reads the contract from beside the system's stylesheet", () => {
    const consumer = fileURLToPath(new URL("../__fixtures__/consumer", import.meta.url));
    const loaded = loadContext({ root: consumer, system: SYSTEM });
    expect(loaded.contract?.contrast).toHaveLength(2);
  });
});
