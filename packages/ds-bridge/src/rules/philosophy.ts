/* What the design system asks for that no checker can prove.
 *
 * Every rule here is a judgement someone has to make with the codebase in front
 * of them: whether a component belongs to the system or to one app, whether a
 * value has earned a name. They carry no `check`, which is the honest signal —
 * `dsbridge check` will never mention them, and `dsbridge rules` always will.
 */
import type { Rule } from "./types.js";

export const belongsInTheSystem: Rule = {
  id: "belongs-in-the-system",
  title: "A component earns its place in the system by being needed twice.",
  why:
    "A component built in the system for one app is that app's component with a " +
    "longer import path and a slower release cycle. It arrives with props nobody " +
    "else wants, it is versioned for consumers who do not exist, and the second " +
    "app that finally needs something like it needs it differently — so the first " +
    "shape has to be widened rather than reused.",
  instead:
    "Build it in the app, composed from system parts. When a second app needs the " +
    "same thing, that is the evidence: move it up then, with two real call sites " +
    "shaping the API instead of one imagined one. PostCard, GroupChatHeader and " +
    "ReportCard are app components, and stay app components.",
  target: "both",
  reads: "component",
};

export const earnTheSemanticToken: Rule = {
  id: "earn-the-semantic-token",
  title: "Core names a value, semantic names a role, a component names neither.",
  why:
    "The three layers only work if each answers a different question. Core answers " +
    "'what values does this system have' — a scale, no opinion about use. Semantic " +
    "answers 'what is this value for' — the contract a brand re-points. A component " +
    "that reaches past semantic into core has taken the brand's decision away from " +
    "it, and a semantic token invented for one component is a component token wearing " +
    "the contract's clothes: every app that copies the brand template now carries it.",
  instead:
    "Read semantic from a component, always. Add a core rung when the system needs a " +
    "value it does not have. Add a semantic token when a role recurs across " +
    "components and a brand would plausibly want to re-point it on its own — if the " +
    "answer is 'only Card uses this', it is Card's local custom property, not the " +
    "contract's.",
  target: "both",
  reads: "stylesheet",
};

export const compositionOverConfiguration: Rule = {
  id: "composition-over-configuration",
  title: "A multi-part component exposes its parts, not props describing them.",
  why:
    "Configuration props multiply: title, extra, actions, cover, tabList — each one " +
    "a slot that cannot be reordered, cannot be conditionally rendered, and cannot " +
    "hold anything the prop's type did not anticipate. The escape hatch that follows " +
    "is always the same one, a styles object reaching inside the component, and then " +
    "the internals are public and nothing can change.",
  instead:
    "Ship the parts as flat named exports and let the caller arrange them: " +
    "`<Card><CardHeader/><CardBody/><CardFooter/></Card>`, matching Tabs/TabList/Tab/" +
    "TabPanel. The container owns the spacing between its slots. Atoms stay " +
    "prop-based — `Button iconLeft` is a shape, not a slot.",
  target: "system",
  reads: "component",
};

export const boundedPrimitivesOnly: Rule = {
  id: "bounded-primitives-only",
  title: "Layout primitives take token-bounded props, never an open style escape.",
  why:
    "A generic Box with an open style prop is a hole straight through the token gate: " +
    "every value that goes through it is unreviewable, untokened, and invisible to " +
    "every rule here. It is also the most-used component in any system that ships " +
    "one, so the hole is not an edge case — it becomes the house style.",
  instead:
    "Stack, Inline and Container take enums that resolve to tokens: gap over " +
    "`--mds-gap-*`, width over `--mds-content-max*`. When a layout needs something " +
    "they cannot express, that is a missing enum value or a missing component, not a " +
    "missing escape hatch. Card plus the surface tokens covers styled containers.",
  target: "system",
  reads: "component",
};

export const brandFlourishStaysInApp: Rule = {
  id: "brand-flourish-stays-in-app",
  title: "The system ships the generic thing; the flourish belongs to the app.",
  why:
    "A loader shaped like the app's logo is that app's identity, not a system " +
    "capability. Put it in the system and every other consumer inherits a component " +
    "they must not use, the system starts holding one brand's assets, and the promise " +
    "that a rebrand is one CSS file quietly stops being true.",
  instead:
    "The system ships `Spinner`. An app builds `BallLoader` from it, or from nothing, " +
    "and keeps it. Same for tone-carrying cards and any component whose reason for " +
    "existing is that it looks like this brand.",
  target: "both",
  reads: "stylesheet",
};

export const iconsAreBrand: Rule = {
  id: "icons-are-brand",
  title: "The system takes an icon set; it does not have one.",
  why:
    "An icon set is a typeface for pictures — as much a brand decision as the font, " +
    "and as expensive to change once components import glyphs directly. Baking one in " +
    "means every consumer ships it whether or not they use it, and an app with its own " +
    "set ships both.",
  instead:
    "`Icon` reads from a pluggable registry the brand provides. Kinbaku keeps lucide, " +
    "Fair Play keeps Material Symbols, and the system stays agnostic. A component asks " +
    "for a name and a size, never for a specific glyph.",
  target: "system",
  reads: "repo",
};

export const deferUnbuiltComponents: Rule = {
  id: "defer-unbuilt-components",
  title: "Build a component when something real needs it, not before.",
  why:
    "A component with no consumer is a guess that has to be maintained. Its API was " +
    "designed against an imagined use, its tests prove only that it does what it does, " +
    "and the first real requirement usually contradicts it — so the cost is paid " +
    "twice, and the second payment includes a breaking change.",
  instead:
    "Wait for the requirement. What is worth doing early is the layer underneath: " +
    "design `useOverlay` anchor-capable now so Tooltip, Popover and Dropdown compose " +
    "one positioning engine when they arrive, and use `@floating-ui/dom` rather than " +
    "hand-rolling it.",
  target: "system",
  reads: "component",
};

export const philosophyRules: Rule[] = [
  belongsInTheSystem,
  earnTheSemanticToken,
  compositionOverConfiguration,
  boundedPrimitivesOnly,
  brandFlourishStaysInApp,
  iconsAreBrand,
  deferUnbuiltComponents,
];
