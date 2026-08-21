---
"@mond-design-system/react": minor
"@mond-design-system/tokens": minor
---

`ImageCarousel`: a gallery of frames, one on show, paged by control, arrow key,
swipe or thumbnail. `pager` chooses thumbnails, dots or nothing; past
`maxThumbnails` the rest collapse into one button that pages to the first frame
no thumbnail stands for.

A frame carries its own `covered` and `cover`, so a gallery can hold one
sensitive picture among ordinary ones. A covered frame does not open larger,
however it is tapped.

`onZoom` pairs at the type level with `zoomIcon` and `zoomLabel`: the glyph is
the app's and the words are the app's, and a zoom control with neither is a
control nobody can use. A tap under the swipe threshold opens the frame; a
longer drag pages it.

Every word it says is a prop, including the two a screen reader reads in place
of "region" and "group" — `labels.carouselRole` and `labels.slideRole`.

New tokens: `--mds-media-inset` (how far a control on a picture stands off its
edge).
