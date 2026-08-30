import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { cx } from "./cx";
import { useOverlay } from "../hooks/useOverlay";
import { usePresence } from "../hooks/usePresence";
import styles from "./Overlay.module.css";

/** Matches --mds-dur-base; usePresence needs the number in JS. */
export const OVERLAY_EXIT_MS = 200;

/** Matches --mds-dur-slow. A sheet travels its own height where a modal only
    fades, so it is on the slower clock — unmounting it on the fade's clock cut
    the slide off partway down. */
export const SHEET_EXIT_MS = 320;

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  variant: "modal" | "sheet" | "lightbox";
  /** alertdialog interrupts — confirms use it so AT announces the question. */
  role?: "dialog" | "alertdialog";
  /** id of the element that explains the dialog, read out with its name. */
  describedBy?: string | undefined;
  /** Scrim click dismisses. Confirmations turn this off. */
  closeOnScrimClick: boolean;
  panelClassName: string | undefined;
  children: ReactNode;
}

/**
 * Internal shell shared by Modal, Sheet and Lightbox: portal, scrim, dialog
 * semantics, useOverlay behaviour, exit-animation presence. Not exported
 * from the package.
 */
export function Overlay({ open, onClose, label, variant, role = "dialog", describedBy, closeOnScrimClick, panelClassName, children }: OverlayProps) {
  const { mounted, visible } = usePresence(open, variant === "sheet" ? SHEET_EXIT_MS : OVERLAY_EXIT_MS);
  const ref = useOverlay<HTMLDivElement>({ open, onClose });

  if (!mounted) return null;

  return createPortal(
    <div
      className={cx(styles.scrim, styles[`variant-${variant}`])}
      data-open={visible || undefined}
      data-testid="mds-scrim"
      onClick={closeOnScrimClick ? onClose : undefined}
    >
      <div
        ref={ref}
        role={role}
        aria-modal="true"
        aria-label={label}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={panelClassName}
        data-open={visible || undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
