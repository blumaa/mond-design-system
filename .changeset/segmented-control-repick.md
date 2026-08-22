---
"@mond-design-system/react": minor
---

SegmentedControl: `repick` reports the segment already chosen being picked again.

A radio fires only when its checked state changes, so a tap on the segment
already selected reaches no caller. That is right for most choices and wrong for
one: where the value on screen was inferred rather than chosen — a language taken
from the browser, a sort taken from a default — confirming it is an act of its
own, and the app has no way to hear it. `repick` turns that tap into an
`onChange` with the current value; off by default, and a real change still
reports exactly once.
