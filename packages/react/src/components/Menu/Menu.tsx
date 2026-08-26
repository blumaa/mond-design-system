import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from "react";
import { usePresence } from "../../hooks/usePresence";
import { useRovingGroup } from "../../hooks/useRovingGroup";
import { forkRef } from "../../internal/forkRef";
import { cx } from "../../internal/cx";
import { useAnchoredPosition } from "../../internal/useAnchoredPosition";
import type { Placement } from "../../internal/useAnchoredPosition";
import { useDismissOnOutside } from "../../internal/useDismissOnOutside";
import styles from "./Menu.module.css";

/** Matches --mds-dur-fast; usePresence needs the number in JS. */
export const MENU_EXIT_MS = 120;

/** Distance from the trigger, matching --mds-space-2. */
const GAP = 8;

const ITEM_SELECTOR = '[role="menuitem"]';

export type MenuPlacement = Placement;

/** What Menu needs to be able to put on its trigger. */
type MenuTriggerProps = {
  ref?: Ref<HTMLElement> | undefined;
  "aria-haspopup"?: "menu" | undefined;
  "aria-expanded"?: boolean | undefined;
  onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
  onKeyDown?: ((event: KeyboardEvent<HTMLElement>) => void) | undefined;
};

/** Closing an open menu, and what focus does about it. */
const MenuContext = createContext<{ close: () => void } | null>(null);

export interface MenuProps {
  /** Accessible name of the menu — what the list of actions is *for*. */
  label: string;
  /** The control that opens it. Gets the ref, the ARIA and the key handling. */
  trigger: ReactElement<MenuTriggerProps>;
  /** Side it prefers. It flips and slides to stay on screen. Default "bottom-end". */
  placement?: MenuPlacement;
  className?: string;
  children: ReactNode;
}

/**
 * A button that opens a short list of actions (APG's menu button).
 *
 * Open state is the menu's own: a list of actions has no meaning outside the
 * button that opened it, so unlike Modal, Sheet and Popover there is nothing
 * for a caller to hold. Reach for Popover instead the moment the panel holds
 * anything but actions — a form, a filter, a list of things to read.
 *
 * ```tsx
 * <Menu label="Heat actions" trigger={<Button variant="ghost">Actions</Button>}>
 *   <MenuItem onSelect={edit}>Edit</MenuItem>
 *   <MenuItem onSelect={remove} tone="danger">Delete</MenuItem>
 * </Menu>
 * ```
 */
export function Menu({ label, trigger, placement = "bottom-end", className, children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const { mounted, visible } = usePresence(open, MENU_EXIT_MS);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Two ways to shut: one where the reader is still on the keyboard and the
     trigger is where they left off, and one where the pointer has already
     landed somewhere else and pulling focus back would be a theft. */
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  const dismiss = () => setOpen(false);

  useAnchoredPosition({ open: mounted, anchorRef: triggerRef, floatingRef: panelRef, placement, gap: GAP });
  useDismissOnOutside(open, dismiss, [panelRef, triggerRef]);

  const onArrowKeys = useRovingGroup(panelRef, {
    selector: ITEM_SELECTOR,
    orientation: "vertical",
  });

  /* Opening lands on the first action, so the next arrow key moves through the
     list instead of opening something. */
  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>(
      `${ITEM_SELECTOR}:not([disabled])`,
    );
    first?.focus();
  }, [open]);

  const openWithKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true);
  };

  /* The trigger is rebuilt from its own type and props rather than cloned. It
     renders identically, and the fork lands on a JSX ref attribute — which is
     what says "hand this the node at commit" rather than "read a ref while
     rendering", the thing cloneElement's props object cannot express. */
  const { type: Trigger, props: triggerProps } = trigger;

  return (
    <MenuContext.Provider value={{ close }}>
      <Trigger
        {...triggerProps}
        ref={forkRef(triggerRef, triggerProps.ref)}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event: MouseEvent<HTMLElement>) => {
          triggerProps.onClick?.(event);
          setOpen((v) => !v);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
          triggerProps.onKeyDown?.(event);
          openWithKeyboard(event);
        }}
      />
      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            aria-label={label}
            className={cx(styles.panel, className)}
            data-open={visible || undefined}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                close();
                return;
              }
              /* Tab out of a menu closes it (APG). Focus goes back to the
                 trigger rather than onward: the panel is portalled to the end
                 of <body>, so "onward" from inside it is nowhere near where
                 the reader thinks they are. */
              if (event.key === "Tab") {
                event.preventDefault();
                close();
                return;
              }
              onArrowKeys(event);
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </MenuContext.Provider>
  );
}

export interface MenuItemProps {
  /** What the action does. The menu closes itself around it. */
  onSelect: () => void;
  disabled?: boolean;
  /** "danger" for an action that destroys something. Default "default". */
  tone?: "default" | "danger";
  children: ReactNode;
}

export function MenuItem({ onSelect, disabled = false, tone = "default", children }: MenuItemProps) {
  const menu = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      // The menu is one stop on the page's tab ring; the arrow keys move
      // inside it, so the items are focusable but not tabbable.
      tabIndex={-1}
      disabled={disabled}
      className={cx(styles.item, styles[`tone-${tone}`])}
      onClick={() => {
        onSelect();
        menu?.close();
      }}
    >
      {children}
    </button>
  );
}
