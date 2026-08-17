import type { ButtonHTMLAttributes, ElementType, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "highlight";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Glyph slots — pass an <Icon> or any node. Agnostic of icon set. */
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

/* Spinner diameter per control size — matches the icon steps. */
const SPINNER_PX: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

/**
 * The tappable action. Semantics: button by default, link when `href`/`as` says so.
 *
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button variant="danger" loading={deleting} onClick={remove}>Delete</Button>
 * <Button iconOnly aria-label="Close" variant="ghost"><Icon name="close" /></Button>
 * <Button href="/settings">Settings</Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
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
        className,
      )}
      aria-busy={loading || undefined}
      {...own}
      {...rest}
    >
      {loading ? <Spinner size={SPINNER_PX[size]} label="" aria-hidden="true" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </Element>
  );
}
