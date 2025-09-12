"use client";
import React from "react";
import {
  radii,
  spacing,
  fontSizes,
  fontWeights,
  fontFamilies,
} from "../../../tokens";
import { useTheme } from "../../providers/ThemeProvider";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonCorners = "default" | "rounded";
export type ButtonAlignContent = "left" | "center" | "right";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
   * Click event handler
   */
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Is button disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;
}

const getVariantStyles = (
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
) => {
  return (
    {
      primary: {
        backgroundColor: theme("interactive.primary.background"),
        color: theme("interactive.primary.text"),
        border: `1px solid ${theme("interactive.primary.background")}`,
        hoverStyles: {
          backgroundColor: theme("interactive.primary.backgroundHover"),
        },
        activeStyles: {
          backgroundColor: theme("interactive.primary.backgroundPressed"),
        },
        focusStyles: {
          outline: `2px solid ${theme("border.focused")}`,
          outlineOffset: "2px",
        },
      },
      outline: {
        backgroundColor: "transparent",
        color: theme("interactive.primary.background"),
        border: `1px solid ${theme("interactive.primary.background")}`,
        hoverStyles: {
          backgroundColor: theme("interactive.primary.background"),
          color: theme("interactive.primary.text"),
          borderColor: theme("interactive.primary.background"),
        },
        activeStyles: {
          backgroundColor: theme("interactive.primary.backgroundHover"),
          color: theme("interactive.primary.text"),
          borderColor: theme("interactive.primary.backgroundHover"),
        },
        focusStyles: {
          outline: `2px solid ${theme("border.focused")}`,
          outlineOffset: "2px",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: theme("interactive.ghost.text"),
        border: "none",
        hoverStyles: {
          backgroundColor: theme("interactive.ghost.backgroundHover"),
        },
        activeStyles: {
          backgroundColor: theme("interactive.ghost.backgroundPressed"),
        },
        focusStyles: {
          outline: `2px solid ${theme("border.default")}`,
          outlineOffset: "2px",
        },
      },
    }[variant] || {}
  );
};

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

const getCornerStyles = (corners: ButtonCorners) => {
  switch (corners) {
    case "rounded":
      return {
        borderRadius: radii.full,
      };
    case "default":
    default:
      return {
        borderRadius: radii.md,
      };
  }
};

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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      corners = "default",
      alignContent = "center",
      children,
      iconOnly = false,
      disabled = false,
      isDarkMode,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme(isDarkMode);
    const variantStyles = getVariantStyles(variant, theme);
    const sizeStyles = getSizeStyles(size, iconOnly);
    const cornerStyles = getCornerStyles(corners);
    const alignmentStyles = getAlignmentStyles(alignContent);

    const baseStyles = {
      // Layout
      display: "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",
      whiteSpace: "nowrap" as const,
      minWidth: "fit-content",
      // Typography
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.medium,
      // State
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 150ms ease",
      outline: "none",
      // Component styles
      ...variantStyles,
      ...cornerStyles,
      ...alignmentStyles,
      ...sizeStyles, // Size styles LAST to ensure padding is applied
    };

    // Convert styles object to inline style for simplicity
    const inlineStyles: React.CSSProperties = {};
    Object.entries(baseStyles).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        // @ts-expect-error - dynamic styles
        inlineStyles[key] = value;
      }
    });

    // Merge props.style with component styles, component styles take precedence
    const { style: propsStyle, ...otherProps } = props;
    const finalStyles = {
      ...propsStyle,
      ...inlineStyles,
    };

    // Handle hover, active, and focus states
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.hoverStyles) {
        Object.entries(variantStyles.hoverStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.hoverStyles) {
        // Reset to base styles
        Object.entries(variantStyles.hoverStyles).forEach(([key]) => {
          // @ts-expect-error - dynamic styles
          const originalValue = baseStyles[key];
          if (originalValue !== undefined) {
            // @ts-expect-error - dynamic styles
            e.currentTarget.style[key] = originalValue;
          }
        });
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.activeStyles) {
        Object.entries(variantStyles.activeStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.activeStyles) {
        // Reset to hover styles if still hovering, otherwise base styles
        const isHovering = e.currentTarget.matches(":hover");
        const stylesToApply =
          isHovering && variantStyles.hoverStyles
            ? variantStyles.hoverStyles
            : baseStyles;

        Object.entries(variantStyles.activeStyles).forEach(([key]) => {
          // @ts-expect-error - dynamic styles
          const resetValue = stylesToApply[key];
          if (resetValue !== undefined) {
            // @ts-expect-error - dynamic styles
            e.currentTarget.style[key] = resetValue;
          }
        });
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.focusStyles) {
        Object.entries(variantStyles.focusStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.focusStyles) {
        Object.entries(variantStyles.focusStyles).forEach(([key]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = "";
        });
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={finalStyles}
        data-mond-button
        data-align-content={alignContent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...otherProps}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

// Also export as default for better compatibility
export default Button;
