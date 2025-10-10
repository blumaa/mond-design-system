'use client';
import React, { useId } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../providers/ThemeProvider';

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
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;

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
  }
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      'data-testid': dataTestId,
      size = 'md',
      isDarkMode,
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
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const generatedId = useId();
    const switchId = id || `switch-${generatedId}`;

    // Container styles
    const containerStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: spacing[2],
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
    };

    // Hidden checkbox styles - sized exactly to track dimensions
    const checkboxStyles: React.CSSProperties = {
      position: 'absolute',
      opacity: 0,
      width: sizeStyles.width,
      height: sizeStyles.height,
      margin: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      zIndex: 1,
    };

    // Visual track wrapper
    const trackWrapperStyles: React.CSSProperties = {
      position: 'relative',
      flexShrink: 0,
      width: sizeStyles.width,
      height: sizeStyles.height,
    };

    // Visual track styles
    const trackStyles: React.CSSProperties = {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: radii.full,
      backgroundColor: checked
        ? theme('interactive.primary.background')
        : theme('border.default'),
      border: `1px solid ${error ? theme('border.error') : 'transparent'}`,
      transition: 'all 200ms ease',
      position: 'relative',
      pointerEvents: 'none',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    };

    // Visual thumb styles
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
      transform: `translateY(-50%) translateX(${
        checked
          ? `calc(${sizeStyles.width} - ${sizeStyles.thumbSize} - ${sizeStyles.thumbOffset})`
          : sizeStyles.thumbOffset
      })`,
      pointerEvents: 'none',
    };

    // Label text styles
    const labelTextStyles: React.CSSProperties = {
      fontSize: sizeStyles.fontSize,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.sans,
      color: disabled ? theme('text.disabled') : theme('text.primary'),
    };

    // Message (helper text or error) styles
    const messageStyles: React.CSSProperties = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : theme('text.secondary'),
    };

    // Focus visible styles - applied via CSS
    const focusVisibleStyles = `
      #${switchId}:focus-visible + span {
        box-shadow: 0 0 0 3px ${theme('feedback.info.background')};
      }
    `;

    return (
      <div data-testid={dataTestId}>
        <style>{focusVisibleStyles}</style>

        <label htmlFor={switchId} style={containerStyles}>
          {/* Switch visual container */}
          <span style={trackWrapperStyles}>
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
              style={checkboxStyles}
              aria-label={label || 'Switch'}
            />

            {/* Visual track */}
            <div data-switch-track style={trackStyles}>
              {/* Visual thumb */}
              <div style={thumbStyles} />
            </div>
          </span>

          {/* Label text and messages */}
          {label && (
            <span>
              <span style={labelTextStyles}>{label}</span>
              {(error || helperText) && (
                <span style={messageStyles}>{error || helperText}</span>
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
