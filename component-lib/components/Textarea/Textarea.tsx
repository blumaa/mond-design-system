import React, { useId } from 'react';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';
import './textarea.css';

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

/**
 * Textarea Component
 *
 * A flexible textarea component that uses CSS variables for theming.
 * Supports multiple sizes, variants, and states.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic textarea
 * <Textarea placeholder="Enter text" />
 *
 * @example
 * // Textarea with label and error
 * <Textarea label="Description" error="Description is required" />
 *
 * @example
 * // Textarea with different sizes
 * <Textarea textareaSize="lg" rows={6} />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    textareaSize = 'md',
    variant = 'default',
    label,
    error,
    success,
    helperText,
    className,
    rows = 4,
    ...props
  }, ref) => {
    const generatedId = useId();
    const textareaId = props.id || `textarea-${generatedId}`;

    // Determine actual variant based on error/success props
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Build CSS class names
    const textareaClassNames = [
      'mond-textarea',
      `mond-textarea--${textareaSize}`,
      effectiveVariant !== 'default' && `mond-textarea--${effectiveVariant}`,
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
            htmlFor={textareaId}
            semantic={messageType === 'default' ? 'default' : messageType as 'error' | 'success'}
          >
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClassNames}
          {...props}
        />
        {message && (
          <span className={`mond-textarea__message mond-textarea__message--${messageType}`}>
            {message}
          </span>
        )}
      </Box>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
