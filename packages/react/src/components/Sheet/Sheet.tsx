import type { ReactNode } from "react";
import { Overlay } from "../../internal/Overlay";
import { CloseGlyph } from "../../internal/glyphs";
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
      {/* The panel's title is its heading: the one landmark a reader jumping
          by heading inside a tall sheet has to go by. */}
      <h2 className={styles.headerTitle}>{children}</h2>
      {onClose !== undefined && (
        <button type="button" aria-label={closeLabel} className={styles.close} onClick={onClose}>
          <CloseGlyph className={styles.closeGlyph} />
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
