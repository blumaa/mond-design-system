# ds-bridge

The `dsbridge` CLI: look at the token graph, check an app against the design
system's rules, and measure what an app would have to move to adopt it.

Zero runtime dependencies. Reads CSS — it does not run your build, and it does
not care which framework rendered the class.

```sh
pnpm add -D ds-bridge

dsbridge tokens               # the graph: core scales, semantic contract, your brand
dsbridge check                # the rules, as a work list
dsbridge rules [id]           # what each rule is protecting
dsbridge roles                # what the system says its tokens are for
dsbridge choosing             # which of two that both compile this case wants
dsbridge next                 # the one piece of work to do now, and what closes it
dsbridge migrate              # the distance between this app and the system
dsbridge migrate --semantics  # what a swap changes that nothing compiles
dsbridge hook <event>         # answer a Claude Code hook, protocol JSON on stdin
```

## Why

A design system's promise is that a rebrand is one CSS file and nothing else
moves. Three things break it, all of them silently:

- a component writes a literal (`#18201B`, `8px`) — it is the one thing that
  does not change when the brand lands, and it never flips for dark mode;
- a brand re-points a colour and nothing re-proves the contrast — the system's
  own accessibility test still passes, on values the app does not render;
- guidance lives in a README and enforcement lives in a script, so they drift.

Here a rule is one object with both halves: `check()` is what `dsbridge check` runs,
and the prose is what `dsbridge rules` prints. They cannot disagree.

## dsbridge tokens

```sh
dsbridge tokens --layer semantic          # the contract
dsbridge tokens --theme dark --kind color # what dark actually resolves to
dsbridge tokens --grep action --json
dsbridge tokens --html tokens.html        # a page you can look at
dsbridge tokens --unbranded               # the system's defaults, brand ignored
```

Every token is resolved, not just listed: `--mds-action-bg` prints the colour
the browser will paint, through however many `var()` hops and `color-mix()`
calls the brand put in the way.

## dsbridge check

```sh
dsbridge check                    # every rule that applies here
dsbridge check src/components     # only what lives under a path
dsbridge check --rule keeps-contrast
dsbridge check --include-tests    # stories, tests and fixtures too
dsbridge check --json             # for CI
```

Exit code 1 when there are findings. Each one names the file, the line, the
rule, and — when the value is already in the graph — the token that holds it:

```
src/components/Card.module.css
  12  literal length 1px — var(--mds-border-width) has that value  no-literal-length
  18  literal color #18201B — var(--mds-text-primary) has that value  no-literal-color
```

Stories, tests and fixtures are not scanned — a fixture is written to be wrong.
What was left out is always printed, because silence here reads as a pass:

```
  111 tests and stories not scanned — run --include-tests
  3 lines suppressed by comment
```

A rule that cannot run here says so rather than passing quietly:

```
skipped keeps-contrast: the design system installed here publishes no
contract.json, so there is nothing to prove against
```

### Fixing the ones with a single answer

```sh
dsbridge check --fix              # rewrite every finding of confidence `certain`
```

A fix that is ever wrong is worse than no fix: it lands in a diff nobody reads
closely, under a green check. So `--fix` writes only where exactly one token can
be meant, and even then it re-reads the file and proves the literal is still at
the column the finding named. Everything else is reported and left alone.

### The baseline

A gate that fails on 394 findings is a gate nobody turns on. Record the debt
once and the check answers the useful question instead — did this change make
it worse:

```sh
dsbridge check --update-baseline  # .dsbridge/baseline.json — 394 findings held
dsbridge check --baseline         # exit 1 only above it
```

It holds counts per rule per file, not fingerprints, so reformatting a
stylesheet does not invalidate it. The held count is printed on every run: debt
that goes quiet is debt that grows. `--update-baseline` records the whole repo,
so it refuses a path or a `--rule`, and says what moved in both directions.

### Suppressing one line

```css
/* dsbridge-ignore-next-line: the SDK hands us a hex and nothing names it */
border-color: #4a4a4a;
```

