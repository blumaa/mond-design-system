'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../tokens';
import { useTheme } from '../../utils/theme';
import { Box } from '../Box/Box';

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
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ 
    options,
    trigger,
    onSelect,
    isOpen: controlledIsOpen,
    onOpenChange,
    placement = 'bottom-start',
    closeOnSelect = true,
    isDarkMode = false,
    'data-testid': dataTestId,
    className,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
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

    const getPlacementStyles = () => {
      switch (placement) {
        case 'bottom-end':
          return { top: '100%', right: 0, marginTop: spacing[1] };
        case 'top-start':
          return { bottom: '100%', left: 0, marginBottom: spacing[1] };
        case 'top-end':
          return { bottom: '100%', right: 0, marginBottom: spacing[1] };
        case 'bottom-start':
        default:
          return { top: '100%', left: 0, marginTop: spacing[1] };
      }
    };

    const renderOption = (option: DropdownOption, index: number, depth = 0) => {
      if (option.divider) {
        return (
          <Box
            key={`divider-${index}`}
            style={{
              height: '1px',
              backgroundColor: theme('border.default'),
              margin: `${spacing[1]} 0`,
            }}
          />
        );
      }

      const hasChildren = option.children && option.children.length > 0;

      return (
        <React.Fragment key={option.value}>
          <Box
            ref={(el: HTMLDivElement | null) => {
              if (!option.disabled && !option.divider) {
                const flatIndex = flatOptions.findIndex(opt => opt.value === option.value);
                if (flatIndex >= 0) {
                  optionRefs.current[flatIndex] = el;
                }
              }
            }}
            tabIndex={option.disabled ? -1 : 0}
            role="menuitem"
            aria-disabled={option.disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${spacing[2]} ${spacing[3]}`,
              paddingLeft: `${parseInt(spacing[3]) + (depth * 16)}px`,
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              color: option.disabled ? theme('text.disabled') : theme('text.primary'),
              backgroundColor: 'transparent',
              transition: 'background-color 150ms ease',
              fontSize: fontSizes.sm,
              fontFamily: fontFamilies.sans,
              borderRadius: radii.sm,
              margin: `0 ${spacing[1]}`,
              ...(hasChildren && {
                fontWeight: fontWeights.medium,
              }),
            }}
            onClick={() => !option.disabled && handleOptionSelect(option)}
            onMouseEnter={() => {
              if (!option.disabled) {
                const flatIndex = flatOptions.findIndex(opt => opt.value === option.value);
                setFocusedIndex(flatIndex);
              }
            }}
            onFocus={() => {
              if (!option.disabled) {
                const flatIndex = flatOptions.findIndex(opt => opt.value === option.value);
                setFocusedIndex(flatIndex);
              }
            }}
            data-option-value={option.value}
          >
            {option.icon && (
              <Box
                style={{
                  marginRight: spacing[2],
                  flexShrink: 0,
                }}
              >
                {option.icon}
              </Box>
            )}
            <Box style={{ flex: 1 }}>
              {option.label}
            </Box>
            {hasChildren && (
              <Box
                style={{
                  marginLeft: spacing[2],
                  fontSize: fontSizes.xs,
                }}
              >
                ▸
              </Box>
            )}
          </Box>
          
          {/* Render nested options */}
          {hasChildren && option.children?.map((childOption, childIndex) => 
            renderOption(childOption, childIndex, depth + 1)
          )}
        </React.Fragment>
      );
    };

    return (
      <Box
        ref={ref || dropdownRef}
        className={className}
        data-testid={dataTestId}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
        {...props}
      >
        {/* Trigger */}
        <Box onClick={handleTriggerClick}>
          {trigger}
        </Box>

        {/* Dropdown Menu */}
        {isOpen && (
          <Box
            ref={menuRef}
            role="menu"
            style={{
              position: 'absolute',
              zIndex: 1000,
              minWidth: '200px',
              backgroundColor: theme('surface.overlay'),
              border: `1px solid ${theme('border.default')}`,
              borderRadius: radii.md,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: spacing[1],
              ...getPlacementStyles(),
            }}
          >
            {options.map((option, index) => renderOption(option, index))}
          </Box>
        )}
      </Box>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;