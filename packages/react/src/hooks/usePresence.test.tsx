// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePresence } from "./usePresence";

describe("usePresence", () => {
  afterEach(() => vi.useRealTimers());

  it("closed from the start: not mounted", () => {
    const { result } = renderHook(() => usePresence(false, 200));
    expect(result.current.mounted).toBe(false);
  });

  it("open: mounted and visible", () => {
    const { result } = renderHook(() => usePresence(true, 200));
    expect(result.current.mounted).toBe(true);
    expect(result.current.visible).toBe(true);
  });

  it("closing keeps it mounted for the exit duration, then unmounts", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open, 200), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    expect(result.current.mounted).toBe(true);
    expect(result.current.visible).toBe(false);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current.mounted).toBe(false);
  });
});
