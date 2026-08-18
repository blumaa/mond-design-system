---
"@mond-design-system/react": patch
---

Two layout gaps the fairplay visual review surfaced:

- AppBar keeps the trailing slot at the end even without a title to push it
  there (auto start-margin on the trailing slot; a no-op when a title's flex
  share already fills the row).
- SegmentedControl takes `fullWidth`, stretching the group across its
  container with segments sharing the width equally.
