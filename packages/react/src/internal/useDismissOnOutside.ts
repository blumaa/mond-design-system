import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Close a non-modal surface when the pointer goes down anywhere outside it.
 *
 * pointerdown rather than click, for two reasons. A drag that starts inside
 * the surface and ends outside it is a text selection, not a dismissal, and
 * click fires on the release. And a trigger that toggles on click would see
 * the surface closed out from under it and reopen on the same press — which
 * is why the anchor is one of the elements passed in, not just the panel.
 */
export function useDismissOnOutside(
  open: boolean,
  onDismiss: () => void,
  inside: readonly RefObject<HTMLElement | null>[],
): void {
  // Both change identity every render; the listener reads them at event time
  // so it can be attached once per open instead of re-attached per render.
  const latest = useRef({ onDismiss, inside });
  useEffect(() => {
    latest.current = { onDismiss, inside };
  });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const { onDismiss: dismiss, inside: refs } = latest.current;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      dismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);
}
