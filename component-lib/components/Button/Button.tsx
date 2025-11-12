import React from "react";
import { Spinner } from "../Spinner/Spinner";
import "./button.css";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "destructive"
  | "warning";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonCorners = "default" | "rounded";
export type ButtonAlignContent = "left" | "center" | "right";

export interface ButtonProps {
  /**
   * Element type to render as
   * @default 'button'
   */
  as?: React.ElementType;

  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Button corner style
   * @default 'default'
   */
  corners?: ButtonCorners;

  /**
   * Content alignment within the button
   * @default 'center'
   */
  alignContent?: ButtonAlignContent;

  /**
   * Button content - optional for icon-only buttons
   */
  children?: React.ReactNode;

  /**
   * Icon-only button (no text content)
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Button expands to fill container width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Is button disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Is button in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Click event handler
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Mouse enter event handler
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Mouse leave event handler
   */
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;

  /**
   * Key down event handler
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;

  /**
   * Accessible label for screen readers
   */
  "aria-label"?: string;

  /**
   * Indicates current item in navigation
   */
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";

  /**
   * Test ID for testing purposes
   */
  "data-testid"?: string;

  /**
   * Button type for form interaction (only applies when as='button')
   * @default "button"
   */
  type?: "button" | "submit" | "reset";

  /**
   * URL to link to (when as='a')
   */
  href?: string;

  /**
   * Link target (when as='a')
   */
  target?: string;

  /**
   * Link rel attribute (when as='a')
   */
  rel?: string;
}

/**
 * Button Component
 *
 * A versatile, SSR-compatible button component that uses CSS variables for theming.
 * Supports multiple variants, sizes, and can render as different elements (polymorphic).
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Primary button
 * <Button variant="primary" size="md">Click me</Button>
 *
 * @example
 * // Outline button with icon
 * <Button variant="outline" size="sm">
 *   <Icon /> Save
 * </Button>
 *
 * @example
 * // Icon-only button
 * <Button iconOnly aria-label="Delete">
 *   <TrashIcon />
 * </Button>
 *
 * @example
 * // Link styled as button
 * <Button as="a" href="/about">About</Button>
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      as = "button",
      variant = "primary",
      size = "md",
      corners = "default",
      alignContent = "center",
      children,
      iconOnly = false,
      fullWidth = false,
      disabled = false,
      loading = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      "data-testid": dataTestId,
      type = "button",
      href,
      target,
      rel,
    },
    ref,
  ) => {
    const Element = as as React.ElementType;

    // Determine spinner size based on button size
    const spinnerSize = size === "sm" ? "xs" : size === "md" ? "sm" : "md";

    // Determine spinner color based on variant
    // Primary, destructive, and warning variants have colored backgrounds, so use white/light spinner
    // Outline and ghost variants have transparent/light backgrounds, so use dark spinner
    const spinnerColor =
      variant === "primary" ||
      variant === "destructive" ||
      variant === "warning"
        ? "var(--mond-brand-interactive-text)"
        : "var(--mond-brand-interactive-background)";

    // Build CSS class names
    const classNames = [
      "mond-button",
      `mond-button--${variant}`,
      `mond-button--${size}`,
      `mond-button--corners-${corners}`,
      `mond-button--align-${alignContent}`,
      fullWidth && "mond-button--full-width",
      iconOnly && "mond-button--icon-only",
      disabled || loading && "mond-button--disabled",
    ]
      .filter(Boolean)
      .join(" ");

    // Base props common to all elements
    const baseProps = {
      ref,
      className: classNames,
      onClick: disabled ? undefined : onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      "data-testid": dataTestId,
      "data-variant": variant,
      "data-size": size,
    };

    // Button content with spinner
    // For icon-only buttons, spinner replaces the icon; otherwise it's shown alongside
    const buttonContent = loading && iconOnly ? (
      <Spinner size={spinnerSize} color={spinnerColor} label="" />
    ) : (
      <>
        {loading && <Spinner size={spinnerSize} color={spinnerColor} label="" />}
        {children}
      </>
    );

    // Element-specific props based on 'as' prop
    if (as === "button") {
      return (
        <Element {...baseProps} type={type} disabled={disabled || loading}>
          {buttonContent}
        </Element>
      );
    }

    if (as === "a") {
      return (
        <Element
          {...baseProps}
          href={disabled || loading ? undefined : href}
          target={target}
          rel={rel}
          aria-disabled={disabled || loading ? "true" : undefined}
          onClick={
            disabled
              ? (e: React.MouseEvent) => e.preventDefault()
              : onClick
          }
        >
          {buttonContent}
        </Element>
      );
    }

    // Custom element
    return (
      <Element
        {...baseProps}
        aria-disabled={disabled ? "true" : undefined}
      >
        {buttonContent}
      </Element>
    );
  },
);

Button.displayName = "Button";

export default Button;
