'use client';
import React, { useId } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Dark mode control for theme resolution
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
    isDarkMode,
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
    const generatedId = useId();
    const switchId = props.id || `switch-${generatedId}`;

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
      boxShadow: theme('effects.shadow.base'),
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

    const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!disabled) {
        const input = e.currentTarget.querySelector('input');
        input?.click();
      }
    };

    return (
      <Box className={className} data-testid={dataTestId}>
        <label htmlFor={switchId} style={containerStyles} onClick={handleLabelClick}>
          <Box position="relative" style={{ flexShrink: 0 }}>
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
            <Box data-switch-track style={trackStyles}>
              <Box style={thumbStyles} />
            </Box>
          </Box>
          {label && (
            <Box>
              <Box as="span" style={labelStyles}>{label}</Box>
              {(error || helperText) && (
                <Box as="span" style={messageStyles}>
                  {error || helperText}
                </Box>
              )}
            </Box>
          )}
        </label>
      </Box>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;