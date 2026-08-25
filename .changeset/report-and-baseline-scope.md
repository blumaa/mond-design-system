---
"@mond-design-system/ds-bridge": minor
---

Add `dsbridge report`: the same rules as `check`, answered as the three
questions people ask — is this app on the system, can everyone use it, and is
the scale missing rungs the app keeps writing by hand. Every rule now declares
which of those it answers, and the accessibility rules name the WCAG criterion
they speak to. The report never claims conformance: it reads source, not a
rendered page, and says so.

Fix the `stop` hook blaming a session for code it never touched. A baseline
records counts per file per rule, so a rule added after it was written has no
counts and everything it finds comes back above the baseline — which the hook
printed as "added in this session". A baseline now records the rules that ran
when it was written; the hook holds a turn open only for findings from rules the
baseline could have held, names the rest as pre-existing debt, and a baseline
written before this says it cannot tell rather than claiming.
