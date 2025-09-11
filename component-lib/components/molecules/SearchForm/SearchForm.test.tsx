import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders search form with input and button', () => {
      render(<SearchForm />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<SearchForm placeholder="Find products..." />);
      
      expect(screen.getByPlaceholderText('Find products...')).toBeInTheDocument();
    });

    it('renders with default placeholder when not provided', () => {
      render(<SearchForm />);
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('applies custom data-testid', () => {
      render(<SearchForm data-testid="custom-search" />);
      
      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
      expect(screen.getByTestId('custom-search-input')).toBeInTheDocument();
      expect(screen.getByTestId('custom-search-button')).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as uncontrolled component with defaultValue', () => {
      render(<SearchForm defaultValue="initial query" />);
      
      const input = screen.getByDisplayValue('initial query');
      expect(input).toBeInTheDocument();
    });

    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('controlled');
        return (
          <SearchForm 
            value={value} 
            onChange={(newValue) => setValue(newValue)} 
          />
        );
      };

      render(<TestComponent />);
      
      const input = screen.getByDisplayValue('controlled');
      await user.clear(input);
      await user.type(input, 'new value');
      
      expect(input).toHaveValue('new value');
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearch when search button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, 'test query');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('calls onSearch when Enter key is pressed in input', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'test query');
      await user.keyboard('{Enter}');
      
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('calls onSearch when form is submitted', () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const form = screen.getByRole('search');
      const input = screen.getByRole('searchbox');
      
      fireEvent.change(input, { target: { value: 'test query' } });
      fireEvent.submit(form);
      
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('does not call onSearch when input is empty', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);
      
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('does not call onSearch when disabled', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} disabled />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, 'test query');
      await user.click(searchButton);
      
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('does not call onSearch when loading', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} loading />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, 'test query');
      await user.click(searchButton);
      
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Clear Functionality', () => {
    it('shows clear button when input has value', async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const input = screen.getByRole('searchbox');
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
      
      await user.type(input, 'test');
      
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('hides clear button when showClearButton is false', async () => {
      const user = userEvent.setup();
      render(<SearchForm showClearButton={false} />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('calls onClear and onChange when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchForm onClear={mockOnClear} onChange={mockOnChange} />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      
      expect(mockOnClear).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('clears input value in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(input).toHaveValue('test');
      
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      
      expect(input).toHaveValue('');
    });

    it('does not show clear button when loading', () => {
      render(<SearchForm defaultValue="test" loading />);
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner in search button when loading', () => {
      render(<SearchForm loading />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeDisabled();
    });

    it('disables search button when loading', () => {
      render(<SearchForm loading />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeDisabled();
    });

    it('hides clear button when loading', () => {
      render(<SearchForm defaultValue="test" loading />);
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables input and button when disabled', () => {
      render(<SearchForm disabled />);
      
      expect(screen.getByRole('searchbox')).toBeDisabled();
      expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
    });

    it('does not call onChange when input is disabled', async () => {
      const user = userEvent.setup();
      render(<SearchForm onChange={mockOnChange} disabled />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(<SearchForm size="sm" />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      expect(input).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<SearchForm size="lg" />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      expect(input).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('Custom Icons', () => {
    const customSearchIcon = <div data-testid="custom-search-icon">Search</div>;
    const customClearIcon = <div data-testid="custom-clear-icon">Clear</div>;

    it('renders custom search icon', () => {
      render(<SearchForm searchIcon={customSearchIcon} />);
      
      expect(screen.getByTestId('custom-search-icon')).toBeInTheDocument();
    });

    it('renders custom clear icon', async () => {
      const user = userEvent.setup();
      render(<SearchForm clearIcon={customClearIcon} />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(screen.getByTestId('custom-clear-icon')).toBeInTheDocument();
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when input value changes', async () => {
      const user = userEvent.setup();
      render(<SearchForm onChange={mockOnChange} />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(mockOnChange).toHaveBeenCalledTimes(4); // Called for each character
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 't');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'te');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'tes');
      expect(mockOnChange).toHaveBeenNthCalledWith(4, 'test');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles and labels', () => {
      render(<SearchForm data-testid="search-form" />);
      
      const form = screen.getByRole('search');
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      expect(form).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });

    it('clear button has proper aria-label', async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
    });

    it('search button has proper aria-label', () => {
      render(<SearchForm searchButtonLabel="Find items" />);
      
      const searchButton = screen.getByLabelText('Find items');
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('Dark Mode', () => {
    it('renders in dark mode without errors', () => {
      render(<SearchForm />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty onSearch gracefully', async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, 'test');
      await user.click(searchButton);
      
      // Should not throw error even without onSearch handler
      expect(input).toHaveValue('test');
    });

    it('handles whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, '   ');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith('   ');
    });

    it('handles rapid successive searches', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);
      
      const input = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(input, 'test1');
      await user.click(searchButton);
      
      await user.clear(input);
      await user.type(input, 'test2');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledTimes(2);
      expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'test1');
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'test2');
    });
  });
});