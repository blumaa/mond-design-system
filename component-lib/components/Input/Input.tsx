import React, { useId } from 'react';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';
import './input.css';

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
}

/**
 * Input Component
 *
 * A flexible input component that uses CSS variables for theming.
 * Supports multiple sizes, variants, and states.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter text" />
 *
 * @example
 * // Input with label and error
 * <Input label="Email" error="Invalid email address" />
 *
 * @example
 * // Input with different sizes
 * <Input inputSize="lg" placeholder="Large input" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    inputSize = 'md',
    variant = 'default',
    label,
    error,
    success,
    helperText,
    className,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = props.id || `input-${generatedId}`;

    // Determine actual variant based on error/success props
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Build CSS class names
    const inputClassNames = [
      'mond-input',
      `mond-input--${inputSize}`,
      effectiveVariant !== 'default' && `mond-input--${effectiveVariant}`,
    ]
      .filter(Boolean)
      .join(' ');

    // Determine message type and content
    const message = error || success || helperText;
    const messageType = error ? 'error' : success ? 'success' : 'default';

    return (
      <Box className={className}>
        {label && (
          <Label
            htmlFor={inputId}
            semantic={messageType === 'default' ? 'default' : messageType as 'error' | 'success'}
          >
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClassNames}
          {...props}
        />
        {message && (
          <Box className={`mond-input__message mond-input__message--${messageType}`}>
            {message}
          </Box>
        )}
      </Box>
    );
  }
);

Input.displayName = 'Input';

export default Input;
