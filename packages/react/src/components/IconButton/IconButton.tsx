import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./IconButton.module.css";

export type IconButtonVariant = "ghost" | "primary" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  /** Accessible name — required. An icon says nothing to a screen reader. */
  label: string;
  /** The glyph. */
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  type?: "button" | "submit" | "reset";
  ref?: Ref<HTMLButtonElement>;
}

/** Square/circular icon-only button. Label is a prop so it cannot be forgotten. */
export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: IconButtonProps): ReactElement {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(styles.iconButton, styles[`variant-${variant}`], styles[`size-${size}`], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
