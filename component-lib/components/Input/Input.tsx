'use client';
import React from 'react';
import { colors, radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input visual size variant
   * @default 'md'
   */
  inputSize?: InputSize;
  
  /**
   * Input variant
   * @default 'default'
   */
  variant?: InputVariant;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Label for the input
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
}

const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'sm':
      return {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: fontSizes.sm,
        height: '32px',
      };
    case 'md':
      return {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: fontSizes.base,
        height: '40px',
      };
    case 'lg':
      return {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.lg,
        height: '48px',
      };
    default:
      return {};
  }
};

const getVariantStyles = (variant: InputVariant, isDarkMode: boolean = false) => {
  const baseColors = {
    background: isDarkMode ? colors.neutral[800] : colors.neutral[50],
    border: isDarkMode ? colors.neutral[600] : colors.neutral[300],
    text: isDarkMode ? colors.neutral[100] : colors.neutral[900],
    placeholder: isDarkMode ? colors.neutral[400] : colors.neutral[500],
  };

  switch (variant) {
    case 'error':
      return {
        ...baseColors,
        border: colors.error[500],
        focusBorder: colors.error[500],
        focusRing: `${colors.error[500]}20`,
      };
    case 'success':
      return {
        ...baseColors,
        border: colors.success[500],
        focusBorder: colors.success[500],
        focusRing: `${colors.success[500]}20`,
      };
    case 'default':
    default:
      return {
        ...baseColors,
        focusBorder: isDarkMode ? colors.primary[400] : colors.primary[500],
        focusRing: isDarkMode ? `${colors.primary[400]}20` : `${colors.primary[500]}20`,
      };
  }
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    inputSize = 'md', 
    variant = 'default',
    isDarkMode = false,
    label,
    error,
    success,
    helperText,
    className,
    ...props 
  }, ref) => {
    const sizeStyles = getSizeStyles(inputSize);
    const variantStyles = getVariantStyles(variant, isDarkMode);
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputStyles = {
      // Layout
      display: 'block',
      width: '100%',
      boxSizing: 'border-box' as const,
      
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
      
      // Placeholder
      '::placeholder': {
        color: variantStyles.placeholder,
      },
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
      color: error ? colors.error[500] : success ? colors.success[500] : variantStyles.placeholder,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = variantStyles.focusBorder;
      e.target.style.boxShadow = `0 0 0 3px ${variantStyles.focusRing}`;
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = variantStyles.border;
      e.target.style.boxShadow = 'none';
      props.onBlur?.(e);
    };

    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {(error || success || helperText) && (
          <span style={messageStyles}>
            {error || success || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;