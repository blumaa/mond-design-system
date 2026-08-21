/* Which one to reach for.
 *
 * Everything else this tool reads is derivable: the graph knows what a token
 * holds, TypeScript knows what a component accepts, the import graph knows what
 * composes what. This does not. `Sheet`, `Modal` and `ConfirmDialog` all
 * compile, all pass every rule, and exactly one of them is right for the case
 * in front of you — and nothing in the code says which, because the difference
 * is a decision somebody made about how the product should feel.
 *
 * So it is authored, small, and published with the system. It carries no props,
 * no states and no styling: those are in the types and the stylesheet, and a
 * second copy of them here would be a copy that goes stale.
 */

/** The schema this understands. A file from the future is refused by name. */
export const CHOOSING_VERSION = 1;

/** A case the default does not cover, and what covers it. */
export type Alternative = {
  /** The condition, in the reader's terms: "the viewport is md or wider". */
  when: string;
  prefer: string;
};

/**
 * One choice people actually get wrong, and how to make it.
 *
 * The components in the cluster are not listed: they are the default and
 * everything the exceptions prefer. Listing them as well would be a second copy
 * of the same list, and the copy is what goes stale.
 */
export type Cluster = {
  /** What to reach for when nothing in `instead` applies. */
  default: string;
  /** What the default is for, in one line. */
  use: string;
  /** The exceptions, each with the case that triggers it. */
  instead: Alternative[];
};

/**
 * Something that still works and should not be written again.
 *
 * A `@deprecated` tag in the types is what an editor reads, and where one
 * exists it is the better warning. This holds the half a tag cannot: what to
 * write instead, and why it went.
 */
export type Deprecation = {
  component: string;
  /** The prop, or absent when the whole component is deprecated. */
  prop?: string;
  /** What to write now. */
  use: string;
  /** Why, in one line. */
  why?: string;
};

export type ChoosingFile = {
  version: number;
  clusters: Cluster[];
  deprecated?: Deprecation[];
};

export type Choosing = {
  /** Whether anything is declared at all. */
  declared: boolean;
  clusters(): Cluster[];
  /** Every cluster this component is in — the default of one is a member of it. */
  for(component: string): Cluster[];
  /** Everything declared deprecated, or only what is on one component. */
  deprecations(component?: string): Deprecation[];
  /** Names this file mentions that the system does not have. */
  unknown(components: string[]): string[];
};

/** The choice a cluster is between: the default, then the exceptions in order. */
export const members = (cluster: Cluster): string[] => [
  cluster.default,
  ...cluster.instead.map((alternative) => alternative.prefer),
];

export function loadChoosing(file: ChoosingFile | undefined): Choosing {
  if (file !== undefined && file.version !== CHOOSING_VERSION) {
    throw new Error(
      `choosing.json is version ${file.version}; this dsbridge reads version ${CHOOSING_VERSION}`,
    );
  }
  const clusters = file?.clusters ?? [];
  /* An exception preferring the default says the default is not the default.
     It reads as guidance and answers nothing, so it is refused where it is
     read rather than printed as a line nobody can act on. */
  for (const cluster of clusters) {
    const back = cluster.instead.find((alternative) => alternative.prefer === cluster.default);
    if (back !== undefined) {
      throw new Error(
        `choosing.json: ${cluster.default} is its own alternative — "${back.when}" prefers what it already defaults to`,
      );
    }
  }
  const deprecated = file?.deprecated ?? [];

  return {
    declared: clusters.length > 0 || deprecated.length > 0,
    clusters: () => clusters,
    for: (component) => clusters.filter((cluster) => members(cluster).includes(component)),
    deprecations: (component) =>
      component === undefined ? deprecated : deprecated.filter((it) => it.component === component),
    unknown: (components) => {
      const has = new Set(components);
      const named = new Set([...clusters.flatMap(members), ...deprecated.map((it) => it.component)]);
      return [...named].filter((name) => !has.has(name));
    },
  };
}
