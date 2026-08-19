import { useEffect, useState } from "react";

export interface Presence {
  /** Keep the element in the DOM (true during exit animation). */
  mounted: boolean;
  /** Drive the visual state — false on the frame it enters and during exit. */
  visible: boolean;
}

/**
 * Enter/exit animation helper. An element inserted already carrying its open
 * style has nothing to transition from, so `visible` stays false for the frame
 * the closed style is painted in and flips on the next one. `mounted` lags
 * `open` by `durationMs` on close so the exit transition can finish.
 */
export function usePresence(open: boolean, durationMs: number): Presence {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  // Syncing on the prop belongs in render, not an effect ("adjusting state when
  // props change" pattern); the effects own only the frame and the timer.
  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (!open) return;
    // Two frames, not one: the callback of the first runs before anything has
    // been painted, so flipping there is still a jump.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(timer);
  }, [open, durationMs]);

  return { mounted: open || mounted, visible };
}
