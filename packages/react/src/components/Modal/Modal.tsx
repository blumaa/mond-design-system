import type { ReactNode } from "react";
import { Overlay } from "../../internal/Overlay";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  /** Scrim click dismisses. Default true. */
  closeOnScrimClick?: boolean;
  /** alertdialog interrupts — ConfirmDialog sets it. Default "dialog". */
  role?: "dialog" | "alertdialog";
  /** id of the element that explains the dialog, read out with its name. */
  describedBy?: string | undefined;
  children: ReactNode;
}

/**
 * Centered dialog. Escape, scrim click (`closeOnScrimClick`), and focus trap
 * are handled. Compose the sections:
 *
 * ```tsx
 * <Modal open={open} onClose={() => setOpen(false)} label="Edit session">
 *   <ModalHeader>Edit session</ModalHeader>
 *   <ModalBody>…</ModalBody>
 *   <ModalFooter><Button onClick={save}>Save</Button></ModalFooter>
 * </Modal>
 * ```
 */
export function Modal({ open, onClose, label, closeOnScrimClick = true, role = "dialog", describedBy, children }: ModalProps) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={label}
      variant="modal"
      role={role}
      describedBy={describedBy}
      closeOnScrimClick={closeOnScrimClick}
      panelClassName={styles.panel}
    >
      {children}
    </Overlay>
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div className={styles.header}>
      {/* The panel's title is its heading, not a styled line of text. */}
      <h2 className={styles.headerTitle}>{children}</h2>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}
