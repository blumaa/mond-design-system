import { Button } from "../Button/Button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal/Modal";
import styles from "./ConfirmDialog.module.css";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | undefined;
  confirmLabel: string;
  cancelLabel?: string | undefined;
  /** Style the confirm action as destructive. */
  danger?: boolean | undefined;
}

/** Pre-composed Modal for the confirm/cancel pattern. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} label={title}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {description ? <p className={styles.description}>{description}</p> : null}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
