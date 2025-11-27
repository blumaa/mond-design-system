import React from 'react';
import { Box } from '../Box';
import { Label } from '../Label';
import { Text } from '../Text';
import './checkbox.css';

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

/**
 * Checkbox Component
 *
 * A versatile, SSR-compatible checkbox component that uses CSS variables for theming.
 * Supports multiple sizes, error states, and indeterminate state.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic checkbox
 * <Checkbox label="Accept terms" />
 *
 * @example
 * // Checkbox with error
 * <Checkbox label="Required field" error="This field is required" />
 *
 * @example
 * // Indeterminate checkbox
 * <Checkbox label="Select all" indeterminate />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    size = 'md',
    label,
    error,
    helperText,
    indeterminate = false,
    className,
    checked,
    disabled,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Handle indeterminate state
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Build CSS class names
    const classNames = [
      'mond-checkbox',
      `mond-checkbox--${size}`,
      disabled && 'mond-checkbox--disabled',
      error && 'mond-checkbox--error',
      indeterminate && 'mond-checkbox--indeterminate',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classNames} data-testid={dataTestId}>
        <label className="mond-checkbox__label">
          <div className="mond-checkbox__input-container">
            <input
              ref={inputRef}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              disabled={disabled}
              className="mond-checkbox__input"
              {...props}
            />
            <div className="mond-checkbox__box" data-checkbox>
              {/* Check icon (visible when checked and not indeterminate) */}
              <span className="mond-checkbox__icon mond-checkbox__icon--check">
                ✓
              </span>
              {/* Indeterminate icon (visible when indeterminate) */}
              <span className="mond-checkbox__icon mond-checkbox__icon--indeterminate">
                −
              </span>
            </div>
          </div>
          {label && (
            <Box>
              <Label size={size} disabled={disabled} required={props.required}>
                {label}
              </Label>
              {(error || helperText) && (
                <Text size="xs" semantic={error ? "error" : "secondary"}>
                  {error || helperText}
                </Text>
              )}
            </Box>
          )}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
