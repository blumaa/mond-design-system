/* Which element reads which alias. Both aliases exist so a brand can move one
 * role without dragging the rest of the scale along, and that only holds if
 * the alias is wired to the element the role names — the editable control, the
 * modal panel — and to nothing else.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sheet = (path: string) => readFileSync(join(__dirname, "components", path), "utf8");
const internalSheet = (path: string) => readFileSync(join(__dirname, "internal", path), "utf8");

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
  expect(css).not.toContain("var(--mds-radius-7)");
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
it("sizes Avatar initials from the avatar scale", () => {
  const css = sheet("Avatar/Avatar.module.css");
  for (const size of ["xs", "sm", "md", "lg", "xl"]) {
    expect(css).toContain(`font-size: var(--mds-avatar-text-${size})`);
  }
});

/* The only type AvatarGroup sets is the overflow count — the avatars beside it
 * size themselves — and a count is two or three characters where initials are
 * one or two, so it cannot ride the initials ratio. */
it("sizes the AvatarGroup overflow count from the count ratio", () => {
  const css = sheet("AvatarGroup/AvatarGroup.module.css");
  expect(css).not.toContain("--mds-avatar-text-");
  for (const size of ["xs", "sm", "md", "lg", "xl"]) {
    expect(css).toContain(`calc(var(--mds-avatar-${size}) * var(--mds-avatar-count-ratio))`);
  }
});

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

/* WCAG 2.5.8 measures the target, not the painted box. These used to meet it
 * with min-height on their root, which is layout the host row pays for: a
 * switch in a settings row made that row 68px tall against the 52px the design
 * draws. The target is an out-of-flow pseudo-element instead, written once. */
it("grows the target without taking the layout, in one place", () => {
  expect(internalSheet("hit-area.module.css")).toMatch(
    /\.hitArea::before \{[^}]*position: absolute;[^}]*width: max\(100%, var\(--mds-tap-min\)\);[^}]*height: max\(100%, var\(--mds-tap-min\)\);/s,
  );
});

