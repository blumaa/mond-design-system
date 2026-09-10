---
"@mond-design-system/react": patch
"@mond-design-system/tokens": minor
---

ImageCarousel: a thumbnail is capped rather than given a share of the row.

`flex: 1 1 0` made every thumbnail the strip's width divided by however many there were, so five frames under an 887px picture drew 174px tiles — a second gallery below the first. The new `--mds-carousel-thumb` token (72px) caps them; shrink stays on so a narrow phone keeps the strip on one row.
