# Patches

## `@storybook/react` — `simplifyNodeForStringify`

Storybook writes a story's "Show code" snippet by stringifying the element the
story rendered. Before it does, `simplifyNodeForStringify` strips the `_owner`
fiber React attaches to every element in development — otherwise stringifying an
element's props would walk the live React tree.

Upstream it only descends through elements and arrays. An element sitting in a
plain object keeps its owner: `slides: [{ cover: <Stack>…</Stack> }]` on
ImageCarousel, and the same shape anywhere a component takes nodes inside a list
of records. Stringifying then walks that fiber, and through it the whole tree and
the Storybook context behind it. Chromium survives it; WebKit pins a core and
grows past 2GB without returning, so Safari users lose the tab on the
ImageCarousel docs page.

The patch descends into plain objects as well, and carries a `WeakMap` of what it
has already simplified so a cycle in the args ends. Snippets are unchanged apart
from now rendering the nested element, which they previously never reached.

Present in 10.5.8 and still in 10.5.10, so a bump does not remove the need. The
patch is pinned to one version; `packages/storybook/src/jsx-snippet-patch.test.ts`
reads what is installed and fails if a bump drops it.
