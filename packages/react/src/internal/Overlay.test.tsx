// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import sheet from "./Overlay.module.css?raw";

// jsdom computes no real styles, so the stylesheet is the fixture — the same
// technique Screen.test.tsx uses for its host-height contract.
describe("Overlay scrim", () => {
  // On iOS the software keyboard shrinks the visual viewport without shrinking
  // 100dvh, so a scrim anchored to `inset: 0` alone puts a sheet's footer
  // underneath the keyboard. The host mirrors visualViewport.height into
  // --mds-vvh (the same contract Screen documents); the fallback keeps a
  // non-opted host at the full dynamic viewport.
  it("sizes to the visual viewport where the host mirrors it", () => {
    const scrim = sheet.match(/\.scrim\s*\{[^}]*\}/)?.[0];
    expect(scrim).toBeDefined();
    expect(scrim).toContain("height: var(--mds-vvh)");
  });
});
