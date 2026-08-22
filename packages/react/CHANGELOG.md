# @mond-design-system/react

## 4.4.0

### Minor Changes

- 516d749: A section title can be the small one, and a card can be the section.

  `Heading` takes `variant="label"`, the type role that already existed for
  everything except a heading. A rail beside the page, a group inside a form:
  the outline level is what makes it a heading, and the size is free to stay out
  of the page title's way.

  `Card`'s `as` now applies to a static card as well as a linked one. A card that
  names a section is a `<section>`, one that holds a post is an `<article>` — the
  element is what puts it in the outline, and a wrapper around the card cannot
  put it there, because the wrapper is not the card.

## 4.3.0

### Minor Changes

- 14d8598: Toast: a danger toast is announced assertively.

  Every toast was a polite `status`, which queues the message behind whatever the
  screen reader is already saying. For a refusal that is the wrong order: the
  thing the reader asked for did not happen, and they are about to carry on as
  though it did. A `danger` toast is now `role="alert"`; neutral and success stay
  `status`, and the rest of the system already read this way — ConfirmDialog's
  error line and UploadProgress's failure are both alerts.

## 4.2.0

### Minor Changes

- 9c1dd56: SegmentedControl: `repick` reports the segment already chosen being picked again.

  A radio fires only when its checked state changes, so a tap on the segment
  already selected reaches no caller. That is right for most choices and wrong for
  one: where the value on screen was inferred rather than chosen — a language taken
  from the browser, a sort taken from a default — confirming it is an act of its
  own, and the app has no way to hear it. `repick` turns that tap into an
  `onChange` with the current value; off by default, and a real change still
  reports exactly once.

## 4.1.0

### Minor Changes

- 1aedfb8: Four roles the first migrating app asked for, all of them chrome that the system could name but did not.

  `TabBarItem` takes `hideLabel`. The caption goes into a `VisuallyHidden` rather than being dropped: the word is still the item's accessible name. For a bottom bar whose glyphs carry the meaning, four captions wrap on the narrowest phone, and a translation twice the length of the English wraps everywhere.

  `AppBar` takes `className` and passes the rest of its attributes to the `<header>` it renders. Every other component in the system already did; the omission meant a screen that shows its bar only at one breakpoint had to wrap it in a div to say so.

  `toast()` takes `action` and `onDismiss`. A message that asks for something — "Update ready", "Add to home screen" — needs the doing beside the saying, and taking the action closes the toast because the message has been answered. `onDismiss` fires however the toast leaves — timeout, close button, or action — exactly once, so a nudge that has been turned down has one place to write that down instead of three that can disagree.

  `SegmentedControl` takes `size` (`sm` | `md`, default `md`) and `bare`. A language switch sharing a header bar with an avatar and a menu is chrome, and the tray is what makes the group read as a form field. `bare` drops the tray; the chosen segment keeps its own surface, which is the answer.

## 4.0.0

### Major Changes

- ddd960c: Every user-facing string a component shows is now a required prop.

  Three policies were in the library at once: some components took the words as a
  required prop, some took an optional prop over an English default, and some
  hardcoded them. The default is the one that looks safe and is not — it compiles
  in every app, so no app is ever asked for the translation, and the missing
  German is found by the person using a screen reader rather than by a build.
  Making the prop required moves the question to `tsc`, which asks once per call
  site and cannot be forgotten.

  Migration — each of these is a type error until the prop is passed:

  - `Spinner` takes `label`.
  - `SearchField` takes `clearLabel`.
  - `PasswordInput` takes `showLabel` and `hideLabel`.
  - `Tag` takes `removeLabel` alongside `onRemove`. The two are a pair: a tag
    without a remove button is not asked for the words of one, and the label is
    no longer guessed from the children.
  - `AvatarGroup` takes `overflowLabel: (hidden: number) => string` — a function,
    because only the app knows how its language counts what it hides.
  - `ToastProvider` takes `regionLabel` and `dismissLabel`, which previously
    defaulted to "Notifications" and "Dismiss".
  - `ConfirmDialog` takes `cancelLabel`, which previously defaulted to "Cancel".
  - `DateTimePicker` takes the whole `labels` object rather than a partial over
    English defaults: a partial makes the one key nobody filled in look
    deliberate. `placeholder` stays optional but no longer defaults to "Select
    date & time" — the trigger shows nothing when neither a value nor a
    placeholder is given.

  The rule is enforced from now on. `dsbridge`'s `user-facing-text-is-a-prop`
  fails the build on a literal reaching `aria-label`, `alt`, `title`,
  `placeholder`, `label`, a text node, or a defaulted prop whose name reads as
  copy.

### Minor Changes

