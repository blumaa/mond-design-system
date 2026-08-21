/* What a repo is made of, read the same way the CSS is: with a regex and no
 * apology.
 *
 * A TypeScript AST would tell us more than this does, and would cost a parser,
 * a version to keep in step with the one the repo compiles with, and a class of
 * failure where the tool cannot read a file it is meant to judge. What the
 * structure rules actually ask is narrow — does a story exist, what does its
 * title say, which components does this file import — and every one of those
 * questions is answerable from the text.
 */

export type Edge = {
  /** The component imported. */
  name: string;
  /** 1-based, in the importing component's file. */
  line: number;
};

export type Component = {
  name: string;
  /** Repo-relative `<Name>/<Name>.tsx`. */
  file: string;
  /** Repo-relative `<Name>.stories.tsx`, wherever it lives. */
  story?: string;
  /** Repo-relative `<Name>.test.tsx`. */
  test?: string;
  /** First segment of the story title, lowercased and singular. */
  level?: string;
  /** 1-based line of the title, for a finding to point at. */
  levelLine?: number;
  /** The components this one composes. */
  imports: Edge[];
};

/** `Atoms` is the drawer in Storybook's sidebar; `atom` is the level. */
export const asLevel = (segment: string) => segment.trim().toLowerCase().replace(/s$/, "");

const lineOf = (source: string, index: number) => source.slice(0, index).split("\n").length;

/**
 * The level a component claims, from its story.
 *
 * Storybook's `title` is the one place a component already declares where it
 * sits, and it is the declaration everyone on the team actually looks at. A
 * separate manifest would be a second answer to the same question — and the
 * second answer is the one that goes stale.
 */
export function levelIn(source: string): { level: string; line: number } | undefined {
  const match = /title:\s*["'`]([^/"'`]+)\//.exec(source);
  if (!match?.[1]) return undefined;
  return { level: asLevel(match[1]), line: lineOf(source, match.index) };
}

/**
 * The component a specifier points at, if it points at one.
 *
 * The design system writes `../Button/Button.js`; an app writes `../Button` or
 * `@/components/Card`, and a graph that only reads one convention has nothing
 * to say about the other. A package names no component — `react` and
 * `@mond-design-system/react` have no PascalCase segment — and a segment that
 * is not a component in this repo is dropped by the rule that reads the edge.
 */
export function importedComponent(specifier: string): string | undefined {
  const segments = specifier.split("/").map((segment) => segment.replace(/\..*$/, ""));
  for (let at = segments.length - 1; at >= 0; at--) {
    const segment = segments[at]!;
    if (/^[A-Z]\w*$/.test(segment)) return segment;
    /* A barrel stands for the directory holding it, and nothing else does. */
    if (segment !== "index") return undefined;
  }
  return undefined;
}

/**
 * The components a file composes.
 *
 * Only a PascalCase binding counts. `Input` importing `useFieldContext` from
 * `Field` shares a context, which is not the same as rendering a Field — and a
 * type import shares nothing at runtime at all. Counting either would make
 * `composes-downward` fire on code that is exactly right.
 */
export function importsIn(source: string): Edge[] {
  const out: Edge[] = [];
  /* The bindings may span lines, but never a second `import` — a lazy `[\s\S]*?`
     would happily swallow every statement above the one that matched. */
  const pattern = /^import\s+(type\s+)?((?:(?!^import\b)[\s\S])*?)\s+from\s+["']([^"']+)["']/gm;
  for (const match of source.matchAll(pattern)) {
    const [, typeOnly, bindings = "", specifier = ""] = match;
    if (typeOnly !== undefined) continue;
    const name = importedComponent(specifier);
    if (name === undefined) continue;
    const names = bindings.replace(/\btype\s+\w+/g, "").match(/[A-Za-z_$][\w$]*/g) ?? [];
    if (!names.some((binding) => /^[A-Z]/.test(binding))) continue;
    out.push({ name, line: lineOf(source, match.index) });
  }
  return out;
}

/**
 * The names a file imports — from `from`, when one is named.
 *
 * `importsIn` answers a question about this repo's own composition, so it drops
 * packages. This answers a different one — does this file use that thing at all
 * — and for a component named after one the design system exports, the import
 * line is the whole answer.
 *
 * Whose Button it is has to be part of that answer. Two design systems are
 * loaded at once for the length of a migration and they share component names
 * by design, so "somebody imported Button" says nothing about which one.
 *
 * The name taken is the one the package exports, never the local alias: it is
 * the export being reached for either way, and `Button as OldButton` counted as
 * both put a name in the set that nothing exports.
 */
export function importedNames(source: string, from?: string): Set<string> {
  const out = new Set<string>();
  const pattern = /^import\s+(?!type\b)((?:(?!^import\b)[\s\S])*?)\s+from\s+["']([^"']+)["']/gm;
  for (const match of source.matchAll(pattern)) {
    if (from !== undefined && !(match[2] === from || match[2]!.startsWith(`${from}/`))) continue;
    const bindings = (match[1] ?? "").replace(/\btype\s+\w+/g, "").replace(/\bas\s+[A-Za-z_$][\w$]*/g, "");
    for (const name of bindings.match(/[A-Za-z_$][\w$]*/g) ?? []) out.add(name);
  }
  return out;
}

const base = (file: string) => file.slice(file.lastIndexOf("/") + 1);

/**
 * Every component in a repo, with the files that go with it.
 *
 * A `.tsx` file named after the component in it. The design system gives each
 * one a directory; an app usually does not, and a recogniser that insists on
 * `<Name>/<Name>.tsx` finds nothing in the repos this is pointed at. The one
 * thing both conventions agree on is the file name, so that is what is read.
 */
export function readComponents(files: string[], read: (file: string) => string): Component[] {
  const stories = new Map<string, string>();
  const tests = new Map<string, string>();
  for (const file of files) {
    const name = base(file);
    if (name.endsWith(".stories.tsx")) stories.set(name.slice(0, -".stories.tsx".length), file);
    if (name.endsWith(".test.tsx")) tests.set(name.slice(0, -".test.tsx".length), file);
  }

  const out: Component[] = [];
  for (const file of files) {
    const name = base(file).replace(/\.tsx$/, "");
    /* PascalCase and nothing else in the name: `router.tsx` is not a component
       and `Overlay.test.tsx` leaves `Overlay.test`, which is not a name. */
    if (base(file) === name || !/^[A-Z]\w*$/.test(name)) continue;
    const story = stories.get(name);
    const level = story === undefined ? undefined : levelIn(read(story));
    out.push({
      name,
      file,
      ...(story ? { story } : {}),
      ...(tests.get(name) ? { test: tests.get(name)! } : {}),
      ...(level ? { level: level.level, levelLine: level.line } : {}),
      imports: importsIn(read(file)),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
