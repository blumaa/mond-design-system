---
description: The one piece of conformance work to do now, what it closes, and the command that does it.
argument-hint: "[--root <dir>]"
allowed-tools: Bash, Read
---

Run `dsbridge next $ARGUMENTS` from the repo root.

One item, computed from the findings as they stand. There is no stored plan and
no state file: a written-down list disagrees with the repo the first time
anything is fixed outside it, so the way to close the item is to make the
findings go away and run this again.

The order is by what the work costs. Findings with exactly one right answer come
first however few there are — `dsbridge check --fix` closes them and not one is a
judgement call. After that it is the value written in the most places, because
every one of those places is the same decision made again: read `dsbridge roles`
once and the rest follow.

Where the item is a value no token holds, the work is not in this repo. That is
the design system's backlog — one token named in the scale closes every place
here, and nothing written locally will. Report it to the system rather than
inventing a local constant for it.

Where `.dsbridge/baseline.json` exists, anything above it is taken first, and the
output says which of the two it is looking at: something added since the debt was
recorded, or the largest thing the baseline is already holding.
