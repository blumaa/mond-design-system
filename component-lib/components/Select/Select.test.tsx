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

  describe('Form Integration', () => {
    it('renders hidden input when name prop is provided', () => {
      const { container } = render(<Select options={mockOptions} name="test-field" />);

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'test-field');
    });

    it('does not render hidden input when name prop is not provided', () => {
      const { container } = render(<Select options={mockOptions} />);

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });

    it('syncs hidden input value with selected option', async () => {
      const { container } = render(
        <Select options={mockOptions} name="test-field" defaultValue="option1" />
      );

      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('option1');

      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      const option2 = screen.getByText('Option 2');
      fireEvent.click(option2);

      await waitFor(() => {
        expect(hiddenInput.value).toBe('option2');
      });
    });

    it('works in uncontrolled mode with defaultValue', async () => {
      render(<Select options={mockOptions} defaultValue="option2" />);

      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveTextContent('Option 2');

      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });

      const option3 = screen.getByText('Option 3');
      fireEvent.click(option3);

      await waitFor(() => {
        expect(selectButton).toHaveTextContent('Option 3');
      });
    });

    it('calls onChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(
        <Select
          options={mockOptions}
          defaultValue="option1"
          onChange={handleChange}
        />
      );

      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      const option2 = screen.getByText('Option 2');
      fireEvent.click(option2);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('submits form data with hidden input', async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        return formData.get('category');
      });

      render(
        <form onSubmit={handleSubmit}>
          <Select
            options={mockOptions}
            name="category"
            defaultValue="option1"
          />
          <button type="submit">Submit</button>
        </form>
      );

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
        const result = handleSubmit.mock.results[0].value;
        expect(result).toBe('option1');
      });
    });

    it('passes required attribute to hidden input', () => {
      const { container } = render(
        <Select options={mockOptions} name="test-field" required />
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute('required');
    });

    it('passes disabled attribute to hidden input', () => {
      const { container } = render(
        <Select options={mockOptions} name="test-field" disabled />
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeDisabled();
    });
  });
});
