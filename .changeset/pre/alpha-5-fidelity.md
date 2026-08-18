---
"@mond-design-system/react": patch
"@mond-design-system/tokens": patch
---

Two layout gaps the fairplay visual review surfaced:

- AppBar keeps the trailing slot at the end even without a title to push it
  there (auto start-margin on the trailing slot; a no-op when a title's flex
  share already fills the row).
- SegmentedControl takes `fullWidth`, stretching the group across its
  container with segments sharing the width equally.
- `--mds-text-control` sizes text inputs independently of the reading scale
  (default unchanged); Input, Select, Textarea and SearchField read it. iOS
  Safari zooms the page on focusing an input under 16px, so a mobile brand
  re-points this to 1rem without touching body text.
- `--mds-radius-modal` gives the modal panel the brand-facing radius alias
  every other surface already had.
