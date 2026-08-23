/* Finding what to read.
 *
 * A consuming app should be able to run `dsbridge tokens` with no arguments and no
 * config, so the two inputs are discovered rather than declared: the design
 * system comes from the installed package, and the brand file is whichever of
 * the app's own stylesheets *declares* design system tokens instead of reading
 * them. That distinction is the whole rule — an app has exactly one bridge.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { declarationsIn } from "./css/parse.js";
import { searchRoots } from "./system.js";
import { expandImports } from "./graph.js";

/** Build output and dependencies are not the app's to change or to be judged on.
    Every dot-directory goes with them: caches are where a *copy* of the app's
    CSS lives, and a copy would be reported as a second brand file. */
const SKIP = new Set(["node_modules", "dist", "build", "out", "coverage", "storybook-static"]);
const skipped = (entry: string) => SKIP.has(entry) || entry.startsWith(".");

/** Node's own resolution, taken as a parameter so a test can be sure it missed. */
export type Resolver = (id: string, from: string) => string;

const nodeResolver: Resolver = (id, from) => createRequire(join(from, "noop.js")).resolve(id);

/** What the repo installed, as its own manifest lists it. */
const dependencyNames = (cwd: string): string[] => {
  const manifest = join(cwd, "package.json");
  if (!existsSync(manifest)) return [];
  const json = JSON.parse(readFileSync(manifest, "utf8")) as Record<string, Record<string, string>>;
  const fields = ["dependencies", "devDependencies", "peerDependencies"];
  return [...new Set(fields.flatMap((field) => Object.keys(json[field] ?? {})))];
};

/** How many tokens a stylesheet and everything it imports declare. */
const declaredTokens = (entry: string): number => {
  try {
    return expandImports(entry).reduce(
      (n, file) => n + declarationsIn(readFileSync(file, "utf8"), file).length,
      0,
    );
  } catch {
    /* A path that does not read is not a design system, and saying so is the
       caller's job, not this one's. */
    return 0;
  }
};

const NAME_IT =
  'name it as "system" in dsbridge.config.json, or pass --system <path to its styles.css>';

/**
 * The design system's entry stylesheet, from the app that installed it.
 *
 * Found by shape and never by name: a tool that looked for one particular
 * package would be a tool for one particular design system. A dependency that
 * publishes `styles.css` is a candidate, and exactly one candidate is an
 * answer. Two is a question only the repo can settle, and so is none — the
 * design system's own repo is the case where there is nothing installed to
 * find, and it is also the one repo that knows where its stylesheet is.
 *
 * `sources` is what the config already says the repo is made of, and it is read
 * for the same reason `readSystemComponents` reads it: a workspace installs a
 * dependency beside the package that declared it, so the root holds neither the
 * manifest naming the system nor the directory containing it. Looking only at
 * the root reports that nothing is installed, in a repo that installed it, and
 * leaves the app writing a path into `node_modules` by hand.
 */
export function resolveSystem(
  cwd: string,
  resolver: Resolver = nodeResolver,
  sources: readonly string[] = [],
): string {
  const at = resolve(cwd);
  /* A directory in that list that holds no manifest names no dependencies, which
     is how the ones that are not packages take themselves out. */
  const roots = [at, ...searchRoots(undefined, sources).map((dir) => resolve(at, dir))];
  /* By name, because one dependency installed beside three workspace packages is
     found three times and is still one candidate. The first root that has it
     wins: they are copies of the same package. */
  const byName = new Map<string, string>();
  for (const from of roots) {
    for (const name of dependencyNames(from)) {
      if (byName.has(name)) continue;
      try {
        byName.set(name, resolver(`${name}/styles.css`, from));
      } catch {
        /* Not this one: a dependency that publishes no stylesheet is not a
           design system, and neither is one this root cannot see. */
      }
    }
  }
  const found = [...byName].map(([name, path]) => ({ name, path }));
  if (found.length === 1) return found[0]!.path;
  if (found.length === 0) {
    throw new Error(`nothing installed here publishes a styles.css, so no design system was found — ${NAME_IT}`);
  }
  /* A design system usually ships two packages that both publish a stylesheet:
     the tokens and the components. The tokens are the one that *declares* them,
     so the count of declarations is what separates the system's contract from a
     stylesheet that merely spends it. */
  const scored = found.map((f) => ({ ...f, declares: declaredTokens(f.path) }));
  const most = Math.max(...scored.map((f) => f.declares));
  const top = scored.filter((f) => f.declares === most);
  if (most > 0 && top.length === 1) return top[0]!.path;
  const names = found.map((f) => f.name).join(", ");
  throw new Error(`more than one dependency publishes a styles.css (${names}) — ${NAME_IT}`);
}

/** Every file under a directory the repo owns, by extension. */
export function findFiles(dir: string, extensions: string[]): string[] {
  const out: string[] = [];
  const walk = (at: string) => {
    for (const entry of readdirSync(at)) {
      if (skipped(entry)) continue;
      const path = join(at, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (extensions.some((extension) => entry.endsWith(extension))) out.push(path);
    }
  };
  walk(resolve(dir));
  return out.sort();
}

/** Every stylesheet the app owns. */
export const findStylesheets = (dir: string): string[] => findFiles(dir, [".css"]);

/** Every TypeScript component, story and test the app owns. */
export const findSources = (dir: string): string[] => findFiles(dir, [".tsx"]);

/** Typefaces the repo carries in its own source. */
export const findFonts = (dir: string): string[] =>
  findFiles(dir, [".woff2", ".woff", ".ttf", ".otf", ".eot"]);

/**
 * A selector that sets a value for the whole document rather than for one thing
 * in it. `:root`, `html`, `[data-theme="dark"]` and their combinations qualify;
 * `.card` does not.
 */
export const rootScoped = (selector: string): boolean =>
  selector
    .split(",")
    .some((part) => part.replace(/:root\b|\bhtml\b|\bbody\b|\*|\[data-theme[^\]]*\]|::?[a-z-]+|[\s>+~]+/g, "") === "");

/**
 * The design system tokens a stylesheet declares document-wide.
 *
 * This is what separates a brand file from a component's: a component may
 * declare tokens of its own — `.button { --mds-icon-slot: … }` sets the slot
 * for its own glyph — but it sets them *on itself*. A file that sets them on
 * the document is re-pointing the contract for everything, which is the one
 * thing a brand does.
 */
export const brandDeclarations = (source: string, file: string, prefix = "--mds-") =>
  declarationsIn(source, file).filter((d) => d.name.startsWith(prefix) && rootScoped(d.selector));

/**
 * The app's brand files: the ones that re-point design system tokens.
 *
 * Declaring is the test, not naming. A file called `brand.css` that only reads
 * tokens is a component stylesheet; a file that declares `--mds-accent` at the
 * document root is the bridge whatever it is called.
 */
export function findBrandFiles(dir: string, prefix = "--mds-"): string[] {
  return findStylesheets(dir).filter(
    (file) => brandDeclarations(readFileSync(file, "utf8"), file, prefix).length > 0,
  );
}
