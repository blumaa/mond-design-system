/* The other half of what a design system publishes: its components.
 *
 * The tokens arrive as a stylesheet, which is a file this tool already reads.
 * The components arrive as a package, and the only statement of what a package
 * offers that ships with it is its type declarations — which is why this reads
 * `.d.ts` rather than the source it was built from. An app checking whether it
 * has rebuilt `Card` needs the list from the copy it installed, not from
 * whatever the tool was built knowing.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

/** Reads a file, or nothing where there is none. Taken as a parameter so a test
    can be sure it missed rather than picking up a real package. */
export type ReadFile = (file: string) => string | undefined;

const onDisk: ReadFile = (file) => (existsSync(file) ? readFileSync(file, "utf8") : undefined);

/**
 * The components a declaration file exports.
 *
 * PascalCase and not a type: `useToast` and `cx` are exports an app should use
 * rather than rebuild, but nobody rebuilds them by writing `<div>`, and a rule
 * about duplicated components that names a hook is a rule people stop reading.
 */
export function componentsIn(source: string): string[] {
  const out = new Set<string>();
  const take = (name: string) => {
    if (/^[A-Z]\w*$/.test(name)) out.add(name);
  };
  /* `export type { … }` is one block of types; a bare `export { … }` may still
     hold `type Foo` entries, which are marked one by one. */
  for (const match of source.matchAll(/\bexport\s*\{([^}]*)\}/g)) {
    for (const part of (match[1] ?? "").split(",")) {
      const entry = part.trim();
      if (entry === "" || /^type\b/.test(entry)) continue;
      take(entry.split(/\s+as\s+/).pop()!.trim());
    }
  }
  for (const match of source.matchAll(/\bexport\s+(?:declare\s+)?(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
    take(match[1]!);
  }
  return [...out].sort();
}

/** Where a package states its types, old field and new alike. */
export function typesEntry(manifest: string): string | undefined {
  const parsed = JSON.parse(manifest) as {
    types?: string;
    typings?: string;
    exports?: { ".": { types?: string } | string };
  };
  const root = parsed.exports?.["."];
  const exported = typeof root === "object" ? root.types : undefined;
  return exported ?? parsed.types ?? parsed.typings;
}

const resolvePackage = (id: string, from: string): string | undefined => {
  try {
    return createRequire(join(from, "noop.js")).resolve(`${id}/package.json`);
  } catch {
    return undefined;
  }
};

/**
 * What the design system installed here exports.
 *
 * Named in `dsbridge.config.json` rather than discovered: the tool has no way
 * to tell which of an app's dependencies is its design system, and guessing at
 * it is how a tool ends up with one repo's package name compiled into it.
 * A path is accepted too, for a repo whose system is a folder it owns.
 */
export function readSystemComponents(
  id: string,
  root: string,
  read: ReadFile = onDisk,
): string[] | undefined {
  const direct = isAbsolute(id) || id.startsWith(".") ? resolve(root, id) : undefined;
  if (direct !== undefined) {
    const source = read(direct);
    return source === undefined ? undefined : componentsIn(source);
  }
  const manifest = resolvePackage(id, resolve(root)) ?? join(resolve(root), "node_modules", id, "package.json");
  const declared = read(manifest);
  if (declared === undefined) return undefined;
  const entry = typesEntry(declared);
  if (entry === undefined) return undefined;
  const source = read(resolve(dirname(manifest), entry));
  return source === undefined ? undefined : componentsIn(source);
}
