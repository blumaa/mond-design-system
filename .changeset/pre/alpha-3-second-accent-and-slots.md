---
"@mond-design-system/tokens": minor
"@mond-design-system/react": minor
---

Second accent slot, avatar identity tints, and the component APIs they unlock.

Tokens:

- `--mds-highlight`, `--mds-highlight-contrast`, `--mds-highlight-hover`,
  `--mds-highlight-soft` — a second semantic accent. The defaults alias the
  accent quartet, so single-accent brands change nothing; two-accent brands
  re-point them.
- `--mds-avatar-tone-1..5` — five numbered identity tints for avatar initials,
  contrast-gated against `--mds-text-primary` in both themes.
- `--mds-avatar-xs` (20px) and `--mds-avatar-xl` (96px) core sizes.

React:

- Button, Badge, Chip: `highlight` variant/tone. Badge and Chip render it as a
  full highlight fill with contrast text — the promoted marker.
- Avatar: `xs`/`xl` sizes, `tone` (1–5) identity tints, `decorative` to hide
  repeat avatars from assistive tech.
- Input: `iconLeft`/`iconRight` decorative icon slots and a standalone
  `invalid` prop (aria-invalid plus danger border outside a Field).
- Link: `plain` variant (inherits color/weight, underlines on hover), `size`
  on the core text scale, and `type="button"` default when rendered
  `as="button"`.
- ListItem: `title`/`description` widened to ReactNode, `surface`
  (card/sunken/accent/plain), and standalone rendering — a `<div>` row outside
  a ListGroup, an `<li>` inside.
- Switch: `loading` (blocks toggling, announces aria-busy) and label-less use
  via a required `aria-label` when `label` is omitted.
- SegmentedControl: `disabled`.
- Checkbox: `label` widened to ReactNode.
