/* What a component announces.
 *
 * A swap that type-checks can still change what a screen reader hears:
 * kinbaku's confirm prompt was a `dialog` and MDS's is an `alertdialog`, and
 * nothing in either repo could have said so, because each side is internally
 * consistent. The system publishes what its components announce; the app's is
 * read out of its own source; the difference is the report.
 */
import { openingTags } from "./jsx.js";

export const SEMANTICS_VERSION = 1;

/** What one component announces: the roles it states, and the heading it renders. */
export type ComponentSemantics = {
  /** Every ARIA role the component can carry, sorted. */
  roles?: string[];
  /** The heading tag its title lands on, e.g. `h2`. */
  heading?: string;
};

export type SemanticsFile = {
  version: number;
  components: Record<string, ComponentSemantics>;
};

export type Semantics = {
  names(): string[];
  of(name: string): ComponentSemantics | undefined;
  /** The system published one. Nothing to compare against otherwise, and no
      differences is a different sentence from no data. */
  declared: boolean;
};

export function loadSemantics(file: SemanticsFile | undefined): Semantics {
  if (file !== undefined && file.version !== SEMANTICS_VERSION) {
    throw new Error(
      `semantics.json is version ${file.version}; this dsbridge reads version ${SEMANTICS_VERSION}`,
    );
  }
  const components = new Map(Object.entries(file?.components ?? {}));
  return {
    names: () => [...components.keys()],
    of: (name) => components.get(name),
    declared: components.size > 0,
  };
}

const HEADING_TAG = /^h([1-6])$/;

/** A quoted attribute value, unwrapped. `{"alert"}` counts; `{tone}` does not. */
const literal = (value: string | undefined): string | undefined =>
  value === undefined ? undefined : /^\{?\s*["'`]([^"'`]*)["'`]\s*\}?$/.exec(value.trim())?.[1];

/* A condition choosing between two literals: `{tone === "danger" ? "alert" :
   "status"}`, or `{decorative ? undefined : "img"}`. Only the two branches are
   read — the condition compares against strings of its own, and a tone is not a
   role. */
const BRANCHES = /\?\s*(?:(["'`])([^"'`]*)\1|undefined)\s*:\s*(?:(["'`])([^"'`]*)\3|undefined)\s*\}?$/;

/**
 * Every value an attribute can hold, where they are all written out.
 *
 * A component that announces one role under a condition and another otherwise
 * announces both, as far as a migration is concerned: the app's is compared to
 * the system's before either is rendered, and naming one of the two would send
 * the reader to check the wrong one.
 */
const literals = (value: string | undefined): string[] => {
  const one = literal(value);
  if (one !== undefined) return [one];
  const branches = value === undefined ? null : BRANCHES.exec(value.trim());
  return branches === null ? [] : [branches[2], branches[4]].filter((it) => it !== undefined);
};

/** What one file states, without following anything it renders. */
export function semanticsIn(source: string): ComponentSemantics {
  const roles = new Set<string>();
  let heading: string | undefined;
  for (const tag of openingTags(source)) {
    const level = HEADING_TAG.exec(tag.name)?.[1];
    if (level !== undefined) heading ??= `h${level}`;
    for (const attribute of tag.attributes) {
      if (attribute.name === "role") for (const value of literals(attribute.value)) roles.add(value);
      /* `<Text as="h2">` is the third spelling, and the one a design system
         reaches for: the heading is a prop on something else entirely. */
      if (attribute.name === "as") {
        const value = HEADING_TAG.exec(literal(attribute.value) ?? "")?.[1];
        if (value !== undefined) heading ??= `h${value}`;
      }
      if (tag.name === "Heading" && attribute.name === "level") {
        const value = /^\{?\s*(\d)\s*\}?$/.exec(attribute.value ?? "")?.[1];
        if (value !== undefined) heading ??= `h${value}`;
      }
    }
  }
  return {
    ...(roles.size > 0 ? { roles: [...roles].sort() } : {}),
    ...(heading !== undefined ? { heading } : {}),
  };
}

/* The component a file's markup opens with, when it opens with one. */
const rootTag = (source: string): string | undefined => {
  const [first] = openingTags(source);
  return first !== undefined && /^[A-Z]/.test(first.name) ? first.name : undefined;
};

/**
 * What a component announces: what it states, and what it wraps.
 *
 * Kinbaku's `ConfirmDialog` said nothing itself — it was a `dialog` because the
 * `ModalSheet` it returned was one. Reading the file alone reports the app
 * announcing nothing, which is a worse lie than the difference it hides. The
 * first tag is the only hop worth following: it is the element the component
 * becomes, where anything deeper is a child the component merely contains.
 *
 * Each half is filled separately, so a component that states its own heading
 * over a root that states a role keeps both. `sources` is every component the
 * repo owns, by name; a name it does not hold ends the chain, and `seen` ends a
 * cycle.
 */
export function announces(
  name: string,
  sources: Map<string, string>,
  seen = new Set<string>(),
): ComponentSemantics {
  const source = sources.get(name);
  if (source === undefined || seen.has(name)) return {};
  seen.add(name);
  const own = semanticsIn(source);
  const root = rootTag(source);
  const under = root === undefined ? {} : announces(root, sources, seen);
  return {
    ...((own.roles ?? under.roles) !== undefined ? { roles: own.roles ?? under.roles } : {}),
    ...((own.heading ?? under.heading) !== undefined ? { heading: own.heading ?? under.heading } : {}),
  };
}

/** One thing the two sides disagree about, as data. */
export type SemanticDifference = {
  from: string;
  to: string;
  /** `role` or `title`. */
  what: string;
  was: string;
  becomes: string;
};

const NONE = "—";

const said = (roles: string[] | undefined) =>
  roles === undefined || roles.length === 0 ? NONE : roles.join(" ");

export function semanticDifference(
  from: string,
  to: string,
  app: ComponentSemantics,
  system: ComponentSemantics,
): SemanticDifference[] {
  const out: SemanticDifference[] = [];
  if (said(app.roles) !== said(system.roles)) {
    out.push({ from, to, what: "role", was: said(app.roles), becomes: said(system.roles) });
  }
  if ((app.heading ?? NONE) !== (system.heading ?? NONE)) {
    out.push({
      from,
      to,
      what: "title",
      was: app.heading ?? NONE,
      becomes: system.heading ?? NONE,
    });
  }
  return out;
}
