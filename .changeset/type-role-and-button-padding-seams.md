---
"@mond-design-system/tokens": minor
"@mond-design-system/react": minor
---

Give brands a seam where one alias served two roles.

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
