import type { ReactNode } from "react";
import { Overlay } from "../Overlay/Overlay";
import styles from "./Sheet.module.css";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  /** Scrim click dismisses. Default true. */
  closeOnScrimClick?: boolean;
  children: ReactNode;
}

/**
 * Bottom sheet. Same composition as Modal:
 *
 *   <Sheet open={open} onClose={close} label="Filters">
 *     <SheetHeader>Filters</SheetHeader>
 *     <SheetBody>…</SheetBody>
 *     <SheetFooter>…</SheetFooter>
 *   </Sheet>
 */
export function Sheet({ open, onClose, label, closeOnScrimClick = true, children }: SheetProps) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={label}
      variant="sheet"
      closeOnScrimClick={closeOnScrimClick}
      panelClassName={styles.panel}
    >
      {children}
    </Overlay>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}
