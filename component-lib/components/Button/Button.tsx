import React from 'react';
import { colors, radii, spacing, fontSizes, fontWeights } from '../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

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
   * Button content
   */
  children: React.ReactNode;
  
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
    primary: isDarkMode ? colors.primary[400] : colors.primary[50],
    text: isDarkMode ? colors.primary[700] : colors.primary[300],
    hover: isDarkMode ? colors.primary[500] : colors.primary[100],
    active: isDarkMode ? colors.primary[600] : colors.primary[200],
  };

  switch (variant) {
    case 'primary':
      return {
        backgroundColor: themeColors.primary,
        color: themeColors.text,
        border: 'none',
        '&:hover': {
          backgroundColor: themeColors.hover,
        },
        '&:active': {
          backgroundColor: themeColors.active,
        },
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        color: themeColors.text,
        border: `1px solid ${themeColors.text}`,
        '&:hover': {
          backgroundColor: `${themeColors.text}1A`, // 10% opacity
        },
        '&:active': {
          backgroundColor: `${themeColors.text}33`, // 20% opacity
        },
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: themeColors.text,
        border: `1px solid ${themeColors.text}`,
        '&:hover': {
          backgroundColor: `${themeColors.text}1A`, // 10% opacity
        },
        '&:active': {
          backgroundColor: `${themeColors.text}33`, // 20% opacity
        },
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: themeColors.text,
        border: 'none',
        '&:hover': {
          backgroundColor: `${themeColors.text}1A`, // 10% opacity
        },
        '&:active': {
          backgroundColor: `${themeColors.text}33`, // 20% opacity
        },
      };
    default:
      return {};
  }
};

const getSizeStyles = (size: ButtonSize) => {
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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, disabled = false, isDarkMode = false, ...props }, ref) => {
    const variantStyles = getVariantStyles(variant, isDarkMode);
    const sizeStyles = getSizeStyles(size);

    const buttonStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.md,
      fontWeight: fontWeights.medium,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 150ms ease',
      ...variantStyles,
      ...sizeStyles,
    };

    // Convert styles object to inline style for simplicity
    const inlineStyles: React.CSSProperties = {};
    Object.entries(buttonStyles).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        // @ts-ignore - dynamic styles
        inlineStyles[key] = value;
      }
    });

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={inlineStyles}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
