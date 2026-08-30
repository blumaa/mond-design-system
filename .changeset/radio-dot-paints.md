---
"@mond-design-system/react": patch
---

Radio's chosen dot paints again.

The dot was sized `50%` of its grid area, and that area is an auto track sized
from the pseudo-element's own empty content — zero. A checked radio took the
click, checked, and showed nothing. The dot is now `0.5em` of the box, the same
em-based geometry the Checkbox glyph already uses, so it scales with
`--mds-check-size` like everything else in the control.
