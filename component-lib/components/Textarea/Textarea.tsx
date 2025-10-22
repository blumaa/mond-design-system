'use client';
import React, { useId } from 'react';
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    textareaSize = 'md',
    variant = 'default',
    label,
    error,
    success,
    helperText,
    disabled,
    id: providedId,
    className,
    rows = 4,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Determine effective variant based on error/success props
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Build wrapper class names
    const wrapperClassNames = [
      'mond-textarea',
      `mond-textarea--${textareaSize}`,
      `mond-textarea--${effectiveVariant}`,
      disabled && 'mond-textarea--disabled',
    ].filter(Boolean).join(' ');

    // Determine message to display
    const message = error || success || helperText;
    const messageClass = error
      ? 'mond-textarea__message--error'
      : success
        ? 'mond-textarea__message--success'
        : 'mond-textarea__message--helper';

    return (
      <Box className="mond-textarea-container">
        {label && (
          <label htmlFor={id} className="mond-textarea__label">
            {label}
          </label>
        )}
        <div className={wrapperClassNames}>
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            className={`mond-textarea__field ${className || ''}`}
            disabled={disabled}
            {...props}
          />
        </div>
        {message && (
          <div className={`mond-textarea__message ${messageClass}`}>
            {message}
          </div>
        )}
      </Box>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
