/* `dsbridge roles` — what the system says its tokens are for.
 *
 * The graph knows what a token holds; only this knows what it answers. The
 * listing is a system reading its own declaration back, and the coverage half
 * is the part worth acting on: a token no role claims is one that will always
 * be suggested by value alone, which is the guess this whole file exists to
 * stop. Coverage is reported and never enforced — a system with half of it
 * declared gets half the benefit and no failing build.
 */
import type { Roles } from "../roles.js";
import { bold, dim, plural } from "../text.js";

export type RolesOptions = {
  /** Name the tokens no role claims, rather than only counting them. */
  coverage?: boolean;
  color?: boolean;
};

export type RoleData = {
  declared: boolean;
  roles: { role: string; properties: string[]; tokens: string[] }[];
  claimed: string[];
  unclaimed: string[];
};

export function roleData(roles: Roles, tokens: string[]): RoleData {
  const { claimed, unclaimed } = roles.coverage();
  return {
    declared: roles.declared,
    roles: roles.names().map((role) => {
      const declaration = roles.role(role);
      return {
        role,
        properties: declaration?.properties ?? [],
        tokens: declaration?.tokens ?? [],
      };
    }),
    claimed: claimed.filter((token) => tokens.includes(token)),
    unclaimed: unclaimed.filter((token) => tokens.includes(token)),
  };
}

const NOTHING =
  "the design system installed here publishes no roles, so every suggestion is made\n" +
  "from the value alone — dsbridge/roles.json beside its stylesheet is where it says\n" +
  "what its tokens are for\n";

export function renderRoles(roles: Roles, tokens: string[], options: RolesOptions = {}): string {
  const color = options.color ?? true;
  const data = roleData(roles, tokens);
  if (!data.declared) return NOTHING;

  const width = Math.max(...data.roles.map((r) => r.role.length));
  const held = Math.max(...data.roles.map((r) => plural(r.tokens.length, "token").length));
  const lines = data.roles.map((r) => {
    const answers = r.properties.length > 0 ? r.properties.join(", ") : dim("answers nothing", color);
    const count = plural(r.tokens.length, "token").padEnd(held);
    return `  ${bold(r.role.padEnd(width), color)}  ${dim(count, color)}  ${answers}`;
  });

  const claimed = data.claimed.length;
  const all = claimed + data.unclaimed.length;
  const share = all === 0 ? 0 : Math.round((claimed / all) * 100);
  const out = [
    ...lines,
    "",
    `${plural(data.roles.length, "role")}, ${claimed} of ${all} tokens claimed by one that answers a property (${share}%)`,
  ];

  if (options.coverage === true && data.unclaimed.length > 0) {
    out.push(
      "",
      `${plural(data.unclaimed.length, "token")} no role answers a property for:`,
      ...data.unclaimed.map((token) => `  ${token}`),
    );
  }
  return `${out.join("\n")}\n`;
}
