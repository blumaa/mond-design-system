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
