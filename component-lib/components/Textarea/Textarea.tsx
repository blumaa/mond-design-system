'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';
import { Box } from '../Box/Box';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'default' | 'error' | 'success';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea visual size variant
   * @default 'md'
   */
  textareaSize?: TextareaSize;
  
  /**
   * Textarea variant
   * @default 'default'
   */
  variant?: TextareaVariant;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Label for the textarea
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success message to display
   */
  success?: string;
  
  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Number of visible text lines
   * @default 4
   */
  rows?: number;
}

const getSizeStyles = (size: TextareaSize) => {
  switch (size) {
    case 'sm':
      return {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: fontSizes.sm,
        minHeight: '80px',
      };
    case 'md':
      return {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.base,
        minHeight: '100px',
      };
    case 'lg':
      return {
        padding: `${spacing[4]} ${spacing[5]}`,
        fontSize: fontSizes.lg,
        minHeight: '120px',
      };
    default:
      return {};
  }
};

const getVariantStyles = (variant: TextareaVariant, theme: ReturnType<typeof useTheme>) => {
  const baseColors = {
    background: theme('surface.input'),
    border: theme('border.default'),
    text: theme('text.primary'),
    placeholder: theme('text.secondary'),
  };

  switch (variant) {
    case 'error':
      return {
        ...baseColors,
        border: theme('border.error'),
        focusBorder: theme('border.error'),
        focusRing: theme('feedback.error.background'),
      };
    case 'success':
      return {
        ...baseColors,
        border: theme('border.success'),
        focusBorder: theme('border.success'),
        focusRing: theme('feedback.success.background'),
      };
    case 'default':
    default:
      return {
        ...baseColors,
        focusBorder: theme('border.focused'),
        focusRing: theme('feedback.info.background'),
      };
  }
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    textareaSize = 'md', 
    variant = 'default',
    isDarkMode = false,
    label,
    error,
    success,
    helperText,
    className,
    rows = 4,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(textareaSize);
    const variantStyles = getVariantStyles(variant, theme);
    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const textareaStyles = {
      // Layout
      display: 'block',
      width: '100%',
      boxSizing: 'border-box' as const,
      resize: 'vertical' as const,
      
      // Typography
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.normal,
      
      // Appearance
      backgroundColor: variantStyles.background,
      border: `1px solid ${variantStyles.border}`,
      borderRadius: radii.md,
      color: variantStyles.text,
      
      // Sizing
      ...sizeStyles,
      
      // States
      outline: 'none',
      transition: 'all 150ms ease',
    };

    const labelStyles = {
      display: 'block',
      marginBottom: spacing[1],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: variantStyles.text,
    };

    const messageStyles = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : success ? theme('text.success') : theme('text.secondary'),
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.target.style.borderColor = variantStyles.focusBorder;
      e.target.style.boxShadow = `0 0 0 3px ${variantStyles.focusRing}`;
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.target.style.borderColor = variantStyles.border;
      e.target.style.boxShadow = 'none';
      props.onBlur?.(e);
    };

    return (
      <Box className={className}>
        {label && (
          <Box as="label" style={labelStyles} {...({ htmlFor: textareaId } as any)}>
            {label}
          </Box>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          style={textareaStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {(error || success || helperText) && (
          <span style={messageStyles}>
            {error || success || helperText}
          </span>
        )}
      </Box>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;