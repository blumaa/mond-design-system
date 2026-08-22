---
"@mond-design-system/react": minor
---

A section title can be the small one, and a card can be the section.

`Heading` takes `variant="label"`, the type role that already existed for
everything except a heading. A rail beside the page, a group inside a form:
the outline level is what makes it a heading, and the size is free to stay out
of the page title's way.

`Card`'s `as` now applies to a static card as well as a linked one. A card that
names a section is a `<section>`, one that holds a post is an `<article>` — the
element is what puts it in the outline, and a wrapper around the card cannot
put it there, because the wrapper is not the card.
