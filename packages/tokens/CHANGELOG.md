# @mond-design-system/tokens

## 1.1.0

### Minor Changes

- d3b4fe7: Name every raw scale step a component used to read.

  A component reading `--mds-space-2` is unreachable from a brand file: re-pointing
  the step moves every unrelated component that shares it, so the only safe edit is
  none. Twenty-three stylesheets did this. Each one now reads an alias that names
  the role the step plays — `--mds-pad-control-sm`, `--mds-pad-pill-x`,
  `--mds-badge-size`, `--mds-radius-checkbox` — and every new alias is a
  pass-through of the exact step it replaced, so no rendered value changes.

  `--mds-button-border` splits a secondary button's outline off
  `--mds-control-border`. They were one token, so a brand darkening a text field's
  border to clear 3:1 against the card also darkened every button outline on the
  screen.

  `check:tokens` gains rule 4 and fails on a raw step in a component sheet.

- 1dfb677: Name the role of every text step a component picked on the reader's behalf.

  A button label read `--mds-text-sm`, an avatar's initials read `--mds-text-xs`,
  and a list heading read the same step as an avatar — so a brand tuning body copy
  resized all three. Each now reads an alias that names its role:
  `--mds-text-button-sm|md|lg`, `--mds-text-control-sm|md|lg`,
  `--mds-text-section`, and `--mds-avatar-text-xs…xl`. All are pass-throughs of the
  step they replaced.

  `Link` is untouched: its `size` prop is documented as a step on the core text
  scale, so the consumer names the step and the component passes it through.

  `check:tokens` rule 4 now covers the text scale, with that one sheet exempt.

  The password reveal glyph draws an SVG at `1em`, so its `font-size` was an icon
  size on the type scale. It reads `--mds-icon-sm` now and is 16px rather than
  17px, matching the select chevron and the search clear cross.

## 1.0.0

### Minor Changes

- 925b7cb: Second accent slot, avatar identity tints, and the component APIs they unlock.

  Tokens:

  - `--mds-highlight`, `--mds-highlight-contrast`, `--mds-highlight-hover`,
    `--mds-highlight-soft` — a second semantic accent. The defaults alias the
    accent quartet, so single-accent brands change nothing; two-accent brands
    re-point them.
  - `--mds-avatar-tone-1..5` — five numbered identity tints for avatar initials,
    contrast-gated against `--mds-text-primary` in both themes.
  - `--mds-avatar-xs` (20px) and `--mds-avatar-xl` (96px) core sizes.

  React:

  - Button, Badge, Chip: `highlight` variant/tone. Badge and Chip render it as a
    full highlight fill with contrast text — the promoted marker.
  - Avatar: `xs`/`xl` sizes, `tone` (1–5) identity tints, `decorative` to hide
    repeat avatars from assistive tech.
  - Input: `iconLeft`/`iconRight` decorative icon slots and a standalone
    `invalid` prop (aria-invalid plus danger border outside a Field).
  - Link: `plain` variant (inherits color/weight, underlines on hover), `size`
    on the core text scale, and `type="button"` default when rendered
    `as="button"`.
  - ListItem: `title`/`description` widened to ReactNode, `surface`
    (card/sunken/accent/plain), and standalone rendering — a `<div>` row outside
    a ListGroup, an `<li>` inside.
  - Switch: `loading` (blocks toggling, announces aria-busy) and label-less use
    via a required `aria-label` when `label` is omitted.
  - SegmentedControl: `disabled`.
  - Checkbox: `label` widened to ReactNode.

- e2a44c6: Close the gaps the fairplay migration surfaced.

  React:

  - Screen fills its host's height instead of claiming 100dvh; ScreenContent
    passes main-element attributes, a caller className, and a ref through.
  - ListItem `pressed` renders aria-pressed on the row button.
  - ListGroup takes a `label` for its accessible name.
  - Tabs only claim `aria-controls` over a panel that exists, so a tab strip
    used as a filter (no panels) stays ARIA-valid.
  - SheetHeader close affordance: optional `onClose` + `closeLabel` pair renders
    a close button after the title.
  - ToastProvider `regionLabel`/`dismissLabel` make the built-in strings
    localizable, and each dismiss button is named after its toast.
  - Overlay scrim sizes to `--mds-vvh`, keeping Sheet/Modal/ConfirmDialog above
    the software keyboard where the host mirrors visualViewport.height.
  - DateTimePicker picks up Field wiring (control id, aria-describedby) from
    context, the same way Input/Select/Textarea already did.
  - Every emitted class and keyframe is namespaced (`mds-Sheet__panel`), so the
    stylesheet is collision-proof beside any other library in any cascade order.
    esbuild's local-css loader only produced `Sheet_panel`, and another library
    built the same way silently restyled our components.

  Tokens:

  - Safe-area insets (`--mds-safe-*`).
  - `--mds-vvh` visual-viewport height (default 100dvh).

