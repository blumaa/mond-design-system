'use client';
import React from 'react';
import { colors, radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonCorners = 'default' | 'rounded';
export type ButtonAlignContent = 'left' | 'center' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
}

const getVariantStyles = (variant: ButtonVariant, isDarkMode: boolean = false) => {
  const themeColors = {
    bg: isDarkMode ? colors.background.dark : colors.background.light,
    text: isDarkMode ? colors.primary[100] : colors.primary[700],
  };

  return {
    primary: {
      // Portfolio-2023 style: bg-primary-700, text-[#DDE6ED], border-[#DDE6ED]
      backgroundColor: colors.primary[700],
      color: colors.foreground.dark, // #DDE6ED
      border: `1px solid ${colors.foreground.dark}`,
      hoverStyles: {
        backgroundColor: colors.primary[800],
      },
      activeStyles: {
        backgroundColor: colors.primary[900],
      },
      focusStyles: {
        outline: `2px solid ${colors.primary[300]}`,
        outlineOffset: '2px',
      },
    },
    outline: {
      // Portfolio-2023 style: border-primary-500, transparent background, hover effects
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
      hoverStyles: {
        backgroundColor: colors.primary[700],
        color: colors.foreground.dark,
        borderColor: colors.foreground.dark,
      },
      activeStyles: {
        backgroundColor: colors.primary[800],
        color: colors.foreground.dark,
        borderColor: colors.foreground.dark,
      },
      focusStyles: {
        outline: `2px solid ${colors.primary[300]}`,
        outlineOffset: '2px',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: themeColors.text,
      border: 'none',
      hoverStyles: {
        backgroundColor: isDarkMode ? colors.neutral[800] : colors.neutral[200],
      },
      activeStyles: {
        backgroundColor: isDarkMode ? colors.neutral[700] : colors.neutral[200],
      },
      focusStyles: {
        outline: `2px solid ${isDarkMode ? colors.neutral[600] : colors.neutral[400]}`,
        outlineOffset: '2px',
      },
    },
  }[variant] || {};
};

const getSizeStyles = (size: ButtonSize, iconOnly: boolean = false) => {
  if (iconOnly) {
    switch (size) {
      case 'sm':
        return {
          padding: spacing[1],
          fontSize: fontSizes.sm,
          width: '32px',
          height: '32px',
        };
      case 'md':
        return {
          padding: spacing[2],
          fontSize: fontSizes.base,
          width: '40px',
          height: '40px',
        };
      case 'lg':
        return {
          padding: spacing[3],
          fontSize: fontSizes.lg,
          width: '48px',
          height: '48px',
        };
      default:
        return {};
    }
  }

  switch (size) {
    case 'sm':
      return {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: fontSizes.sm,
      };
    case 'md':
      return {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: fontSizes.base,
      };
    case 'lg':
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
    case 'rounded':
      return {
        borderRadius: radii.full,
      };
    case 'default':
    default:
      return {
        borderRadius: radii.md,
      };
  }
};

const getAlignmentStyles = (alignContent: ButtonAlignContent) => {
  switch (alignContent) {
    case 'left':
      return {
        justifyContent: 'flex-start',
      };
    case 'right':
      return {
        justifyContent: 'flex-end',
      };
    case 'center':
    default:
      return {
        justifyContent: 'center',
      };
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    corners = 'default',
    alignContent = 'center',
    children, 
    iconOnly = false,
    disabled = false, 
    isDarkMode = false, 
    ...props 
  }, ref) => {
    const variantStyles = getVariantStyles(variant, isDarkMode);
    const sizeStyles = getSizeStyles(size, iconOnly);
    const cornerStyles = getCornerStyles(corners);
    const alignmentStyles = getAlignmentStyles(alignContent);

    const baseStyles = {
      // Layout
      display: 'inline-flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap' as const,
      minWidth: 'fit-content',
      // Typography  
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.medium,
      // State
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 150ms ease',
      outline: 'none',
      // Component styles
      ...variantStyles,
      ...cornerStyles,
      ...alignmentStyles,
      ...sizeStyles,  // Size styles LAST to ensure padding is applied
    };

    // Convert styles object to inline style for simplicity
    const inlineStyles: React.CSSProperties = {};
    Object.entries(baseStyles).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        // @ts-ignore - dynamic styles
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
          // @ts-ignore - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.hoverStyles) {
        // Reset to base styles
        Object.entries(variantStyles.hoverStyles).forEach(([key]) => {
          // @ts-ignore - dynamic styles
          const originalValue = baseStyles[key];
          if (originalValue !== undefined) {
            // @ts-ignore - dynamic styles
            e.currentTarget.style[key] = originalValue;
          }
        });
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.activeStyles) {
        Object.entries(variantStyles.activeStyles).forEach(([key, value]) => {
          // @ts-ignore - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.activeStyles) {
        // Reset to hover styles if still hovering, otherwise base styles
        const isHovering = e.currentTarget.matches(':hover');
        const stylesToApply = isHovering && variantStyles.hoverStyles ? variantStyles.hoverStyles : baseStyles;
        
        Object.entries(variantStyles.activeStyles).forEach(([key]) => {
          // @ts-ignore - dynamic styles
          const resetValue = stylesToApply[key];
          if (resetValue !== undefined) {
            // @ts-ignore - dynamic styles
            e.currentTarget.style[key] = resetValue;
          }
        });
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.focusStyles) {
        Object.entries(variantStyles.focusStyles).forEach(([key, value]) => {
          // @ts-ignore - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && variantStyles.focusStyles) {
        Object.entries(variantStyles.focusStyles).forEach(([key]) => {
          // @ts-ignore - dynamic styles
          e.currentTarget.style[key] = '';
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
  }
);

Button.displayName = 'Button';

// Also export as default for better compatibility
export default Button;
