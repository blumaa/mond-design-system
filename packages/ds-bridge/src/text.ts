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
