---
description: List the token graph — the core scales, the semantic contract, and what the brand re-points.
argument-hint: "[--group <name>] [--layer <core|semantic|brand>] [--theme dark] [--grep <text>]"
allowed-tools: Bash, Read
---

Run `dsbridge tokens $ARGUMENTS` from the repo root.

Read it before writing any CSS: the answer to "what do I use for this" is in
here, and inventing a token that already exists under another name is the most
common way a design system splits in two.

The layers say where a value belongs. A core token is a rung on a scale, a
semantic token names a role, a component token belongs to one component. A
component reads roles; only the system's own core layer reads rungs.

`--theme dark` shows what the same names resolve to in dark mode. A value that
only works in one theme is a bug the light-mode listing cannot show you.