- 014828f: Give a card's header its own type role.

  `Card`'s header read `--mds-type-subtitle`, which is the role `Heading` levels 3
  and 4 render in. A card header is a slot rather than a heading level, so a brand
  that sized its section headings was also setting the inherited font of every
  card header row — and those rows mostly hold their own `Text`, so what the role
  supplied there was leading, not type. `--mds-type-card-title` names the slot and
  ships as a pass-through of subtitle, so the default look is unchanged.

- f81bfd6: Give brands a seam where one alias served two roles.

  `--mds-type-subtitle` dressed both the title of a screen or overlay and a
  heading inside one; `--mds-type-label` dressed a form label, a list row's title
  and the type inside a chip, tag or segment. Most brands set those at different
  sizes, so re-pointing the alias moved slots the brand never meant to touch.
  `--mds-type-panel-title`, `--mds-type-item-title` and `--mds-type-pill` now name
  those slots, and AppBar, Modal, Sheet, List, Chip, Tag and SegmentedControl read
  them.

  Button's inline padding read `--mds-space-3/4/5` directly, which a brand cannot
  reach — the width of every button on the screen was fixed at the scale. It now
  reads `--mds-pad-button-sm/md/lg`.

  All six aliases ship as pass-throughs of the role they were split from, so the
  default look is unchanged.

### Patch Changes

- First stable release. The alpha line drove a full application migration end to
  end, which is what the prerelease was for: every component the app needed now
  exists, every token role it reached for has a name, and the brand file is the
  only place either of them is re-pointed.

  The public surface is what it was at `1.0.0-alpha.8` — this drops the
  prerelease tag rather than changing anything. Semver applies from here, so a
  breaking change to a component's props or to a semantic token's meaning is a
  major.

- f78cb5f: Two layout gaps the fairplay visual review surfaced:

  - AppBar keeps the trailing slot at the end even without a title to push it
    there (auto start-margin on the trailing slot; a no-op when a title's flex
    share already fills the row).
  - SegmentedControl takes `fullWidth`, stretching the group across its
    container with segments sharing the width equally.
  - `--mds-text-control` sizes text inputs independently of the reading scale
    (default unchanged); Input, Select, Textarea and SearchField read it. iOS
    Safari zooms the page on focusing an input under 16px, so a mobile brand
    re-points this to 1rem without touching body text.
  - `--mds-radius-modal` gives the modal panel the brand-facing radius alias
    every other surface already had.

## 1.0.0-alpha.5

### Minor Changes

- 014828f: Give a card's header its own type role.

  `Card`'s header read `--mds-type-subtitle`, which is the role `Heading` levels 3
  and 4 render in. A card header is a slot rather than a heading level, so a brand
  that sized its section headings was also setting the inherited font of every
  card header row — and those rows mostly hold their own `Text`, so what the role
  supplied there was leading, not type. `--mds-type-card-title` names the slot and
  ships as a pass-through of subtitle, so the default look is unchanged.

## 1.0.0-alpha.4

### Minor Changes

- f81bfd6: Give brands a seam where one alias served two roles.

  `--mds-type-subtitle` dressed both the title of a screen or overlay and a
  heading inside one; `--mds-type-label` dressed a form label, a list row's title
  and the type inside a chip, tag or segment. Most brands set those at different
  sizes, so re-pointing the alias moved slots the brand never meant to touch.
  `--mds-type-panel-title`, `--mds-type-item-title` and `--mds-type-pill` now name
  those slots, and AppBar, Modal, Sheet, List, Chip, Tag and SegmentedControl read
  them.

  Button's inline padding read `--mds-space-3/4/5` directly, which a brand cannot
  reach — the width of every button on the screen was fixed at the scale. It now
  reads `--mds-pad-button-sm/md/lg`.

  All six aliases ship as pass-throughs of the role they were split from, so the
  default look is unchanged.

