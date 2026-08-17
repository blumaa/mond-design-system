import { useEffect, useState } from "react";

export interface Presence {
  /** Keep the element in the DOM (true during exit animation). */
  mounted: boolean;
  /** Drive the visual state — false during exit. */
  visible: boolean;
}

/**
 * Exit-animation helper. `open` flips instantly; `mounted` lags by
 * `durationMs` on close so the exit transition can play.
 */
export function usePresence(open: boolean, durationMs: number): Presence {
  const [mounted, setMounted] = useState(open);

  // Sync on open belongs in render, not an effect ("adjusting state when
  // props change" pattern) — the effect only owns the exit timer.
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(timer);
  }, [open, durationMs]);

  return { mounted: open || mounted, visible: open };
}
