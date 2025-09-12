'use client';
import React, { useId } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

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

  /**
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;
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

const getVariantStyles = (variant: InputVariant, theme: ReturnType<typeof useTheme>) => {
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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    inputSize = 'md', 
    variant = 'default',
    label,
    error,
    success,
    helperText,
    isDarkMode,
    className,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(inputSize);
    const variantStyles = getVariantStyles(variant, theme);
    const generatedId = useId();
    const inputId = props.id || `input-${generatedId}`;

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
      <Box className={className}>
        {label && (
          <Box
            as="label"
            display="block"
            mb={1}
            fontSize={14}
            fontWeight="medium"
            color={variantStyles.text}
            style={{ cursor: 'pointer' }}
            {...(inputId && { htmlFor: inputId })}
          >
            {label}
          </Box>
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
          <Box
            display="block"
            mt={1}
            fontSize={12}
            color={error ? theme('text.error') : success ? theme('text.success') : theme('text.secondary')}
          >
            {error || success || helperText}
          </Box>
        )}
      </Box>
    );
  }
);

Input.displayName = 'Input';

export default Input;