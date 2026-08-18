---
"@mond-design-system/react": patch
---

CardHeader: give a lone child the full row.

The header is a centred flex row, so a single layout block passed to it
shrink-wrapped and any `justify-content: space-between` inside that block had no
free space to distribute — trailing content collapsed against the title. AppBar
already flexes its title slot; CardHeader now matches.
