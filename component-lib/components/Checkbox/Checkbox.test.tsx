import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox with label and handles state changes', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Accept terms" onChange={handleChange} data-testid="test-checkbox" />);

    const labelElement = screen.getByText(/accept terms/i);
    const checkboxElement = screen.getByRole('checkbox');

    expect(labelElement).toBeInTheDocument();
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).not.toBeChecked();

    fireEvent.click(checkboxElement);
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked and unchecked states', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Checked checkbox" checked onChange={handleChange} />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeChecked();

    render(<Checkbox label="Unchecked checkbox" />);
    const uncheckedBox = screen.getByLabelText(/unchecked checkbox/i);
    expect(uncheckedBox).not.toBeChecked();
  });

  describe('Indeterminate state', () => {
    it('handles indeterminate state and applies CSS class', () => {
      render(<Checkbox label="Indeterminate" indeterminate data-testid="indeterminate-checkbox" />);

      const checkboxElement = screen.getByRole('checkbox');
      const container = screen.getByTestId('indeterminate-checkbox');

      expect(checkboxElement).toHaveProperty('indeterminate', true);
      expect(container).toHaveClass('mond-checkbox--indeterminate');
    });
  });

  describe('Sizes', () => {
    it('applies size classes correctly', () => {
      const { rerender } = render(<Checkbox size="sm" label="Small checkbox" data-testid="sm-checkbox" />);
      let container = screen.getByTestId('sm-checkbox');
      expect(container).toHaveClass('mond-checkbox--sm');

      rerender(<Checkbox size="lg" label="Large checkbox" data-testid="lg-checkbox" />);
      container = screen.getByTestId('lg-checkbox');
      expect(container).toHaveClass('mond-checkbox--lg');
    });
  });

  describe('Error and helper text', () => {
    it('displays error message and applies error CSS class', () => {
      render(<Checkbox label="Required checkbox" error="This field is required" data-testid="error-checkbox" />);

      const errorMessage = screen.getByText(/this field is required/i);
      const container = screen.getByTestId('error-checkbox');

      expect(errorMessage).toBeInTheDocument();
      expect(container).toHaveClass('mond-checkbox--error');
    });

    it('displays helper text', () => {
      render(<Checkbox label="Newsletter" helperText="Get weekly updates" />);
      const helperText = screen.getByText(/get weekly updates/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('renders disabled checkbox with proper styling', () => {
      render(<Checkbox label="Disabled checkbox" disabled data-testid="disabled-checkbox" />);

      const checkboxElement = screen.getByRole('checkbox');
      const container = screen.getByTestId('disabled-checkbox');

      expect(checkboxElement).toBeDisabled();
      expect(container).toHaveClass('mond-checkbox--disabled');
    });
  });

  describe('Accessibility', () => {
    it('associates label with checkbox and handles focus/blur', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(<Checkbox label="Accessible checkbox" id="accessible-cb" onFocus={handleFocus} onBlur={handleBlur} />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveAttribute('id', 'accessible-cb');

      fireEvent.focus(checkboxElement);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(checkboxElement);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('supports keyboard interaction', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Keyboard test" onChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');
      checkboxElement.focus();
      fireEvent.keyDown(checkboxElement, { key: ' ' });
    });
  });

  it('renders without label and applies custom className', () => {
    const { rerender } = render(<Checkbox data-testid="no-label-checkbox" />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeInTheDocument();

    rerender(<Checkbox label="Custom class" className="custom-class" data-testid="custom-checkbox" />);
    const container = screen.getByTestId('custom-checkbox');
    expect(container).toHaveClass('mond-checkbox');
    expect(container).toHaveClass('custom-class');

    const checkboxBox = container.querySelector('[data-checkbox]');
    expect(checkboxBox).toBeInTheDocument();
    expect(checkboxBox).toHaveClass('mond-checkbox__box');
  });
});
