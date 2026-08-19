---
"@mond-design-system/tokens": major
"@mond-design-system/react": major
---

Adopt the density, radius and control geometry of the first app to ship on MDS,
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
went busy, because the spinner it swaps in *was* sized by the system, at 16px.
Each control now gives the slot a fixed box on the icon scale — a button from its
size, an input at the step its padding already reserved, a chip at its own label
size, since a pill is shorter than any step on the scale — and publishes that
step as `--mds-icon-slot` for an icon set that can only size itself from the
inside. The spinner reads the same step.

Migration: a glyph passed into one of those slots is drawn at the control's size
rather than its own. An icon that must keep a size of its own states it, as
before.
