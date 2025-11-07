import React, { useState, useRef, useEffect, useId } from 'react';
import { Box } from '../Box/Box';
import { Label } from '../Label';
import { Text } from '../Text';
import './select.css';

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

  /**
   * Marks the field as required
   */
  required?: boolean;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

/**
 * Select Component
 *
 * A versatile, SSR-compatible select component that uses CSS variables for theming.
 * Supports multiple sizes, error/success states, and keyboard navigation.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic select
 * <Select options={[...]} placeholder="Choose option" />
 *
 * @example
 * // Select with error
 * <Select options={[...]} error="This field is required" />
 *
 * @example
 * // Controlled select with label
 * <Select label="Country" value={value} onChange={setValue} options={[...]} />
 */
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
    id,
    required = false,
    'data-testid': dataTestId,
  }, ref) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(option => option.value === value);

    // Determine effective variant based on error/success
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Build CSS class names
    const classNames = [
      'mond-select',
      `mond-select--${size}`,
      effectiveVariant !== 'default' && `mond-select--${effectiveVariant}`,
      isOpen && 'mond-select--open',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const triggerClassNames = [
      'mond-select__trigger',
      !selectedOption && 'mond-select__trigger--placeholder',
      disabled && 'mond-select__trigger--disabled',
    ]
      .filter(Boolean)
      .join(' ');

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

    return (
      <div ref={ref} className={classNames} data-testid={dataTestId}>
        {label && (
          <Label htmlFor={selectId} size={size} disabled={disabled} required={required}>
            {label}
          </Label>
        )}
        <div ref={containerRef} className="mond-select__trigger-container">
          <button
            ref={triggerRef}
            id={selectId}
            type="button"
            className={triggerClassNames}
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <span className="mond-select__chevron">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4H4z" />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="mond-select__dropdown" role="listbox">
              {options.map((option, index) => {
                const optionClassNames = [
                  'mond-select__option',
                  focusedIndex === index && 'mond-select__option--focused',
                  option.disabled && 'mond-select__option--disabled',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={option.value}
                    className={optionClassNames}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {(error || success || helperText) && (
          <Box marginTop="1">
            <Text variant="caption" semantic={error ? "error" : success ? "success" : "secondary"}>
              {error || success || helperText}
            </Text>
          </Box>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
