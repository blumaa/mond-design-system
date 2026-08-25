/* What every command needs to print, in one place.
 *
 * Colour is a parameter rather than a global: `--no-color` and a non-TTY are
 * decided once in `main`, and nothing below it reads `process` to find out.
 */
export const ESC = "\u001b[";

export const dim = (s: string, on: boolean) => (on ? `${ESC}2m${s}${ESC}0m` : s);
export const bold = (s: string, on: boolean) => (on ? `${ESC}1m${s}${ESC}0m` : s);
export const red = (s: string, on: boolean) => (on ? `${ESC}31m${s}${ESC}0m` : s);
export const green = (s: string, on: boolean) => (on ? `${ESC}32m${s}${ESC}0m` : s);

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* Laying anything out in a column means knowing how wide a string prints, and
   a coloured string is longer than it looks: the escapes take space in the
   value and none on the screen. Everything below counts what a reader sees. */

/* Built out of the same ESC the colours are written with, so what counts a
   sequence and what writes one cannot drift — and as a string rather than a
   literal, since a regex carrying the escape character itself is unreadable. */
const SEQUENCE = `${ESC.replace("[", "\\[")}[0-9;]*m`;
const ANSI = new RegExp(SEQUENCE, "g");
const STARTS_WITH_ANSI = new RegExp(`^${SEQUENCE}`);

/** How wide this prints — the escape sequences count for nothing. */
export const visible = (s: string): number => s.replace(ANSI, "").length;

/** Pad to a printed width. Already wider is left alone rather than truncated:
    a border decides that, and it does it by clipping first. */
export const pad = (s: string, width: number): string => s + " ".repeat(Math.max(0, width - visible(s)));

/**
 * Cut to a printed width, ending in an ellipsis.
 *
 * The escapes are copied through and never counted, so a cut that lands inside
 * a coloured run keeps its colour — and the reset at the end stops that colour
 * bleeding into whatever the border draws next.
 */
export function clip(s: string, width: number): string {
  if (visible(s) <= width) return s;
  let out = "";
  let seen = 0;
  let colored = false;
  for (let i = 0; i < s.length; ) {
    const escape = STARTS_WITH_ANSI.exec(s.slice(i));
    if (escape !== null) {
      out += escape[0];
      colored = true;
      i += escape[0].length;
      continue;
    }
    if (seen >= width - 1) break;
    out += s[i];
    seen += 1;
    i += 1;
  }
  return `${out}…${colored ? `${ESC}0m` : ""}`;
}

/** Break plain prose to a printed width, on spaces. Colour is not handled:
    what is wrapped here is written here, and the colour goes on afterwards. */
export function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line === "") line = word;
    else if (visible(line) + 1 + visible(word) <= width) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line !== "") lines.push(line);
  return lines;
}
