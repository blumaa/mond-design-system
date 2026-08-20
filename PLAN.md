# MDS-2 Plan

Rebuild Mond Design System (MDS) as shared, brand-agnostic foundation for fairplay, kinbaku-study-group, CompHQPro. Old MDS dies. New MDS lives in `tools-libraries/MDS-2/`.

Status: WORKSHOPPED 2026-08-17. All §9 questions resolved. Ready for Phase 0.

---

## 1. What exists today (investigation)

### Old MDS — `tools-libraries/mond-design-system`
- 25 components. JSON tokens + custom build scripts. Runtime `ThemeProvider` + JS brand objects (`brands/brand-1.ts`). Jest. Yarn workspaces.
- Verdict: kill. Runtime JS theming heavier than CSS-variable theming both new systems use. No consumers. Nothing worth porting except lesson: multi-brand was right goal, wrong mechanism.

### Kinbaku DS — `apps/Alexander Ma + Natasha Umbrella/kinbaku-study-group/kinbaku-design-system`
- ~63 components. Flat `src/components/<Name>/` — `.tsx` + `.css` + `.test.tsx` per component.
- Plain CSS, `k-` BEM prefix. Tokens: 7 brand primitives, ramps derived via `color-mix`, semantic aliases only in components. Rebrand = edit one primitive block.
- Dark mode: `[data-theme="dark"]` re-points semantic aliases. No component ships dark CSS.
- `dsbridge check`: rejects literal hex / raw `@media` values in components.
- Hooks: `useOverlay`, `usePresence`, `useRovingGroup`.
- pnpm + turbo + tsup + vitest + Storybook. React 18 peer.

### Fairplay lib — `apps/fairplay/fairplay-app/component-lib`
- ~55 components. CSS Modules. Folders: `primitives/ forms/ display/ feedback/ organisms/`.
- Tokens: raw palette `--fp-c-*` + semantic `--fp-*`. Dark = same `[data-theme="dark"]` swap. Theme-independent tokens documented (on-media, scrim, conduct cards).
- **Contrast gate test** (`tokens/contrast.test.ts`): resolves token graph from CSS, asserts WCAG AA for every foreground on every surface. Caught real bug (danger 4.03:1).
- Hooks: `useOverlay`, `usePresence`, `useRovingTablist`.
- Same stack: pnpm + turbo + tsup + vitest + Storybook. React 18.

### Convergence (already agree — keep)
- Two-layer CSS-variable tokens, semantic-only in components.
- Dark mode = token swap under `[data-theme="dark"]`.
- Components self-styled, no provider, consumer imports one stylesheet.
- Package pair: `tokens` + `react` lib. tsup build, `sideEffects: ["*.css"]`, ESM+CJS.
- Test file next to every component. Storybook as visual oracle.

### Divergence (must decide)
| Question | Kinbaku | Fairplay | MDS-2 recommendation |
|---|---|---|---|
| CSS strategy | Plain CSS, `k-` BEM | CSS Modules | **CSS Modules** — collision-proof across 3 apps, fairplay proves tsup pipeline works. Class hashing prevents app-side style poking (good: forces API-level customization) |
| Folder layout | Flat list | Atomic-ish groups | **Flat storage, atomic taxonomy in Storybook/docs.** Kinbaku argument holds: reclassifying = file moves + import rewrites for zero behavior change. Atomic design = thinking + docs tool, not directory law (matches how MUI/Chakra ship) |
| Icons | lucide-react | Material Symbols font | **Workshop item** — see §9 |
| Focus ring | accent-based ring | dedicated `--focus-ring-*` tokens | Dedicated focus tokens (fairplay). Explicit contract, testable |

---

## 2. Principles

1. **Agnostic core, branded skin.** Components know only semantic tokens (`--mds-*`). Brand = one CSS file. Zero brand logic in components.
2. **Atomic design as taxonomy.** tokens → primitives (atoms) → composites (molecules) → patterns (organisms). Docs + Storybook organized this way. Files flat.
3. **Three token layers** (Spectrum model):
   - **Core** (global/primitive): raw values. `--mds-c-*`, scale steps, font stacks. Never used by components.
   - **Semantic** (alias): `--mds-surface-card`, `--mds-text-primary`, `--mds-accent`, `--mds-focus-ring-color`. The component contract. Brands + dark theme re-point these.
   - **Component** (optional, sparse): `--mds-button-radius` style overrides only where a brand legitimately needs per-component divergence. Add on demand, never speculatively.
