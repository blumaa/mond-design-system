'use client';
import React from 'react';
import { radii, spacing } from '../../../tokens';
import { useTheme } from '../../../utils/theme';
import { Box } from '../../layout/Box/Box';
import { InputSize, InputVariant } from '../../atoms/Input/Input';

export interface InputGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /**
   * Element to display before the input (left side)
   */
  prefix?: React.ReactNode;
  
  /**
   * Element to display after the input (right side)
   */
  suffix?: React.ReactNode;
  
  /**
   * Input size variant inherited by the input
   */
  inputSize?: InputSize;
  
  /**
   * Input variant inherited by the input
   */
  variant?: InputVariant;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * The Input component to enhance with prefix/suffix
   */
  children: React.ReactElement;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ 
    prefix,
    suffix,
    inputSize = 'md',
    variant = 'default',
    isDarkMode = false,
    children,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    
    // Clone the input child to inherit group properties
    const enhancedInput = React.isValidElement(children) 
      ? React.cloneElement(children, {
          inputSize: (children.props as Record<string, unknown>).inputSize || inputSize,
          variant: (children.props as Record<string, unknown>).variant || variant,
          isDarkMode: (children.props as Record<string, unknown>).isDarkMode ?? isDarkMode,
          // Preserve existing className
          className: (children.props as Record<string, unknown>).className,
          // Remove border radius on appropriate sides when prefix/suffix are present
          style: {
            ...((children.props as Record<string, unknown>).style as React.CSSProperties || {}),
            ...(prefix && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }),
            ...(suffix && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }),
          },
        } as Record<string, unknown>)
      : children;

    const getBorderColor = () => {
      switch (variant) {
        case 'error':
          return theme('border.error');
        case 'success':
          return theme('border.success');
        default:
          return theme('border.default');
      }
    };

    const getSizeStyles = (size: InputSize) => {
      switch (size) {
        case 'sm':
          return {
            fontSize: '14px',
            padding: `${spacing[1]} ${spacing[3]}`,
            height: '32px',
          };
        case 'md':
          return {
            fontSize: '16px',
            padding: `${spacing[2]} ${spacing[4]}`,
            height: '40px',
          };
        case 'lg':
          return {
            fontSize: '18px',
            padding: `${spacing[3]} ${spacing[5]}`,
            height: '48px',
          };
        default:
          return {};
      }
    };

    const sizeStyles = getSizeStyles(inputSize);

    const affixStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme('surface.input'),
      border: `1px solid ${getBorderColor()}`,
      color: theme('text.secondary'),
      ...sizeStyles,
      borderRadius: 0, // Will be set specifically on first/last child
      flexShrink: 0,
    };

    return (
      <Box
        ref={ref}
        display="flex"
        alignItems="stretch"
        position="relative"
        data-testid={dataTestId}
        style={{
          borderRadius: radii.md,
          overflow: 'hidden',
        }}
        {...props}
      >
        {prefix && (
          <Box
            style={{
              ...affixStyles,
              borderTopLeftRadius: radii.md,
              borderBottomLeftRadius: radii.md,
              borderRight: 'none',
            }}
          >
            {prefix}
          </Box>
        )}
        
        <Box flex="1" position="relative">
          {enhancedInput}
        </Box>
        
        {suffix && (
          <Box
            style={{
              ...affixStyles,
              borderTopRightRadius: radii.md,
              borderBottomRightRadius: radii.md,
              borderLeft: 'none',
            }}
          >
            {suffix}
          </Box>
        )}
      </Box>
    );
  }
);

InputGroup.displayName = 'InputGroup';

export default InputGroup;