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

### 9. Verifying a release against an app that already shipped

MDS 4.0.0 makes every user-facing string a required prop. What that costs an app
is not a judgement call, it is a number: Fair Play, built against 3.0.3, came to
58 type errors in 48 files, and every one of them was a string the library used
to supply. Six props account for all of them — `ToastProvider`'s pair (25),
`ConfirmDialog.cancelLabel` (18), `Spinner.label` (5), `AvatarGroup.overflowLabel`
(6), `SearchField.clearLabel` (2), `DateTimePicker.labels` (2). The long tail is
the two providers an app mounts once and the dialog it raises everywhere; the
components with one label each barely register. A release note that says "expect
roughly one error per overlay and provider, and one per confirm" would have been
worth more than the list of changed components.

The brand rules earned their keep on the first run. `brand-leaves-floors-alone`
found that Fair Play re-pointed `--mds-text-control` — a floor, not a role. The
value was right (16px either way), which is exactly why nobody would have looked:
the failure was that the floor had moved into a file where the next edit could
lower it, and only a rule reading the manifest could see that.

It also showed the gap next to it. Fair Play re-points sixteen typography
tokens the manifest does not name as settable — the raw scale rungs
`--mds-text-sm`, `--mds-text-base`, `--mds-text-md` and the `--mds-type-*` roles
built on them — and dsbridge said nothing, because `brand-role-takes-its-kind`
only judges the roles the manifest lists. The manifest is read as a list of
promises and not as a fence. A brand may set what it names; nothing says a brand
may set *only* what it names, so the layering the note in `brand-surface.json`
describes ("raw scales the system's, never re-pointed index-to-index") is prose
with no rule behind it. The rule that closes it — call it
`brand-sets-only-what-the-manifest-names` — has to be geometry-only, since
colour is settable in full by design, and it will report a real app on day one:
Fair Play's type scale is a deliberate, shipped decision, not a slip. That is an
argument for `--baseline`, not against the rule.

Two smaller notes from building Lightbox and VideoPlayer beside the tool:

- `every-component-has-a-story` caught VideoPlayer's missing story file, which
  is the kind of thing that gets forgotten at the end of a long component.
- dsbridge is silent about what eslint's `react-hooks/refs` and
  `react-hooks/immutability` catch: a ref read during render, and a mutation
  reached through a value already used in JSX. Both fired on real code here.
  They are not conformance rules and dsbridge should not grow them, but a
  system's setup guidance should say the two tools are complementary, or an
  agent that sees `dsbridge check` pass will believe the component is done.
- `check --root <an app with no dsbridge.config.json>` names the six rules it
  skipped and why. That is the right behaviour and worth keeping: the rules that
  need a taxonomy said so rather than passing.

### 10. The tool blocked its own design system's release

`changeset publish` for react 4.0.0 and tokens 3.2.0 published tokens, then
stopped on:

```
E403: 403 Forbidden - PUT https://registry.npmjs.org/ds-bridge
Package name too similar to existing package dsbridge
```

React never went out. The cause is not the 403 — it is that ds-bridge was a
candidate for publishing at all. It sits in the workspace at `0.0.0`, has never
had a changeset written for it and has no changelog, and it was neither
`private` nor in the changesets `ignore` list. `@mond-design-system/storybook`
is both; ds-bridge was neither, so every release of the design system was
already carrying an unversioned package along with it, and the first one to
reach npm found out that way.

Marked `private: true` and added to `ignore`, matching storybook.

Two things to carry forward. The bare name `ds-bridge` is unavailable on npm
whatever the version, so shipping this tool means a scoped name —
`@mond-design-system/ds-bridge`, with the `dsbridge` bin unchanged, since the
bin name is what a consumer types and it is not affected by the scope. And a
partial publish is the failure mode worth designing against: the registry now
holds tokens 3.2.0 against a react that is still 3.0.3, which is a version pair
no app should install. Changesets publishes alphabetically and stops at the
first failure; nothing about that ordering knows which packages are a set.

### 11. `system` is a path, not a specifier — the app has to know where a package hides its stylesheet

Repointing Kinbaku's config from its own design system to MDS, the obvious
value for `system` was the one the app imports:

```json
"system": "apps/web/node_modules/@mond-design-system/tokens/styles.css"
```

`dsbridge tokens` failed with ENOENT. The file is at
`.../tokens/src/styles.css`; `styles.css` is an `exports` key, not a path on
disk, and the tokens package maps `"./styles.css"` to `"./src/styles.css"`.

The value that works is the resolved one, which means the config records a
detail of how a dependency happens to lay out its own repository. That breaks
the first time the package moves the file — a change its `exports` map exists
precisely to make invisible.