4. **Deterministic, test-driven.** No component without failing test first. No optimistic rendering paths.
5. **Components own their styles.** One `.module.css` per component. No global styles beyond reset + tokens. No Tailwind, no inline styles, no mixing.
6. **WCAG 2.2 AA is a build gate**, not a review note (§6).
7. **Mobile-first responsive.** Base styles = 320px. `@media (min-width)` up. Breakpoint values enforced by `dsbridge check` (media queries can't `var()` — kinbaku's solved problem).
8. **DRY across apps:** only components ≥2 apps need live in MDS. App-domain components (PostCard, GroupChatHeader, ReportCard…) stay in apps, composed FROM MDS parts.

---

## 3. Repo structure

```
MDS-2/
  PLAN.md                     this file
  package.json                pnpm workspace root
  pnpm-workspace.yaml
  turbo.json
  packages/
    tokens/                   @mds/tokens
      src/
        core/                 colors.css spacing.css typography.css radius.css
                              elevation.css motion.css layout.css
        semantic.css          the contract — every --mds-* alias, neutral
                              "mond" defaults, light + dark scopes
        base.css              reset + document defaults + focus-visible
        brand-template.css    full contract listing — apps copy INTO their
                              own repo, fill values. MDS ships zero brands.
        styles.css            @import graph
      contrast.test.ts        WCAG gate: mond defaults × light+dark, template
                              contract-coverage check
    react/                    @mds/react
      src/
        components/<Name>/    Name.tsx  Name.module.css  Name.test.tsx
        hooks/                useOverlay usePresence useRovingGroup
        internal/             shared unexported helpers (cx, Portal)
        index.ts              public barrel
    storybook/                @mds/storybook — atomic-grouped titles,
                              theme toolbar + local demo brand (private,
                              proves the swap; not published), a11y addon
    conformance/              @mds/conformance — the `dsbridge` CLI: tokens, check,
                              rules, migrate. Rules are data, so the prose and
                              the enforcement cannot drift.
  docs/
    README.md  getting-started  theming  tokens  contributing  a11y
```

Consumption:

```tsx
import "@mond-design-system/tokens/styles.css"; // core + semantic defaults + base
import "./brand.css";                           // APP-OWNED: copied from brand-template.css, loads after, wins
import { Button, Card } from "@mond-design-system/react";
// dark: data-theme="dark" on any ancestor
```

---

## 4. Token system detail

### Core
- Color: each brand owns small primitive set (kinbaku proved 7 enough); ramps derived `color-mix`. No hand-picked pastel lists.
- Spacing: single scale `--mds-space-1..12` (4px base).
- Type: role fonts `--mds-font-display/body/mono`, size scale `--mds-text-xs..4xl`, leading, weight, tracking.
- Radius, elevation (shadow rgb + alpha steps), motion (durations, easings), layout (breakpoints `--mds-bp-*`, container widths, touch target min 44px).

### Semantic contract (components use ONLY these)
- Text: `primary secondary muted inverse accent on-media`
- Surface: `page card raised sunken inverse media`
- Border: `subtle strong control`
- Action: `bg fg bg-hover` + `accent accent-contrast`
- Status: `danger warning success` + `-soft` fills + `-contrast`
- Focus: `ring-color ring-width ring-offset`
- Overlay: `scrim overlay`
- Theme-independent group documented explicitly (fairplay lesson: on-media/scrim must NOT flip with theme).

### Brand file anatomy (each = one file, 3 sections)
1. Primitive block (raw hex, fonts, shadow tint)
2. Semantic re-point (light)
3. `[data-theme="dark"]` re-point

Rebrand or new app = new file, nothing else moves. Both source systems already prove this.

### No JSON token pipeline
Old MDS built CSS from JSON via scripts. Neither new system needed it. CSS custom properties ARE the source of truth. KISS. Revisit only if Figma sync demands JSON (workshop item).

---

## 5. Component inventory

### v1 core — shared by both apps today (~32)
| Tier (docs taxonomy) | Components |
|---|---|
| Primitives | Text, Heading, Icon, Button, IconButton, Link, Avatar, AvatarGroup, Badge, Tag/Chip, Divider, Skeleton, Spinner, ProgressBar |
| Forms | Field, Input, Textarea, Select, Checkbox, Radio, Switch, SegmentedControl, SearchField |
| Composites | ListItem/ListGroup, EmptyState, Tabs, Toast(+Provider), Tooltip? (old MDS only — defer) |
| Patterns | Screen, AppBar, TabBar/FooterNav, Card, Modal, Sheet, ConfirmDialog |
| Hooks | useOverlay, usePresence, useRovingGroup |

### v2 candidates (one app today, likely shared later)
Combobox, DateTimePicker, Slider/RangeSlider, MentionField, ReactionBar/List/Picker, ImageCarousel, Lightbox, Breadcrumb, Stat, RichText, ErrorBoundary, Thread, UploadProgress.

### Stays in apps (domain-specific)
PostCard, PostComposer, CommentThread, GroupChatHeader, ReportCard, AdminTable, MemberList, NotificationList, SensitiveMediaOverlay, VideoPlayer, ConductCard tones, BallLoader (fairplay brand flourish — see §9 open question on brand-specific components).

