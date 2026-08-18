---
"@mond-design-system/react": patch
---

Space a card's slots from the card rather than from each other. Each slot padded
the card's outer edge and left the separation between two of them to whichever
slot sat in between, so a header above a footer had none — the two rows touched —
and a card that ended on its header had no bottom padding at all. The slots now
pay only for the edge they sit against and the card's own gap supplies the rest,
which holds for any combination of header, body and footer.
