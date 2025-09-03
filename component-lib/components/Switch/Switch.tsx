'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;
  
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
   * Helper text
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;
}

const getSizeStyles = (size: SwitchSize) => {
  switch (size) {
    case 'sm':
      return {
        width: '32px',
        height: '18px',
        thumbSize: '14px',
        thumbOffset: '2px',
        fontSize: fontSizes.sm,
      };
    case 'md':
      return {
        width: '44px',
        height: '24px',
        thumbSize: '20px',
        thumbOffset: '2px',
        fontSize: fontSizes.base,
      };
    case 'lg':
      return {
        width: '56px',
        height: '32px',
        thumbSize: '28px',
        thumbOffset: '2px',
        fontSize: fontSizes.lg,
      };
    default:
      return {};
  }
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ 
    size = 'md',
    isDarkMode = false,
    label,
    helperText,
    error,
    className,
    checked,
    disabled,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const switchId = props.id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const trackStyles = {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: radii.full,
      backgroundColor: checked 
        ? theme('interactive.primary.background') 
        : theme('border.default'),
      border: `1px solid ${error ? theme('border.error') : 'transparent'}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      transition: 'all 200ms ease',
      position: 'relative' as const,
      flexShrink: 0,
      opacity: disabled ? 0.6 : 1,
    };

    const thumbStyles = {
      width: sizeStyles.thumbSize,
      height: sizeStyles.thumbSize,
      borderRadius: radii.full,
      backgroundColor: checked 
        ? theme('interactive.primary.text')
        : theme('surface.background'),
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 200ms ease',
      position: 'absolute' as const,
      top: '50%',
      transform: `translateY(-50%) translateX(${checked 
        ? `calc(${sizeStyles.width} - ${sizeStyles.thumbSize} - ${sizeStyles.thumbOffset})` 
        : sizeStyles.thumbOffset})`,
    };

    const labelStyles = {
      fontSize: sizeStyles.fontSize,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.sans,
      color: disabled ? theme('text.disabled') : theme('text.primary'),
      cursor: disabled ? 'not-allowed' : 'pointer',
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

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.parentElement) {
        const track = e.target.parentElement.querySelector('[data-switch-track]') as HTMLElement;
        if (track) {
          track.style.boxShadow = `0 0 0 3px ${theme('feedback.info.background')}`;
        }
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.parentElement) {
        const track = e.target.parentElement.querySelector('[data-switch-track]') as HTMLElement;
        if (track) {
          track.style.boxShadow = 'none';
        }
      }
      props.onBlur?.(e);
    };

    return (
      <div className={className} data-testid={dataTestId}>
        <label style={containerStyles}>
          <div style={{ position: 'relative' }}>
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              checked={checked}
              disabled={disabled}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            <div data-switch-track style={trackStyles}>
              <div style={thumbStyles} />
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

Switch.displayName = 'Switch';

export default Switch;