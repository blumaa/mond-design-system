# @mond-design-system/conformance

The `mds` CLI: look at the token graph, check an app against the design
system's rules, and measure what an app would have to move to adopt it.

Zero runtime dependencies. Reads CSS — it does not run your build, and it does
not care which framework rendered the class.

```sh
pnpm add -D @mond-design-system/conformance

mds tokens            # the graph: core scales, semantic contract, your brand
mds check             # the rules, as a work list
mds rules [id]        # what each rule is protecting
mds migrate           # the distance between this app and the system
```

## Why

A design system's promise is that a rebrand is one CSS file and nothing else
moves. Three things break it, all of them silently:

- a component writes a literal (`#18201B`, `8px`) — it is the one thing that
  does not change when the brand lands, and it never flips for dark mode;
- a brand re-points a colour and nothing re-proves the contrast — the system's
  own accessibility test still passes, on values the app does not render;
- guidance lives in a README and enforcement lives in a script, so they drift.

Here a rule is one object with both halves: `check()` is what `mds check` runs,
and the prose is what `mds rules` prints. They cannot disagree.

## mds tokens

```sh
mds tokens --layer semantic          # the contract
mds tokens --theme dark --kind color # what dark actually resolves to
mds tokens --grep action --json
mds tokens --html tokens.html        # a page you can look at
mds tokens --unbranded               # the system's defaults, brand ignored
```

Every token is resolved, not just listed: `--mds-action-bg` prints the colour
the browser will paint, through however many `var()` hops and `color-mix()`
calls the brand put in the way.

## mds check

```sh
mds check                    # every rule that applies here
mds check --rule keeps-contrast
mds check --json             # for CI
```

Exit code 1 when there are findings. Each one names the file, the line, the
rule, and — when the value is already in the graph — the token that holds it:

```
src/components/Card.module.css
  12  literal length 1px — var(--mds-border-width) has that value  no-literal-length
  18  literal color #18201B — var(--mds-text-primary) has that value  no-literal-color
```

A rule that cannot run here says so rather than passing quietly:

```
skipped keeps-contrast: the design system installed here publishes no
contract.json, so there is nothing to prove against
```

### Configuration

`mds.config.json` at the checked root, all keys optional:

```json
{
  "ignore": ["src/__fixtures__"],
  "scales": ["spacing", "radius", "typography"],
  "exempt": {
    "no-raw-scale-step/typography": ["src/components/Link/Link.module.css"]
  }
}
```

An exemption is a claim that the rule is wrong about one file. Put the reason
in the file, next to what it excuses; `mds check` will not print it for you.

## mds rules

The agent-facing half.

```sh
mds rules                       # every rule, one line each
mds rules no-literal-color      # the reasoning, wrapped for a terminal
mds rules --markdown > RULES.md # the whole set, for an agent's instructions
```

`RULES.md` in this package is that output, committed. Regenerate with
`pnpm rules`.

## mds migrate

For an app that has not adopted the system yet, `mds check` is quiet: it reads
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

## The rules

| id | target | what it requires |
| --- | --- | --- |
| `no-literal-color` | both | a component names a colour, never writes one |
| `no-literal-length` | both | lengths come from the scale; a `@media` prelude may use a declared breakpoint |
| `no-raw-scale-step` | both | components read the alias that names the role, not the rung behind it |
| `no-undefined-token` | both | every token read is declared, or read with a fallback |
| `no-foreign-namespace-token` | both | an app re-points the system's tokens; it does not invent new ones in that prefix |
| `brand-ships-dark` | both | a brand file carries both themes |
| `brand-overrides-both-themes` | both | a token re-pointed in one theme is re-pointed in the other |
| `brand-covers-contract` | system | the brand template the system ships declares every semantic token |
| `keeps-contrast` | both | every pair in `contract.json` clears its ratio, in both themes, with the brand applied |

`mds rules <id>` for what each one is protecting.

## Any design system

Nothing here is Mond-specific except the default prefix and where it looks for
the entry stylesheet:

```sh
mds check --system path/to/your/styles.css
```

Layers come from the file layout — `core/*.css`, `semantic.css`, `base.css`,
anything else that declares tokens at the document root is a brand. The
contrast contract is `contract.json` beside the entry stylesheet:

```json
{ "contrast": [{ "fg": "--x-text", "bg": ["--x-surface"], "ratio": 4.5 }] }
```

## Licence

MIT.
