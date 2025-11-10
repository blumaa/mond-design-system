import React from 'react';
import './radio.css';
import { Box } from '../Box/Box';
import { Label } from '../Label';
import { Text } from '../Text';

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
    className,
    checked,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const radioId = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e);
    };

    const wrapperClasses = [
      'mond-radio-wrapper',
      `mond-radio-wrapper--${size}`,
      error ? 'mond-radio-wrapper--error' : '',
      props.disabled ? 'mond-radio-wrapper--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Box className={wrapperClasses} data-testid={dataTestId}>
        <label className="mond-radio-label" htmlFor={radioId}>
          <div className={`mond-radio-container mond-radio-container--${size}`}>
            <input
              ref={ref}
              type="radio"
              id={radioId}
              checked={checked}
              className="mond-radio-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            <div className={`mond-radio-circle mond-radio-circle--${size}`}>
              <div className={`mond-radio-dot mond-radio-dot--${size} ${checked ? 'mond-radio-dot--checked' : ''}`} />
            </div>
          </div>
          {label && (
            <div className="mond-radio-content">
              <Label size={size} disabled={props.disabled} required={props.required}>
                {label}
              </Label>
              {(error || helperText) && (
                <Text variant="caption" semantic={error ? "error" : "secondary"}>
                  {error || helperText}
                </Text>
              )}
            </div>
          )}
        </label>
      </Box>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;