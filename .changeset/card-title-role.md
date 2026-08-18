---
"@mond-design-system/tokens": minor
"@mond-design-system/react": minor
---

Give a card's header its own type role.

`Card`'s header read `--mds-type-subtitle`, which is the role `Heading` levels 3
and 4 render in. A card header is a slot rather than a heading level, so a brand
that sized its section headings was also setting the inherited font of every
card header row — and those rows mostly hold their own `Text`, so what the role
supplied there was leading, not type. `--mds-type-card-title` names the slot and
ships as a pass-through of subtitle, so the default look is unchanged.
