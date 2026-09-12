---
"@mond-design-system/react": patch
---

A MediaPlaceholder in a flex row stays where the row put it

6.2.2 put the cap and `margin-inline: auto` on the box itself. As a flex item with a fixed width, those auto margins absorbed the row's free space: a feed card's thumbnail drifted to the middle and the words beside it were pushed right. The cap and the centring now sit on a frame inside the box, so the caller's box is sized and placed as the caller says and the picture centres only within it. Same DOM class names for the image, the fill, the caption and the cover; one new `frame` between the box and them.
