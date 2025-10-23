'use client';
import React, { useId } from 'react';
import { Box } from '../Box/Box';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Radio size
   * @default 'md'
   */
  size?: RadioSize;

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
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({
    size = 'md',
    label,
    error,
    helperText,
    disabled,
    checked,
    id: providedId,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Build container class names
    const containerClassNames = [
      'mond-radio',
      `mond-radio--${size}`,
      error && 'mond-radio--error',
      disabled && 'mond-radio--disabled',
      className,
    ].filter(Boolean).join(' ');

    // Determine message to display
    const message = error || helperText;
    const messageClass = error
      ? 'mond-radio__message--error'
      : 'mond-radio__message--helper';

    return (
      <Box className={containerClassNames}>
        <label htmlFor={id} className="mond-radio__label-wrapper">
          <div className="mond-radio__input-wrapper">
            <input
              ref={ref}
              type="radio"
              id={id}
              checked={checked}
              disabled={disabled}
              className="mond-radio__input"
              data-testid={dataTestId}
              {...props}
            />
            <div className="mond-radio__circle">
              <div className="mond-radio__dot" />
            </div>
          </div>
          {label && (
            <div className="mond-radio__label-content">
              <span className="mond-radio__label-text">{label}</span>
              {message && (
                <span className={`mond-radio__message ${messageClass}`}>
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

Radio.displayName = 'Radio';

