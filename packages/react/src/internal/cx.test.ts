import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins class names with a space", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy parts", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns empty string for no truthy parts", () => {
    expect(cx(false, undefined)).toBe("");
  });
});
