'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../../tokens';
import { useTheme } from '../../../utils/theme';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Badge variant
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Badge content
   */
  children: React.ReactNode;
}

const getSizeStyles = (size: BadgeSize) => {
  switch (size) {
    case 'sm':
      return {
        fontSize: fontSizes.xs,
        paddingX: spacing[2],
        paddingY: spacing[1],
        height: '20px',
      };
    case 'md':
      return {
        fontSize: fontSizes.sm,
        paddingX: spacing[3],
        paddingY: spacing[1],
        height: '24px',
      };
    case 'lg':
      return {
        fontSize: fontSizes.base,
        paddingX: spacing[4],
        paddingY: spacing[2],
        height: '32px',
      };
    default:
      return {};
  }
};

const getVariantStyles = (variant: BadgeVariant, theme: (path: string) => string) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme('interactive.primary.background'),
        color: theme('interactive.primary.text'),
        border: 'none',
      };
    case 'secondary':
      return {
        backgroundColor: theme('interactive.secondary.background'),
        color: theme('interactive.secondary.text'),
        border: `1px solid ${theme('interactive.secondary.border')}`,
      };
    case 'success':
      return {
        backgroundColor: theme('feedback.success.background'),
        color: theme('feedback.success.text'),
        border: `1px solid ${theme('feedback.success.border')}`,
      };
    case 'warning':
      return {
        backgroundColor: theme('feedback.warning.background'),
        color: theme('feedback.warning.text'),
        border: `1px solid ${theme('feedback.warning.border')}`,
      };
    case 'error':
      return {
        backgroundColor: theme('feedback.error.background'),
        color: theme('feedback.error.text'),
        border: `1px solid ${theme('feedback.error.border')}`,
      };
    case 'default':
    default:
      return {
        backgroundColor: theme('surface.elevated'),
        color: theme('text.secondary'),
        border: `1px solid ${theme('border.default')}`,
      };
  }
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default',
    size = 'md',
    isDarkMode = false,
    className,
    children,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(variant, theme);

    const badgeStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.full,
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.medium,
      textAlign: 'center' as const,
      whiteSpace: 'nowrap' as const,
      userSelect: 'none' as const,
      transition: 'all 150ms ease',
      fontSize: sizeStyles.fontSize,
      paddingLeft: sizeStyles.paddingX,
      paddingRight: sizeStyles.paddingX,
      paddingTop: sizeStyles.paddingY,
      paddingBottom: sizeStyles.paddingY,
      height: sizeStyles.height,
      ...variantStyles,
    };

    return (
      <span
        ref={ref}
        className={className}
        data-testid={dataTestId}
        style={badgeStyles}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;