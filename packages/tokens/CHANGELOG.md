# @mond-design-system/tokens

## 3.6.1

### Patch Changes

- 9c01984: A link now carries the cursor its role implies. WebKit leaves `a[href]` at the
  default arrow where Chromium shows a pointer, so the base stylesheet states it
  rather than leaving a browser to decide: every anchor the system styles points,
  including the ones a button component renders.

  The package also publishes `dsbridge/semantics.json` — what each component
  announces, roles and title level, for `dsbridge migrate --semantics` to compare
  an app's own components against before a swap.

## 3.6.0

### Minor Changes

- Add `Scroller`: a titled row that scrolls sideways — featured posts, a shelf of covers. The row scrolls with the finger; the arrows do the same for a pointer or a key and shut themselves at each end, and the title names the scrolling group so a screen reader arrives at a row that says what it holds. `action` hangs a link to the rest beside the title.

  `dsbridge choosing Scroller` now answers, sending pictures looked at one at a time to `ImageCarousel`, a row that should be wholly in view to `Stack`, and a row of filters to `ChipBar`.

## 3.5.0

### Minor Changes

- Add `--mds-indent-thread`, how far a reply steps in from the comment it answers, and the `indent` role that claims it. The system ships no comment thread, so the app draws one; without a token for the step it would have to invent the geometry itself, which is the one thing an app must not do.

## 3.4.0

### Minor Changes

- Add `FileDrop`: the place a file is handed over, which the system was missing beside `UploadProgress`. Press it for the picker or drop a file on it; it takes `accept` and `multiple` through to the input, cuts a multi-file drop to one when it was told to take one, marks itself while a file is over it, and hides the input the browser needs behind the button a person sees. Tokens gain `--mds-pad-drop-y`, the block padding that makes a drop zone a target for a dragged file rather than a row to press.

## 3.3.1

### Patch Changes

- Name `SideNav` in the choosing data, beside `TabBar`: dsbridge can now answer which of the two an app's primary navigation wants.

## 3.3.0

### Minor Changes

- 3fde8db: Add the `--mds-type-code` type role: mono, one step above prose. A run a reader has to copy character by character — a one-time password, a key, an identifier — reads differently from a sentence, and until now an app had no role to ask for it and had to reach for a raw scale step.

## 3.2.0

### Minor Changes

- 49e71ce: `ImageCarousel`: a gallery of frames, one on show, paged by control, arrow key,
  swipe or thumbnail. `pager` chooses thumbnails, dots or nothing; past
  `maxThumbnails` the rest collapse into one button that pages to the first frame
  no thumbnail stands for.

  A frame carries its own `covered` and `cover`, so a gallery can hold one
  sensitive picture among ordinary ones. A covered frame does not open larger,
  however it is tapped.

  `onZoom` pairs at the type level with `zoomIcon` and `zoomLabel`: the glyph is
  the app's and the words are the app's, and a zoom control with neither is a
  control nobody can use. A tap under the swipe threshold opens the frame; a
  longer drag pages it.

  Every word it says is a prop, including the two a screen reader reads in place
  of "region" and "group" — `labels.carouselRole` and `labels.slideRole`.

  New tokens: `--mds-media-inset` (how far a control on a picture stands off its
  edge).

- bb3ecce: `UploadProgress`: one file on its way up — a thumbnail, its name, how far it
  has got, and the way out. It composes `ProgressBar` rather than drawing a
  second bar, and the bar stops counting while the server processes, which
  reports no percentage.

  `ProgressBar` takes `valueText`: the progress in the caller's words ("2.1 MB of
  5 MB"), read out instead of a percentage that is not always what the number
  means.

  The status glyph comes in through `mark`, from the app's icon set, and the
  system tints it by the state it is standing for. New token
  `--mds-upload-thumb`.

- 1c321ce: Two components an app that shows other people's things needs: `Breadcrumb` and
  `MediaPlaceholder`.

  `Breadcrumb` renders a labelled `nav` around an ordered list. The last step
  never links, wherever it points, and carries `aria-current="page"`; a step with
  no `href` renders as text wherever it sits. `linkAs` takes a router's link. An
  empty trail renders nothing rather than an empty landmark.

  `MediaPlaceholder` is the box a picture goes in, whether or not there is one
  yet. Without a `src`, or after one fails to load, it draws a hatched surface
  carrying a `glyph` slot and a caption; with one, the picture fills the box and
  the caption moves onto a scrim over it. `blurred` obscures the media far enough
  that a photo reads as shape and colour only. What asks for consent belongs to
  the app, so it comes in through `cover` — a node drawn over the surface and
  outside the blur, so the prompt stays readable while what it covers does not.

  The broken-image state keys off the source rather than a flag, so handing the
  component a different picture tries again instead of leaving the box empty for
  as long as it stays mounted.

  New tokens: `--mds-blur-media` (how far a covered picture is blurred) and
  `--mds-media-hatch` (the pitch of the hatch on an empty media surface).

## 3.1.1

### Patch Changes

