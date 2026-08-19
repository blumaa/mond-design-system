---
"@mond-design-system/tokens": minor
"@mond-design-system/react": minor
---

Name the role of every text step a component picked on the reader's behalf.

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
