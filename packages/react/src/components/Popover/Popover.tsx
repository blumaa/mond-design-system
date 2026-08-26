import { createPortal } from "react-dom";
import type { ReactNode, RefObject } from "react";
import { useOverlay } from "../../hooks/useOverlay";
import { usePresence } from "../../hooks/usePresence";
import { useAnchoredPosition } from "../../internal/useAnchoredPosition";
import type { Placement } from "../../internal/useAnchoredPosition";
import { useDismissOnOutside } from "../../internal/useDismissOnOutside";
import { cx } from "../../internal/cx";
import { CloseGlyph } from "../../internal/glyphs";
import styles from "./Popover.module.css";

/** Matches --mds-dur-fast; usePresence needs the number in JS. */
export const POPOVER_EXIT_MS = 120;

/** Distance from the anchor, matching --mds-space-2. */
const GAP = 8;

export type PopoverPlacement = Placement;

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** The trigger the panel hangs off. It stays interactive while open. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Accessible name of the panel. */
  label: string;
  /** Side it prefers. It flips and slides to stay on screen. Default "bottom-start". */
  placement?: PopoverPlacement;
  className?: string;
  children: ReactNode;
}

/**
 * Anchored, non-modal surface. The page behind it stays live and scrollable
 * and the panel travels with the anchor; a press outside, Escape, or the
 * trigger itself dismisses it.
 *
 * Modal by contrast: reach for Modal when the answer must come before anything
 * else, and for Sheet when the content is a task rather than a detail — a
 * form with its own header and footer belongs in one of those, not here.
 *
 * ```tsx
 * const anchor = useRef<HTMLButtonElement>(null);
 * const [open, setOpen] = useState(false);
 * <Button ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
 *   Equipment
 * </Button>
 * <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchor} label="Equipment">
 *   <PopoverBody>…</PopoverBody>
 * </Popover>
 * ```
 */
export function Popover({
  open,
  onClose,
  anchorRef,
  label,
  placement = "bottom-start",
  className,
  children,
}: PopoverProps) {
  const { mounted, visible } = usePresence(open, POPOVER_EXIT_MS);
  // Focus capture, Escape, Tab cycling and focus restore are the modal
  // surface's behaviour and are the same here; only the page lock differs.
  const panelRef = useOverlay<HTMLDivElement>({ open, onClose, lockScroll: false });
  useAnchoredPosition({ open: mounted, anchorRef, floatingRef: panelRef, placement, gap: GAP });
  useDismissOnOutside(open, onClose, [panelRef, anchorRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      className={cx(styles.panel, className)}
      data-open={visible || undefined}
    >
      {children}
    </div>,
    document.body,
  );
}

export type PopoverHeaderProps = { children: ReactNode } & (
  | {
      /** Renders a close button after the title. Wire it to the popover's own onClose. */
      onClose: () => void;
      /** Accessible name of the close button (localise). */
      closeLabel: string;
    }
  | { onClose?: undefined; closeLabel?: undefined }
);

export function PopoverHeader({ children, onClose, closeLabel }: PopoverHeaderProps) {
  return (
    <div className={styles.header}>
      {/* Same contract as a sheet's header: the panel's title is the one
          landmark a reader jumping by heading has to go by. */}
      <h2 className={styles.headerTitle}>{children}</h2>
      {onClose !== undefined && (
        <button type="button" aria-label={closeLabel} className={styles.close} onClick={onClose}>
          <CloseGlyph className={styles.closeGlyph} />
        </button>
      )}
    </div>
  );
}

export function PopoverBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function PopoverFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}
