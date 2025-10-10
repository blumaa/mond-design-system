'use client';
import React, { useState, useRef, useEffect, useId } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies, shadows } from '../../tokens';
import { useTheme } from '../providers/ThemeProvider';
import { Box } from '../Box/Box';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'error' | 'success';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Select size
   * @default 'md'
   */
  size?: SelectSize;
  
  /**
   * Select variant
   * @default 'default'
   */
  variant?: SelectVariant;
  
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success message to display
   */
  success?: string;
  
  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;

  /**
   * Array of options
   */
  options: SelectOption[];

  /**
   * Selected value
   */
  value?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * ID for the select
   */
  id?: string;
}

const getSizeStyles = (size: SelectSize) => {
  switch (size) {
    case 'sm':
      return {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: fontSizes.sm,
        height: '32px',
      };
    case 'md':
      return {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: fontSizes.base,
        height: '40px',
      };
    case 'lg':
      return {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.lg,
        height: '48px',
      };
    default:
      return {};
  }
};

const getVariantStyles = (variant: SelectVariant, theme: ReturnType<typeof useTheme>) => {
  const baseColors = {
    background: theme('surface.input'),
    border: theme('border.default'),
    text: theme('text.primary'),
    placeholder: theme('text.secondary'),
  };

  switch (variant) {
    case 'error':
      return {
        ...baseColors,
        border: theme('border.error'),
        focusBorder: theme('border.error'),
        focusRing: theme('feedback.error.background'),
      };
    case 'success':
      return {
        ...baseColors,
        border: theme('border.success'),
        focusBorder: theme('border.success'),
        focusRing: theme('feedback.success.background'),
      };
    case 'default':
    default:
      return {
        ...baseColors,
        focusBorder: theme('border.focused'),
        focusRing: theme('feedback.info.background'),
      };
  }
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    size = 'md',
    variant = 'default',
    label,
    error,
    success,
    helperText,
    placeholder = 'Select an option',
    options,
    value,
    onChange,
    disabled = false,
    className,
    id
  }, _ref) => {
    const theme = useTheme();
    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(variant, theme);
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            const option = options[focusedIndex];
            if (!option.disabled) {
              onChange?.(option.value);
              setIsOpen(false);
              setFocusedIndex(-1);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const nextIndex = focusedIndex < options.length - 1 ? focusedIndex + 1 : 0;
            setFocusedIndex(nextIndex);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
            setFocusedIndex(prevIndex);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
      }
    };

    const selectStyles = {
      position: 'relative' as const,
      display: 'inline-block',
      width: '100%',
    };

    const triggerStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: variantStyles.background,
      border: `1px solid ${variantStyles.border}`,
      borderRadius: radii.md,
      color: selectedOption ? variantStyles.text : variantStyles.placeholder,
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.normal,
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      transition: 'all 150ms ease',
      opacity: disabled ? 0.6 : 1,
      ...sizeStyles,
    };

    const dropdownStyles = {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      marginTop: spacing[1],
      backgroundColor: theme('surface.elevated'),
      border: `1px solid ${theme('border.default')}`,
      borderRadius: radii.md,
      boxShadow: shadows.lg,
      maxHeight: '200px',
      overflowY: 'auto' as const,
    };

    const optionStyles = (optionIndex: number, option: SelectOption) => ({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: sizeStyles.fontSize,
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.normal,
      color: option.disabled ? theme('text.disabled') : theme('text.primary'),
      backgroundColor: focusedIndex === optionIndex ? theme('surface.overlay') : 'transparent',
      cursor: option.disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      textAlign: 'left' as const,
      transition: 'background-color 150ms ease',
    });

    const labelStyles = {
      display: 'block',
      marginBottom: spacing[1],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: variantStyles.text,
    };

    const messageStyles = {
      display: 'block',
      marginTop: spacing[1],
      fontSize: fontSizes.sm,
      color: error ? theme('text.error') : success ? theme('text.success') : theme('text.secondary'),
    };

    const chevronStyles = {
      transition: 'transform 150ms ease',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: theme('text.secondary'),
    };

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          // Set focus to selected item or first item
          const selectedIndex = value ? options.findIndex(opt => opt.value === value) : 0;
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }
      }
    };

    const handleOptionClick = (option: SelectOption) => {
      if (!option.disabled) {
        onChange?.(option.value);
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
      }
    };

    const handleFocus = () => {
      if (triggerRef.current) {
        triggerRef.current.style.borderColor = variantStyles.focusBorder;
        triggerRef.current.style.boxShadow = `0 0 0 3px ${variantStyles.focusRing}`;
      }
    };

    const handleBlur = () => {
      if (triggerRef.current) {
        triggerRef.current.style.borderColor = variantStyles.border;
        triggerRef.current.style.boxShadow = 'none';
      }
    };

    return (
      <Box className={className}>
        {label && (
          <Box as="label" style={labelStyles} {...(selectId && { htmlFor: selectId })}>
            {label}
          </Box>
        )}
        <Box ref={containerRef} style={selectStyles}>
          <button
            ref={triggerRef}
            id={selectId}
            type="button"
            style={triggerStyles}
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <span style={chevronStyles}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4H4z" />
              </svg>
            </span>
          </button>
          
          {isOpen && (
            <Box ref={optionsRef} style={dropdownStyles} role="listbox">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  style={optionStyles(index, option)}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              ))}
            </Box>
          )}
        </Box>
        {(error || success || helperText) && (
          <span style={messageStyles}>
            {error || success || helperText}
          </span>
        )}
      </Box>
    );
  }
);

Select.displayName = 'Select';

export default Select;