`resolveSystem` already resolves specifiers when `system` is absent, using
`createRequire`. What is missing is doing the same when it is present: if the
value is not a path that exists, try resolving it as a specifier before giving
up. `"@mond-design-system/tokens/styles.css"` is then a legal value, and it is
the one an app can write from memory.

### 12. `tokens --grep` takes a string, and it reads like a regex

`tokens --grep "sidebar\|nav\|header"` returned `no tokens match that filter`,
which is true — no token has that literal text in its name — and useless. The
flag is called `grep` and it is spelled like an alternation, so the failure
reads as "there is no sidebar token", the opposite of the truth.

Two ways to close it and only one is right. Making the filter a real regex is
the smaller change but the larger surprise: `--grep "pad-"` is fine either way,
`--grep "text-2xl"` is not obviously so, and a token search is somewhere an
agent should not have to think about escaping. Splitting the filter on `|` and
matching any part keeps the substring semantics and makes the spelling that
already looks right actually work. Either way, the empty result should name what
it searched — 265 tokens under `--mds-` — so the reader can tell an empty search
from an empty system.

### 13. A render prop that is handed a number the CSS already owns

MDS's `Icon` takes a `size` and passes the pixel value to the registry's render
function alongside the name. Kinbaku's registry ignores it, and that is the
right call: the span `Icon` draws is already sized from `--mds-icon-*`, so a
glyph drawn at the number would stop matching the moment a brand moved the
token. Sizing the glyph to 100% of its span keeps one source.

But the number is in the API, so an app that uses it — the obvious reading of a
prop named `size` — silently opts out of the token. This is
`earn-the-semantic-token` in a shape the rule cannot see, because there is no
literal anywhere: the app writes `width: {size}`, and the px arrives from the
system.

Two candidate rules, both worth having. `render-prop-size-is-the-css-token`
would be a system-side rule: a component that publishes a token for a dimension
should not also hand that dimension to a render prop as a number. And
`icon-glyph-fills-its-span`, app-side: an icon registry's rendered glyph reads
its size from the slot, not from an argument. The second is checkable today;
the first needs the tool to pair a token with the prop that duplicates it,
which is the same machinery note 8 wanted for `--mds-icon-slot`.

### 14. Four gaps in one migration, and the tool found none of them

The shell layer of the migration needed four things MDS did not have:
`TabBarItem hideLabel`, `AppBar className` passthrough, `toast()` with an
`action` and an `onDismiss`, and `SegmentedControl` at a small size without its
frame. All four are now in react 4.1.0.

Every one surfaced by reading the app's code against the system's API, and
dsbridge said nothing about any of them. That is not a defect — `check` measures
a file against the rules, and a missing prop is not in a file — but it marks the
edge of what the tool covers. The command that would have found them is the one
that does not exist: something that takes an app's component and the system's
component and reports the props the app passes that the system does not accept.
`migrate` already parses both sides to build its component map. A
`migrate --props` that lists, per component pair, the unmatched props, would
have produced this list on day one of the migration rather than file by file
through it.

The AppBar case is the sharpest, because the system's own rules caught it the
moment the fix was written: adding `{...rest}` to the header made
`forwards-its-ref` fire, and the ref went in with it. The rule knew what a
spreading component owes its caller. Nothing knew that the component owed a
`className` in the first place.

### 15. A raw element that is not a hand-rolled anything

`no-raw-element-over-component` fired on the `<button>` inside
`DesktopSidebar`'s `NavRow`, and the finding was wrong. The rule reads a raw
`<button>` as a Button somebody built by hand, which is the usual case and the
one worth catching. This one is a side-nav row: an icon, a label, a count, and
`aria-current` on the item that matches the route. MDS exports no component for
it, so the only advice the rule could give is "use Button", and taking that
advice would make the row worse.

The signal the rule is missing is arity. A raw `<button>` whose children are
text, or text and one icon, is a Button that was not imported. A raw `<button>`
with three children in a row, one of them a live count and one of them carrying
a route-aware ARIA state, is a composite the system has no name for. The second
is a gap in the component library, not a violation, and the honest output for
it is a different one: not "replace this" but "the system has nothing for
this". A rule that cannot tell them apart teaches the reader to reach for the
suppression comment, which is the one habit the tool exists to prevent.

### 16. The app's test suite caught two semantic breaks the tool could not

Swapping a component for its MDS counterpart changed two things no rule looked
at, and both surfaced as red tests in kinbaku rather than as findings.

The confirm prompt: kinbaku's was `role="dialog"`, MDS's `ConfirmDialog` is
`role="alertdialog"`. Fifty-five assertions across thirteen files went looking
for a dialog and found nothing. The fix was mechanical once the cause was
known, and unfindable before then — `queryByRole('dialog')` on a screen with no
dialog passes, so some of those assertions had quietly stopped asserting
anything at all.

