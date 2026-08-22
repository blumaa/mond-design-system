// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { forkRef } from "./forkRef";

describe("forkRef", () => {
  it("fills the component's own ref", () => {
    const own = createRef<HTMLInputElement>();
    const node = document.createElement("input");
    forkRef(own, undefined)(node);
    expect(own.current).toBe(node);
  });

  it("fills an object ref the caller gave", () => {
    const own = createRef<HTMLInputElement>();
    const given = createRef<HTMLInputElement>();
    const node = document.createElement("input");
    forkRef(own, given)(node);
    expect(given.current).toBe(node);
  });

  it("calls a callback ref the caller gave", () => {
    const own = createRef<HTMLInputElement>();
    const given = vi.fn();
    const node = document.createElement("input");
    forkRef(own, given)(node);
    expect(given).toHaveBeenCalledWith(node);
  });

  /* Unmounting hands null to the same ref, and a caller holding a detached
     node is a leak they cannot see. */
  it("passes the null on when the node goes", () => {
    const own = createRef<HTMLInputElement>();
    const given = createRef<HTMLInputElement>();
    forkRef(own, given)(document.createElement("input"));
    forkRef(own, given)(null);
    expect(own.current).toBeNull();
    expect(given.current).toBeNull();
  });
});
