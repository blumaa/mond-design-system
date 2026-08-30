import { useContext, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { OverlayHistoryContext } from "./overlayHistory";

export interface UseOverlayOptions {
  open: boolean;
  onClose: () => void;
  /**
   * Freeze the page behind the surface. Default true.
   *
   * False for anchored surfaces: a popover is pinned to a trigger that scrolls
   * with the page, so locking the page would strand it over content the reader
   * can no longer reach, and locking it *and* letting the popover follow the
   * anchor are the same gesture answered two ways.
   */
  lockScroll?: boolean;
  /**
   * Trap Tab inside the panel and always hand focus back on close. Default
   * true.
   *
   * False for non-modal surfaces: the page behind a popover is still live,
   * so Tab walks out of the panel instead of cycling, and focus returns to
   * the opener only when the close takes it from inside the panel — a press
   * elsewhere on the page already put it where the reader wanted it.
   */
  modal?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal-surface behaviour: focus capture and restore, Escape to
 * close, Tab cycling inside the panel, body scroll lock. Attach the
 * returned ref to the dialog element (it needs tabIndex={-1}).
 *
 * Popover uses it too, with `lockScroll: false`; where it sits on the screen
 * is a separate question, answered by useAnchoredPosition.
 */
export function useOverlay<T extends HTMLElement>(options: UseOverlayOptions): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { open, onClose, lockScroll = true, modal = true } = options;
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

    /* aria-modal promises assistive tech the rest of the page is gone; inert
       enforces it for the readers that promise alone misses, and takes the
       background out of the Tab order for everyone. Only siblings not already
       inert are marked, so a modal over a modal restores exactly what it
       inerted and no more. */
    let marked: Element[] = [];
    if (modal && panel) {
      let portal: Element = panel;
      while (portal.parentElement && portal.parentElement !== document.body) {
        portal = portal.parentElement;
      }
      marked = [...document.body.children].filter(
        (sibling) => sibling !== portal && !sibling.hasAttribute("inert"),
      );
      for (const sibling of marked) sibling.setAttribute("inert", "");
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close.current();
        return;
      }
      if (!modal || event.key !== "Tab" || !panel) return;
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
    if (lockScroll) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) document.body.style.overflow = bodyOverflow;
      // Before the focus restore: focus will not land on an inert element.
      for (const sibling of marked) sibling.removeAttribute("inert");
      const active = document.activeElement;
      if (modal || (panel && active instanceof HTMLElement && panel.contains(active))) {
        previous?.focus();
      }
    };
  }, [open, lockScroll, modal]);

  return ref;
}