The reason is required — without one the line is reported as usual. This is for
the case where the rule is wrong about one line; when it is wrong about a whole
file, `exempt` says so in config.

## dsbridge roles

The graph knows what a token *holds*. Only the system knows what it is *for*,
and without that a suggestion is a coin flip: `20px` is an icon size, a switch
knob and a spacing rung at once.

```sh
dsbridge roles                    # every role, what it answers, how many tokens
dsbridge roles --coverage         # the tokens no role claims
```

A role is a set of tokens and the CSS properties they answer. The system
publishes them in `dsbridge/roles.json` beside its entry stylesheet, so an app
is answered from the copy of the system it installed:

```json
{
  "version": 1,
  "roles": {
    "gap":       { "properties": ["gap", "row-gap", "column-gap"], "tokens": ["--mds-gap*"] },
    "icon-size": { "properties": ["width", "height"],              "tokens": ["--mds-icon-*"] },
    "rung":      { "properties": [],                               "tokens": ["--mds-space-*"] }
  },
  "roleOf": { "--mds-switch-knob": "icon-size" }
}
```

Tokens and properties are both globs; `roleOf` places one token by hand, and
takes it out of every role a glob would have put it in. A role with no
properties answers nothing — that is what a scale rung is, a step that exists so
the scale is complete.

A suggestion is then the intersection of *the tokens that hold the value* and
*the roles that claim the property*:

| | |
| --- | --- |
| one token in both | `certain` — the only kind `--fix` writes |
| several | `ambiguous`, all of them named |
| the property is claimed, and none of its tokens holds the value | `value-only` — the scale is missing a rung |
| nothing claims the property | `value-only`, or `certain` when one token holds it |

The relation is many-to-many on purpose: `width` is claimed by icon-size,
avatar-size and control-width together, and where more than one holds the value
the honest answer names them all rather than breaking the tie.

Coverage is reported and never enforced. A system with half its tokens declared
gets half the benefit and no failing build.

## dsbridge choosing

Everything else here is derivable. The graph knows what a token holds,
TypeScript knows what a component accepts, the import graph knows what composes
what. This does not: `Sheet`, `Modal` and `ConfirmDialog` all compile, all pass
every rule, and exactly one of them is right for the case in front of you.

```sh
dsbridge choosing                 # every choice, the default and its exceptions
dsbridge choosing Modal           # only the choices that name this component
```

```json
{
  "version": 1,
  "clusters": [
    {
      "default": "Sheet",
      "use": "a transient panel over the page — filters, a picker, a short form",
      "instead": [
        { "when": "the viewport is md or wider", "prefer": "Modal" },
        { "when": "the user has to answer before anything continues", "prefer": "ConfirmDialog" }
      ]
    }
  ],
  "deprecated": [{ "component": "Button", "prop": "kind", "use": "variant" }]
}
```

The components in a choice are not listed: they are the default plus everything
the exceptions prefer. A second copy of the same list is a copy free to go
stale, and this is the one file nothing else can check — which is why
`choosing-names-a-real-component` does, against the components the repo has.

Keep it to the choices people actually get wrong. A catalogue of forty
components is what `dsbridge check` and the session-start hook already print;
this is the dozen or so that need a sentence, and a dozen is a length somebody
will read.

`deprecated` holds what a `@deprecated` tag cannot: what to write now, and why
the old one went. Where a tag exists it is the better warning — an editor shows
it without being asked — so this is for the intent that has not been written
into the types yet.

## dsbridge next

One work item, chosen from the findings as they stand. Nothing is stored, so
there is no list to fall out of date the moment somebody fixes something
outside it — the way to close the item is to make the findings go away, and the
next run picks up whatever is now the cheapest real work.

```sh
dsbridge next                     # the item, what it closes, and the command
dsbridge next --json              # the same as data
```

```
  rewrite 86 literals that can only mean one token
  closes 86 of 407, in 41 files

  dsbridge check --fix

  One command closes every one of them, and not one is a judgement call.
```

