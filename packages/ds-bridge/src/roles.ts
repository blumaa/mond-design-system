/* What a token is for.
 *
 * The graph knows what every token *holds*. That is enough to say "some token
 * has this value" and not enough to say which one was meant: `20px` is an icon
 * size, a switch knob, a spacing rung and a radius at once, and answering with
 * the first of them is a coin flip printed with the authority of a fact.
 *
 * A role is the missing half — a set of tokens and the CSS properties they
 * answer. The relation is many-to-many on purpose: `width` is claimed by
 * icon-size and control-width together, and where both hold the value the
 * honest answer names both rather than breaking the tie.
 *
 * The system publishes this beside its stylesheet, so an app is answered from
 * the copy it installed rather than from anything this tool was built knowing.
 */
import { anyGlob } from "./glob.js";

/** The schema this understands. A file from the future is refused by name. */
export const ROLES_VERSION = 1;

export type RoleDeclaration = {
  /** CSS properties this role answers; globs, so `padding-*` is one entry. */
  properties: string[];
  /** The tokens in it; globs over token names. */
  tokens: string[];
};

export type RolesFile = {
  version: number;
  roles: Record<string, RoleDeclaration>;
  /** One token placed by hand, where a name alone put it in the wrong role. */
  roleOf?: Record<string, string>;
};

export type Roles = {
  /** Every declared role, in the order the file declares them. */
  names(): string[];
  /** The roles a token belongs to. */
  of(token: string): string[];
  /** One role as it resolved: what it answers, and the tokens the globs reached. */
  role(name: string): RoleDeclaration | undefined;
  /** The tokens of every role that answers this property. */
  forProperty(property: string): Set<string>;
  /** Whether anything is declared at all — nothing published, nothing claimed. */
  declared: boolean;
  /** Tokens in a role that answers at least one property, against the whole set. */
  coverage(): { claimed: string[]; unclaimed: string[] };
};

/** Roles from the file the system published, or an empty set when it published none. */
export function loadRoles(file: RolesFile | undefined, tokens: string[]): Roles {
  if (file !== undefined && file.version !== ROLES_VERSION) {
    throw new Error(
      `roles.json is version ${file.version}; this dsbridge reads version ${ROLES_VERSION}`,
    );
  }
  const declarations = Object.entries(file?.roles ?? {});
  const placed = file?.roleOf ?? {};

  const members = new Map<string, string[]>();
  for (const [role, declaration] of declarations) {
    const claims = anyGlob(declaration.tokens);
    members.set(
      role,
      tokens.filter((token) => placed[token] === role || (placed[token] === undefined && claims(token))),
    );
  }
  /* A hand-placed token joins a role the globs never reach — including one
     whose token list is empty because hand-placing is all it is. */
  for (const [token, role] of Object.entries(placed)) {
    const held = members.get(role);
    if (held !== undefined && !held.includes(token)) held.push(token);
  }

  const rolesOfToken = new Map<string, string[]>();
  for (const [role, held] of members) {
    for (const token of held) rolesOfToken.set(token, [...(rolesOfToken.get(token) ?? []), role]);
  }

  const answers = new Map<string, (property: string) => boolean>();
  for (const [role, declaration] of declarations) answers.set(role, anyGlob(declaration.properties));

  return {
    declared: declarations.length > 0,
    names: () => declarations.map(([role]) => role),
    role: (name) => {
      const declaration = file?.roles[name];
      if (declaration === undefined) return undefined;
      return { properties: declaration.properties, tokens: members.get(name) ?? [] };
    },
    of: (token) => rolesOfToken.get(token) ?? [],
    forProperty: (property) => {
      const out = new Set<string>();
      for (const [role, claims] of answers) {
        if (!claims(property)) continue;
        for (const token of members.get(role) ?? []) out.add(token);
      }
      return out;
    },
    coverage: () => {
      const answering = new Set(
        declarations.filter(([, d]) => d.properties.length > 0).map(([role]) => role),
      );
      const claimed = tokens.filter((token) =>
        (rolesOfToken.get(token) ?? []).some((role) => answering.has(role)),
      );
      const held = new Set(claimed);
      return { claimed, unclaimed: tokens.filter((token) => !held.has(token)) };
    },
  };
}
