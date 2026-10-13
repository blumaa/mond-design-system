---
"@mond-design-system/react": patch
"@mond-design-system/tokens": patch
---

MediaPlaceholder's loading pulse runs from `--mds-surface-sunken` to `--mds-border-strong` instead of `--mds-surface-raised`, so it stays visible in a dark theme where those two surfaces are almost the same. The contrast contract gains the pair at 1.4:1, so a brand is held to a visible step.
