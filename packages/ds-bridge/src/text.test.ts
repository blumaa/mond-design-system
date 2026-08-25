import { describe, expect, it } from "vitest";
import { clip, dim, pad, visible, wrap } from "./text.js";

describe("measuring a coloured string", () => {
  it("counts what a reader sees, not what colour costs", () => {
    expect(visible(dim("hello", true))).toBe(5);
    expect(visible("hello")).toBe(5);
  });

  it("pads to a printed width whether or not it is coloured", () => {
    expect(visible(pad(dim("ab", true), 6))).toBe(6);
    expect(pad("ab", 6)).toBe("ab    ");
  });

  it("leaves something already wide enough alone", () => {
    expect(pad("abcdef", 3)).toBe("abcdef");
  });

  it("clips to a printed width, ellipsis included", () => {
    expect(clip("abcdef", 4)).toBe("abc…");
    expect(visible(clip(dim("abcdef", true), 4))).toBe(4);
  });

  it("closes the colour it cut into, so it cannot bleed past the cut", () => {
    expect(clip(dim("abcdef", true), 4).endsWith("\u001b[0m")).toBe(true);
  });

  it("leaves something short enough exactly as it was", () => {
    expect(clip("abc", 10)).toBe("abc");
  });
});

describe("wrapping prose", () => {
  it("breaks on spaces at the given width", () => {
    expect(wrap("one two three four", 9)).toEqual(["one two", "three", "four"]);
  });

  it("keeps a word that is wider than the line rather than losing part of it", () => {
    expect(wrap("supercalifragilistic", 5)).toEqual(["supercalifragilistic"]);
  });

  it("returns nothing for nothing", () => {
    expect(wrap("", 10)).toEqual([]);
  });
});
