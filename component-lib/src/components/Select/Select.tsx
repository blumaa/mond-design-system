import React, { useState, useRef, useEffect, useId } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label as MdsLabel } from '../Label/Label';

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

// Styled Components
const SelectContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;


const SelectWrapper = styled(Box)<{ $size: SelectSize; $variant: SelectVariant; $isOpen: boolean }>`
  position: relative;
  display: inline-block;
  width: 100%;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      .mond-select__chevron {
        transform: rotate(180deg);
      }
    `}
`;

const TriggerButton = styled(Box).attrs({ as: 'button' })<{
  $size: SelectSize;
  $variant: SelectVariant;
  $isPlaceholder: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceInput};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme, $isPlaceholder }) =>
    $isPlaceholder ? theme.colors.textSecondary : theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  cursor: pointer;
  outline: none;
  transition: all 150ms ease;

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.space[1]} ${theme.space[2]};
          font-size: ${theme.fontSizes.sm};
          height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${theme.space[3]} ${theme.space[4]};
          font-size: ${theme.fontSizes.lg};
          height: 48px;
        `;
      default: // md
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.base};
          height: 40px;
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'error':
        return css`
          border-color: ${theme.colors.borderError};

          &:focus {
            border-color: ${theme.colors.borderError};
            box-shadow: 0 0 0 3px ${theme.colors.feedbackErrorBackground};
          }
        `;
      case 'success':
        return css`
          border-color: ${theme.colors.borderSuccess};

          &:focus {
            border-color: ${theme.colors.borderSuccess};
            box-shadow: 0 0 0 3px ${theme.colors.feedbackSuccessBackground};
          }
        `;
      default:
        return css`
          &:focus {
            border-color: ${theme.colors.brandPrimary600};
            box-shadow: 0 0 0 3px ${theme.colors.feedbackInfoBackground};
          }
        `;
    }
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Chevron = styled(Box).attrs({ as: 'span' })`
  transition: transform 150ms ease;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.space[2]};
  display: flex;
  align-items: center;
`;

const Dropdown = styled(Box)<{ $size: SelectSize }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: ${({ theme }) => theme.space[1]};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
`;

const Option = styled(Box).attrs({ as: 'button' })<{ $size: SelectSize; $isFocused: boolean; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme, $isSelected }) =>
    $isSelected ? theme.fontWeights.medium : theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme, $isFocused, $isSelected }) =>
    $isFocused || $isSelected ? theme.colors.surfaceOverlay : 'transparent'};
  cursor: pointer;
  border: none;
  text-align: left;
  transition: background-color 150ms ease;

  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return css`
          font-size: ${theme.fontSizes.lg};
        `;
      default: // md
        return css`
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surfaceOverlay};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;

const Message = styled(Box)<{ $variant: 'error' | 'success' | 'helper' }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'error':
        return theme.colors.textError;
      case 'success':
        return theme.colors.textSuccess;
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
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
    },
    _ref
  ) => {
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

    // Determine message to display
    const message = error || success || helperText;
    const messageVariant = error ? 'error' : success ? 'success' : 'helper';

    return (
      <SelectContainer className="mond-select-container">
        {label && (
          <MdsLabel htmlFor={selectId} className="mond-select__label">
            {label}
          </MdsLabel>
        )}
        <SelectWrapper
          ref={containerRef}
          $size={size}
          $variant={effectiveVariant}
          $isOpen={isOpen}
          className={`mond-select mond-select--${size} mond-select--${effectiveVariant} ${
            isOpen ? 'mond-select--open' : ''
          } ${className || ''}`}
        >
          <TriggerButton
            ref={triggerRef}
            id={selectId}
            type="button"
            $size={size}
            $variant={effectiveVariant}
            $isPlaceholder={!selectedOption}
            className={`mond-select__trigger ${!selectedOption ? 'mond-select__trigger--placeholder' : ''}`}
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <Chevron className="mond-select__chevron">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4H4z" />
              </svg>
            </Chevron>
          </TriggerButton>

          {isOpen && (
            <Dropdown $size={size} className="mond-select__dropdown" role="listbox">
              {options.map((option, index) => (
                <Option
                  key={option.value}
                  $size={size}
                  $isFocused={focusedIndex === index}
                  $isSelected={option.value === value}
                  className={`mond-select__option ${
                    focusedIndex === index ? 'mond-select__option--focused' : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </Option>
              ))}
            </Dropdown>
          )}
        </SelectWrapper>
        {message && (
          <Message
            $variant={messageVariant}
            className={`mond-select__message mond-select__message--${messageVariant}`}
          >
            {message}
          </Message>
        )}
      </SelectContainer>
    );
  }
);

Select.displayName = 'Select';

