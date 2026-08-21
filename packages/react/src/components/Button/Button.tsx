import type { ButtonHTMLAttributes, ElementType, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "warning" | "highlight";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "rect" | "pill";

interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Standing on a picture, where the page's own foreground would be read
   *  against a photograph. Only the two see-through variants take it up: a
   *  filled button brings its own ground. */
  onMedia?: boolean;
  /** Corner shape, when the default is not the one this button wants: a
   *  rectangle where `iconOnly` would round it, or a pill around words.
   *  Unset, the shape follows from the size — rect, or a circle when
   *  `iconOnly`. */
  shape?: ButtonShape;
  /** Glyph slots — pass an <Icon> or any node. Agnostic of icon set; the
   *  button sizes the slot from its own size, and publishes that step as
   *  --mds-icon-slot for an icon set that can only size itself. */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Spinner replaces the left slot; disables and announces busy. */
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  /** Renders an <a> — for navigation styled as a button. */
  href?: string;
  /** Element override, e.g. a router's Link. */
  as?: ElementType;
  ref?: Ref<HTMLButtonElement>;
}

/* Icon-only collapses the button to a circle holding one glyph. A glyph says
   nothing to a screen reader, so the type demands the name. */
type IconOnlyEnforcement =
  | { iconOnly: true; "aria-label": string }
  | { iconOnly?: false | undefined };

export type ButtonProps = ButtonBaseProps & IconOnlyEnforcement;

/* Must match --mds-icon-slot on the size classes: the spinner takes the left
   glyph's place and Spinner needs a number, which a stylesheet cannot hand it. */
const ICON_PX: Record<ButtonSize, number> = { sm: 16, md: 20, lg: 24 };

/**
 * The tappable action. Semantics: button by default, link when `href`/`as` says so.
 *
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button variant="danger" loading={deleting} onClick={remove}>Delete</Button>
 * <Button iconOnly aria-label="Close" variant="ghost"><Icon name="close" /></Button>
 * <Button href="/settings">Settings</Button>
 * <Button iconOnly aria-label="Menu" shape="rect"><Icon name="menu" /></Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  shape,
  onMedia = false,
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  type = "button",
  href,
  as,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const Element: ElementType = as ?? (href !== undefined ? "a" : "button");
  const isButton = Element === "button";
  const own = isButton ? { type, disabled: disabled || loading } : { href };

  return (
    <Element
      className={cx(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        iconOnly && styles["icon-only"],
        shape !== undefined && styles[`shape-${shape}`],
        onMedia && styles["on-media"],
        className,
      )}
      aria-busy={loading || undefined}
      {...own}
      {...rest}
    >
      {loading ? (
        <span className={styles.slot}>
          <Spinner size={ICON_PX[size]} label="" aria-hidden="true" />
        </span>
      ) : (
        iconLeft ? <span className={styles.slot}>{iconLeft}</span> : null
      )}
      {children}
      {!loading && iconRight ? <span className={styles.slot}>{iconRight}</span> : null}
    </Element>
  );
}
