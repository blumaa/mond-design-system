# @mond-design-system/react

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
