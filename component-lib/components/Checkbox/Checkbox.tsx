'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
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

const getSizeStyles = (size: CheckboxSize) => {
  switch (size) {
    case 'sm':
      return {
        width: '16px',
        height: '16px',
        fontSize: fontSizes.sm,
      };
    case 'md':
      return {
        width: '20px',
        height: '20px',
        fontSize: fontSizes.base,
      };
    case 'lg':
      return {
        width: '24px',
        height: '24px',
        fontSize: fontSizes.lg,
      };
    default:
      return {};
  }
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    size = 'md',
    isDarkMode = false,
    label,
    error,
    helperText,
    indeterminate = false,
    className,
    checked,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Handle indeterminate state
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const checkboxStyles = {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: radii.sm,
      border: `1px solid ${error ? theme('border.error') : theme('border.default')}`,
      backgroundColor: checked || indeterminate ? theme('interactive.primary.background') : theme('surface.input'),
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      transition: 'all 150ms ease',
      position: 'relative' as const,
      flexShrink: 0,
    };

    const labelStyles = {
      fontSize: sizeStyles.fontSize,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.sans,
      color: props.disabled ? theme('text.disabled') : theme('text.primary'),
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none' as const,
    };

    const containerStyles = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[2],
    };

    const messageStyles = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : theme('text.secondary'),
    };

    const checkmarkStyles = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: theme('interactive.primary.text'),
      fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
      lineHeight: 1,
      opacity: checked || indeterminate ? 1 : 0,
      transition: 'opacity 150ms ease',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.parentElement) {
        const checkbox = e.target.parentElement.querySelector('[data-checkbox]') as HTMLElement;
        if (checkbox) {
          checkbox.style.boxShadow = `0 0 0 3px ${theme('feedback.info.background')}`;
        }
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.parentElement) {
        const checkbox = e.target.parentElement.querySelector('[data-checkbox]') as HTMLElement;
        if (checkbox) {
          checkbox.style.boxShadow = 'none';
        }
      }
      props.onBlur?.(e);
    };

    return (
      <div className={className} data-testid={dataTestId}>
        <label style={containerStyles}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                cursor: props.disabled ? 'not-allowed' : 'pointer',
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            <div data-checkbox style={checkboxStyles}>
              <span style={checkmarkStyles}>
                {indeterminate ? '−' : checked ? '✓' : ''}
              </span>
            </div>
          </div>
          {label && (
            <div>
              <span style={labelStyles}>{label}</span>
              {(error || helperText) && (
                <span style={messageStyles}>
                  {error || helperText}
                </span>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;