/* What a brand may set, and what it may not.
 *
 * A design system that lets an app re-point everything is a fork with extra
 * steps, and one that lets it re-point nothing gets px written into app
 * stylesheets instead. The line between the two is not prose: the system
 * publishes it as data beside its stylesheet — every role a brand may move,
 * the kind of value that role takes, and the floors that belong to nobody.
 *
 * The kind is the part a tool can act on. A `step` role names a rung on a
 * shared scale, so it must be re-pointed at another rung: a length written
 * there is a value only that role has, which is how a scale quietly becomes
 * decoration. A `length` role sits on no scale in either system — three
 * control heights are not a ladder — so the number is the decision.
 */

/** The schema this understands. A file from the future is refused by name. */
export const SURFACE_VERSION = 1;

/** How a role's value is written: a rung on a scale, or a length of its own. */
export type Kind = "step" | "length";

export type SettableRole = { token: string; kind: Kind; why: string };
export type Floor = { token: string; why: string };

export type SurfaceFile = {
  version: number;
  note?: string;
  settable: SettableRole[];
  floors: Floor[];
};

export type Surface = {
  /** Whether the system published one at all. Nothing published, nothing claimed. */
  declared: boolean;
  /** The kind this role's value takes, or undefined when it is not a role. */
  kindOf(token: string): Kind | undefined;
  /** Why this token is a floor, or undefined when it is not one. */
  floorOf(token: string): string | undefined;
  settable(): SettableRole[];
  floors(): Floor[];
};

/** The surface the system published, or an empty one when it published none. */
export function loadSurface(file: SurfaceFile | undefined): Surface {
  if (file !== undefined && file.version !== SURFACE_VERSION) {
    throw new Error(
      `brand-surface.json is version ${file.version}; this dsbridge reads version ${SURFACE_VERSION}`,
    );
  }
  const settable = file?.settable ?? [];
  const floors = file?.floors ?? [];
  /* A token in both lists is a contradiction the system has to settle, not one
     for a rule to resolve at check time by reading whichever came first. */
  const both = settable.filter((role) => floors.some((floor) => floor.token === role.token));
  if (both.length > 0) {
    throw new Error(
      `brand-surface.json lists ${both.map((role) => role.token).join(", ")} as settable and as a floor`,
    );
  }
  const kinds = new Map(settable.map((role) => [role.token, role.kind]));
  const reasons = new Map(floors.map((floor) => [floor.token, floor.why]));
  return {
    declared: file !== undefined,
    kindOf: (token) => kinds.get(token),
    floorOf: (token) => reasons.get(token),
    settable: () => settable,
    floors: () => floors,
  };
}
