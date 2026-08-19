---
"@mond-design-system/react": patch
---

Keep the tab bar's raised action inside the bar's box, and let overlays animate
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
