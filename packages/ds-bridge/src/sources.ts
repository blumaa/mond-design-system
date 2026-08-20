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

const TOKENS_ENTRY = "@mond-design-system/tokens/styles.css";
/** Build output and dependencies are not the app's to change or to be judged on.
    Every dot-directory goes with them: caches are where a *copy* of the app's
    CSS lives, and a copy would be reported as a second brand file. */
const SKIP = new Set(["node_modules", "dist", "build", "out", "coverage", "storybook-static"]);
const skipped = (entry: string) => SKIP.has(entry) || entry.startsWith(".");

/** Node's own resolution, taken as a parameter so a test can be sure it missed. */
export type Resolver = (id: string, from: string) => string;

const nodeResolver: Resolver = (id, from) => createRequire(join(from, "noop.js")).resolve(id);

/** The design system's entry stylesheet, from the app that installed it. */
export function resolveSystem(cwd: string, resolver: Resolver = nodeResolver): string {
  const local = resolve(cwd, "packages/tokens/src/styles.css");
  if (existsSync(local)) return local;
  try {
    return resolver(TOKENS_ENTRY, resolve(cwd));
  } catch {
    throw new Error(
      `cannot find ${TOKENS_ENTRY} from ${cwd} — install @mond-design-system/tokens, or pass --system <path to styles.css>`,
    );
  }
}

/** Every stylesheet the app owns. */
export function findStylesheets(dir: string): string[] {
  const out: string[] = [];
  const walk = (at: string) => {
    for (const entry of readdirSync(at)) {
      if (skipped(entry)) continue;
      const path = join(at, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (entry.endsWith(".css")) out.push(path);
    }
  };
  walk(resolve(dir));
  return out.sort();
}

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
