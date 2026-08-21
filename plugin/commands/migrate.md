---
description: Plan an app's adoption of the design system — what it would have to move, measured.
argument-hint: "[--root <dir>]"
allowed-tools: Bash, Read, Grep, Glob
---

Run `dsbridge migrate $ARGUMENTS` from the app's root.

The output is a measurement, not a task list: which of the app's own tokens hold
a value the system already names, which parts of the contract the app's brand
file has not re-pointed, and what its stylesheets would have to give up.

Do not start editing. Turn the measurement into a plan the user can agree to,
smallest first: the brand file is one file and moves everything, so it comes
before any component. Say plainly what the app would lose as well as gain.