The order is by what the work costs, not by what it is worth:

1. **fix** — the findings with exactly one answer, however few. One command
   closes them and not one is a judgement call, so nothing needing a decision
   competes with them.
2. **decide** — the value written in the most places that more than one token
   could be. Every place is the same decision made again; reading the roles
   once settles all of them.
3. **name** — the value written in the most places that *no* token holds. That
   is the system's backlog rather than this repo's debt: one token named in the
   scale closes every place here, and nothing this repo writes will.
4. **rule** — where nothing carries a value to sort by, the rule with the most
   findings.

Where `.dsbridge/baseline.json` exists, anything above it is taken first and
the output says so. When nothing is above it, the item is the largest thing the
baseline is holding — and the output says that instead, so forgiven debt and a
regression are never mistaken for each other.

### Configuration

`dsbridge.config.json` at the checked root, all keys optional:

```json
{
  "prefix": "--mds-",
  "system": "packages/tokens/src/styles.css",
  "components": "@mond-design-system/react",
  "primitives": ["Stack", "Inline", "Container"],
  "levels": ["atom", "molecule", "organism", "template"],
  "levelsIgnore": ["Docs"],
  "sources": ["src"],
  "ignore": ["**/generated/**"],
  "scales": ["spacing", "radius", "typography"],
  "exempt": {
    "no-raw-scale-step/typography": ["src/components/Link/Link.module.css"]
  }
}
```

`prefix` is the namespace the design system owns — the app's own namespace is
whatever else it declares, and the two being different is the point. Unset, it
is read off the system's own stylesheet: the first segment most of its tokens
share is the one it owns, and being told it is being told what it already says.

`system` names the design system's entry stylesheet, and is only needed when
the system is a folder the repo owns rather than a package it installed. With
neither `system` nor `--system`, it is whichever installed dependency publishes
a `styles.css` — and where a design system ships both tokens and components,
the one that *declares* the tokens rather than spending them. Two that both
declare is a question only the repo can answer, and it is asked rather than
guessed at.

`components` names the package whose exports are the design system's components
— or a path to a `.d.ts`, for a system the repo owns. Without it an app cannot
be told it has rebuilt something it already has, and the two rules that would
say so skip with that as the reason.

`primitives` names the design system's layout components. A tool that guessed
them would be telling every design system what its own parts are called, so the
rule that says "this hand-written flex row is a `Stack`" skips until the repo
says which name to reach for.

`levels` is the taxonomy, simplest first; `levelsIgnore` lists story-title
segments that name something other than a level. An app has no taxonomy until
it declares one here, and the three rules that read levels skip until it does:
its levels are its own, and a repo grouped by feature is not wrong for it.

`sources` bounds what is read at all; `ignore` removes files from within it.
Both take globs — `*` and `?` stop at a path separator, `**` does not, and a
pattern naming a directory claims everything under it.

An exemption is a claim that the rule is wrong about one file. Put the reason
in the file, next to what it excuses; `dsbridge check` will not print it for you.

## dsbridge rules

The agent-facing half.

```sh
dsbridge rules                       # every rule, one line each
dsbridge rules no-literal-color      # the reasoning, wrapped for a terminal
dsbridge rules --markdown > RULES.md # the whole set, for an agent's instructions
```

`RULES.md` in this package is that output, committed, and the Claude Code
plugin under `plugin/` ships the same file as its skill. Both are generated —
`pnpm rules` from the repo root writes both, and CI fails if either is stale.

## dsbridge hook

The same rules, moved to the moment they are cheap to act on. `hook` reads the
Claude Code hook protocol on stdin and writes it back on stdout; the plugin under
`plugin/` wires the three events to it, so nothing in either repo needs to know
where the other one is installed.

| event | what it says |
| --- | --- |
| `session-start` | the namespace, the token count, the taxonomy, what the repo already has, and what the baseline holds |
| `pre-tool-use` | what a pending `Write` or `Edit` **adds** — the file is checked as it stands and as it would stand, and only the difference is reported |
| `stop` | holds the turn open while the session has left the repo above its baseline |

