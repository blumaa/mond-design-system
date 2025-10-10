import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import { Select } from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const optionsWithDisabled = [
  { value: 'available', label: 'Available Option' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
  { value: 'another', label: 'Another Available' },
];

describe('Select Component', () => {
  it('renders select with placeholder', () => {
    render(<Select options={mockOptions} placeholder="Choose an option" />);
    const selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('Choose an option');
  });

  it('renders with label', () => {
    render(<Select label="Country" options={mockOptions} placeholder="Select country" />);
    const labelElement = screen.getByText('Country');
    expect(labelElement).toBeInTheDocument();
  });

  it('displays selected option', () => {
    render(<Select options={mockOptions} value="option2" />);
    const selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('Option 2');
  });

  it('opens dropdown when clicked', async () => {
    render(<Select options={mockOptions} />);
    const selectButton = screen.getByRole('button');
    
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('closes dropdown when option is selected', async () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      const option = screen.getByText('Option 2');
      fireEvent.click(option);
    });
    
    expect(handleChange).toHaveBeenCalledWith('option2');
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown with Enter key', async () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      selectButton.focus();
      fireEvent.keyDown(selectButton, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('opens dropdown with Space key', async () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      selectButton.focus();
      fireEvent.keyDown(selectButton, { key: ' ' });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('closes dropdown with Escape key', async () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      fireEvent.click(selectButton);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(selectButton, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });

    it('navigates options with arrow keys', async () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      selectButton.focus();
      fireEvent.keyDown(selectButton, { key: 'ArrowDown' });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Select size="sm" options={mockOptions} data-testid="sm-select" />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveStyle('font-size: 0.875rem');
      expect(selectButton).toHaveStyle('height: 32px');
    });

    it('renders medium size correctly', () => {
      render(<Select size="md" options={mockOptions} data-testid="md-select" />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveStyle('font-size: 1rem');
      expect(selectButton).toHaveStyle('height: 40px');
    });

    it('renders large size correctly', () => {
      render(<Select size="lg" options={mockOptions} data-testid="lg-select" />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveStyle('font-size: 1.125rem');
      expect(selectButton).toHaveStyle('height: 48px');
    });
  });

  describe('variants', () => {
    it('renders error variant with error styling', () => {
      render(
        <Select 
          variant="error" 
          options={mockOptions}
          error="Please select an option"
          data-testid="error-select"
        />
      );
      const selectButton = screen.getByRole('button');
      const errorMessage = screen.getByText(/please select an option/i);
      
      expect(selectButton).toHaveStyle('border: 1px solid #ef4444');
      expect(errorMessage).toBeInTheDocument();
    });

    it('renders success variant with success styling', () => {
      render(
        <Select 
          variant="success" 
          options={mockOptions}
          success="Good choice!"
          data-testid="success-select"
        />
      );
      const selectButton = screen.getByRole('button');
      const successMessage = screen.getByText(/good choice!/i);
      
      expect(selectButton).toHaveStyle('border: 1px solid #22c55e');
      expect(successMessage).toBeInTheDocument();
    });
  });

  describe('disabled options', () => {
    it('renders disabled options correctly', async () => {
      render(<Select options={optionsWithDisabled} />);
      const selectButton = screen.getByRole('button');
      
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        const disabledOption = screen.getByText('Disabled Option').closest('button');
        expect(disabledOption).toBeDisabled();
      });
    });

    it('does not select disabled options when clicked', async () => {
      const handleChange = jest.fn();
      render(<Select options={optionsWithDisabled} onChange={handleChange} />);
      
      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        const disabledOption = screen.getByText('Disabled Option');
        fireEvent.click(disabledOption);
      });
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled select', () => {
    it('renders disabled select', () => {
      render(<Select options={mockOptions} disabled />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toBeDisabled();
    });

    it('does not open dropdown when disabled', () => {
      render(<Select options={mockOptions} disabled />);
      const selectButton = screen.getByRole('button');
      
      fireEvent.click(selectButton);
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      renderWithDarkMode(<Select options={mockOptions} data-testid="dark-select" />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveStyle('background-color: #171717');
    });

    it('applies light mode styling by default', () => {
      render(<Select options={mockOptions} data-testid="light-select" />);
      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveStyle('background-color: #ffffff');
    });
  });

  describe('helper text', () => {
    it('displays helper text', () => {
      render(<Select options={mockOptions} helperText="Choose your preference" />);
      const helperText = screen.getByText(/choose your preference/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Select options={mockOptions} id="test-select" />);
      const selectButton = screen.getByRole('button');
      
      expect(selectButton).toHaveAttribute('aria-haspopup', 'listbox');
      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when opened', async () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('associates label with select using htmlFor and id', () => {
      render(<Select label="Test Select" options={mockOptions} id="test-select" />);
      const labelElement = screen.getByText(/test select/i);
      const selectButton = screen.getByRole('button');
      
      expect(labelElement).toHaveAttribute('for', 'test-select');
      expect(selectButton).toHaveAttribute('id', 'test-select');
    });
  });

  describe('focus states', () => {
    it('handles focus and blur events', () => {
      render(<Select options={mockOptions} />);
      const selectButton = screen.getByRole('button');
      
      fireEvent.focus(selectButton);
      fireEvent.blur(selectButton);
      
      // Focus and blur should work without errors
      expect(selectButton).not.toHaveFocus();
    });
  });

  describe('click outside to close', () => {
    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <Select options={mockOptions} />
          <div data-testid="outside">Outside element</div>
        </div>
      );
      
      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);
      
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  it('renders empty options array gracefully', () => {
    render(<Select options={[]} placeholder="No options" />);
    const selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('No options');
  });
});
