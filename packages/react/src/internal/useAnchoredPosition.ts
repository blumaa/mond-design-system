import { useEffect } from "react";
import type { RefObject } from "react";
import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";

/** Side the surface prefers, and the edge it lines up with. */
export type { Placement };

/** How far a surface clears the viewport edge before shift() pulls it back. */
const VIEWPORT_PAD = 8;

/** A surface shorter than this is not worth flipping to — it would scroll on
    two lines. Below it, size() stops shrinking and shift() takes over. */
const MIN_HEIGHT = 120;

export interface AnchoredPositionOptions {
  open: boolean;
  /** The element the surface hangs off. */
  anchorRef: RefObject<HTMLElement | null>;
  /** The surface itself. */
  floatingRef: RefObject<HTMLElement | null>;
  placement: Placement;
  /** Distance from the anchor, px. */
  gap: number;
}

/**
 * Keep a portalled surface pinned to its anchor.
 *
 * Writes `left`/`top` straight onto the element rather than through state:
 * autoUpdate fires on every scroll and resize frame of every scrollable
 * ancestor, and a re-render per frame is a re-render of the surface's whole
 * subtree. The resolved side lands in `data-placement` so the stylesheet can
 * grow the surface out of the edge it is actually attached to.
 */
export function useAnchoredPosition({
  open,
  anchorRef,
  floatingRef,
  placement,
  gap,
}: AnchoredPositionOptions): void {
  useEffect(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!open || anchor === null || floating === null) return;

    const update = () => {
      void computePosition(anchor, floating, {
        placement,
        strategy: "fixed",
        middleware: [
          offset(gap),
          // Order is load-bearing: choose the side first, then cap the height
          // to what that side has, then slide along the cross axis. Sizing
          // before flipping caps against the side being abandoned.
          flip({ padding: VIEWPORT_PAD }),
          size({
            padding: VIEWPORT_PAD,
            apply({ availableHeight, elements }) {
              elements.floating.style.maxHeight = `${Math.max(availableHeight, MIN_HEIGHT)}px`;
            },
          }),
          shift({ padding: VIEWPORT_PAD }),
        ],
      }).then(({ x, y, placement: resolved }) => {
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
        floating.dataset.placement = resolved;
      });
    };

    return autoUpdate(anchor, floating, update);
  }, [open, anchorRef, floatingRef, placement, gap]);
}