## 1.0.0-alpha.3

### Patch Changes

- f78cb5f: Two layout gaps the fairplay visual review surfaced:

  - AppBar keeps the trailing slot at the end even without a title to push it
    there (auto start-margin on the trailing slot; a no-op when a title's flex
    share already fills the row).
  - SegmentedControl takes `fullWidth`, stretching the group across its
    container with segments sharing the width equally.
  - `--mds-text-control` sizes text inputs independently of the reading scale
    (default unchanged); Input, Select, Textarea and SearchField read it. iOS
    Safari zooms the page on focusing an input under 16px, so a mobile brand
    re-points this to 1rem without touching body text.
  - `--mds-radius-modal` gives the modal panel the brand-facing radius alias
    every other surface already had.

## 1.0.0-alpha.2

### Minor Changes

- e2a44c6: Close the gaps the fairplay migration surfaced.

  React:

  - Screen fills its host's height instead of claiming 100dvh; ScreenContent
    passes main-element attributes, a caller className, and a ref through.
  - ListItem `pressed` renders aria-pressed on the row button.
  - ListGroup takes a `label` for its accessible name.
  - Tabs only claim `aria-controls` over a panel that exists, so a tab strip
    used as a filter (no panels) stays ARIA-valid.
  - SheetHeader close affordance: optional `onClose` + `closeLabel` pair renders
    a close button after the title.
  - ToastProvider `regionLabel`/`dismissLabel` make the built-in strings
    localizable, and each dismiss button is named after its toast.
  - Overlay scrim sizes to `--mds-vvh`, keeping Sheet/Modal/ConfirmDialog above
    the software keyboard where the host mirrors visualViewport.height.
  - DateTimePicker picks up Field wiring (control id, aria-describedby) from
    context, the same way Input/Select/Textarea already did.
  - Every emitted class and keyframe is namespaced (`mds-Sheet__panel`), so the
    stylesheet is collision-proof beside any other library in any cascade order.
    esbuild's local-css loader only produced `Sheet_panel`, and another library
    built the same way silently restyled our components.

  Tokens:

  - Safe-area insets (`--mds-safe-*`).
  - `--mds-vvh` visual-viewport height (default 100dvh).

## 1.0.0-alpha.1

### Minor Changes

- 925b7cb: Second accent slot, avatar identity tints, and the component APIs they unlock.

  Tokens:

  - `--mds-highlight`, `--mds-highlight-contrast`, `--mds-highlight-hover`,
    `--mds-highlight-soft` — a second semantic accent. The defaults alias the
    accent quartet, so single-accent brands change nothing; two-accent brands
    re-point them.
  - `--mds-avatar-tone-1..5` — five numbered identity tints for avatar initials,
    contrast-gated against `--mds-text-primary` in both themes.
  - `--mds-avatar-xs` (20px) and `--mds-avatar-xl` (96px) core sizes.

  React:

  - Button, Badge, Chip: `highlight` variant/tone. Badge and Chip render it as a
    full highlight fill with contrast text — the promoted marker.
  - Avatar: `xs`/`xl` sizes, `tone` (1–5) identity tints, `decorative` to hide
    repeat avatars from assistive tech.
  - Input: `iconLeft`/`iconRight` decorative icon slots and a standalone
    `invalid` prop (aria-invalid plus danger border outside a Field).
  - Link: `plain` variant (inherits color/weight, underlines on hover), `size`
    on the core text scale, and `type="button"` default when rendered
    `as="button"`.
  - ListItem: `title`/`description` widened to ReactNode, `surface`
    (card/sunken/accent/plain), and standalone rendering — a `<div>` row outside
    a ListGroup, an `<li>` inside.
  - Switch: `loading` (blocks toggling, announces aria-busy) and label-less use
    via a required `aria-label` when `label` is omitted.
  - SegmentedControl: `disabled`.
  - Checkbox: `label` widened to ReactNode.
