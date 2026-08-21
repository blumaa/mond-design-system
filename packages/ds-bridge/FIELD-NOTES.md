# Field notes

What real adoptions taught the tool. One entry per finding: what happened, the
root cause, and what closes it. Entries stay after the fix, because the case is
why the test exists.

## Kinbaku adopting MDS — started 2026-08-21

The first migration dsbridge has been pointed at. Kinbaku owns a design system
rather than installing one: 206 `--k-*` tokens across seven files, 63
components, and a `dsbridge.config.json` that names its own stylesheet as the
system. Adoption replaces all of it with `@mond-design-system/react`.

This is the case no other consumer exercises. Fair Play and Kinbaku both run
dsbridge against the system they already use, so the config's namespace has
always been the entry's namespace. A migration is the one situation where the
two disagree, and `migrate` is the one command whose whole job is that
situation.

### 1. `--system` replaced the system but not its namespace — fixed

`dsbridge migrate --system <MDS tokens>` from Kinbaku's root reported `the app's
own scale  0 tokens in 0 files`. There are 206.

`loadContext` takes the entry from `--system` and the prefix from
`config.prefix` (`context.ts:218`), so the graph was MDS and the namespace was
`--k-`. `makeSheet` calls a sheet a brand file when it root-scopes a
declaration in the namespace (`context.ts:43`), which is true of every one of
Kinbaku's token files under that wrong prefix, and `planMigration` drops brand
sheets (`commands/migrate.ts:60`). The app's scale was classified as the app's
brand and vanished from the report.

The prefix is a property of the entry stylesheet, not of the repo being
checked. When `--system` names a system, the config's prefix names some other
one, and inference from the entry is the only right answer. There is also no
`--prefix` flag to work around it with.

Fixed 2026-08-21: an explicit `--system` ignores `config.prefix` and infers
from the entry (`context.ts:218`). The report went from 0 tokens to 206 in 7
files, 93 of them holding a value MDS already names.

### 2. An app's palette rungs were offered a semantic replacement — fixed

Of the 93 mapped tokens, the first three are `--k-brand-white`, `--k-sand-50`
and `--k-text-inverse`, all `#ffffff`, all offered `--mds-text-on-media`. The
third is a fair suggestion. The first two are palette rungs: what they hold is
the brand's own value, and in the migrated app they are what the brand file
points the contract *at*, not something a contract token replaces.

`valueIndex` already excludes the system's rungs from the candidates
(`commands/migrate.ts:67`, via `isRung`), because a rung is not a role. The
same reasoning applies to the app's own rungs on the other side of the map, and
nothing applies it: every app token is looked up alike. So "93 hold a value the
system already names" counts two different things, and the smaller number
underneath — the app's semantic aliases that map — is the one a migration is
actually planned from.

Fixed 2026-08-21, in two parts. A token that is a rung under the *app's own*
namespace gets no equivalent — `inferPrefix` over the app's declarations, since
`context.prefix` is now the system's. And where the pick shares no word with
the app's name and other tokens hold the same value, the mapping is marked as
what it is: `Mapping.alternatives` carries the rest, and the report says the
value chose, not the name.

Kinbaku's mapped count went from 93 to 54, of which 10 are marked guesses.
`--k-brand-white: #ffffff` now prints its nine rivals beside it instead of
`--mds-text-on-media` alone.

### 3. Only one of the three keys naming a system could be overridden — fixed

A config states the system three ways: `prefix`, `system`, and `components`.
`--system` overrides one of them. Finding 1 fixed `prefix` by inference, but
`components` has no route at all, so `migrate` printed no component section for
Kinbaku: `context.exported` was empty, and the question a 63-component app is
migrating to answer — which MDS components it would reach for — went unasked.

Editing Kinbaku's config to name MDS is not the answer while the same config
still has to describe the system Kinbaku is leaving; both are true at once for
the length of the migration.

