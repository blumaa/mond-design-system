---
"@mond-design-system/tokens": minor
"@mond-design-system/react": minor
---

Name every raw scale step a component used to read.

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
