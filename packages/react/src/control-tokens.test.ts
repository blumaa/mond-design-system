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

/* Sized controls read the per-size alias; the two that ship one size read the
   role under its plain name. Both move with --mds-text-control. */
it.each(EDITABLE)("%s sizes its editable element with --mds-text-control", (path) => {
  const css = sheet(path);
  expect(css).toMatch(/font-size: var\(--mds-text-control(-(sm|md|lg))?\)/);
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

/* An avatar's initials are sized by the circle they sit in, not by the reading
 * scale — a brand tuning body copy must not resize every avatar's letters. */
it.each(["Avatar/Avatar.module.css", "AvatarGroup/AvatarGroup.module.css"])(
  "%s sizes initials from the avatar scale",
  (path) => {
    const css = sheet(path);
    for (const size of ["xs", "sm", "md", "lg", "xl"]) {
      expect(css).toContain(`font-size: var(--mds-avatar-text-${size})`);
    }
  },
);

it("sizes a button's label from --mds-text-button-*", () => {
  const css = sheet("Button/Button.module.css");
  for (const size of ["sm", "md", "lg"]) {
    expect(css).toContain(`font-size: var(--mds-text-button-${size})`);
  }
});

/* The reveal toggle draws an SVG at 1em, so its font-size is an icon size. On
 * the type scale it tracked running text and sat a pixel off the chevron and
 * the clear cross, which are the other two glyphs at the end of a field. */
it("sizes the password reveal glyph from the icon scale", () => {
  const css = sheet("PasswordInput/PasswordInput.module.css");
  expect(css).toContain("font-size: var(--mds-icon-sm)");
  expect(css).not.toContain("--mds-text-lg");
});

/* WCAG 2.5.8 measures the target, not the painted box. These three used to
 * meet it with min-height on their root, which is layout the host row pays
 * for: a switch in a settings row made that row 68px tall against the 52px
 * the design draws. The target moved to an out-of-flow pseudo-element. */
it.each([
  ["Switch/Switch.module.css", "track"],
  ["Checkbox/Checkbox.module.css", "box"],
  ["Radio/Radio.module.css", "dot"],
])("%s reaches the tap minimum without costing layout", (path, element) => {
  const css = sheet(path);
  expect(css).not.toMatch(/\.root \{[^}]*min-height/s);
  expect(css).toMatch(
    new RegExp(
      `\\.${element}::before \\{[^}]*position: absolute;[^}]*width: max\\(100%, var\\(--mds-tap-min\\)\\);[^}]*height: max\\(100%, var\\(--mds-tap-min\\)\\);`,
      "s",
    ),
  );
  expect(css).toMatch(new RegExp(`\\.${element} \\{[^}]*position: relative;`, "s"));
});

/* A list row is the target, so it keeps the minimum as real height. */
it("keeps the tap minimum on a List row, which is the target itself", () => {
  expect(sheet("List/List.module.css")).toMatch(/\.row \{[^}]*min-height: var\(--mds-tap-min\)/s);
});

/* Initials are display type. A brand whose display face is a serif wants to
 * see it in an avatar; MDS read the body face and there was no way to say so. */
it("sets avatar initials in the display face", () => {
  expect(sheet("Avatar/Avatar.module.css")).toContain("font-family: var(--mds-font-display)");
});

/* A secondary button's label was --mds-text-primary, so a brand could colour
 * the outline in its accent but not the words inside it. */
it("colours a secondary button's label with --mds-button-secondary-fg", () => {
  const css = sheet("Button/Button.module.css");
  expect(css).toContain("color: var(--mds-button-secondary-fg)");
  expect(css).toMatch(/\.variant-secondary \{(?:(?!\}).)*--mds-button-secondary-fg/s);
});