Per-component API: reconcile both existing APIs, take superset only where both apps use it. Prefer kinbaku's polymorphic `as`/`href` pattern + fairplay's stricter prop naming. Every divergence logged in component doc.

---

## 6. WCAG strategy (2.2 AA)

Build gates, all in CI:
1. **Contrast test** — port fairplay `contrast.test.ts`, generalize: every brand × light × dark, every semantic foreground × every surface it can sit on. AA 4.5:1 text, 3:1 UI (1.4.11 — kinbaku control-border lesson).
2. **Token lint** — `dsbridge check`: no literal hex, no raw media values in `@mds/react`, plus the brand and contrast rules. Same binary an app runs against itself.
3. **axe per component** — `vitest-axe` in each component test (default render + each variant).
4. **Storybook a11y addon** — visual review channel.
5. Manual contract per component doc: keyboard map, focus order, ARIA roles, touch target ≥44px, `prefers-reduced-motion` honored in motion tokens.

---

## 7. Testing / TDD

- vitest + @testing-library/react + vitest-axe. jsdom.
- Rule: test file written first, red → green. One `.test.tsx` per component (both systems already do this — port + adapt tests, they encode learned edge cases).
- Test tiers: render/props/variants, interaction (keyboard included), a11y (axe + ARIA assertions), token discipline (script), contrast (token graph).
- No snapshot-only tests. Deterministic: fake timers for motion/toasts, no real network.
- Coverage target: 100% of exported components have interaction + axe tests. Line % is not the metric.

---

## 8. Build & tooling

- pnpm workspaces + Turborepo (both source systems already use).
- tsup: ESM+CJS+d.ts, CSS Modules compiled into single `index.css` per package. `sideEffects: ["*.css"]`.
- React ≥19 peer. Ref as prop, no forwardRef. Apps (currently 18.3) upgrade before adopting MDS.
- TypeScript strict. ESLint flat config.
- Storybook: one stories file per component, titles atomic-grouped, toolbar: brand switch × theme switch.
- Versioning + publishing: see §8b.

## 8b. Publishing & versioning

Apps live in separate repos — npm is the consumption mechanism.

**Registry & scope**
- Publish public to npm. Old scope `@mond-design-system` already exists (v2.9.12, `@mond-design-system/theme`, MIT). Reuse it: no new scope squatting, npm scope ownership already held.
- Packages: `@mond-design-system/tokens`, `@mond-design-system/react`. Old `theme` package: deprecate on npm (`npm deprecate`) once MDS-2 ships, never reuse the name.
- Scope decision: keep `@mond-design-system`. Ownership held, rename cosmetic.

**Versioning**
- Semver, enforced. 3 consumers — breaking change = major, no exceptions.
- Changesets: every PR touching packages adds a changeset; CI blocks merge without one. Changesets generates CHANGELOG.md per package + version bumps.
- `tokens` and `react` version independently (react depends on tokens via `^` range). Semantic token contract change = major on tokens.
- Start at `1.0.0-alpha.x` during phases 0–4. `1.0.0` gate = fairplay migration complete (phase 5).

**Release flow**
- CI on main: build + full test gates (contrast, axe, token-lint) → changesets version PR → merge → auto-publish with provenance.
- Git tags per release (`@mond-design-system/react@1.2.0`).
- During development/migration: apps consume via `pnpm link` or local `file:` — never publish untested from a laptop; publishing is CI-only.

**Repo & version control**
- MDS-2 = own git repo at `tools-libraries/MDS-2`. Init at phase 0.
- Trunk-based: main protected, PRs + CI gates. No long-lived branches.

---

## 9. Workshop decisions (all resolved 2026-08-17)

