/* The base sheet, held to the disagreements it exists to settle. A reset is
 * only worth shipping for the places the browsers do not already agree, so
 * each assertion here names the disagreement rather than the declaration.
 */
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const base = readFileSync(join(__dirname, "src", "base.css"), "utf8");

/* The suggested UA stylesheet in the HTML spec gives a link the hand cursor,
   and WebKit does not: an <a href> in Safari computes cursor:auto, so every
   link in the app read as text under the pointer while the same markup read
   as a link in Chrome. Scoped to [href] because an anchor without one is a
   target, not a link, and pointing at it would be a lie. */
it("gives a link the link cursor, which WebKit does not", () => {
  expect(base).toMatch(/a\[href\]\s*\{[^}]*cursor:\s*pointer;/);
});
