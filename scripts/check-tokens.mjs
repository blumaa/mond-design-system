#!/usr/bin/env node
/* Token discipline, made runnable. Ported from the kinbaku design system.
 *
 * The brand promise — a rebrand is one CSS file and nothing else moves — only
 * holds if no component ever writes a raw value or reaches for a token that
 * isn't there. Both failures are silent: a literal hex just works until the
 * brand lands, and an undefined custom property drops the declaration with no
 * error anywhere.
 *
 *   node scripts/check-tokens.mjs
 *
 * Rules, applied to every stylesheet in packages/react/src:
 *   1. no literal color (hex)
 *   2. no literal px length — except a declared --mds-bp-* value inside a
 *      @media prelude (a media query is resolved before custom properties
 *      exist, so a breakpoint cannot be var())
 *   3. every --mds-* consumed must be declared by the tokens package or
 *      locally in the same sheet (component tokens)
 *
 * `--root` points the gate at a throwaway tree so its own test can watch it
 * fail — a gate never seen failing is indistinguishable from one that cannot.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootFlag = process.argv.indexOf("--root");
const ROOT =
  rootFlag > -1
    ? resolve(process.argv[rootFlag + 1])
    : fileURLToPath(new URL("..", import.meta.url));

const TOKENS = join(ROOT, "packages/tokens/src");
const COMPONENTS = join(ROOT, "packages/react/src");

function cssFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return path.endsWith(".css") ? [path] : [];
  });
}

/* Comments are prose and are allowed to say "32px" — that is often the
   clearest way to record why a value was chosen. Blanked rather than removed
   so line numbers survive. */
const stripComments = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));

const read = (path) => ({ path, source: stripComments(readFileSync(path, "utf8")) });
const componentSheets = cssFiles(COMPONENTS).map(read);
const systemSheets = cssFiles(TOKENS).map(read);

const matchAll = (source, pattern) => [...source.matchAll(pattern)].map((m) => m[0]);

/* The one exemption: breakpoints, held to the declared list. */
const breakpoints = new Set(
  systemSheets
    .flatMap(({ source }) => matchAll(source, /--mds-bp-[a-z0-9-]+\s*:\s*[0-9.]+px/g))
    .map((declaration) => declaration.split(":")[1].trim()),
);

/* Anything declared anywhere in the tokens package is the system's to define.
   A component may also declare its own --mds-<component>-* and consume it in
   the same sheet. */
const defined = new Set(
  systemSheets.flatMap(({ source }) => matchAll(source, /--mds-[a-z0-9-]+(?=\s*:)/g)),
);

const failures = [];

for (const { path, source } of componentSheets) {
  const local = new Set(matchAll(source, /--mds-[a-z0-9-]+(?=\s*:)/g));
  const file = relative(ROOT, path);

  source.split("\n").forEach((line, i) => {
    const at = `${file}:${i + 1}`;

    for (const hex of matchAll(line, /#[0-9a-fA-F]{3,8}\b/g)) {
      failures.push(`${at}  literal color ${hex} — use a semantic alias`);
    }

    /* px inside var() is a fallback and equally a raw value; the only
       hard-coded length a component sheet may carry is a declared breakpoint,
       and only in the query itself. A prelude split over two lines fails here
       — write it on one. */
    const prelude = line.trimStart().startsWith("@media");
    for (const px of matchAll(line, /\b[0-9.]+px\b/g)) {
      if (prelude && breakpoints.has(px)) continue;
      const reason = prelude
        ? "off the breakpoint list — add it to --mds-bp-* in core/layout.css or use one that is there"
        : "use a spacing, radius or layout token";
      failures.push(`${at}  literal length ${px} — ${reason}`);
    }

    for (const used of matchAll(line, /--mds-[a-z0-9-]+(?=\s*[,)])/g)) {
      if (!defined.has(used) && !local.has(used)) {
        failures.push(`${at}  undefined token ${used} — nothing declares it`);
      }
    }
  });
}

/* Semantic contract completeness: every brand must re-declare the full
   semantic alias set (light block) and its dark block must exist. A brand
   missing an alias silently falls through to whatever loaded before it. */
const semanticPath = join(TOKENS, "semantic.css");
if (existsSync(semanticPath)) {
  const contract = new Set(
    matchAll(stripComments(readFileSync(semanticPath, "utf8")), /--mds-[a-z0-9-]+(?=\s*:)/g),
  );
  const brandDir = join(TOKENS, "brands");
  for (const brandFile of cssFiles(brandDir)) {
    const source = stripComments(readFileSync(brandFile, "utf8"));
    const declaredHere = new Set(matchAll(source, /--mds-[a-z0-9-]+(?=\s*:)/g));
    const file = relative(ROOT, brandFile);
    for (const token of contract) {
      if (!declaredHere.has(token)) {
        failures.push(`${file}  missing semantic token ${token} — the contract requires it`);
      }
    }
    if (!source.includes('[data-theme="dark"]')) {
      failures.push(`${file}  no [data-theme="dark"] scope — every brand ships both themes`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Token discipline: ${failures.length} problem(s)\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(
  `Token discipline: clean. ${componentSheets.length} component sheets, ` +
    `${systemSheets.length} system sheets, ${defined.size} system tokens.`,
);
