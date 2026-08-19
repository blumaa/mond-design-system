/* Which element reads which alias. Both aliases exist so a brand can move one
 * role without dragging the rest of the scale along, and that only holds if
 * the alias is wired to the element the role names — the editable control, the
 * modal panel — and to nothing else.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sheet = (path: string) => readFileSync(join(__dirname, "components", path), "utf8");

/* Every component that styles its own editable element. PasswordInput and
   DateTimePicker are absent on purpose — see below. */
const EDITABLE = [
  "Input/Input.module.css",
  "Select/Select.module.css",
  "Textarea/Textarea.module.css",
  "SearchField/SearchField.module.css",
];

it.each(EDITABLE)("%s sizes its editable element with --mds-text-control", (path) => {
  const css = sheet(path);
  expect(css).toContain("font-size: var(--mds-text-control)");
  expect(css).not.toContain("font-size: var(--mds-text-base)");
});

it("leaves composed fields to the control they wrap", () => {
  /* PasswordInput renders an Input and DateTimePicker's trigger is a button
     opening a sheet of Selects. Neither owns a text-entry element, so neither
     may re-declare the control size — the reveal toggle's glyph and the
     trigger label are adornments and keep their own sizes. */
  expect(sheet("PasswordInput/PasswordInput.module.css")).not.toContain("--mds-text-control");
  expect(sheet("DateTimePicker/DateTimePicker.module.css")).not.toContain("--mds-text-control");
});

it("shapes the Modal panel with --mds-radius-modal", () => {
  const css = sheet("Modal/Modal.module.css");
  expect(css).toContain("border-radius: var(--mds-radius-modal)");
  expect(css).not.toContain("var(--mds-radius-3)");
});

/* A secondary button's outline and a text field's border were one token, so a
 * brand darkening the field border to clear 3:1 against the card also darkened
 * every button outline on the screen. */
it("outlines a secondary button with --mds-button-border", () => {
  const css = sheet("Button/Button.module.css");
  expect(css).toContain("border-color: var(--mds-button-border)");
  expect(css).not.toContain("--mds-control-border");
});

it.each(["Input/Input.module.css", "Select/Select.module.css", "Textarea/Textarea.module.css"])(
  "%s keeps its own border on --mds-control-border",
  (path) => {
    expect(sheet(path)).toContain("var(--mds-control-border)");
  },
);
