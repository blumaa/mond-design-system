# Mond Design System

A brand-agnostic React component library and the CSS custom properties it reads.
Components ship their own styles, take no theme object, and carry no product
vocabulary — a rebrand is one CSS file in the consuming app and nothing else
moves.

| Package                                         | Version | What it is                                             |
| ----------------------------------------------- | ------- | ------------------------------------------------------ |
| [`@mond-design-system/react`](packages/react)   | 1.0.0   | 40 components, self-styled, WCAG 2.2 AA                |
| [`@mond-design-system/tokens`](packages/tokens) | 1.0.0   | Core scales, the semantic contract, the brand template |

## Install

```sh
pnpm add @mond-design-system/react @mond-design-system/tokens
```

React 19 or newer, as a peer.

## Wire it up

Load the tokens, then the components, then your brand. Order is the whole
mechanism: the brand file re-declares the same custom properties and wins by
coming last.

```ts
import "@mond-design-system/tokens/styles.css";
import "@mond-design-system/react/styles.css";
import "./tokens/brand-acme.css";
```

```tsx
import { Button, Card, Stack } from "@mond-design-system/react";

<Card>
  <Stack gap="loose">
    <Button variant="primary">Save</Button>
  </Stack>
</Card>;
```

Dark mode is `data-theme="dark"` on `<html>`. Every brand ships both blocks.

## How a rebrand works

Copy `packages/tokens/src/brand-template.css` into your app and edit the values.
It starts as the mond defaults, so a copy with nothing changed renders exactly
what you see today.

The template only exposes **semantic aliases** — `--mds-surface-card`,
`--mds-pad-control-md`, `--mds-text-button-lg`. That is deliberate, and it is
enforced: a component reading `--mds-space-3` or `--mds-text-sm` directly is
unreachable from a brand file, because a raw scale step is a rung shared with
every unrelated component that happens to want the same number. `pnpm
check:tokens` fails the build on one.

The same gate rejects a literal hex, a literal `px` outside a declared
breakpoint, an undefined `--mds-*`, and a brand file missing part of the
semantic contract or its dark block — each of which fails silently in CSS
otherwise.

## Layout

```
packages/
  tokens/      CSS custom properties: core/, semantic.css, base.css, brand-template.css
  react/       the components, one folder each, sheet + tests beside the source
  storybook/   the docs site, atomic-grouped
scripts/       check-tokens.mjs and its self-test
```

## Develop

```sh
pnpm install
pnpm storybook       # the components, in isolation
pnpm verify          # build, typecheck, lint, check:tokens, test
```

`pnpm verify` is what CI runs, in that order. Keep the two the same.

## Release

Changesets. A change that adds tokens or components is a minor; a rendered value
moving without an opt-out is a major.

```sh
pnpm changeset            # describe the change
pnpm version-packages     # apply versions + changelogs
pnpm release              # build, then publish
```

## License

MIT
