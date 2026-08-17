import type { KeyboardEvent, RefObject } from "react";
import { useCallback } from "react";

export interface RovingGroupOptions {
  /** Selector for the focusable items inside the container. */
  selector: string;
  /** Arrow axis. Default "horizontal". */
  orientation?: "horizontal" | "vertical" | "both";
}

/**
 * Arrow-key focus movement for composite widgets (toolbars, menus, tab bars).
 * Wraps at the edges; Home/End jump. Returns a keydown handler for the
 * container.
 */
export function useRovingGroup(
  ref: RefObject<HTMLElement | null>,
  { selector, orientation = "horizontal" }: RovingGroupOptions,
): (event: KeyboardEvent<HTMLElement>) => void {
  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const horizontal = orientation !== "vertical";
      const vertical = orientation !== "horizontal";
      const forward = (horizontal && event.key === "ArrowRight") || (vertical && event.key === "ArrowDown");
      const backward = (horizontal && event.key === "ArrowLeft") || (vertical && event.key === "ArrowUp");
      const home = event.key === "Home";
      const end = event.key === "End";
      if (!forward && !backward && !home && !end) return;

      const container = ref.current;
      if (container === null) return;
      const items = [...container.querySelectorAll<HTMLElement>(selector)].filter(
        (item) => !item.hasAttribute("disabled"),
      );
      const current = items.indexOf(document.activeElement as HTMLElement);
      if (items.length === 0 || current === -1) return;

      event.preventDefault();
      const next = home
        ? 0
        : end
          ? items.length - 1
          : (current + (forward ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    },
    [ref, selector, orientation],
  );
}
