/* Reading the style prop.
 *
 * `style={{ … }}` is CSS written in JavaScript, and none of the stylesheet
 * rules can see it: a literal length in a `.module.css` file is caught, the
 * same length in a component's JSX is not. This finds the declarations so the
 * same standard can be applied to both.
 */

export type StyleDeclaration = {
  /** As written, quotes and all: `gap`, `"--progress"`. */
  key: string;
  /** As written, expression and all. */
  value: string;
  /** 1-based, in the file. */
  line: number;
};

/** The index just past the `}` matching the `{` at `open`, honouring strings. */
function closing(source: string, open: number): number {
  let depth = 0;
  let quote: string | undefined;
  for (let at = open; at < source.length; at += 1) {
    const character = source[at]!;
    if (quote !== undefined) {
      if (character === "\\") at += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return at;
    }
  }
  return source.length;
}

/** Top-level commas only: a nested object or call keeps its own. */
function parts(body: string): { text: string; at: number }[] {
  const out: { text: string; at: number }[] = [];
  let depth = 0;
  let quote: string | undefined;
  let start = 0;
  for (let at = 0; at < body.length; at += 1) {
    const character = body[at]!;
    if (quote !== undefined) {
      if (character === "\\") at += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if ("{[(".includes(character)) depth += 1;
    else if ("}])".includes(character)) depth -= 1;
    else if (character === "," && depth === 0) {
      out.push({ text: body.slice(start, at), at: start });
      start = at + 1;
    }
  }
  out.push({ text: body.slice(start), at: start });
  return out.filter((part) => part.text.trim() !== "");
}

const splitKey = (text: string): [string, string] | undefined => {
  let depth = 0;
  let quote: string | undefined;
  for (let at = 0; at < text.length; at += 1) {
    const character = text[at]!;
    if (quote !== undefined) {
      if (character === "\\") at += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if ("{[(".includes(character)) depth += 1;
    else if ("}])".includes(character)) depth -= 1;
    else if (character === ":" && depth === 0) return [text.slice(0, at).trim(), text.slice(at + 1).trim()];
  }
  return undefined;
};

/**
 * Every declaration written into a `style={{ … }}` in a file.
 *
 * A spread is not a declaration — `{ ...style }` passes on whatever the caller
 * wrote, and the caller is where that was written and where it is judged.
 */
export function styleDeclarations(source: string): StyleDeclaration[] {
  const out: StyleDeclaration[] = [];
  const opener = /style=\{\s*\{/g;
  for (const match of source.matchAll(opener)) {
    const open = source.indexOf("{", match.index + "style=".length + 1);
    const end = closing(source, open);
    const body = source.slice(open + 1, end);
    for (const part of parts(body)) {
      if (part.text.trim().startsWith("...")) continue;
      const split = splitKey(part.text);
      if (split === undefined) continue;
      const [key, value] = split;
      const at = open + 1 + part.at + part.text.indexOf(key);
      out.push({ key, value, line: source.slice(0, at).split("\n").length });
    }
  }
  return out;
}