`pre-tool-use` warns; it never answers the permission question. Emitting
`permissionDecision: "allow"` would settle the prompt for every `Write` and
`Edit` in the session, and a warning is not consent.

Three things it refuses to do, each for the same reason — a hook that fails
loudly is a hook someone removes, and then nothing is checked at all:

- a repo with no design system, or a config that does not parse, gets silence
  rather than an error on every write;
- a repo that has never recorded a baseline is not gated at `stop`;
- `stop` returns nothing when `stop_hook_active` is set, so the agent gets one
  turn to answer and the session cannot be trapped in a loop.

```sh
echo '{"cwd":"'$PWD'"}' | dsbridge hook session-start
```

## dsbridge migrate

For an app that has not adopted the system yet, `dsbridge check` is quiet: it reads
none of the system's tokens, so almost nothing has anything to grip. The useful
question there is what maps.

```
migration plan — kinbaku-study-group

the app's own scale  220 tokens in 15 files
  104 hold a value the system already names — read the system's instead
    --k-surface-card: #ffffff       --mds-surface-card
    --k-action-fg: #ffffff          --mds-action-fg
    --k-header-h: 56px              --mds-header-h
  116 do not — each is a brand value, or a role the contract is missing

the contract  56 semantic tokens, 0 re-pointed by this app
    copy node_modules/@mond-design-system/tokens/src/brand-template.css into
    the app, load it after the system's stylesheet, and point its values at
    the app's own tokens

literals in components  8 in 4 files
```

Where two system tokens hold the same value, the app's own name breaks the tie:
`--k-surface-card` picks `--mds-surface-card` over the other `#ffffff`.

It writes nothing. Which token plays which role is a judgement, and the report
is what somebody makes it with.

### `--semantics`

The other half of a swap is what the two components announce, which no
type-check reads. Kinbaku's confirm prompt was a `dialog` and MDS's is an
`alertdialog`; its toast announced a refusal as an `alert` and MDS announced
every toast as a `status`. Both sides were internally consistent, both test
suites passed on their own, and the difference surfaced as seventy-four red
assertions after the swap.

```sh
dsbridge migrate --semantics
```

```
what the swap announces  4 differences, 7 pairs agree
  the app announces the left; the system announces the right
    ConfirmDialog  role   dialog → alert alertdialog
    Divider        role   — → separator
    EmptyState     title  — → h3
    Toast          role   alert status → alert region status
```

It reads the app's components off their own markup — the roles they state, the
element their title renders as, and whatever the component each one opens with
announces, because a prompt that wraps a sheet is a dialog only because the
sheet is. The system's side is `dsbridge/semantics.json`, published beside its
stylesheet; without one there is nothing to compare against and the command says
so rather than reporting no differences.

Where the two names differ, the config pairs them:

```json
{ "replaces": { "ModalSheet": "Sheet", "ConfirmPrompt": "ConfirmDialog" } }
```

## The rules

There are 42, of which 30 carry a `check`. Listing them here would be a second
copy of something already generated:

```sh
dsbridge rules                  # every one, one line each, checked or judgement
dsbridge rules --for src/x.css  # only the ones that read this kind of file
dsbridge rules <id>             # what that one is protecting
```

`RULES.md` beside this file is the whole set in markdown, committed and
regenerated by `pnpm rules`.

## Any design system

Nothing here is Mond-specific except the default prefix and where it looks for
the entry stylesheet:

```sh
dsbridge check --system path/to/your/styles.css
```

Layers come from the file layout — `core/*.css`, `semantic.css`, `base.css`,
anything else that declares tokens at the document root is a brand. What the
system declares about itself goes in a `dsbridge/` directory beside the entry
stylesheet: `roles.json` and `choosing.json` above, and `contract.json` for the
contrast gate:

```json
{ "contrast": [{ "fg": "--x-text", "bg": ["--x-surface"], "ratio": 4.5 }] }
```

## Licence

MIT.
