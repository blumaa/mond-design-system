import { describe, expect, it } from "vitest";
import { makeSheet } from "./context.js";

const sheet = (source: string, system: string[] = []) =>
  makeSheet("/app/src/x.module.css", source, "/app", "--mds-", new Set(system));

describe("brand or component", () => {
  it("a sheet declaring a token on itself is a component's", () => {
    expect(sheet(".button { --mds-icon-slot: 1em; }").isBrand).toBe(false);
  });

  it("a sheet declaring one at the document root is a brand file", () => {
    expect(sheet(":root { --mds-accent: #f60; }").isBrand).toBe(true);
    expect(sheet('[data-theme="dark"] { --mds-accent: #f93; }').isBrand).toBe(true);
    expect(sheet("html, body { --mds-accent: #f60; }").isBrand).toBe(true);
  });

  it("re-pointing a contract token is a brand file wherever it is written", () => {
    expect(sheet(".theme-warm { --mds-surface-page: #fff; }", ["--mds-surface-page"]).isBrand).toBe(true);
  });

  it("a file that declares the app's own scale is a value source, not a component's", () => {
    const s = sheet(":root { --fp-space-2: 8px; }");
    expect(s.isTokens).toBe(true);
    expect(s.isBrand).toBe(false);
  });

  it("a sheet that only reads tokens is a component's", () => {
    const s = sheet(".card { color: var(--mds-text-primary); }");
    expect(s.isBrand).toBe(false);
    expect(s.isTokens).toBe(false);
  });

  it("records what it declares and keeps line numbers through comments", () => {
    const s = sheet("/* a\n   comment */\n.button { --mds-icon-slot: 1em; }");
    expect([...s.declares]).toEqual(["--mds-icon-slot"]);
    expect(s.lines).toHaveLength(3);
    expect(s.file).toBe("src/x.module.css");
  });
});
