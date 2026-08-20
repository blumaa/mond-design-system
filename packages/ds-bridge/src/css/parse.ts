/* Custom-property declarations out of a stylesheet, each with the place it was
   written. Deliberately not a full CSS parser: it walks braces, keeps the
   at-rule preludes it is nested under, and reads `--name: value` pairs. That
   is the whole surface a token file has. */

export type Theme = "light" | "dark";

export type Declaration = {
  name: string;
  value: string;
  file: string;
  /** 1-based, and the line the name is on. */
  line: number;
  selector: string;
  /** At-rule preludes this declaration sits inside, outermost first. */
  conditions: string[];
  theme: Theme;
};

/** Blanks a comment out in place: the lines after it keep their numbers. */
export const stripComments = (css: string) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

const DARK = /\[data-theme=["']?dark["']?\]|prefers-color-scheme:\s*dark/;

export function declarationsIn(source: string, file: string): Declaration[] {
  const css = stripComments(source);
  const out: Declaration[] = [];
  const stack: string[] = [];
  let buf = "";
  let bufLine = 1;
  let line = 1;
  let parens = 0;

  const flush = () => {
    const m = /^(--[a-z0-9-]+)\s*:\s*([\s\S]+)$/i.exec(buf.trim());
    if (m && stack.length > 0) {
      const selector = stack[stack.length - 1]!;
      const conditions = stack.filter((s) => s.startsWith("@"));
      out.push({
        name: m[1]!,
        value: m[2]!.replace(/\s+/g, " ").trim(),
        file,
        line: bufLine,
        selector,
        conditions,
        theme: [selector, ...conditions].some((s) => DARK.test(s)) ? "dark" : "light",
      });
    }
    buf = "";
  };

  for (const ch of css) {
    if (ch === "\n") line++;
    if (ch === "(") parens++;
    if (ch === ")") parens--;
    if (parens === 0) {
      if (ch === "{") {
        stack.push(buf.replace(/\s+/g, " ").trim());
        buf = "";
        bufLine = line;
        continue;
      }
      if (ch === "}") {
        flush();
        stack.pop();
        bufLine = line;
        continue;
      }
      if (ch === ";") {
        flush();
        bufLine = line;
        continue;
      }
    }
    if (buf === "" && /\s/.test(ch)) {
      bufLine = line;
      continue;
    }
    buf += ch;
  }
  return out;
}

/**
 * One flat name-to-value map, as a browser would have it in that theme.
 *
 * Conditional declarations are left out: a media query is a *second* value,
 * not a replacement, and folding it in reports the desktop measure as the one
 * a phone gets. Ask for those through the declarations themselves.
 */
export function flatten(decls: Declaration[], theme: Theme): Map<string, string> {
  const map = new Map<string, string>();
  for (const d of decls) {
    if (d.conditions.length > 0) continue;
    if (d.theme === "dark" && theme !== "dark") continue;
    map.set(d.name, d.value);
  }
  return map;
}
