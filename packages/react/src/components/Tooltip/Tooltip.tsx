import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FocusEvent, PointerEvent, ReactElement, ReactNode, Ref } from "react";
import { forkRef } from "../../internal/forkRef";
import { useAnchoredPosition } from "../../internal/useAnchoredPosition";
import type { Placement } from "../../internal/useAnchoredPosition";
import styles from "./Tooltip.module.css";

/** Distance from the trigger, matching --mds-space-2. */
const GAP = 8;

/** Pointer dwell before it appears. Long enough that crossing the control on
    the way somewhere else does not flash a label. */
const DEFAULT_DELAY_MS = 400;

export type TooltipPlacement = Placement;

/** What Tooltip needs to be able to put on its trigger. */
type TriggerProps = {
  ref?: Ref<HTMLElement> | undefined;
  "aria-describedby"?: string | undefined;
  onPointerEnter?: ((event: PointerEvent<HTMLElement>) => void) | undefined;
  onPointerLeave?: ((event: PointerEvent<HTMLElement>) => void) | undefined;
  onFocus?: ((event: FocusEvent<HTMLElement>) => void) | undefined;
  onBlur?: ((event: FocusEvent<HTMLElement>) => void) | undefined;
};

export interface TooltipProps {
  /** The label. Plain text — nothing here is reachable by pointer or key. */
  content: ReactNode;
  /** Side it prefers. It flips and slides to stay on screen. Default "top". */
  placement?: TooltipPlacement;
  /** Pointer dwell in ms. Keyboard focus ignores it. Default 400. */
  delayMs?: number;
  /** The control being labelled. Gets the ref and the handlers. */
  children: ReactElement<TriggerProps>;
}

/**
 * A name for a control that shows only its glyph, on hover and on focus.
 *
 * It describes; it does not hold anything. There is nothing to click inside
 * it and focus never moves into it, so anything the reader has to act on —
 * a link, a button, a form — belongs in a Popover instead. A control whose
 * label is *only* here still needs an aria-label of its own: this is the
 * accessible description, not the accessible name.
 *
 * ```tsx
 * <Tooltip content="Remove from heat">
 *   <Button variant="ghost" aria-label="Remove from heat"><Icon name="x" /></Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  placement = "top",
  delayMs = DEFAULT_DELAY_MS,
  children,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => clearTimeout(timer.current), []);

  useAnchoredPosition({ open, anchorRef, floatingRef: surfaceRef, placement, gap: GAP });

  /* WCAG 1.4.13 (Content on Hover or Focus): whatever put it there, Escape
     takes it away without moving the pointer or the focus. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* The trigger is rebuilt from its own type and props rather than cloned. It
     renders identically, and the fork lands on a JSX ref attribute — which is
     what says "hand this the node at commit" rather than "read a ref while
     rendering", the thing cloneElement's props object cannot express. */
  const { type: Trigger, props: triggerProps } = children;

  return (
    <>
      <Trigger
        {...triggerProps}
        ref={forkRef(anchorRef, triggerProps.ref)}
        // Only while it exists: a describedby pointing at nothing is a broken
        // reference, and axe reads it as one.
        aria-describedby={open ? id : triggerProps["aria-describedby"]}
        onPointerEnter={(event: PointerEvent<HTMLElement>) => {
          triggerProps.onPointerEnter?.(event);
          // A touch fires pointerenter with no way to leave, so the label would
          // stick until the next tap somewhere else. Touch gets nothing here;
          // the control needs a real name either way.
          if (event.pointerType === "touch") return;
          clearTimeout(timer.current);
          timer.current = setTimeout(show, delayMs);
        }}
        onPointerLeave={(event: PointerEvent<HTMLElement>) => {
          triggerProps.onPointerLeave?.(event);
          hide();
        }}
        // No dwell on focus: the reader has already committed to the control,
        // and a delay on a keyboard path reads as the tooltip being broken.
        onFocus={(event: FocusEvent<HTMLElement>) => {
          triggerProps.onFocus?.(event);
          show();
        }}
        onBlur={(event: FocusEvent<HTMLElement>) => {
          triggerProps.onBlur?.(event);
          hide();
        }}
      />
      {open &&
        createPortal(
          <div ref={surfaceRef} id={id} role="tooltip" className={styles.surface}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
