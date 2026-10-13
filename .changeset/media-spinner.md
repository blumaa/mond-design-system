---
"@mond-design-system/react": minor
---

MediaPlaceholder shows a spinner while its picture loads, then fades the picture in. The frame no longer pulses. The spinner waits a beat before it appears, so a cached picture does not flash one, and it stays out of the accessibility tree; the frame is `aria-busy` instead.
