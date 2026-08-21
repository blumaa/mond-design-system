---
name: design-system
description: Use when writing or reviewing UI in a repo that has a design system — building a component, styling anything, choosing spacing or colour, laying out a screen, or judging whether new code belongs in the system or in the app. Says which lookup answers which question, and what the checked rules are protecting.
user-invocable: true
---

# Working inside a design system

A design system's promise is that a rebrand is one file and nothing else moves.
Every rule exists because some ordinary-looking line of code quietly breaks that
promise: a literal hex that survives the rebrand, a hard-coded 12px the scale can
no longer move, a component that pins itself to the bottom of a screen it does
not own.

The rules live in the tool, not in this file. Ask for the ones that apply.

## Look it up rather than recall it

| the moment | the lookup |
| --- | --- |
| about to write or edit one file | `dsbridge rules --for <path>` |
| reaching for a value — `12px`, `#f60`, `1.5rem` | `dsbridge tokens --grep <text>` |
| a finding that names several tokens, or a token you cannot place | `dsbridge roles` |
| two components that both look right — `Sheet` or `Modal` | `dsbridge choosing [name]` |
| a finding you want to understand or argue with | `dsbridge rules <id>` |
| finished a change | `dsbridge check <path>` |
| picking up conformance work with no particular file in hand | `dsbridge next` |
| an app deciding what it would take to adopt the system | `dsbridge migrate` |

`--for` is the one to reach for by default: it answers with the rules that read
that kind of file, one line each, and says of each whether it is checked or a
judgement call. The whole set is 22 KB and most of it is about a file you are not
touching — `dsbridge rules --markdown` prints all of it, and is almost never what
you want mid-edit.

`choosing` is the only lookup here that nothing in the code could answer.
Everything else is derived — the graph, the types, the import graph — but which
of two components that both compile is right for this case is a decision
somebody made, and it is written down or it is lost.

`roles` is what turns a value back into a name. The graph knows what a token
*holds*; only the system says what it is *for*, and a finding that names several
tokens is naming every one whose role answers that property. Reading the roles is
how you pick between them — the token that names the role you are writing, not
the one that happens to sort first.

`next` is for the other kind of session — no file in hand, the task is the debt
itself. It picks one item from the findings as they stand: the cheapest real
work first, and above the baseline before anything the baseline already forgives.
There is no plan behind it and nothing stored, so the way to close the item is to
make the findings go away.

Configuration lives in `dsbridge.config.json` at the repo root: the token prefix,
where the design system's stylesheet lives, the component taxonomy, and any
exemptions. There is no global install to reason about — the repo that owns the
design system owns the rules.

## What arrives without being asked

Where this plugin's hooks are installed, dsbridge speaks three times on its own:

- **At session start**, the token namespace, the taxonomy, what the repo already
  has, and how much debt the baseline holds.
- **Before a Write or an Edit** to a stylesheet or a component, what that text
  adds — only what it adds, never what the file already carried. It is a warning
  and not a veto; the write proceeds. Correct it in the same write. A finding
  answered before it lands is the cheapest one there is.
- **At the end of a turn**, if the session left the repo above its baseline.

None of that replaces the lookups. It tells you something is wrong; `dsbridge
rules <id>` is what tells you why, and the why is what decides the fix.

## The two kinds of rule

**Checked.** `dsbridge check` proves them, so a violation is a fact. Fix it, or
exempt it with the reason written beside the code. Never fix one by making it
unmeasurable — moving a literal into a JavaScript string satisfies no rule and
defeats every one of them.

Where a finding says exactly one token can be meant, `dsbridge check --fix`
writes it. It touches nothing else: a finding that names two tokens is a choice,
and one that names none is a value the scale has no word for. Both of those are
yours to answer.

**Judgement.** No tool can prove them. Whether a component belongs in the system
at all, whether a value has earned a semantic name, whether a variant should be a
prop or a composition — these are decisions, and the rule is an argument to
weigh. A repo can pass every check and still be a design system in name only.

## When a rule is wrong here

It happens, and the answer is to say so on the record rather than to work around
it:

- One line, one reason: `/* dsbridge-ignore-next-line: reason */` above it. The
  reason is required; without one the finding stands.
- A whole directory a rule does not apply to: `exempt` in
  `dsbridge.config.json`, keyed by rule id.
- Debt that predates you: `dsbridge check --update-baseline` records what is
  already there, and `--baseline` reports only what is above it. Recording is a
  decision to make deliberately and to say you made — it is not a fix.

## Before and after

Look for the token before naming a value, and for the component before writing a
raw `<button>`: the second name for one value is how a system splits in two, and
the hand-rolled button is the one that misses the focus ring, the loading state
and the tap target. Know which level you are writing at — a component that
reaches upward is a circular dependency waiting for its second consumer.

Afterwards, run `dsbridge check` and fix by root cause: several findings across
several files are usually one missing token, or one component doing its own
layout. Then read the diff once more and ask the question no rule can — is this
in the system because two apps need it, or because one app needed it today?
