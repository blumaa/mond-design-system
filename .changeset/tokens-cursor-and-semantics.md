---
"@mond-design-system/tokens": patch
---

A link now carries the cursor its role implies. WebKit leaves `a[href]` at the
default arrow where Chromium shows a pointer, so the base stylesheet states it
rather than leaving a browser to decide: every anchor the system styles points,
including the ones a button component renders.

The package also publishes `dsbridge/semantics.json` — what each component
announces, roles and title level, for `dsbridge migrate --semantics` to compare
an app's own components against before a swap.