it.each([
  ["Switch/Switch.module.css", "track"],
  ["Checkbox/Checkbox.module.css", "box"],
  ["Radio/Radio.module.css", "dot"],
  ["Tag/Tag.module.css", "remove"],
  ["Toast/Toast.module.css", "close"],
  ["SearchField/SearchField.module.css", "clear"],
])("%s composes that target onto its %s", (path, element) => {
  const css = sheet(path);
  expect(css).not.toMatch(/\.root \{[^}]*min-height/s);
  expect(css).toMatch(
    new RegExp(
      `\\.${element} \\{[^}]*composes: hitArea from "\\.\\./\\.\\./internal/hit-area\\.module\\.css";`,
      "s",
    ),
  );
  /* The composing class supplies the containing block. The shared rule cannot:
     one of these is `absolute`, and a composed declaration would overwrite it. */
  expect(css).toMatch(new RegExp(`\\.${element} \\{[^}]*position: (relative|absolute);`, "s"));
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

/* A control that offers an icon slot decides how big the glyph in it is. The
   caller passes a node from an icon set the system has never heard of, so the
   only thing that can hold the size steady is the control: the slot is a fixed
   box on the icon scale, and the step is published as --mds-icon-slot for a set
   that can only size itself from the inside (a ligature font reading font-size
   rather than width). Nothing else in a button may change with `loading`, so
   the spinner reads the same step. */
it.each([
  ["Button/Button.module.css", ["sm", "md", "lg"]],
  ["Input/Input.module.css", ["md"]],
  ["CountButton/CountButton.module.css", ["md"]],
])("%s publishes --mds-icon-slot and sizes the slot from it", (path, steps) => {
  const css = sheet(path);
  for (const step of steps) expect(css).toContain(`--mds-icon-slot: var(--mds-icon-${step})`);
  expect(css).toMatch(/width: var\(--mds-icon-slot\)/);
  expect(css).toMatch(/height: var\(--mds-icon-slot\)/);
  expect(css).toMatch(/font-size: var\(--mds-icon-slot\)/);
});

it("sizes a chip's glyph to its label, not to the icon scale", () => {
  /* A pill is barely taller than its type — 16px is over the whole line box —
     so the chip is the one control whose slot is not a step on the scale. */
  const css = sheet("Chip/Chip.module.css");
  expect(css).toContain("--mds-icon-slot: 1em");
  expect(css).not.toMatch(/--mds-icon-slot: var\(--mds-icon-/);
});

it("spins a busy button at the step its glyph occupies", () => {
  const tsx = readFileSync(join(__dirname, "components/Button/Button.tsx"), "utf8");
  const map = /ICON_PX: Record<ButtonSize, number> = \{ sm: (\d+), md: (\d+), lg: (\d+) \}/.exec(tsx);
  if (map === null) throw new Error("Button no longer states a numeric step per size");
  const layout = readFileSync(
    join(__dirname, "../../tokens/src/core/layout.css"),
    "utf8",
  );
  const px = (name: string) => {
    const found = new RegExp(`--mds-icon-${name}:\\s*(\\d+)px`).exec(layout);
    if (found === null) throw new Error(`--mds-icon-${name} is not declared in px`);
    return found[1];
  };
  expect([map[1], map[2], map[3]]).toEqual([px("sm"), px("md"), px("lg")]);

  /* Same trade in a count button: the spinner takes the glyph's place, so the
     row of them must not reflow the moment one is tapped. */
  const count = readFileSync(join(__dirname, "components/CountButton/CountButton.tsx"), "utf8");
  const spinner = /SPINNER_PX = (\d+)/.exec(count);
  if (spinner === null) throw new Error("CountButton no longer states a numeric spinner step");
  expect(spinner[1]).toBe(px("md"));
});

const token = (file: string) =>
  readFileSync(join(__dirname, "../../tokens/src", file), "utf8");

/* The bar is the one place where a glyph is bigger than the type beside it and
   the type is smaller than any reading step, so both are its own: borrowing
   the icon scale's md step and the meta role shrank the glyph, grew the label
   and left the surplus as empty bar. */
it("sizes the tab bar's glyph and label from the bar's own roles", () => {
  const css = sheet("TabBar/TabBar.module.css");
  expect(css).toContain("--mds-icon-slot: var(--mds-tabbar-icon)");
  expect(css).toContain("font: var(--mds-type-tab)");
  expect(css).not.toContain("var(--mds-type-meta)");
  expect(token("core/layout.css")).toMatch(/--mds-tabbar-icon:\s*\d+px/);
  expect(token("core/typography.css")).toContain("--mds-type-tab:");
});

/* Both the height and the padding carry the home-bar inset. With border-box the
   inset would otherwise be taken out of the bar's height, leaving the items to
   stand in whatever was left. */
it("adds the home-bar inset to the tab bar rather than spending its height on it", () => {
  const css = sheet("TabBar/TabBar.module.css");
  expect(css).toContain("height: calc(var(--mds-tabbar-h) + var(--mds-safe-bottom))");
  expect(css).toContain("calc(var(--mds-tabbar-seat) + var(--mds-safe-bottom))");
});

/* The action breaks the bar's top edge on a negative margin, and the bar is a
   plain positioned box so that nothing has to be painted around it. Reserving
   the lift as transparent padding and moving the surface to a ::before behind a
   z-index of -1 put the action's top on the far side of a paint boundary, and a
   sticky bar is a layer of its own for that boundary to be enforced against.
   Neither is needed: the bar is the last item of a column with a resolved
   height, so it is already where sticky would put it. */
it("raises the action out of a bar that is one plain box", () => {
  const css = sheet("TabBar/TabBar.module.css");
  expect(css).toMatch(/\.action\s*\{[^}]*margin-top: calc\(-1 \* var\(--mds-tabbar-action-lift\)\)/);
  expect(css).toMatch(/\.bar\s*\{[^}]*position: relative/);
  expect(css).not.toContain("position: sticky");
  expect(css).not.toContain("::before");
});

/* Chrome is not the page. The bar sits over the scrolling body, so it paints the
   step above it — the same one a Card rests on. --mds-surface-page is the colour
   of the body itself: a percent off the card in the default theme, and the same
   colour on a brand that separates them, which leaves the bar a border line
   across a flat field. */
it("paints the tab bar on the step above the page", () => {
  const css = sheet("TabBar/TabBar.module.css");
  expect(css).toMatch(/\.bar\s*\{[^}]*background: var\(--mds-surface-card\)/);
  expect(css).not.toContain("--mds-surface-page");
});

/* The floating action is the only element that stands clear of the chrome it
   belongs to, so it is the only one on the top resting step. Sharing
   --mds-elevation-raised with a Card gave a button hovering over the bar the
   same weight as a card lying on the page. */
it("floats the tab bar action above the surfaces that rest", () => {
  expect(sheet("TabBar/TabBar.module.css")).toContain("box-shadow: var(--mds-elevation-floating)");
  const elevation = readFileSync(
    join(__dirname, "../../tokens/src/core/elevation.css"),
    "utf8",
  );
  expect(elevation).toContain("--mds-elevation-floating:");
  for (const path of ["Card/Card.module.css", "SegmentedControl/SegmentedControl.module.css"]) {
    expect(sheet(path)).not.toContain("--mds-elevation-floating");
  }
});

/* An overlay unmounts on a timer, so the number in JS has to be the duration
   the CSS actually uses. A sheet slides its own height on the slow clock while
   a modal fades on the base one; unmounting both on the base clock cut 120ms
   off the end of every sheet's exit. */
it("unmounts each overlay on the clock its own transition runs on", () => {
  const overlay = readFileSync(join(__dirname, "internal/Overlay.tsx"), "utf8");
  const ms = (name: string) => {
    const found = new RegExp(`${name} = (\\d+)`).exec(overlay);
    if (found === null) throw new Error(`Overlay no longer states ${name}`);
    return `${found[1]}ms`;
  };
  const dur = (name: string) => {
    const found = new RegExp(`--mds-dur-${name}:\\s*(\\d+ms)`).exec(token("core/motion.css"));
    if (found === null) throw new Error(`motion.css no longer states --mds-dur-${name}`);
    return found[1];
  };
  expect(ms("OVERLAY_EXIT_MS")).toBe(dur("base"));
  expect(ms("SHEET_EXIT_MS")).toBe(dur("slow"));
  expect(sheet("Sheet/Sheet.module.css")).toContain("transition: var(--mds-transition-sheet)");
  expect(token("core/motion.css")).toContain("--mds-transition-sheet: var(--mds-dur-slow)");
});

/* A sheet is portalled to <body>, so nothing in the app tree constrains it —
   on a desktop viewport it spanned the whole window while the app it belongs
   to sat in a phone-width column. */
it("holds a sheet to the app column and centres it", () => {
  expect(sheet("Sheet/Sheet.module.css")).toContain("max-width: var(--mds-frame-width)");
  expect(internalSheet("Overlay.module.css")).toMatch(
    /\.variant-sheet \{(?:(?!\}).)*justify-content: center/s,
  );
  /* Uncapped by default and capped only above --mds-bp-md: a large phone
     reports a viewport wider than the framed measure (462px is real
     hardware), and a cap there strips the app's own edges. */
  expect(token("core/layout.css")).toMatch(/--mds-frame-width:\s*100%/);
  expect(token("core/layout.css")).toMatch(
    /@media \(min-width: 600px\)\s*\{\s*:root\s*\{\s*--mds-frame-width:\s*\d+px/,
  );
});

/* An icon with no size stated takes the slot it sits in, so a control that
   publishes --mds-icon-slot reaches the system's own Icon too — not only an
   app icon set that opted into reading the fallback chain. */
it("sizes an unstated Icon from the slot around it", () => {
  expect(sheet("Icon/Icon.module.css")).toContain(
    "width: var(--mds-icon-slot, var(--mds-icon-md))",
  );
});
