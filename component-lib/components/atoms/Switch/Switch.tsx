'use client';
import React, { useId, useState } from 'react';
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
    onChange,
    onClick,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const generatedId = useId();
    const switchId = props.id || `switch-${generatedId}`;

    // Track focus state in React instead of DOM manipulation
    const [isFocused, setIsFocused] = useState(false);

    const trackStyles: React.CSSProperties = {
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
      position: 'relative',
      flexShrink: 0,
      opacity: disabled ? 0.6 : 1,
      // Apply focus ring via React state
      boxShadow: isFocused ? `0 0 0 3px ${theme('feedback.info.background')}` : 'none',
    };

    const thumbStyles: React.CSSProperties = {
      width: sizeStyles.thumbSize,
      height: sizeStyles.thumbSize,
      borderRadius: radii.full,
      backgroundColor: checked
        ? theme('interactive.primary.text')
        : theme('surface.background'),
      boxShadow: theme('effects.shadow.base'),
      transition: 'all 200ms ease',
      position: 'absolute',
      top: '50%',
      transform: `translateY(-50%) translateX(${checked
        ? `calc(${sizeStyles.width} - ${sizeStyles.thumbSize} - ${sizeStyles.thumbOffset})`
        : sizeStyles.thumbOffset})`,
      pointerEvents: 'none', // Prevent thumb from intercepting clicks
    };

    const labelStyles: React.CSSProperties = {
      fontSize: sizeStyles.fontSize,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.sans,
      color: disabled ? theme('text.disabled') : theme('text.primary'),
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
    };

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[2],
    };

    const messageStyles: React.CSSProperties = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : theme('text.secondary'),
    };

    // Handle focus via React state
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    // Handle blur via React state
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    // Handle clicks on the visual track - forward to hidden checkbox
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      // Prevent any default behavior that might cause scrolling
      e.preventDefault();

      // Get the hidden checkbox and programmatically click it
      const checkbox = document.getElementById(switchId) as HTMLInputElement;
      if (checkbox) {
        checkbox.click(); // This triggers onChange naturally
      }
    };

    // Handle clicks on the label text - forward to hidden checkbox
    const handleLabelClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      e.preventDefault();

      const checkbox = document.getElementById(switchId) as HTMLInputElement;
      if (checkbox) {
        checkbox.click();
      }
    };

    return (
      <Box className={className} data-testid={dataTestId}>
        <Box style={containerStyles}>
          {/* Visual switch track - clickable */}
          <Box
            position="relative"
            style={{ flexShrink: 0 }}
            onClick={handleTrackClick}
            role="presentation" // This is just visual, real control is the checkbox
          >
            {/* Hidden checkbox for accessibility and form integration */}
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              onClick={onClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
                zIndex: 1, // Ensure it's on top for keyboard interaction
              }}
              aria-label={label || 'Switch'}
              {...props}
            />
            {/* Visual track */}
            <Box data-switch-track style={trackStyles}>
              {/* Visual thumb */}
              <Box style={thumbStyles} />
            </Box>
          </Box>

          {/* Label text - clickable, but handled explicitly */}
          {label && (
            <Box>
              <label
                htmlFor={switchId}
                style={labelStyles}
                onClick={handleLabelClick}
              >
                {label}
              </label>
              {(error || helperText) && (
                <Box as="span" style={messageStyles}>
                  {error || helperText}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
