// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { usePresence } from "./usePresence";

describe("usePresence", () => {
  afterEach(() => vi.useRealTimers());

  it("closed from the start: not mounted", () => {
    const { result } = renderHook(() => usePresence(false, 200));
    expect(result.current.mounted).toBe(false);
  });

  // An element inserted already carrying its open style transitions from
  // nothing and simply appears. It has to be painted closed first.
  it("open: mounted at once, visible a frame later", async () => {
    const { result } = renderHook(() => usePresence(true, 200));
    expect(result.current.mounted).toBe(true);
    expect(result.current.visible).toBe(false);
    await waitFor(() => expect(result.current.visible).toBe(true));
  });

  it("closing keeps it mounted for the exit duration, then unmounts", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open, 200), {
      initialProps: { open: true },
    });
    act(() => {
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
    });
    expect(result.current.visible).toBe(true);
    rerender({ open: false });
    expect(result.current.mounted).toBe(true);
    expect(result.current.visible).toBe(false);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current.mounted).toBe(false);
  });
});
