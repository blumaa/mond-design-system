'use client';
import React, { useId } from 'react';
import { Box } from '../Box/Box';

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
 * A text input component with labels, validation states, and helper text.
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Keeps 'use client' for interactivity but uses CSS variables for theming.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 *
 * @example
 * <Input label="Password" type="password" error="Password is required" variant="error" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  inputSize = 'md',
  variant = 'default',
  label,
  error,
  success,
  helperText,
  disabled,
  id: providedId,
  className,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  // Determine variant based on error/success
  const effectiveVariant = error ? 'error' : success ? 'success' : variant;

  // Build wrapper class names
  const wrapperClassNames = [
    'mond-input',
    `mond-input--${inputSize}`,
    `mond-input--${effectiveVariant}`,
    disabled && 'mond-input--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  // Get message to display
  const message = error || success || helperText;
  const messageClass = error
    ? 'mond-input__message--error'
    : success
    ? 'mond-input__message--success'
    : 'mond-input__message--helper';

  return (
    <Box className="mond-input-container">
      {label && (
        <label htmlFor={id} className="mond-input__label">
          {label}
        </label>
      )}
      <div className={wrapperClassNames}>
        <input
          ref={ref}
          id={id}
          className={`mond-input__field ${className || ''}`}
          disabled={disabled}
          {...props}
        />
      </div>
      {message && (
        <div className={`mond-input__message ${messageClass}`}>
          {message}
        </div>
      )}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;
