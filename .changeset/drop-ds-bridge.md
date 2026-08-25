---
"@mond-design-system/react": patch
---

Drop the `ds-bridge` conformance CLI from this repo. It is no longer part of the
build, CI, or the docs the packages ship. Nothing about the components or the
tokens changes — the rules it enforced are still the rules, they are just no
longer machine-checked here.