1. **Icons.** RESOLVED: pluggable registry. `Icon` accepts icon set from brand setup; core agnostic. Kinbaku keeps lucide, fairplay keeps Material Symbols. Brand owns iconography like it owns color.
2. **Brand flourish components** (BallLoader, conduct-card tones). RESOLVED: stay in app, composed from MDS primitives. MDS ships generic `Spinner`. Flourish = app identity, not system.
3. **Package naming/publishing.** RESOLVED → §8b. npm publish under existing `@mond-design-system` scope, changesets + semver, CI-only publishing. Scope stays `@mond-design-system` — ownership already held, rename cosmetic.
4. **MDS-2 final location.** RESOLVED: `tools-libraries/MDS-2`, own git repo. Old `tools-libraries/mond-design-system` deleted at phase 7.
5. **Typography.** RESOLVED (superseded by 9): brand CSS declares `@font-face`; woff2 lives in the APP, not in MDS. Brand re-points `--mds-font-*` role tokens.
6. **Tooltip/Popover/Dropdown.** RESOLVED: wait — build when CompHQPro has real requirements (YAGNI, no consumer = optimistic code). But: `useOverlay` API designed anchor-capable now; positioning engine when built = `@floating-ui/dom`, never hand-rolled. Mirrors MUI (Popper on Floating UI) and Spectrum (`@react-aria/overlays` single positioning layer) — one shared layer, anchored components compose it.
7. **CSS strategy.** RESOLVED: CSS Modules. React Spectrum model — internals private (hashed classes), customization via tokens + props only; no MUI-style stable class contract (override API for unknown consumers we don't have, maintenance cost we'd pay anyway). Zero-runtime CSS confirmed by both references (Pigment CSS, Spectrum style macros).
8. **React target.** RESOLVED: React 19-only, peer `>=19`. MDS is agnostic — sets its own bar, doesn't track app state. No `forwardRef` (ref as prop), modern APIs allowed. Consequence: apps upgrade to React 19 as prerequisite of their migration phase. Ported source code (both libs use forwardRef) modernized during port.
9. **Brand ownership (added 2026-08-17, supersedes earlier "3 brand files in tokens").** RESOLVED: brands live in CONSUMING APPS, never in MDS. MDS = contract (semantic.css, neutral defaults) + `brand-template.css`. App copies template, re-points `--mds-*` tokens, owns its fonts. MDS contains zero product/app knowledge — no app names, no app-domain tokens (no feed widths, conduct cards, thumbnails). Storybook proves theming with a private generic demo brand.
10. **Layout primitives (added 2026-08-17).** RESOLVED: ship `Stack` (vertical), `Inline` (horizontal), `Container` (max-width column) — token-bounded props only (gap enums on `--mds-gap-*`, widths on `--mds-content-max*`). NO generic Box, NO open style prop: MUI `sx`-style escape hatch would bypass the token gate; Card + surface tokens cover styled containers. Model = Atlassian/Polaris bounded primitives; spacing owned by parent `gap`, components ship zero outer margin (Spectrum rule).
11. **Composition over configuration (added 2026-08-17).** RESOLVED: multi-part components expose semantic children, not config props — `<Card><CardHeader/><CardBody/><CardFooter/></Card>`, same for Modal/Sheet. Flat named exports (CardHeader, not Card.Header), matching Tabs/TabList/Tab/TabPanel. Container owns internal spacing (slot principle). Atoms stay prop-based (Button iconLeft etc.); ListItem keeps leading/trailing slot props. Anti-pattern reference: Ant Card (title/extra/actions/cover/tabList prop explosion + styles-reach-inside API).

---

## 10. Migration phases

Each phase = deliverable + gate. TDD throughout.

- **Phase 0 — scaffold.** Workspace, turbo, tsup, vitest, Storybook, CI scripts, token-lint. Gate: empty packages build + test green.
- **Phase 1 — tokens.** Core scales, semantic contract with neutral mond defaults (light + dark), base.css, brand-template.css. No brand files in MDS (§9.9). Gate: contrast tests green both themes, template covers full contract, token lint clean.
- **Phase 2 — primitives.** §5 primitive tier, ported test-first from best of both sources. Adds Storybook demo brand (private) to prove token swap. Gate: tests + axe + Storybook renders default + demo brand, both themes.
- **Phase 3 — forms + composites.** Same discipline.
- **Phase 4 — patterns + hooks.** Layout primitives (Stack/Inline/Container, §9.10), compositional Card/Modal/Sheet (§9.11) + ConfirmDialog on useOverlay, Screen/AppBar/TabBar, usePresence/useRovingGroup.
- **Phase 5 — pilot migration: fairplay.** Prerequisite: app upgrades React 18.3 → 19. Then: write fairplay brand CSS INSIDE the app (copy brand-template.css, port `--fp-*` values, app keeps its fonts + app-domain tokens), swap `@fair-play/component-lib` imports → `@mond-design-system/react`. App-domain components refactored to compose MDS parts. Gate: app test suite + visual pass, zero local duplicates of MDS components.
- **Phase 6 — kinbaku migration.** Same, incl. React 19 prerequisite; kinbaku brand CSS written in-app (7 primitives + color-mix ramps port cleanly into template). Gate: same.
- **Phase 7 — retire.** Delete old MDS + both app-local libs. CompHQPro starts on MDS day one.

Order rationale: fairplay first — CSS Modules already, smaller delta. Kinbaku second — class-name strategy changes.

---

## 11. What we deliberately do NOT build

- Runtime theme provider / JS theme objects (old MDS mistake).
- JSON token pipeline (until Figma sync forces it).
- Speculative components for CompHQPro before its requirements exist.
- Per-app forks of MDS components — if an app needs divergence, it's a component token or an app-local composition.
