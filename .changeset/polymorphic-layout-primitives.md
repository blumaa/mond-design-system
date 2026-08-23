---
"@mond-design-system/react": minor
---

Stack, Inline and Container keep what `as` promises: they take the props of the element they render, and they hand that element back through `ref`.

Typed as `HTMLAttributes<HTMLElement>`, `<Stack as="form">` compiled and `autoComplete` did not, so a form went back to a hand-written `<form>` with a flex block in a stylesheet — the thing the primitive exists to remove. `StackProps`, `InlineProps` and `ContainerProps` now take the element as a type argument and default to `div`, so existing uses are unchanged.
