---
"@mond-design-system/tokens": minor
"@mond-design-system/react": patch
---

Paint the tab bar on the step above the page, and give its action a step of its own.

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
