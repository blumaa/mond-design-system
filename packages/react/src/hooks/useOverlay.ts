import { useContext, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { OverlayHistoryContext } from "./overlayHistory";

export interface UseOverlayOptions {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal-surface behaviour: focus capture and restore, Escape to
 * close, Tab cycling inside the panel, body scroll lock. Attach the
 * returned ref to the dialog element (it needs tabIndex={-1}).
 *
 * Anchor-positioned overlays (Tooltip/Popover) will extend this hook with
 * a floating-ui middleware pass; the options object leaves room for that.
 */
export function useOverlay<T extends HTMLElement>(options: UseOverlayOptions): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { open, onClose } = options;
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  /* Back-button contract: an app that supplies OverlayHistory gets every open
     overlay registered, so back dismisses the innermost one instead of leaving
     the screen underneath. Null context (Storybook, tests, non-opted apps) is
     a no-op. The register/dispose pair keeps history balanced either way. */
  const overlayHistory = useContext(OverlayHistoryContext);
  useEffect(() => {
    if (!open || !overlayHistory) return;
    return overlayHistory.register(() => close.current());
  }, [open, overlayHistory]);

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = bodyOverflow;
      previous?.focus();
    };
  }, [open]);

  return ref;
}
