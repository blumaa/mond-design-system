/* `dsbridge choosing` — which of the ones that all compile.
 *
 * The listing is deliberately short. A catalogue of forty components is what
 * `dsbridge check` and the session-start hook already print; this is only the
 * dozen choices people actually get wrong, and a dozen is a size somebody will
 * read. Anything longer stops being guidance and becomes documentation.
 */
import { members, type Choosing, type Cluster, type Deprecation } from "../choosing.js";
import { bold, dim, plural } from "../text.js";

export type ChoosingOptions = {
  /** Only the choices that name this component. */
  component?: string;
  color?: boolean;
};

export type ChoosingData = {
  declared: boolean;
  clusters: (Cluster & { members: string[] })[];
  deprecated: Deprecation[];
  /** How many of the repo's components a choice names. */
  covered: number;
  /** Names the file mentions that the system does not have. */
  unknown: string[];
};

export function choosingData(choosing: Choosing, components: string[]): ChoosingData {
  const clusters = choosing.clusters().map((cluster) => ({ ...cluster, members: members(cluster) }));
  const named = new Set(clusters.flatMap((cluster) => cluster.members));
  return {
    declared: choosing.declared,
    clusters,
    deprecated: choosing.deprecations(),
    covered: components.filter((component) => named.has(component)).length,
    unknown: choosing.unknown(components),
  };
}

const NOTHING =
  "the design system installed here publishes no choosing.json, so nothing says which\n" +
  "of two components that both compile is the one this case wants — dsbridge/choosing.json\n" +
  "beside its stylesheet is where it says so\n";

const nothingFor = (component: string) =>
  `${component} is in no choice — nothing else in the system does what it does, or nobody\n` +
  `has been caught reaching for the wrong one\n`;

/** The widest name in what is about to be printed, so two columns line up. */
const widest = (clusters: (Cluster & { members: string[] })[]) =>
  Math.max(0, ...clusters.flatMap((cluster) => cluster.members.map((name) => name.length)));

function block(cluster: Cluster & { members: string[] }, width: number, color: boolean): string[] {
  return [
    `  ${bold(cluster.default.padEnd(width), color)}  ${cluster.use}`,
    ...cluster.instead.map(
      (alternative) => `    ${alternative.prefer.padEnd(width)}  ${dim(alternative.when, color)}`,
    ),
  ];
}

const said = (it: Deprecation) =>
  `${it.component}${it.prop === undefined ? "" : ` ${it.prop}`} — use ${it.use}${it.why === undefined ? "" : ` (${it.why})`}`;

export function renderChoosing(
  choosing: Choosing,
  components: string[],
  options: ChoosingOptions = {},
): string {
  const color = options.color ?? true;
  const data = choosingData(choosing, components);
  if (!data.declared) return NOTHING;

  const asked = options.component;
  const clusters =
    asked === undefined ? data.clusters : data.clusters.filter((c) => c.members.includes(asked));
  const deprecated = asked === undefined ? data.deprecated : choosing.deprecations(asked);
  if (clusters.length === 0 && deprecated.length === 0) return nothingFor(asked ?? "");

  const width = widest(clusters);
  const out = clusters.flatMap((cluster) => [...block(cluster, width, color), ""]);

  if (asked === undefined) {
    out.push(
      `${plural(data.clusters.length, "choice")}, ${data.covered} of ${components.length} components in one`,
    );
  }
  if (deprecated.length > 0) {
    out.push("", bold("deprecated", color), ...deprecated.map((it) => `  ${said(it)}`));
  }
  return `${out.join("\n").replace(/\n+$/, "")}\n`;
}
