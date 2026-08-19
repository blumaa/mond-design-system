# @mond-design-system/tokens

The CSS custom properties
[`@mond-design-system/react`](https://www.npmjs.com/package/@mond-design-system/react)
reads. Plain CSS — no build step, no JS import, no theme object.

```sh
pnpm add @mond-design-system/tokens
```

```ts
import "@mond-design-system/tokens/styles.css";
```

That one file pulls in the core scales, the semantic contract and the base
reset. Individual layers are exported too (`./core/spacing.css`,
`./semantic.css`, `./base.css`) for the rare app that wants only some of them.

## Three layers

**Core scales** (`core/*.css`) are the rungs: `--mds-space-1…12`,
`--mds-radius-1…4`, `--mds-text-xs…4xl`, durations, easings, z-indices, icon and
avatar sizes.

**Semantic aliases** name what a rung is _for_: `--mds-pad-card`,
`--mds-text-button-lg`, `--mds-surface-raised`, `--mds-control-border`,
`--mds-radius-modal`. Components read these and only these.

**Base** (`base.css`) is the only global CSS the system ships: a reset, page
defaults, and one focus treatment.

## Why components never read a rung

A step is a number. `--mds-space-2` is 8px in a chip, a list row, a tab and a
toast, and a brand that wants roomier chips cannot have them without moving the
other three. So every step a component reads has a name for the role it plays,
and re-pointing that name moves exactly one thing.

The library's `check:tokens` gate enforces it, along with the failures CSS keeps
quiet about: a literal hex, a literal `px` outside a declared breakpoint, an
undefined `--mds-*` (which drops the declaration with no error anywhere), and a
brand file missing part of the semantic contract or its dark block.

## Rebranding

Copy `brand-template.css` into your app and edit the values. It starts as the
mond defaults, so a copy with nothing changed renders what you see today.

```ts
import "@mond-design-system/tokens/styles.css";
import "@mond-design-system/react/styles.css";
import "./tokens/brand-acme.css"; // last — it wins by cascade order
```

Four rules, and the first is the one that bites:

- The light block re-declares **every** semantic token. A missing alias does not
  error; it silently falls through to the mond default.
- The dark block (`[data-theme="dark"]`) re-points only what flips. Tokens on
  fixed backdrops — the scrim, text over media, the letterbox behind a video —
  stay put in both themes.
- `@font-face` lives in your app. Point the three `--mds-font-*` role tokens at
  your faces here.
- Keep WCAG AA: text 4.5:1 against its surfaces, control borders and the focus
  ring 3:1.

Colour is not the only surface. Density, radius, control padding and the type
scale are aliases too, so a brand can be tighter or rounder without touching a
component.

## License

MIT
