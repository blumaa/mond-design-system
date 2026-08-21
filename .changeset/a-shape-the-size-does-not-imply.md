---
"@mond-design-system/react": minor
---

`Button` takes `shape?: "rect" | "pill"`.

Unset, nothing changes: the shape follows from the size, which means a
rectangle, or a circle when `iconOnly`. The prop is for the two cases the
default gets wrong — a pill around words, and a square icon button, which is
what an app with a rectangular control language wants for the icon buttons
sitting in its rows.
