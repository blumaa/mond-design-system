'use client';
import React from 'react';
import { Stack } from '../../layout/Stack/Stack';
import { Box } from '../../layout/Box/Box';
import { useTheme } from '../../providers/ThemeProvider';

export interface FormFieldProps {
  'data-testid'?: string;
  
  /**
   * Field label text
   */
  label?: string;
  
  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Help text to display below the field
   */
  helpText?: string;
  
  /**
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Form control element (input, select, textarea, etc.)
   */
  children: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    label,
    required = false,
    error,
    helpText,
    isDarkMode,
    children,
    className,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const fieldId = React.useId();
    const errorId = error ? `${fieldId}-error` : undefined;
    const helpId = helpText ? `${fieldId}-help` : undefined;
    
    // Clone children to add aria attributes
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          id: fieldId,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': [errorId, helpId].filter(Boolean).join(' ') || undefined,
        } as React.HTMLAttributes<HTMLElement>);
      }
      return child;
    });

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        {...props}
      >
        <Stack spacing={6}>
          {/* Label */}
          {label && (
            <Box
              as="label"
              fontSize={14}
              fontWeight="medium"
              color={theme('text.primary')}
              display="flex"
              alignItems="center"
              gap={4}
              style={{ cursor: 'pointer' }}
              {...(fieldId && { htmlFor: fieldId })}
            >
              {label}
              {required && (
                <Box
                  as="span"
                  color={theme('feedback.error.text')}
                  fontSize={14}
                  lineHeight="1"
                  aria-label="required"
                >
                  *
                </Box>
              )}
            </Box>
          )}
          
          {/* Form Control */}
          <Box>
            {childrenWithProps}
          </Box>
          
          {/* Error Message */}
          {error && (
            <Box
              id={errorId}
              fontSize={12}
              color={theme('feedback.error.text')}
              role="alert"
              aria-live="polite"
            >
              {error}
            </Box>
          )}
          
          {/* Help Text */}
          {helpText && !error && (
            <Box
              id={helpId}
              fontSize={12}
              color={theme('text.secondary')}
              lineHeight="1.4"
            >
              {helpText}
            </Box>
          )}
        </Stack>
      </Box>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;