The toast: kinbaku announced a refusal with `role="alert"`, MDS announced every
toast with `role="status"`. Nineteen tests failed, and the right fix was in the
system rather than the app — a refusal interrupts, and MDS already agreed with
itself about that everywhere else (`ConfirmDialog`'s error line and
`UploadProgress`'s failure are both alerts). Released as react 4.3.0.

Both are the same shape as note 14's four gaps — a difference across the
boundary that neither side's own tests could see, because each side was
internally consistent. But these are not missing props; they are the same prop
meaning something else. `migrate` already pairs the app's component with the
system's, and it could diff what those two render: the role, the ARIA state,
the accessible name pattern. A `migrate --semantics` that said

    ConfirmDialog   role  dialog → alertdialog
    Toast (danger)  role  alert  → status

would have been the whole of both investigations, on day one, before a single
test was written against the new component.

### 17. `no-raw-scale-step` steering, and it worked

The one rule that paid for itself unprompted in this layer. Every finding it
raised in the shell stylesheets — `--mds-space-2` in a gap, `--mds-space-4` in
a padding — had a role token waiting for it: `--mds-gap-tight`,
`--mds-pad-page-x`. Fixing them was not a rename but a decision about what the
value was for, and in each case the answer was already named.

One finding had no role behind it: 4px of vertical padding on the sidebar's
group heading. There was no `--mds-pad-heading-y`, and inventing one for a
single call site would have been the app writing a token for itself. Reading
the rule's question — what is this padding for? — the answer was that it was
holding the heading off the rows beneath it, which the group's own
`--mds-gap-hairline` already does. The declaration came out entirely. A rule
that ends in deleted code rather than a substituted token is the rule working
at its best.

### 18. The dying system's tokens are invisible, which is the migration's blind spot

`dsbridge check apps/web/src/components/PostControls.module.css` reports
"clean". The file is built entirely out of `--k-gap`, `--k-space-3` and
`--k-radius-control` — the design system being migrated away from. Every
length in it comes from a system dsbridge has never heard of, and the tool
has nothing to say.

The rules are individually right. `no-undefined-token` reads `--mds-` tokens
and checks they are declared. `no-foreign-namespace-token` says an app
re-points the system's tokens and does not invent new ones *in the system's
namespace* — `--k-` is a different namespace, so it is the app's own business.
Between them there is a hole exactly the shape of a migration: the one job
where "which files still read the old system?" is the only question that
matters, and the tool that exists to answer questions about design system
adherence cannot answer it.

The app has to hand-roll the gate. Kinbaku's PR 8 ends with a grep asserting
zero `--k-` across `src/`, which is a check dsbridge should own:

    "retiring": ["--k-"]

in `dsbridge.config.json`, and every read of a retiring namespace becomes a
finding with a file and a line. That turns the migration's progress into
something the tool reports — `dsbridge check` counting down — rather than
something a person tracks in a plan document. It also makes the end of a
migration provable, which a grep in a CI script only approximates.

### 19. A panel's title was not a heading, and only the app's tests knew

Four tests in `ReactorsSheet.test.tsx` failed on `getByRole('heading', { name:
'Who reacted' })` after the sheet moved to MDS. Kinbaku's `ModalSheet` rendered
its title as a heading; MDS's `SheetHeader` rendered a styled `<span>` and named
the dialog with `aria-label` instead. Both name the dialog, so no automated
check on either side saw a difference — axe passes, the accessible name is
right, and the only thing lost is the title's place in the document outline.
`ModalHeader` had the same shape, and `AppBar` — the third reader of
`--mds-type-panel-title` — already rendered its title as the page `h1`, so the
system disagreed with itself in a way nothing was reading.

Same family as note 16: a difference across the boundary that neither side's
own tests could see. And the same fix would have caught it — a `migrate
--semantics` that diffed the element and role of what each component renders
would have printed

    ModalSheet → Sheet   title  h2 → span

before the swap. Released as react 4.6.1.

### 20. Two components that both compile, and the reason to prefer one

`ListItem` grew an `actions` slot during this layer, and the reason is worth
recording because `choosing` should be able to say it. A reactor row links to
the member's profile and carries a remove button for the reader's own
reaction. `trailing` compiles — it takes a `ReactNode` and the button renders.
It also puts a `<button>` inside an `<a>`, which is invalid HTML and leaves
the control unreachable by name.

The system had one slot after the text and two jobs for it: things that are
read (a badge, a chevron) and things that are pressed. `trailing` sits inside
the row's hit target and `actions` sits beside it, so the choice between them
is now the question "is this read or pressed?" rather than a guess.

Kinbaku's `MemberList` had the right shape all along — its `action` rendered
outside `.k-member__hit` — which is the second time in this migration the
dying library has been the one with the more careful markup. That is worth
saying plainly: a component library grown inside one app knows things the
general system had no reason to learn, and a migration is the only moment
those are legible.
