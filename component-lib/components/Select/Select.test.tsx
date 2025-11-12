import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  it('renders select with placeholder, label, and selected option', () => {
    render(<Select options={mockOptions} placeholder="Choose an option" label="Country" value="option2" />);

    const selectButton = screen.getByRole('button');
    const labelElement = screen.getByText('Country');

    expect(selectButton).toHaveTextContent('Option 2');
    expect(labelElement).toBeInTheDocument();
  });

  it('opens and closes dropdown', async () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);

    const selectButton = screen.getByRole('button');

    fireEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('option2');
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard navigation', () => {
    it('opens dropdown with Enter/Space and closes with Escape', async () => {
      render(<Select options={mockOptions} />);

      const selectButton = screen.getByRole('button');

      selectButton.focus();
      fireEvent.keyDown(selectButton, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.keyDown(selectButton, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sizes and variants', () => {
    it('applies size and variant classes', () => {
      const { rerender } = render(<Select size="sm" options={mockOptions} data-testid="sm-select" />);
      let container = screen.getByTestId('sm-select');
      expect(container).toHaveClass('mond-select--sm');

      rerender(<Select variant="error" error="Please select an option" options={mockOptions} data-testid="error-select" />);
      container = screen.getByTestId('error-select');
      const errorMessage = screen.getByText(/please select an option/i);

      expect(container).toHaveClass('mond-select--error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Disabled options and select', () => {
    it('renders disabled options and does not select them', async () => {
      const handleChange = jest.fn();
      render(<Select options={optionsWithDisabled} onChange={handleChange} />);

      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      await waitFor(() => {
        const disabledOption = screen.getByText('Disabled Option').closest('button');
        expect(disabledOption).toBeDisabled();
      });

      const disabledOption = screen.getByText('Disabled Option');
      fireEvent.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('renders disabled select and does not open', () => {
      render(<Select options={mockOptions} disabled />);

      const selectButton = screen.getByRole('button');
      expect(selectButton).toBeDisabled();

      fireEvent.click(selectButton);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes and associates label', async () => {
      render(<Select label="Test Select" options={mockOptions} id="test-select" />);

      const selectButton = screen.getByRole('button');
      const labelElement = screen.getByText(/test select/i);

      expect(selectButton).toHaveAttribute('aria-haspopup', 'listbox');
      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
      expect(labelElement).toHaveAttribute('for', 'test-select');
      expect(selectButton).toHaveAttribute('id', 'test-select');

      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  it('handles click outside to close', async () => {
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

  it('renders empty options array gracefully and shows helper text', () => {
    render(<Select options={[]} placeholder="No options" helperText="Choose your preference" />);

    const selectButton = screen.getByRole('button');
    const helperText = screen.getByText(/choose your preference/i);

    expect(selectButton).toHaveTextContent('No options');
    expect(helperText).toBeInTheDocument();
  });
});
