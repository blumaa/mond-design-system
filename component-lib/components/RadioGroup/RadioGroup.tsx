'use client';
import React, { useState, useCallback } from 'react';
import { spacing, fontSizes, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';
import { Box } from '../Box/Box';
import { Radio, RadioSize } from '../Radio/Radio';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /**
   * Group label displayed as a legend
   */
  label?: string;
  
  /**
   * Form name for all radios in the group
   */
  name?: string;
  
  /**
   * Selected value (controlled)
   */
  value?: string;
  
  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;
  
  /**
   * Callback fired when selection changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Array of radio options
   */
  options: RadioGroupOption[];
  
  /**
   * Size applied to all radios
   * @default 'md'
   */
  size?: RadioSize;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Helper text to display
   */
  helperText?: string;
  
  /**
   * Layout orientation
   * @default 'vertical'
   */
  orientation?: RadioGroupOrientation;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
  
  /**
   * Disable all radios in the group
   * @default false
   */
  disabled?: boolean;
}

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ 
    label,
    name,
    value,
    defaultValue,
    onChange,
    options,
    size = 'md',
    error,
    helperText,
    orientation = 'vertical',
    isDarkMode = false,
    'data-testid': dataTestId,
    disabled = false,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string>(defaultValue || '');
    
    // Determine if we're in controlled mode
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;
    
    const handleChange = useCallback((optionValue: string) => {
      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      
      // Call onChange callback
      onChange?.(optionValue);
    }, [isControlled, onChange]);

    // Generate a unique group name if none provided
    const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Box
        as="fieldset"
        ref={ref as React.Ref<HTMLElement>}
        style={{
          border: 'none',
          padding: 0,
          margin: 0,
          minWidth: 0,
        }}
        data-testid={dataTestId}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      >
        {label && (
          <Box
            as="legend"
            mb={3}
            style={{
              fontFamily: fontFamilies.sans,
              fontSize: fontSizes.base,
              fontWeight: 600,
              color: theme('text.primary'),
              padding: 0,
              marginBottom: spacing[3],
            }}
          >
            {label}
          </Box>
        )}
        
        <Box
          display="flex"
          flexDirection={orientation === 'vertical' ? 'column' : 'row'}
          style={{
            gap: orientation === 'vertical' ? spacing[2] : spacing[4],
          }}
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              name={groupName}
              value={option.value}
              size={size}
              label={option.label}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || option.disabled}
              isDarkMode={isDarkMode}
            />
          ))}
        </Box>
        
        {(error || helperText) && (
          <Box
            mt={2}
            style={{
              fontSize: fontSizes.sm,
              color: error ? theme('text.error') : theme('text.secondary'),
              fontFamily: fontFamilies.sans,
            }}
          >
            {error || helperText}
          </Box>
        )}
      </Box>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;