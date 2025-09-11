'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

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

const getSizeStyles = (size: RadioSize) => {
  switch (size) {
    case 'sm':
      return {
        width: '16px',
        height: '16px',
        fontSize: fontSizes.sm,
        dotSize: '6px',
      };
    case 'md':
      return {
        width: '20px',
        height: '20px',
        fontSize: fontSizes.base,
        dotSize: '8px',
      };
    case 'lg':
      return {
        width: '24px',
        height: '24px',
        fontSize: fontSizes.lg,
        dotSize: '10px',
      };
    default:
      return {};
  }
};

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
    const theme = useTheme();
    const sizeStyles = getSizeStyles(size);
    const radioId = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const radioStyles = {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: radii.full,
      border: `1px solid ${error ? theme('border.error') : theme('border.default')}`,
      backgroundColor: theme('surface.input'),
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      transition: 'background-color 150ms ease, border-color 150ms ease',
      contain: 'layout style',
      position: 'relative' as const,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      alignItems: 'center',
      gap: spacing[2],
    };

    const messageStyles = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : theme('text.secondary'),
    };

    const dotStyles = {
      width: sizeStyles.dotSize,
      height: sizeStyles.dotSize,
      borderRadius: radii.full,
      backgroundColor: theme('interactive.primary.background'),
      opacity: checked ? 1 : 0,
      transition: 'opacity 150ms ease',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e);
    };

    return (
      <Box className={className} data-testid={dataTestId} style={{ contain: 'layout' }}>
        <Box as="label" style={containerStyles}>
          <Box 
            position="relative" 
            style={{ 
              flexShrink: 0,
              width: sizeStyles.width,
              height: sizeStyles.height,
              minWidth: sizeStyles.width,
              minHeight: sizeStyles.height
            }}
          >
            <input
              ref={ref}
              type="radio"
              id={radioId}
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
            <Box data-radio style={radioStyles}>
              <Box style={dotStyles} />
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
        </Box>
      </Box>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;