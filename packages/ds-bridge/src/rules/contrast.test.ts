import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext, loadContext, makeSheet } from "../context.js";
import { loadGraph } from "../graph.js";
import { keepsContrast, overMediaCarriesItsOwnBacking } from "./contrast.js";
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
    expect(keepsContrast.check!(context())).toEqual([]);
  });

  it("passes a brand that keeps the ratio", () => {
    expect(keepsContrast.check!(context("good.css"))).toEqual([]);
  });

  it("fails a brand that breaks it, in the theme it breaks in", () => {
    const findings = keepsContrast.check!(context("low-contrast.css"));
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.rule === "keeps-contrast")).toBe(true);
    expect(findings.map((f) => f.message)).toContainEqual(
      expect.stringContaining("--mds-text-primary on --mds-surface-page"),
    );
    expect(findings.map((f) => f.message).join(" ")).toContain("the contract requires 4.5:1");
  });

  it("points at the line of the brand declaration it is about", () => {
    const [finding] = keepsContrast.check!(context("low-contrast.css"));
    expect(finding).toMatchObject({ file: "../brands/low-contrast.css", line: 2 });
  });

  it("says nothing when the system publishes no contract", () => {
    expect(keepsContrast.check!(context("low-contrast.css", null))).toEqual([]);
  });

  it("reads the contract from beside the system's stylesheet", () => {
    const consumer = fileURLToPath(new URL("../__fixtures__/consumer", import.meta.url));
    const loaded = loadContext({ root: consumer, system: SYSTEM });
    expect(loaded.contract?.contrast).toHaveLength(2);
  });
});

const ROOT = "/app";
const graph = loadGraph({ system: SYSTEM });

const overMedia = (source: string, file = "src/Player/Player.module.css", config = {}) =>
  overMediaCarriesItsOwnBacking.check!(
    buildContext({
      root: ROOT,
      kind: "system",
      graph,
      sheets: [makeSheet(join(ROOT, file), source, ROOT, "--mds-")],
      config,
    }),
  );

describe("over-media-carries-its-own-backing", () => {
  it("flags an overlay that paints on-media colour and lays nothing down", () => {
    const [finding] = overMedia(
      ".controls {\n  position: absolute;\n  inset-block-end: 0;\n  color: var(--mds-text-on-media);\n}",
    );
    expect(finding).toMatchObject({ rule: "over-media-carries-its-own-backing", line: 4 });
    expect(finding?.message).toContain(".controls");
  });

  it("says it once for an overlay that paints several on-media values", () => {
    expect(
      overMedia(
        ".bar {\n  position: absolute;\n  color: var(--mds-text-on-media);\n  border-color: var(--mds-on-media-border);\n}",
      ),
    ).toHaveLength(1);
  });

  it("accepts an overlay that lays a scrim", () => {
    expect(
      overMedia(
        ".controls {\n  position: absolute;\n  background: var(--mds-scrim);\n  color: var(--mds-text-on-media);\n}",
      ),
    ).toEqual([]);
  });

  it("accepts a scrim painted by the overlay's own pseudo-element", () => {
    expect(
      overMedia(
        ".controls {\n  position: absolute;\n  color: var(--mds-text-on-media);\n}\n" +
          ".controls::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: var(--mds-scrim);\n}",
      ),
    ).toEqual([]);
  });

  it("accepts a backdrop filter as backing", () => {
    expect(
      overMedia(
        ".bar {\n  position: fixed;\n  backdrop-filter: blur(8px);\n  color: var(--mds-text-on-media);\n}",
      ),
    ).toEqual([]);
  });

  /* Text's own tone class is the colour and nothing else. Whoever lays it over a
     picture owes the scrim; the primitive that paints the colour does not. */
  it("leaves an on-media colour that is not laid over anything alone", () => {
    expect(overMedia(".tone-on-media {\n  color: var(--mds-text-on-media);\n}")).toEqual([]);
  });

  it("does not count a background that only arrives on hover", () => {
    expect(
      overMedia(
        ".button {\n  position: absolute;\n  color: var(--mds-text-on-media);\n}\n" +
          ".button:hover {\n  background: var(--mds-on-media-surface-hover);\n}",
      ),
    ).toHaveLength(1);
  });

  it("does not count a background of none", () => {
    expect(
      overMedia(
        ".bar {\n  position: absolute;\n  background: none;\n  color: var(--mds-text-on-media);\n}",
      ),
    ).toHaveLength(1);
  });

  it("honours an exemption on record", () => {
    expect(
      overMedia(
        ".controls {\n  position: absolute;\n  color: var(--mds-text-on-media);\n}",
        "src/Player/Player.module.css",
        { exempt: { "over-media-carries-its-own-backing": ["src/Player/Player.module.css"] } },
      ),
    ).toEqual([]);
  });

  it("is aimed at the system and its apps alike", () => {
    expect(overMediaCarriesItsOwnBacking.target).toBe("both");
  });
});
