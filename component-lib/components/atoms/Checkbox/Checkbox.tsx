'use client';
import React from 'react';
import { radii, fontSizes, fontFamilies } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

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
    label,
    error,
    helperText,
    indeterminate = false,
    className,
    checked,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme();
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
      transition: 'background-color 150ms ease, border-color 150ms ease',
      contain: 'layout style',
      position: 'relative' as const,
      flexShrink: 0,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e);
    };

    return (
      <Box className={className} data-testid={dataTestId} style={{ contain: 'layout' }}>
        <Box as="label" display="flex" alignItems="center">
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
            <Box data-checkbox style={checkboxStyles}>
              {/* Always render both icons to prevent layout shift */}
              <Box
                as="span"
                position="absolute"
                top="50%"
                left="50%"
                style={{
                  transform: 'translate(-50%, -50%)',
                  color: theme('interactive.primary.text'),
                  fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
                  lineHeight: 1,
                  opacity: checked && !indeterminate ? 1 : 0,
                  transition: 'opacity 150ms ease',
                }}
              >
                ✓
              </Box>
              <Box
                as="span"
                position="absolute"
                top="50%"
                left="50%"
                style={{
                  transform: 'translate(-50%, -50%)',
                  color: theme('interactive.primary.text'),
                  fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
                  lineHeight: 1,
                  opacity: indeterminate ? 1 : 0,
                  transition: 'opacity 150ms ease',
                }}
              >
                −
              </Box>
            </Box>
          </Box>
          {label && (
            <Box ml={2}>
              <Box
                as="span"
                fontSize={sizeStyles.fontSize}
                fontWeight="normal"
                color={props.disabled ? theme('text.disabled') : theme('text.primary')}
                style={{
                  fontFamily: fontFamilies.sans,
                  cursor: props.disabled ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                }}
              >
                {label}
              </Box>
              {(error || helperText) && (
                <Box
                  as="span"
                  display="block"
                  mt={1}
                  fontSize={12}
                  color={error ? theme('text.error') : theme('text.secondary')}
                >
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;