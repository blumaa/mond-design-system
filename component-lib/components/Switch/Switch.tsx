'use client';
import React, { useId } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /**
   * Unique identifier for the switch
   * @default auto-generated
   */
  id?: string;

  /**
   * Test identifier
   */
  'data-testid'?: string;

  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below label
   */
  helperText?: string;

  /**
   * Error message to display (takes precedence over helperText)
   */
  error?: string;

  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled component
   */
  defaultChecked?: boolean;

  /**
   * Makes the input read-only
   */
  readOnly?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Change event handler - receives the native change event
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Click event handler - receives the native click event
   */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      'data-testid': dataTestId,
      size = 'md',
      label,
      helperText,
      error,
      checked,
      defaultChecked,
      readOnly,
      disabled = false,
      onChange,
      onClick,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || `switch-${generatedId}`;

    // Build container class names
    const containerClassNames = [
      'mond-switch',
      `mond-switch--${size}`,
      error && 'mond-switch--error',
      disabled && 'mond-switch--disabled',
      checked && 'mond-switch--checked',
    ].filter(Boolean).join(' ');

    // Determine message to display
    const message = error || helperText;
    const messageClass = error
      ? 'mond-switch__message--error'
      : 'mond-switch__message--helper';

    return (
      <div className="mond-switch-container">
        <label htmlFor={switchId} className="mond-switch__label-wrapper">
          {/* Switch visual container */}
          <div className={containerClassNames}>
            <div className="mond-switch__track-wrapper">
              {/* Hidden checkbox - the actual form control */}
              <input
                ref={ref}
                type="checkbox"
                id={switchId}
                checked={checked}
                defaultChecked={defaultChecked}
                readOnly={readOnly}
                disabled={disabled}
                onChange={onChange}
                onClick={onClick}
                onFocus={onFocus}
                onBlur={onBlur}
                className="mond-switch__input"
                data-testid={dataTestId}
                aria-label={label || 'Switch'}
              />

              {/* Visual track */}
              <div className="mond-switch__track">
                {/* Visual thumb */}
                <div className="mond-switch__thumb" />
              </div>
            </div>
          </div>

          {/* Label text and messages */}
          {label && (
            <div className="mond-switch__label-content">
              <span className="mond-switch__label-text">{label}</span>
              {message && (
                <span className={`mond-switch__message ${messageClass}`}>
                  {message}
                </span>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