Fixed 2026-08-21: `--components <package|path>` sits beside `--system` on
`check`, `next`, `migrate` and `choosing` — the four verbs that read
`context.exported`. The pair names the system being migrated to without the
config having to stop describing the one being left. A second config file was
the other option and is worse: `ignore`, `sources` and `exempt` describe the
app, not the system, and duplicating them is how two configs drift.

With it, Kinbaku's plan reports 23 of MDS's 60 components against 37 never
reached for.

### 4. "Imported somewhere" counts imports from the system being left — fixed

That 23 of 60 is not MDS usage. Kinbaku has not installed MDS; the 23 are names
it imports from `@kinbaku/react` that MDS also exports — Avatar, Badge, Button,
Checkbox. `reached` is every imported name in the app's sources, whatever
package it came from (`commands/migrate.ts`), and the line reads "23 of 60
imported somewhere".

The number is worth having — a same-named counterpart is exactly what a
migration maps — but under that label it says the app is already on the system.
Two different facts wear one name.

Fixed 2026-08-21: `importedNames` takes the specifier the names came from and
counts only those, and `readSystemComponents` returns the package they are
imported under alongside them — the id it was given, or, for a path, the name in
the nearest `package.json`. Where the package cannot be named the count stays as
it was, which is the only honest answer for a `.d.ts` that sits in no package.
`rules/usage.ts` asked the same question the same way and got the same fix.

Kinbaku's plan now reports 0 of 60, which is what a migration that has not
started looks like.

### 5. An aliased import counted as two components — fixed

Found while fixing 4. `import { Button as OldButton }` put `Button`, `as` and
`OldButton` in the set of imported names: the pattern took every identifier in
the binding clause. So every aliased import of the old system's Button was also
an import of the new system's, `as` was a component name as far as the set was
concerned, and the alias — a name nothing exports — was another.

Fixed 2026-08-21: `as <alias>` is dropped before the identifiers are read, so
the name taken is the one the package exports. That is the right one for both
callers: the question is which export was reached for, and a local rename does
not change the answer.

### 6. The geometry surface: dsbridge had no way to say what a brand may set

Kinbaku's brand file re-points shape and size — card radius, control heights,
the tab bar — and MDS-2 had no answer to whether it may. dsbridge could tell a
component off for writing `12px`, and had nothing to say about a brand writing
the same 12px into a role that names a rung, which is the same failure one layer
up: the ladder still says 18px and the next component to ask for a card corner
gets it.

The line is not prose. `packages/tokens/src/brand-surface.json` names every
role a brand may move, the kind of value each takes (`step` — a rung — or
`length`), and the floors that belong to nobody. dsbridge reads it the way it
reads `roles.json` and `choosing.json`, and two rules hold a brand to it:
`brand-role-takes-its-kind` and `brand-leaves-floors-alone`. Both carry `needs`,
so a system that publishes no surface gets "nothing says which roles take a
rung" rather than a silent pass.

Two things this turned up in MDS itself:

- `--mds-text-control` was `var(--mds-text-base)`, 15px. An input under 16px
  makes iOS Safari zoom the page on focus and nothing puts it back. The system
  knew about the zoom and had made the fix the brand's option, which is the
  wrong owner: every app this system ships is phone-shaped. It is now
  `max(1rem, var(--mds-text-base))` — a larger scale grows through it, a smaller
  one cannot fall under it — and a floor in the manifest.
- `--mds-gap-tight` (6px) and `--mds-stack-section` (30px) sat off the spacing
  scale. Padding inside a control is allowed off it; rhythm between elements is
  not, or a row does not line up with the one above it. Snapped to 8 and 32.

`isRung` matches `--mds-icon-md` as well as `--mds-space-2` — two segments, the
second a position — so the rule cannot work from the name alone. `rungsIn` was
extracted from `no-raw-scale-step` and asks the graph which group the token was
declared in. Both rules read the same helper, which is what keeps a component's
"stay off the rungs" and a brand's "stay on them" talking about one list.

### 7. Copy inside a component: the gate that had to exist before Phase 2

MDS held three policies at once. Some components took every string they showed
as a required prop, some took an optional one over an English default, and some
hardcoded the words. Nothing said which was right, so each new component picked
whichever the file beside it happened to use.

