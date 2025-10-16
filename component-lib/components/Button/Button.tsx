"use client";
import React from "react";
import {
  radii,
  spacing,
  fontSizes,
  fontWeights,
  fontFamilies,
} from "../../tokens";
import { useTheme } from "../providers/ThemeProvider";

export type ButtonVariant = "primary" | "outline" | "ghost" | "destructive" | "warning";
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
   * Accessible label for screen readers
   */
  "aria-label"?: string;

  /**
   * Indicates current item in navigation
   */
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false";

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

  /**
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;
}

// Variant style definitions using theme tokens
const getVariantStyles = (
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
) => {
  const variants = {
    primary: {
      backgroundColor: theme("interactive.primary.background"),
      color: theme("interactive.primary.text"),
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: theme("interactive.primary.background"),
      border: `1px solid ${theme("interactive.primary.background")}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme("interactive.ghost.text"),
      border: "none",
    },
    destructive: {
      backgroundColor: theme("brand.error.600"),
      color: theme("interactive.primary.text"),
      border: "none",
    },
    warning: {
      backgroundColor: theme("brand.warning.600"),
      color: theme("interactive.primary.text"),
      border: "none",
    },
  };

  return variants[variant];
};

// Size style definitions
const getSizeStyles = (size: ButtonSize, iconOnly: boolean = false) => {
  if (iconOnly) {
    switch (size) {
      case "sm":
        return {
          padding: spacing[1],
          fontSize: fontSizes.sm,
          width: "32px",
          height: "32px",
        };
      case "md":
        return {
          padding: spacing[2],
          fontSize: fontSizes.base,
          width: "40px",
          height: "40px",
        };
      case "lg":
        return {
          padding: spacing[3],
          fontSize: fontSizes.lg,
          width: "48px",
          height: "48px",
        };
      default:
        return {};
    }
  }

  switch (size) {
    case "sm":
      return {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: fontSizes.sm,
      };
    case "md":
      return {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: fontSizes.base,
      };
    case "lg":
      return {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: fontSizes.lg,
      };
    default:
      return {};
  }
};

// Corner style definitions
const getCornerStyles = (corners: ButtonCorners) => {
  const cornerStyles = {
    default: {
      borderRadius: radii.md,
    },
    rounded: {
      borderRadius: radii.full,
    },
  };

  return cornerStyles[corners];
};

// Alignment style definitions
const getAlignmentStyles = (alignContent: ButtonAlignContent) => {
  switch (alignContent) {
    case "left":
      return {
        justifyContent: "flex-start",
      };
    case "right":
      return {
        justifyContent: "flex-end",
      };
    case "center":
    default:
      return {
        justifyContent: "center",
      };
  }
};

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
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      "data-testid": dataTestId,
      type = "button",
      href,
      target,
      rel,
      isDarkMode,
    },
    ref,
  ) => {
    const theme = useTheme(isDarkMode);
    const variantStyles = getVariantStyles(variant, theme);
    const sizeStyles = getSizeStyles(size, iconOnly);
    const cornerStyles = getCornerStyles(corners);
    const alignmentStyles = getAlignmentStyles(alignContent);

    const Element = as as React.ElementType;

    // Generate CSS class with a unique identifier
    const buttonId = React.useId();
    const uniqueClass = `mond-button-${buttonId.replace(/:/g, "-")}`;

    // Build dynamic CSS for pseudo-states
    const dynamicCSS = React.useMemo(() => {
      const hoverStyles: Record<string, string> = {};
      const activeStyles: Record<string, string> = {};
      const focusStyles: Record<string, string> = {
        outline: `2px solid ${theme("border.focused")}`,
        outlineOffset: "2px",
      };

      // Define hover and active states per variant
      switch (variant) {
        case "primary":
          hoverStyles.backgroundColor = theme("interactive.primary.backgroundHover");
          activeStyles.backgroundColor = theme("interactive.primary.backgroundPressed");
          break;
        case "outline":
          hoverStyles.backgroundColor = theme("interactive.primary.background");
          hoverStyles.color = theme("interactive.primary.text");
          activeStyles.backgroundColor = theme("interactive.primary.backgroundHover");
          activeStyles.color = theme("interactive.primary.text");
          break;
        case "ghost":
          hoverStyles.backgroundColor = theme("interactive.ghost.backgroundHover");
          activeStyles.backgroundColor = theme("interactive.ghost.backgroundPressed");
          focusStyles.outline = `2px solid ${theme("border.default")}`;
          break;
        case "destructive":
          hoverStyles.backgroundColor = theme("brand.error.500");
          activeStyles.backgroundColor = theme("brand.error.700");
          break;
        case "warning":
          hoverStyles.backgroundColor = theme("brand.warning.500");
          activeStyles.backgroundColor = theme("brand.warning.700");
          break;
      }

      // Convert style objects to CSS strings
      const hoverCSS = Object.entries(hoverStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
        .join(" ");

      const activeCSS = Object.entries(activeStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
        .join(" ");

      const focusCSS = Object.entries(focusStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
        .join(" ");

      return `
        .${uniqueClass}:hover:not(:disabled) {
          ${hoverCSS}
        }
        .${uniqueClass}:active:not(:disabled) {
          ${activeCSS}
        }
        .${uniqueClass}:focus-visible {
          ${focusCSS}
        }
      `;
    }, [variant, theme, uniqueClass]);

    const baseStyles: React.CSSProperties = {
      // Layout
      display: fullWidth ? "flex" : "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      minWidth: fullWidth ? undefined : "fit-content",
      width: fullWidth ? "100%" : undefined,
      gap: spacing[2],
      // Typography
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.medium,
      // State
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      // Variant, size, corner, and alignment styles
      ...variantStyles,
      ...cornerStyles,
      ...alignmentStyles,
      ...sizeStyles, // Size styles LAST to ensure padding is applied
    };

    // Build element-specific props
    const baseElementProps = {
      ref,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      "data-testid": dataTestId,
      className: uniqueClass,
      style: baseStyles,
      "data-mond-button": true,
      "data-variant": variant,
      "data-align-content": alignContent,
    };

    // Add element-specific props based on the 'as' prop
    const elementProps = as === "button"
      ? {
          ...baseElementProps,
          type,
          disabled,
        }
      : as === "a"
      ? {
          ...baseElementProps,
          "aria-disabled": disabled,
          href,
          target,
          rel,
        }
      : {
          ...baseElementProps,
          "aria-disabled": disabled,
        };

    return (
      <>
        <style>{dynamicCSS}</style>
        <Element {...elementProps}>
          {children}
        </Element>
      </>
    );
  },
);

Button.displayName = "Button";

export default Button;