- 5dae007: Button takes `onMedia`, for a control standing on a picture. The two see-through
  variants swap the page's foreground, border, hover, active, focus ring and
  disabled grey for the `on-media` palette; the filled variants bring their own
  ground and are left alone.
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

- de3d034: `Button` takes `shape?: "rect" | "pill"`.

  Unset, nothing changes: the shape follows from the size, which means a
  rectangle, or a circle when `iconOnly`. The prop is for the two cases the
  default gets wrong — a pill around words, and a square icon button, which is
  what an app with a rectangular control language wants for the icon buttons
  sitting in its rows.

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

- c705c93: New `Lightbox`: one picture full screen, with zoom controls, double tap, pinch
  and trackpad pinch, and panning held inside the picture's own edges. The
  overlay shell gains a `lightbox` variant — a panel that takes the whole scrim
  rather than sitting on it.
- fa466f8: New `VideoPlayer`: transport, seek, sound, captions, fullscreen and chapters,
  with `covered` and `cover` for media that has to be asked past. Chapters and
  captions each pair with the label that names them, so a player without either
  is asked for neither. The transport marks join the internal glyphs.
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

### Patch Changes

- Updated dependencies [49e71ce]
- Updated dependencies [bb3ecce]
- Updated dependencies [1c321ce]
  - @mond-design-system/tokens@3.2.0

## 3.0.3

### Patch Changes

- b24a6d4: Raise the tab bar's action out of a bar that is one plain box.

  `TabBar` was sticky, reserved the action's lift as transparent padding, and drew
  its surface on a `::before` behind a `z-index` of `-1`. That put the top of the
  action on the far side of a paint boundary, inside an element promoted to a
  layer of its own — and the action lost exactly its lift, cut flat where the
  surface began.

  None of it was needed. The bar is the last item of a column with a resolved
  height, so it is already where sticky would put it. It is now a plain
  `position: relative` box that paints its own background, and the action breaks
  its top edge on a negative margin, which is what it did before the rewrite.

## 3.0.2

### Patch Changes

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

- Updated dependencies [b90d8c8]
  - @mond-design-system/tokens@3.1.0

## 3.0.1

### Patch Changes

- b800079: Keep the tab bar's raised action inside the bar's box, and let overlays animate
  in.

  The action lifted itself with a negative margin from the bar's content-box top,
  which put the top of the circle outside the bar altogether. Anything outside a
  box is subject to every ancestor's overflow and to paint order, and the bar's
  z-index does nothing for the part of a child that is not in it — the lift was
  being erased. The bar now reserves the lift as transparent padding and takes it
  back out of the flow with a matching negative margin, so the screen above keeps
  its height and scrolls under it while the action stays in the box. The bar's
  surface moved to a pseudo-element below the strip.

  `usePresence` also inserted overlays already carrying their open style, which
  transitions from nothing and simply appears; it now paints the closed style
  first and flips on the next frame. A sheet unmounts on `--mds-dur-slow` rather
  than `--mds-dur-base`, which had been cutting 120ms off the end of its slide.

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

### Patch Changes

- Updated dependencies [e77cb44]
  - @mond-design-system/tokens@3.0.0

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

### Patch Changes

- Updated dependencies [9d7c31f]
  - @mond-design-system/tokens@2.0.0

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

### Patch Changes

- Updated dependencies [d3b4fe7]
- Updated dependencies [1dfb677]
  - @mond-design-system/tokens@1.1.0

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

- 8484591: Add Chip, ChipGroup, ChipBar, CountButton, DateTimePicker and the OverlayHistory contract.

  - **Chip** — interactive pill for filters and choices (button with `aria-pressed` when `selected` is given; static pill otherwise). **ChipGroup** wraps chips for multi-select form fields; **ChipBar** is a single-line scrolling filter strip with optional border and trailing-edge fade.
  - **CountButton** — chrome-less icon + count pressable (like/comment actions) with active (`aria-pressed`), loading (spinner + lock) and token-bound `tone` ("accent" | "danger").
  - **DateTimePicker** — trigger styled like Input opening a bottom Sheet with a roving-focus month calendar and native Select time controls. Weekday/month names, week start and 12/24-hour clock derive from `Intl` for the given `locale`; visible strings are overridable via `labels`.
  - **OverlayHistoryContext** — apps can supply an `OverlayHistory` so the hardware back gesture dismisses the innermost open overlay instead of leaving the screen. `useOverlay` registers every open overlay, so Modal, Sheet and ConfirmDialog participate with no call-site wiring; without a provider nothing changes.

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

- 85785bd: Button: make the loading spinner decorative. The spinner rendered with its
  default live label, so a busy button's accessible name became "Loading Save"
  and name-based queries and screen readers lost the button. aria-busy on the
  button already announces the state; the spinner now renders with an empty
  label and aria-hidden, matching CountButton.
