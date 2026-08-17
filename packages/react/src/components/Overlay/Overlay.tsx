import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { cx } from "../../internal/cx";
import { useOverlay } from "../../hooks/useOverlay";
import { usePresence } from "../../hooks/usePresence";
import styles from "./Overlay.module.css";

/** Matches --mds-dur-base; usePresence needs the number in JS. */
export const OVERLAY_EXIT_MS = 200;

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  variant: "modal" | "sheet";
  panelClassName: string | undefined;
  children: ReactNode;
}

/**
 * Internal shell shared by Modal and Sheet: portal, scrim, dialog
 * semantics, useOverlay behaviour, exit-animation presence. Not exported
 * from the package.
 */
export function Overlay({ open, onClose, label, variant, panelClassName, children }: OverlayProps) {
  const { mounted, visible } = usePresence(open, OVERLAY_EXIT_MS);
  const ref = useOverlay<HTMLDivElement>({ open, onClose });

  if (!mounted) return null;

  return createPortal(
    <div
      className={cx(styles.scrim, styles[`variant-${variant}`])}
      data-open={visible || undefined}
      data-testid="mds-scrim"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
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
