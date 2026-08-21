---
description: What a design system rule is protecting, in its own words.
argument-hint: "[rule-id] [--target system|app]"
allowed-tools: Bash, Read
---

Run `dsbridge rules $ARGUMENTS` from the repo root.

With no argument it lists every rule. With an id it prints that one rule's
reasoning: the failure it prevents and what to do instead.

Rules come in two kinds and the listing marks which is which. A checked rule is
proved by `dsbridge check`, so a violation is a fact. A judgement rule cannot be
proved by any tool — it is the part of a design system that a person has to
decide — so read it as an argument to weigh, not an instruction to obey.
