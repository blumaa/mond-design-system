// @vitest-environment jsdom
/* The glyphs, held to the one thing a bundled mark cannot leave to the browser.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as glyphs from "./glyphs.js";

const marks = Object.entries(glyphs).filter(([name]) => name.endsWith("Glyph"));

describe("every bundled glyph", () => {
  /* An <svg> with a viewBox and no size of its own has no agreed default:
     Chrome invents 300x150 and shrinks it to whatever the parent allows,
     WebKit gives 0x0 and the mark disappears. The slot a glyph sits in
     usually sizes it, and `className` is optional — so the fallback has to
     be on the glyph. 1em follows the text around it, and a slot's
     `width: 100%` beats a presentation attribute wherever there is one. */
  it.each(marks)("%s sizes itself when no slot does", (_name, Glyph) => {
    const { container } = render(<Glyph />);
    const svg = container.querySelector("svg");
    expect([svg?.getAttribute("width"), svg?.getAttribute("height")]).toEqual(["1em", "1em"]);
  });
});
