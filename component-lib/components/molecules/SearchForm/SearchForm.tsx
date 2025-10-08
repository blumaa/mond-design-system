'use client';
import React, { useState } from 'react';
import { Box } from '../../layout/Box/Box';
import { Input, InputSize } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface SearchFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  /**
   * Search input placeholder text
   * @default 'Search...'
   */
  placeholder?: string;
  
  /**
   * Search input value
   */
  value?: string;
  
  /**
   * Default value for uncontrolled component
   */
  defaultValue?: string;
  
  /**
   * Input size variant
   * @default 'md'
   */
  size?: InputSize;
  
  /**
   * Loading state for search operation
   * @default false
   */
  loading?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Show clear button when input has value
   * @default true
   */
  showClearButton?: boolean;
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Search callback - called when search button is clicked or form is submitted
   */
  onSearch?: (query: string) => void;
  
  /**
   * Clear callback - called when clear button is clicked
   */
  onClear?: () => void;
  
  /**
   * Change callback - called when input value changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Custom search button label
   * @default 'Search'
   */
  searchButtonLabel?: string;
  
  /**
   * Custom search button icon
   */
  searchIcon?: React.ReactNode;
  
  /**
   * Custom clear button icon
   */
  clearIcon?: React.ReactNode;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

const defaultSearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const defaultClearIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M12 4L4 12M4 4l8 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const spinnerIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2v2m0 8v2m6-6h-2m-8 0H2m10.95-3.05L12.243 5.05M3.757 10.95L5.464 9.243M12.95 10.95L10.95 8.95M3.05 5.05l1.414 1.414"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <animateTransform
      attributeName="transform"
      type="rotate"
      values="0 8 8;360 8 8"
      dur="1s"
      repeatCount="indefinite"
    />
  </svg>
);

export const SearchForm = React.forwardRef<HTMLFormElement, SearchFormProps>(
  ({ 
    placeholder = 'Search...',
    value,
    defaultValue,
    size = 'md',
    loading = false,
    disabled = false,
    showClearButton = true,
    
    onSearch,
    onClear,
    onChange,
    searchButtonLabel = 'Search',
    searchIcon = defaultSearchIcon,
    clearIcon = defaultClearIcon,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const { theme } = useThemeContext();
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    
    // Determine if this is controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = Boolean(currentValue && currentValue.length > 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!disabled && !loading && currentValue) {
        onSearch?.(currentValue);
      }
    };

    const handleClearClick = () => {
      if (!disabled && !loading) {
        if (!isControlled) {
          setInternalValue('');
        }
        onClear?.();
        onChange?.('');
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !loading && currentValue) {
          onSearch?.(currentValue);
        }
      }
    };

    return (
      <form
        ref={ref as React.Ref<HTMLFormElement>}
        data-testid={dataTestId}
        onSubmit={handleSubmit}
        role="search"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          borderRadius: '6px',
          overflow: 'hidden',
          border: `1px solid ${theme('border.default')}`,
          backgroundColor: theme('surface.input'),
          transition: 'border-color 150ms ease',
        }}
        {...props}
      >
        {/* Search Input */}
        <Box flex="1" position="relative">
          <Input
            type="search"
            placeholder={placeholder}
            value={currentValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputSize={size}
            disabled={disabled}
            
            style={{
              border: 'none',
              borderRadius: '0',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
            data-testid={dataTestId ? `${dataTestId}-input` : undefined}
          />
          
          {/* Clear Button */}
          {showClearButton && hasValue && !loading && (
            <Box
              position="absolute"
              right="8px"
              top="50%"
              style={{
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            >
              <Button
                variant="ghost"
                size={size}
                disabled={disabled}
                onClick={handleClearClick}
                iconOnly
                aria-label="Clear search"
                data-testid={dataTestId ? `${dataTestId}-clear` : undefined}
              >
                <Icon size="sm" >
                  {clearIcon}
                </Icon>
              </Button>
            </Box>
          )}
        </Box>

        {/* Search Button */}
        <Button
          type="submit"
          variant="primary"
          size={size}
          disabled={disabled || loading || !currentValue}
          aria-label={searchButtonLabel}
          data-testid={dataTestId ? `${dataTestId}-button` : undefined}
        >
          <Icon size={size === 'sm' ? 'sm' : 'md'} >
            {loading ? spinnerIcon : searchIcon}
          </Icon>
          {!loading && size !== 'sm' && (
            <Box ml={2} style={{ display: 'none' }} className="sm:block">
              {searchButtonLabel}
            </Box>
          )}
        </Button>
      </form>
    );
  }
);

SearchForm.displayName = 'SearchForm';

export default SearchForm;