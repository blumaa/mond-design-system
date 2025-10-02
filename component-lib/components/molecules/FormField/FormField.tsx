'use client';
import React from 'react';
import { Stack } from '../../layout/Stack/Stack';
import { Box } from '../../layout/Box/Box';
import { Label } from '../../atoms/Label/Label';
import { Text } from '../../atoms/Text/Text';

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
    children,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
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
          {/* Label - using Label atom */}
          {label && (
            <Label
              htmlFor={fieldId}
              required={required}
              size="md"
              semantic={error ? 'error' : 'default'}
            >
              {label}
            </Label>
          )}

          {/* Form Control */}
          <Box>
            {childrenWithProps}
          </Box>

          {/* Error Message - using Text atom */}
          {error && (
            <Text
              id={errorId}
              variant="caption"
              semantic="error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </Text>
          )}

          {/* Help Text - using Text atom */}
          {helpText && !error && (
            <Text
              id={helpId}
              variant="caption"
              semantic="secondary"
            >
              {helpText}
            </Text>
          )}
        </Stack>
      </Box>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;