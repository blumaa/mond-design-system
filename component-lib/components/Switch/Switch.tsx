import React, { useId } from 'react';
import { Label } from '../Label';
import { Text } from '../Text';
import './switch.css';

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

    // Build CSS class names
    const switchClasses = [
      'mond-switch',
      `mond-switch--${size}`,
      disabled && 'mond-switch--disabled',
      error && 'mond-switch--error',
    ].filter(Boolean).join(' ');

    return (
      <div className={switchClasses} data-testid={dataTestId}>
        <label htmlFor={switchId} className="mond-switch__label">
          {/* Switch visual container */}
          <span className="mond-switch__track-wrapper">
            {/* Hidden checkbox - the actual form control */}
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              className="mond-switch__input"
              checked={checked}
              defaultChecked={defaultChecked}
              readOnly={readOnly}
              disabled={disabled}
              onChange={onChange}
              onClick={onClick}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-label={label || 'Switch'}
            />

            {/* Visual track */}
            <div className="mond-switch__track" data-switch-track>
              {/* Visual thumb */}
              <div className="mond-switch__thumb" />
            </div>
          </span>

          {/* Label text and messages */}
          {label && (
            <span className="mond-switch__content">
              <Label size={size} disabled={disabled}>
                {label}
              </Label>
              {(error || helperText) && (
                <Text size="xs" semantic={error ? "error" : "secondary"}>
                  {error || helperText}
                </Text>
              )}
            </span>
          )}
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