The default is the one that looks safe and is not. `regionLabel = "Notifications"`
compiles everywhere, so no app is ever asked for the German, and the gate that
would catch the missing translation never fires — a gate never seen to fail is
indistinguishable from a gate that cannot. Required props move the question to
`tsc`, which asks once per call site and cannot be forgotten.

`user-facing-text-is-a-prop` reads a component four ways: literals in the
attributes a person hears (`aria-label`, `alt`, `title`, `placeholder`, `label`
and the aria text properties), text nodes between tags, defaulted parameters
whose name reads as copy, and object literals under a name like `labels` or
`messages`. `target: "system"` — an app owns its words and writes `t(...)`,
which the literal scan would otherwise flag on every line.

The first run reported 124 findings, of which 105 were the scanner's fault, and
all three causes were shared with every other rule that reads a source file:

- JSDoc `@example` blocks were read as real markup. `buildContext` now blanks
  comments before any rule sees a source, the way `makeSheet` already did for
  stylesheets. A documented example of the thing a rule forbids is not the file
  doing it.
- `` throw new Error(`${component} must sit inside <Tabs>`) `` opened an element
  that never closed, so the rest of the file read as text. The scanner is now
  string-aware in the same pass.
- `) : null}` was reported as copy. JSX alternates between markup and code, so
  the scanner carries a frame stack: inside `{...}` a string is a string, inside
  an element it is what somebody reads.

The surviving 19 were all real, and four of the eight components they named were
not in the migration plan: `AvatarGroup`'s "+N more", `ConfirmDialog`'s
"Cancel", `Toast`'s "Notifications" and "Dismiss", and `DateTimePicker`'s bag of
eight. The plan had listed the four everyone remembers.

Two shapes came out of the fixes. `AvatarGroup.overflowLabel` is
`(hidden: number) => string` rather than a string, because only the app knows
how its language counts. `Tag` pairs `onRemove` with `removeLabel` in a
discriminated union, so a tag with no remove button is not asked for the words
of one.

Known limit: a bag of strings is only found through the name of the const that
holds it. `labels`, `messages`, `copy` are caught; `strings2` is not. The name
is the only evidence available without knowing what each key means, and a rule
that guesses at intent would report the app's config objects too.

### 8. Building six components with the tool open beside them

Phase 2 added `Breadcrumb`, `MediaPlaceholder` and `UploadProgress` with
`dsbridge rules --for <path>` run before each stylesheet and `dsbridge check`
after it. Every one of them came out clean on the first check — which sounds
like the tool did nothing, and is the opposite. The rules were read before the
file was written, so what would have been three findings never got typed.

Two things it could not answer, both about the same moment:

- `no-literal-length` refuses `blur(20px)` and a hatch pitch of `8px`, correctly.
  `dsbridge tokens --grep blur` then answers "no tokens match that filter" and
  stops. That is the whole answer to "does the system already name this?" and no
  answer at all to "so where do I put it?" — which core file, which naming shape
  (`--mds-blur-media` or `--mds-media-blur`, `--mds-upload-thumb` beside
  `--mds-avatar-md`). Both decisions were made by reading neighbouring tokens.
  A `tokens --propose <name>` that named the file the nearest group lives in,
  and showed how that group names things, would close it.
- `check <path>` filters findings to that path, but its summary line still counts
  the whole repo: "clean — 51 stylesheets, 264 tokens". A scoped run reads as
  though the path was ignored, which is exactly the doubt a check is meant to
  remove. It cost a deliberate broken-colour probe to confirm the file was being
  scanned at all.

The `--mds-icon-slot` convention was found by grep, not by the tool: a control
that offers an icon slot publishes the step and sizes the slot from it, and
`control-tokens.test.ts` enforces it through a hand-maintained list of files.
`UploadProgress` had to be added to that list by hand. A rule reading "a
stylesheet that declares `--mds-icon-slot` reads it back for width, height and
font-size" would enforce it for every component, including the ones nobody
remembers to add.
