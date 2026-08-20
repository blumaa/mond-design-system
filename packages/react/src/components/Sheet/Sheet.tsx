import type { ReactNode } from "react";
import { Overlay } from "../../internal/Overlay";
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
 * Bottom sheet. Same composition and dismissal model as Modal:
 *
 * ```tsx
 * <Sheet open={open} onClose={() => setOpen(false)} label="Filters">
 *   <SheetHeader>Filters</SheetHeader>
 *   <SheetBody>…</SheetBody>
 *   <SheetFooter><Button onClick={apply}>Apply</Button></SheetFooter>
 * </Sheet>
 * ```
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

export type SheetHeaderProps = { children: ReactNode } & (
  | {
      /** Renders a close button after the title. Wire it to the sheet's own onClose. */
      onClose: () => void;
      /** Accessible name of the close button (localise). */
      closeLabel: string;
    }
  | { onClose?: undefined; closeLabel?: undefined }
);

export function SheetHeader({ children, onClose, closeLabel }: SheetHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.headerTitle}>{children}</span>
      {onClose !== undefined && (
        <button type="button" aria-label={closeLabel} className={styles.close} onClick={onClose}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.closeGlyph}>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}
