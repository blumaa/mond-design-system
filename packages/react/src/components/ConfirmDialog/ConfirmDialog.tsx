import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal/Modal";
import styles from "./ConfirmDialog.module.css";

export type ConfirmDialogTone = "default" | "danger" | "warning";

export interface ConfirmDialogProps<T = void> {
  /** The row in question, or null when nothing is being asked. Held by the
      caller — only it knows which row was tapped — and handed back to
      `onConfirm`, so the action runs against the row the user actually saw. */
  target?: T | null;
  /** Defaults to "there is a row in question"; pass it directly for a
      one-off prompt that has no row. */
  open?: boolean;
  /** Cancel, or the action having landed. Clear the row here. */
  onClose?: () => void;
  /** The action, given the row it was asked about. Return the promise the
      write is riding on — typically `mutateAsync(...)` — and do not catch:
      a handled rejection resolves, and a resolved action is
      indistinguishable from a write that landed. Typed as a promise so
      fire-and-forget is a type error rather than a prompt that closes on
      the click. */
  onConfirm?: (target: T) => Promise<unknown>;
  /** Short question, e.g. "Delete session?" */
  title: string;
  /** Consequence explained in a sentence or two. */
  description?: ReactNode;
  confirmLabel: string;
  /** Names the way out, e.g. "Cancel". Required: it is a button with words on
      it, and the words are the app's. */
  cancelLabel: string;
  /** Styles the confirm action: danger for destructive, warning for
      consequential-but-recoverable. */
  tone?: ConfirmDialogTone;
  /** How to phrase a failure, given the error's own message. Defaults to
      that message — supply this rather than catching inside `onConfirm`,
      so the copy stays with the caller. */
  errorMessage?: (message: string) => string;
}

/** What the panel is showing, the row included. Frozen at close so the exit
    animation still has a question to animate away after the caller has
    dropped what it was asking about. */
interface Shown<T> {
  target: T | null | undefined;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone: ConfirmDialogTone;
}

const CONFIRM_VARIANT = {
  default: "primary",
  danger: "danger",
  warning: "warning",
} as const;

/**
 * A binary confirm/cancel prompt for consequential actions. role="alertdialog"
 * so assistive tech announces it and holds focus until the user decides.
 *
 * The prompt owns everything downstream of the tap: it stays busy until
 * `onConfirm` settles, closes only once the write has landed, and keeps
 * itself up with the reason shown if it fails. Callers supply the question,
 * not the mechanics.
 *
 * ```tsx
 * <ConfirmDialog
 *   target={asked}
 *   onClose={() => setAsked(null)}
 *   onConfirm={(row) => remove.mutateAsync(row.id)}
 *   title="Delete session?"
 *   description="This cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   tone="danger"
 * />
 * ```
 */
export function ConfirmDialog<T = void>({
  target,
  open = target != null,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "default",
  errorMessage,
}: ConfirmDialogProps<T>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Each new question starts idle. Reset on the way in rather than on the
  // way out: on the way out the panel is still visible, and wiping the
  // spinner there restores the unanswered question for the length of the
  // exit animation. Render-phase adjust, the "state from props" pattern —
  // an effect would paint the stale frame first.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setBusy(false);
      setError(null);
    }
  }

  // While open, show the live props. Closing freezes them (in the close
  // handlers, where state writes are free) because the closing render's
  // props are already stale: the caller clears its row in the same set of
  // state updates that closes the prompt.
  const live: Shown<T> = { target, title, description, confirmLabel, cancelLabel, tone };
  const [frozen, setFrozen] = useState<Shown<T>>(live);
  const view = open ? live : frozen;

  const close = () => {
    setFrozen(live);
    onClose?.();
  };

  const handleConfirm = async () => {
    if (!onConfirm) return;
    // Read the row now, at the tap, not after the await: by then the caller
    // has been told to close and has cleared it.
    const asked = live.target as T;
    setBusy(true);
    setError(null);
    try {
      await onConfirm(asked);
      // Only now: before this point the write may still fail, and a prompt
      // that has already closed has told the user something it doesn't know.
      close();
    } catch (e) {
      setBusy(false);
      const message = (e as Error).message;
      setError(errorMessage?.(message) ?? message);
    }
  };

  return (
    <Modal
      open={open}
      // Escape must always work — dropping onClose while busy would leave
      // the dialog with no keyboard exit (WCAG 2.1.2). The scrim stays
      // guarded regardless, so a stray click can't dismiss the question.
      onClose={close}
      label={view.title}
      role="alertdialog"
      closeOnScrimClick={false}
    >
      <ModalHeader>{view.title}</ModalHeader>
      <ModalBody>
        {view.description != null ? <p className={styles.description}>{view.description}</p> : null}
        {error != null ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}
      </ModalBody>
      <ModalFooter>
        {/* Stays enabled while busy so focus always has an operable home
            (only Confirm is locked, to block a double submit). */}
        <Button variant="secondary" onClick={close}>
          {view.cancelLabel}
        </Button>
        <Button variant={CONFIRM_VARIANT[view.tone]} loading={busy} onClick={handleConfirm}>
          {view.confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
