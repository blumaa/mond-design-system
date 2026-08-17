import type { ReactNode } from "react";
import { Overlay } from "../Overlay/Overlay";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  /** Scrim click dismisses. Default true. */
  closeOnScrimClick?: boolean;
  children: ReactNode;
}

/**
 * Centered dialog. Compose the sections:
 *
 *   <Modal open={open} onClose={close} label="Edit session">
 *     <ModalHeader>Edit session</ModalHeader>
 *     <ModalBody>…</ModalBody>
 *     <ModalFooter>…</ModalFooter>
 *   </Modal>
 */
export function Modal({ open, onClose, label, closeOnScrimClick = true, children }: ModalProps) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={label}
      variant="modal"
      closeOnScrimClick={closeOnScrimClick}
      panelClassName={styles.panel}
    >
      {children}
    </Overlay>
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}