- e0d82ef: CardHeader: give a lone child the full row.

  The header is a centred flex row, so a single layout block passed to it
  shrink-wrapped and any `justify-content: space-between` inside that block had no
  free space to distribute — trailing content collapsed against the title. AppBar
  already flexes its title slot; CardHeader now matches.

- e07fab9: Space a card's slots from the card rather than from each other. Each slot padded
  the card's outer edge and left the separation between two of them to whichever
  slot sat in between, so a header above a footer had none — the two rows touched —
  and a card that ended on its header had no bottom padding at all. The slots now
  pay only for the edge they sit against and the card's own gap supplies the rest,
  which holds for any combination of header, body and footer.

  A footer also wraps now. The card clips its overflow, so a row of actions that
  outgrew one line lost the controls at its far end rather than falling to the
  next — four buttons that fit in English did not in German.

- Updated dependencies
- Updated dependencies [925b7cb]
- Updated dependencies [e2a44c6]
- Updated dependencies [f78cb5f]
- Updated dependencies [014828f]
- Updated dependencies [f81bfd6]
  - @mond-design-system/tokens@1.0.0

## 1.0.0-alpha.8

### Patch Changes

- e07fab9: Space a card's slots from the card rather than from each other. Each slot padded
  the card's outer edge and left the separation between two of them to whichever
  slot sat in between, so a header above a footer had none — the two rows touched —
  and a card that ended on its header had no bottom padding at all. The slots now
  pay only for the edge they sit against and the card's own gap supplies the rest,
  which holds for any combination of header, body and footer.

  A footer also wraps now. The card clips its overflow, so a row of actions that
  outgrew one line lost the controls at its far end rather than falling to the
  next — four buttons that fit in English did not in German.

## 1.0.0-alpha.7

### Minor Changes

- 014828f: Give a card's header its own type role.

  `Card`'s header read `--mds-type-subtitle`, which is the role `Heading` levels 3
  and 4 render in. A card header is a slot rather than a heading level, so a brand
  that sized its section headings was also setting the inherited font of every
  card header row — and those rows mostly hold their own `Text`, so what the role
  supplied there was leading, not type. `--mds-type-card-title` names the slot and
  ships as a pass-through of subtitle, so the default look is unchanged.

### Patch Changes

- Updated dependencies [014828f]
  - @mond-design-system/tokens@1.0.0-alpha.5

## 1.0.0-alpha.6

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

### Patch Changes

- e0d82ef: CardHeader: give a lone child the full row.

  The header is a centred flex row, so a single layout block passed to it
  shrink-wrapped and any `justify-content: space-between` inside that block had no
  free space to distribute — trailing content collapsed against the title. AppBar
  already flexes its title slot; CardHeader now matches.

- Updated dependencies [f81bfd6]
  - @mond-design-system/tokens@1.0.0-alpha.4

## 1.0.0-alpha.5

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

- Updated dependencies [f78cb5f]
  - @mond-design-system/tokens@1.0.0-alpha.3

## 1.0.0-alpha.4

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

### Patch Changes

- Updated dependencies [e2a44c6]
  - @mond-design-system/tokens@1.0.0-alpha.2

## 1.0.0-alpha.3

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

### Patch Changes

- Updated dependencies [925b7cb]
  - @mond-design-system/tokens@1.0.0-alpha.1

## 1.0.0-alpha.2

### Patch Changes

- 85785bd: Button: make the loading spinner decorative. The spinner rendered with its
  default live label, so a busy button's accessible name became "Loading Save"
  and name-based queries and screen readers lost the button. aria-busy on the
  button already announces the state; the spinner now renders with an empty
  label and aria-hidden, matching CountButton.

## 1.0.0-alpha.1

### Minor Changes

- 8484591: Add Chip, ChipGroup, ChipBar, CountButton, DateTimePicker and the OverlayHistory contract.

  - **Chip** — interactive pill for filters and choices (button with `aria-pressed` when `selected` is given; static pill otherwise). **ChipGroup** wraps chips for multi-select form fields; **ChipBar** is a single-line scrolling filter strip with optional border and trailing-edge fade.
  - **CountButton** — chrome-less icon + count pressable (like/comment actions) with active (`aria-pressed`), loading (spinner + lock) and token-bound `tone` ("accent" | "danger").
  - **DateTimePicker** — trigger styled like Input opening a bottom Sheet with a roving-focus month calendar and native Select time controls. Weekday/month names, week start and 12/24-hour clock derive from `Intl` for the given `locale`; visible strings are overridable via `labels`.
  - **OverlayHistoryContext** — apps can supply an `OverlayHistory` so the hardware back gesture dismisses the innermost open overlay instead of leaving the screen. `useOverlay` registers every open overlay, so Modal, Sheet and ConfirmDialog participate with no call-site wiring; without a provider nothing changes.