- e93eba6: Stop `--mds-frame-width` capping the app column on a phone.

  The token's contract is that a phone-shaped app is full-bleed on a phone and framed on a desktop viewport, but it only ever framed: `430px` was declared unconditionally at `:root`. A phone whose CSS viewport is wider than the framed measure — 462px is real hardware — got the desktop treatment, leaving a strip of the sunken surface down each edge of the app.

  The measure is now uncapped by default and set to `430px` only above `--mds-bp-md`. Consumers reading the token as a `max-width` (`Sheet`, and an app's own frame element) need no change.

## 3.1.0

### Minor Changes

- b90d8c8: Paint the tab bar on the step above the page, and give its action a step of its own.

  `TabBar` filled its surface with `--mds-surface-page`, the colour of the body
  scrolling underneath it. In the default theme page and card are a percent apart
  so it looked right; on a brand that separates them the bar disappeared into the
  page, leaving a 1px border across a flat field and a raised action that read as
  a shape cut in half rather than a button standing on a bar. It now paints
  `--mds-surface-card`, and the badge ring follows it.

  Adds `--mds-elevation-floating` for something that stands clear of the chrome it
  belongs to. The tab bar's action was on `--mds-elevation-raised`, the same step
  as a `Card` lying on the page, so nothing but its colour said it was above the
  bar.

## 3.0.0

### Major Changes

- e77cb44: **A tab bar owns the size of its glyph and its caption.**

  `TabBar` took its glyph from the generic `md` step on the icon scale and its
  label from the `meta` text role. Both are wrong for a tab: the glyph is read as
  a picture and stands above the icon scale, the caption below the reading scale.
  The bar kept its 66px while its contents shrank to 35, and the surplus showed
  as empty bar.

  New tokens: `--mds-tabbar-icon`, `--mds-tabbar-pad-x`, `--mds-tabbar-seat`,
  `--mds-text-2xs`, `--mds-type-tab`.

  **An `Icon` with no size stated takes the slot around it.**

  `Icon` defaulted to the `md` step, so a control publishing `--mds-icon-slot`
  could size an app's own icon set but never the system's own `Icon`. Left
  unset, the size now resolves to `var(--mds-icon-slot, var(--mds-icon-md))` —
  the slot's step inside a control, the `md` step outside one.

  Breaking: `IconRenderProps.size` is `number | undefined`. A render function
  that needs a number states its own fallback:
  `(name, { size }) => <Glyph name={name} width={size ?? 20} />`.

  **A sheet is the width of the app column.**

  `Sheet` portals to `<body>`, where nothing in the app tree constrains it, and
  carried no maximum — on a desktop window it spanned the whole viewport beside
  a phone-width app. It now reads `--mds-frame-width` and the sheet scrim
  centres it.

  **A tab bar adds the home-bar inset to its height.**

  The box is border-box, so `padding-bottom: var(--mds-safe-bottom)` alone took
  the inset out of the height the items stood in.

  **`CountButton` sizes the glyph in its slot.**

  Same defect the buttons had: the spinner that replaces the glyph while a count
  is in flight stated a step the glyph did not, so a row of them reflowed on a
  tap.

## 2.0.0

### Major Changes

- 9d7c31f: Adopt the density, radius and control geometry of the first app to ship on MDS,
  and close the two holes that let a brand override the system's job.

  The first migration onto MDS swapped a component library out from under a
  working app, and the result read as a regression: settings rows grew, avatar
  initials shrank into their circles, secondary buttons lost their colour. The
  app fixed it by declaring 27 dimension tokens in its brand file. That is the
  wrong repair — a brand file states colour and type, and MDS owns padding,
  density, radius, surface and control geometry. So the values moved here.

  **Geometry now defaults to the tuned scale.** Tab bar 66px; control heights
  32/38/46; checkbox and radio 22px; switch 44×26 with a 20px knob; status dot
  9px; avatars 24/30/38/46/72. Page padding, button inline padding, the tight gap
  and the section stack move with them. Radius gains the rungs the roles actually
  land on (6, 14, 18, 20) and `--mds-radius-modal` now matches `--mds-radius-sheet`
  rather than sitting a step tighter than the panel beside it.

  **Avatar initials derive from the diameter.** `--mds-avatar-text-*` was pinned
  to steps on the reading scale, so a brand that resized its avatars got 12px
  initials in a 38px circle and nothing failed. They are now
  `diameter × --mds-avatar-text-ratio`, one number for the whole set. Initials
  also render in the display face, which is what a brand with a distinct
  display face expects to see there.

  **Switch, Checkbox and Radio meet the tap minimum without charging for it.**
  `min-height: var(--mds-tap-min)` on the control root was layout the host row
  paid for — a switch in a list row made that row 68px tall against the 52px the
  design draws. WCAG 2.5.8 measures the target, not the painted box, so the
  target is an out-of-flow pseudo-element and the control occupies its own size.

  **New semantic token: `--mds-button-secondary-fg`.** A secondary button's
  outline was brandable and its label was not, so a brand could draw the outline
  in its accent and had to leave the words inside it in `--mds-text-primary`.
  Defaults to `--mds-text-primary`; brands must declare it.

  Migration: most apps see rendered dimensions move. An app that had overridden
  these tokens to reach these values can delete those overrides. Every brand file
  must add `--mds-button-secondary-fg` in both themes.

  **A control sizes the glyph in its own icon slot.** `Button`, `Input` and `Chip`
  took an icon slot as a `ReactNode` and sized nothing in it, so a glyph was
  whatever the caller's icon set happened to default to — 20px beside a 12px label
  in a 32px small button. It also meant a small button changed width the moment it
  went busy, because the spinner it swaps in _was_ sized by the system, at 16px.
  Each control now gives the slot a fixed box on the icon scale — a button from its
  size, an input at the step its padding already reserved, a chip at its own label
  size, since a pill is shorter than any step on the scale — and publishes that
  step as `--mds-icon-slot` for an icon set that can only size itself from the
  inside. The spinner reads the same step.

  Migration: a glyph passed into one of those slots is drawn at the control's size
  rather than its own. An icon that must keep a size of its own states it, as
  before.

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
