'use client';
import React, { useState, useRef, useEffect, useId } from 'react';
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
  }, _ref) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(option => option.value === value);

    // Determine effective variant based on error/success props
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

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

    // Build class names
    const selectClassNames = [
      'mond-select',
      `mond-select--${size}`,
      `mond-select--${effectiveVariant}`,
      isOpen && 'mond-select--open',
      className,
    ].filter(Boolean).join(' ');

    const triggerClassNames = [
      'mond-select__trigger',
      !selectedOption && 'mond-select__trigger--placeholder',
    ].filter(Boolean).join(' ');

    // Determine message to display
    const message = error || success || helperText;
    const messageClass = error
      ? 'mond-select__message--error'
      : success
        ? 'mond-select__message--success'
        : 'mond-select__message--helper';

    return (
      <Box className="mond-select-container">
        {label && (
          <label htmlFor={selectId} className="mond-select__label">
            {label}
          </label>
        )}
        <div ref={containerRef} className={selectClassNames}>
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
              {options.map((option, index) => (
                <button
                  key={option.value}
                  className={`mond-select__option ${focusedIndex === index ? 'mond-select__option--focused' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {message && (
          <div className={`mond-select__message ${messageClass}`}>
            {message}
          </div>
        )}
      </Box>
    );
  }
);

Select.displayName = 'Select';

export default Select;
