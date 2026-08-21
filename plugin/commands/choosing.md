---
description: Which of two design system components that both compile is the one this case wants.
argument-hint: "[ComponentName] [--root <dir>]"
allowed-tools: Bash, Read
---

Run `dsbridge choosing $ARGUMENTS` from the repo root.

Every other lookup here is derived from something: the graph knows what a token
holds, TypeScript knows what a component accepts, the import graph knows what
composes what. This is the one that is authored, because nothing in the code can
answer it — `Sheet`, `Modal` and `ConfirmDialog` all compile, all pass every
rule, and only one of them is right for the case in front of you.

Read it before reaching for a component that has a near-twin. The default is
what to use when nothing else applies; the lines under it are the exceptions,
each with the case that triggers it. A component listed under no choice is one
nobody has been caught getting wrong.

With a component name it prints only the choices that name that component, plus
anything deprecated on it and what to write instead.

If a choice looks wrong for what the product actually does, that is a real
disagreement to settle in the design system — not a reason to work around it in
one app.
