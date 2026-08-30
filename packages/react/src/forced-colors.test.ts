/* Windows High Contrast (forced-colors) strips author backgrounds and
 * box-shadows, so any control whose state is painted with a background swap
 * goes blank there: the radio's dot, the switch's knob, the chosen segment.
 * Each of these sheets must restate its states in system colors, which
 * forced-colors honors.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sheet = (path: string) => readFileSync(join(__dirname, "components", path), "utf8");

/* Every sheet that paints a selected state with background-color. */
const STATE_PAINTERS = [
  "Radio/Radio.module.css",
  "Checkbox/Checkbox.module.css",
  "Switch/Switch.module.css",
  "SegmentedControl/SegmentedControl.module.css",
  "TabBar/TabBar.module.css",
];

it.each(STATE_PAINTERS)("%s restates its selected state under forced colors", (path) => {
  const css = sheet(path);
  expect(css).toMatch(/@media \(forced-colors: active\)/);
  /* SelectedItem is the system color for a chosen thing — the state must be
     drawn in the palette the mode enforces, not merely re-declared. */
  expect(css).toContain("SelectedItem");
});
