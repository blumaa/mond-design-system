/* Which element reads which type role. Three roles ship as pass-throughs of a
 * broader one, so the default look is unchanged and a brand can still move a
 * screen title without moving a card's heading, or a chip's type without moving
 * a form label. That only holds while each slot reads the narrower alias.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sheet = (path: string) => readFileSync(join(__dirname, "components", path), "utf8");

/* A title that names the whole screen or overlay, as opposed to a heading
   inside one. */
const PANELS = ["AppBar/AppBar.module.css", "Modal/Modal.module.css", "Sheet/Sheet.module.css"];

/* Type set inside a small enclosed shape, where the line box is the height of
   the shape itself. */
const PILLS = [
  "Chip/Chip.module.css",
  "Tag/Tag.module.css",
  "SegmentedControl/SegmentedControl.module.css",
];

it.each(PANELS)("%s titles the panel with --mds-type-panel-title", (path) => {
  const css = sheet(path);
  expect(css).toContain("font: var(--mds-type-panel-title)");
  expect(css).not.toContain("var(--mds-type-subtitle)");
});

it.each(PILLS)("%s sets its face in --mds-type-pill", (path) => {
  const css = sheet(path);
  expect(css).toContain("font: var(--mds-type-pill)");
  expect(css).not.toContain("var(--mds-type-label)");
});

it("titles a list row with --mds-type-item-title", () => {
  const css = sheet("List/List.module.css");
  expect(css).toContain("font: var(--mds-type-item-title)");
  expect(css).not.toContain("var(--mds-type-label)");
});

it("keeps a card's own heading on the subtitle role", () => {
  expect(sheet("Card/Card.module.css")).toContain("font: var(--mds-type-subtitle)");
});

it("pads a button from --mds-pad-button-*", () => {
  const css = sheet("Button/Button.module.css");
  for (const size of ["sm", "md", "lg"]) {
    expect(css).toContain(`padding: 0 var(--mds-pad-button-${size})`);
  }
  expect(css).not.toMatch(/padding: 0 var\(--mds-space-\d\)/);
});
