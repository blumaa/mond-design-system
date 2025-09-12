'use client';
import React, { useState, useCallback } from 'react';
import { spacing, fontSizes, fontFamilies } from '../../../tokens';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';
import { Checkbox, CheckboxSize } from '../../atoms/Checkbox/Checkbox';

export type CheckboxGroupOrientation = 'horizontal' | 'vertical';

export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /**
   * Group label displayed as a legend
   */
  label?: string;
  
  /**
   * Form name for all checkboxes in the group
   */
  name?: string;
  
  /**
   * Array of selected values (controlled)
   */
  value?: string[];
  
  /**
   * Default selected values (uncontrolled)
   */
  defaultValue?: string[];
  
  /**
   * Callback fired when selection changes
   */
  onChange?: (values: string[]) => void;
  
  /**
   * Array of checkbox options
   */
  options: CheckboxGroupOption[];
  
  /**
   * Size applied to all checkboxes
   * @default 'md'
   */
  size?: CheckboxSize;
  
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
  orientation?: CheckboxGroupOrientation;
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
  
  /**
   * Disable all checkboxes in the group
   * @default false
   */
  disabled?: boolean;
}

export const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
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
    
    'data-testid': dataTestId,
    disabled = false,
    ...props 
  }, ref) => {
    const { theme } = useThemeContext();
    
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue || []);
    
    // Determine if we're in controlled mode
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;
    
    const handleChange = useCallback((optionValue: string, checked: boolean) => {
      let newValues: string[];
      
      if (checked) {
        // Add value if not already present
        newValues = selectedValues.includes(optionValue) 
          ? selectedValues 
          : [...selectedValues, optionValue];
      } else {
        // Remove value
        newValues = selectedValues.filter(v => v !== optionValue);
      }
      
      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(newValues);
      }
      
      // Call onChange callback
      onChange?.(newValues);
    }, [selectedValues, isControlled, onChange]);

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
            <Checkbox
              key={option.value}
              name={name}
              size={size}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled || option.disabled}
              
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

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;