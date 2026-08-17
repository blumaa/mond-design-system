# @mond-design-system/react

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
