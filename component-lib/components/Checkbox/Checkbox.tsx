'use client';
import React, { useId, useRef, useEffect, useImperativeHandle } from 'react';
import { Box } from '../Box/Box';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Indeterminate state (partially checked)
   * @default false
   */
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    size = 'md',
    label,
    error,
    helperText,
    indeterminate = false,
    disabled,
    checked,
    id: providedId,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Handle indeterminate state
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Build container class names
    const containerClassNames = [
      'mond-checkbox',
      `mond-checkbox--${size}`,
      error && 'mond-checkbox--error',
      disabled && 'mond-checkbox--disabled',
      indeterminate && 'mond-checkbox--indeterminate',
      className,
    ].filter(Boolean).join(' ');

    // Determine message to display
    const message = error || helperText;
    const messageClass = error
      ? 'mond-checkbox__message--error'
      : 'mond-checkbox__message--helper';

    return (
      <Box className={containerClassNames}>
        <label htmlFor={id} className="mond-checkbox__label-wrapper">
          <div className="mond-checkbox__input-wrapper">
            <input
              ref={inputRef}
              type="checkbox"
              id={id}
              checked={checked}
              disabled={disabled}
              className="mond-checkbox__input"
              data-testid={dataTestId}
              {...props}
            />
            <div className="mond-checkbox__box">
              <span className="mond-checkbox__checkmark">✓</span>
              <span className="mond-checkbox__indeterminate-icon">−</span>
            </div>
          </div>
          {label && (
            <div className="mond-checkbox__label-content">
              <span className="mond-checkbox__label-text">{label}</span>
              {message && (
                <span className={`mond-checkbox__message ${messageClass}`}>
                  {message}
                </span>
              )}
            </div>
          )}
        </label>
      </Box>
    );
  }
);

Checkbox.displayName = 'Checkbox';

