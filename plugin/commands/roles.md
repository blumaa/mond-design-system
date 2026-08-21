---
description: What the design system says each token is for — the roles, and which properties they answer.
argument-hint: "[--coverage] [--root <dir>]"
allowed-tools: Bash, Read
---

Run `dsbridge roles $ARGUMENTS` from the repo root.

A role is a set of tokens and the CSS properties they answer. The graph knows
what every token *holds*; only the roles say what it is *for*, and that is the
half a value cannot supply — `20px` is an icon size, a switch knob and a spacing
rung at once.

Read it when a finding names more than one token. Every one of them holds the
value and answers the property, so the tie is real and the roles are what breaks
it: pick the token that names the role you are writing, not the one that sorts
first.

A role that answers nothing is a scale rung — a step that exists so the scale is
complete. Its tokens are never suggested for a property some other role claims.

`--coverage` lists the tokens no answering role has claimed. It is a report and
never a gate: a system with half its tokens declared gets half the benefit and no
failing build. If the token you need is in that list, the system has not yet said
what it is for, and saying so is a change to `dsbridge/roles.json` in the system
— not something to guess at from the app.
