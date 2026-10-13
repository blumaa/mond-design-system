/* WCAG 1.4.1: color is never the only tell. Where a state or a link is
 * conveyed by a swap of text color, a drawn mark has to carry it too, or the
 * distinction vanishes for anyone who cannot separate the two colors.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sheet = (path: string) => readFileSync(join(__dirname, "components", path), "utf8");

it("TabBar marks the active item with a drawn indicator, not color alone", () => {
  const css = sheet("TabBar/TabBar.module.css");
  /* The indicator inherits the active color via currentColor, so the two cues
     cannot drift apart. */
  expect(css).toMatch(/\.active::before\s*\{[^}]*background:\s*currentColor/);
});

/* A loading pulse between two near-identical surfaces reads as a dark square
   in a dark theme. Its ends are a contract pair, so every brand is held to a
   visible step between them. */
it("MediaPlaceholder pulses between two colours the contrast contract keeps apart", () => {
  const css = sheet("MediaPlaceholder/MediaPlaceholder.module.css");
  const contract = JSON.parse(
    readFileSync(join(__dirname, "../../tokens/src/contrast-contract.json"), "utf8"),
  ) as { contrast: Array<{ fg: string; bg: string[] }> };
  const [, from, to] =
    /@keyframes media-pulse\s*\{\s*from\s*\{[^}]*var\((--[\w-]+)\)[^}]*\}\s*to\s*\{[^}]*var\((--[\w-]+)\)/.exec(css) ?? [];

  expect(contract.contrast.some(({ fg, bg }) => fg === to && from !== undefined && bg.includes(from))).toBe(true);
});
