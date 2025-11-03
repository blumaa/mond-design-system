import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { DropdownItem } from '../DropdownItem/DropdownItem';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  divider?: boolean;
  icon?: React.ReactNode;
  children?: DropdownOption[];
}

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Dropdown options
   */
  options: DropdownOption[];

  /**
   * Trigger element (button, custom trigger)
   */
  trigger: React.ReactNode;

  /**
   * Callback when an option is selected
   */
  onSelect?: (value: string, option: DropdownOption) => void;

  /**
   * Whether the dropdown is open (controlled)
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Placement of the dropdown relative to trigger
   * @default 'bottom-start'
   */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

  /**
   * Close dropdown when option is selected
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

interface StyledMenuProps {
  $placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

const StyledMenu = styled.div<StyledMenuProps>`
  position: absolute;
  z-index: 1000;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space[1]};

  /* Placement variants */
  ${({ $placement, theme }) =>
    $placement === 'bottom-start' &&
    css`
      top: 100%;
      left: 0;
      margin-top: ${theme.space[1]};
    `}

  ${({ $placement, theme }) =>
    $placement === 'bottom-end' &&
    css`
      top: 100%;
      right: 0;
      margin-top: ${theme.space[1]};
    `}

  ${({ $placement, theme }) =>
    $placement === 'top-start' &&
    css`
      bottom: 100%;
      left: 0;
      margin-bottom: ${theme.space[1]};
    `}

  ${({ $placement, theme }) =>
    $placement === 'top-end' &&
    css`
      bottom: 100%;
      right: 0;
      margin-bottom: ${theme.space[1]};
    `}
`;

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({
    options,
    trigger,
    onSelect,
    isOpen: controlledIsOpen,
    onOpenChange,
    placement = 'bottom-start',
    closeOnSelect = true,
    'data-testid': dataTestId,
    className,
    ...props
  }, ref) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Controlled vs uncontrolled open state
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const setIsOpen = useCallback((open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    }, [isControlled, onOpenChange]);

    const handleOptionSelect = useCallback((option: DropdownOption) => {
      if (option.disabled) return;

      onSelect?.(option.value, option);

      if (closeOnSelect) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }, [onSelect, closeOnSelect, setIsOpen]);

    // Flatten options for keyboard navigation
    const flatOptions = React.useMemo(() => {
      const flatten = (opts: DropdownOption[]): DropdownOption[] => {
        const result: DropdownOption[] = [];
        opts.forEach(opt => {
          if (!opt.divider && !opt.disabled) {
            result.push(opt);
          }
          if (opt.children) {
            result.push(...flatten(opt.children));
          }
        });
        return result;
      };
      return flatten(options);
    }, [options]);

    // Handle outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const currentRef = ref && 'current' in ref ? ref.current : dropdownRef.current;
        if (currentRef && !currentRef.contains(event.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, setIsOpen, ref]);

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            setIsOpen(false);
            setFocusedIndex(-1);
            break;
          case 'ArrowDown':
            event.preventDefault();
            setFocusedIndex(prev => {
              const nextIndex = prev < flatOptions.length - 1 ? prev + 1 : 0;
              optionRefs.current[nextIndex]?.focus();
              return nextIndex;
            });
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFocusedIndex(prev => {
              const nextIndex = prev > 0 ? prev - 1 : flatOptions.length - 1;
              optionRefs.current[nextIndex]?.focus();
              return nextIndex;
            });
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < flatOptions.length) {
              const option = flatOptions[focusedIndex];
              handleOptionSelect(option);
            }
            break;
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen, focusedIndex, flatOptions, setIsOpen, handleOptionSelect]);

    const handleTriggerClick = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(-1);
      }
    };

    const renderOption = (option: DropdownOption, index: number, depth = 0) => {
      const hasChildren = option.children && option.children.length > 0;
      const flatIndex = flatOptions.findIndex(opt => opt.value === option.value);
      const isFocused = flatIndex >= 0 && flatIndex === focusedIndex;

      return (
        <React.Fragment key={option.divider ? `divider-${index}` : option.value}>
          <DropdownItem
            ref={(el: HTMLDivElement | null) => {
              if (!option.disabled && !option.divider && flatIndex >= 0) {
                optionRefs.current[flatIndex] = el;
              }
            }}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
            divider={option.divider}
            icon={option.icon}
            hasChildren={hasChildren}
            depth={depth}
            focused={isFocused}
            onSelect={(value) => {
              const selectedOption = flatOptions.find(opt => opt.value === value);
              if (selectedOption) {
                handleOptionSelect(selectedOption);
              }
            }}
            onMouseEnter={(value) => {
              const flatIdx = flatOptions.findIndex(opt => opt.value === value);
              if (flatIdx >= 0) {
                setFocusedIndex(flatIdx);
              }
            }}
            onFocus={(value) => {
              const flatIdx = flatOptions.findIndex(opt => opt.value === value);
              if (flatIdx >= 0) {
                setFocusedIndex(flatIdx);
              }
            }}
          />

          {/* Render nested options */}
          {hasChildren && option.children?.map((childOption, childIndex) =>
            renderOption(childOption, childIndex, depth + 1)
          )}
        </React.Fragment>
      );
    };

    return (
      <StyledDropdown
        ref={ref || dropdownRef}
        className={className}
        data-testid={dataTestId}
        {...props}
      >
        {/* Trigger */}
        <div
          onClick={handleTriggerClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {trigger}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <StyledMenu
            ref={menuRef}
            role="menu"
            $placement={placement}
          >
            {options.map((option, index) => renderOption(option, index))}
          </StyledMenu>
        )}
      </StyledDropdown>
    );
  }
);

Dropdown.displayName = 'Dropdown';
