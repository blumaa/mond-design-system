---
"@mond-design-system/react": patch
---

A glyph now states its own size. An `svg` without one is sized by the browser,
and the browsers disagree: WebKit rendered the video player's controls and the
lightbox's at a size Chromium never showed, which is why those controls could
not be found on the page. The icon-only button sizes its slot to match, and the
spinner it swaps in while pending takes the glyph's place rather than sitting
beside it.

Every box that scrolls now says where the scroll stops. Without
`overscroll-behavior`, a scroll that reaches the end of a panel continues into
the page behind it — the whole document moving under a dialog that was supposed
to hold it still.
