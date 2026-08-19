---
"@mond-design-system/react": patch
---

Raise the tab bar's action out of a bar that is one plain box.

`TabBar` was sticky, reserved the action's lift as transparent padding, and drew
its surface on a `::before` behind a `z-index` of `-1`. That put the top of the
action on the far side of a paint boundary, inside an element promoted to a
layer of its own — and the action lost exactly its lift, cut flat where the
surface began.

None of it was needed. The bar is the last item of a column with a resolved
height, so it is already where sticky would put it. It is now a plain
`position: relative` box that paints its own background, and the action breaks
its top edge on a negative margin, which is what it did before the rewrite.
