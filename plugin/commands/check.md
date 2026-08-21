---
description: Run the design system rules against this repo and fix what they find.
argument-hint: "[--rule <id>] [--root <dir>]"
allowed-tools: Bash, Read, Edit, Grep, Glob
---

Run `dsbridge check $ARGUMENTS` from the repo root.

Each finding names the rule that produced it. Before changing anything, run
`dsbridge rules <id>` for the rules that fired: the reasoning says what the rule
is protecting, and a fix that satisfies the check while defeating the reason is
not a fix.

Work by root cause, not by finding. Several findings in different files are
usually one missing token or one component that should not be doing its own
layout — fix that, then re-run. If a finding is genuinely correct and the design
still needs the exception, add it to `exempt` in `dsbridge.config.json` with the
reason written beside the code, and say in your summary that you did.

Report what you changed and what you left, with the count before and after.
