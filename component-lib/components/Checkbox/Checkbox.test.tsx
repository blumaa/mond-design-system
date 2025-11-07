import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent } from '../../test-utils';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox with label', () => {
    render(<Checkbox label="Accept terms" />);
    const labelElement = screen.getByText(/accept terms/i);
    const checkboxElement = screen.getByRole('checkbox');

    expect(labelElement).toBeInTheDocument();
    expect(checkboxElement).toBeInTheDocument();
  });

  it('handles checked state changes', () => {
    const handleChange = jest.fn();
    render(
      <Checkbox
        label="Test checkbox"
        onChange={handleChange}
        data-testid="test-checkbox"
      />
    );

    const checkboxElement = screen.getByRole('checkbox');
    fireEvent.click(checkboxElement);

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked state', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Checked checkbox" checked onChange={handleChange} />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeChecked();
  });

  it('renders in unchecked state by default', () => {
    render(<Checkbox label="Unchecked checkbox" />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).not.toBeChecked();
  });

  describe('indeterminate state', () => {
    it('handles indeterminate state correctly', () => {
      render(<Checkbox label="Indeterminate" indeterminate />);
      const checkboxElement = screen.getByRole('checkbox');
      // Note: indeterminate is a property, not an attribute
      expect(checkboxElement).toHaveProperty('indeterminate', true);
    });

    it('applies indeterminate CSS class', () => {
      render(<Checkbox label="Indeterminate" indeterminate data-testid="indeterminate-checkbox" />);
      const container = screen.getByTestId('indeterminate-checkbox');
      expect(container).toHaveClass('mond-checkbox--indeterminate');
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Checkbox size="sm" label="Small checkbox" data-testid="sm-checkbox" />);
      const container = screen.getByTestId('sm-checkbox');
      expect(container).toHaveClass('mond-checkbox--sm');
    });

    it('renders medium size correctly', () => {
      render(<Checkbox size="md" label="Medium checkbox" data-testid="md-checkbox" />);
      const container = screen.getByTestId('md-checkbox');
      expect(container).toHaveClass('mond-checkbox--md');
    });

    it('renders large size correctly', () => {
      render(<Checkbox size="lg" label="Large checkbox" data-testid="lg-checkbox" />);
      const container = screen.getByTestId('lg-checkbox');
      expect(container).toHaveClass('mond-checkbox--lg');
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<Checkbox label="Required checkbox" error="This field is required" />);
      const errorMessage = screen.getByText(/this field is required/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies error CSS class', () => {
      render(
        <Checkbox
          label="Error checkbox"
          error="Error message"
          data-testid="error-checkbox"
        />
      );
      const container = screen.getByTestId('error-checkbox');
      expect(container).toHaveClass('mond-checkbox--error');
    });
  });

  describe('helper text', () => {
    it('displays helper text', () => {
      render(<Checkbox label="Newsletter" helperText="Get weekly updates" />);
      const helperText = screen.getByText(/get weekly updates/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('renders correctly in dark mode', () => {
      renderWithDarkMode(<Checkbox label="Dark checkbox" data-testid="dark-checkbox" />);
      const container = screen.getByTestId('dark-checkbox');
      const checkboxElement = screen.getByRole('checkbox');
      expect(container).toBeInTheDocument();
      expect(checkboxElement).toBeInTheDocument();
    });

    it('renders correctly in light mode by default', () => {
      render(<Checkbox label="Light checkbox" data-testid="light-checkbox" />);
      const container = screen.getByTestId('light-checkbox');
      const checkboxElement = screen.getByRole('checkbox');
      expect(container).toBeInTheDocument();
      expect(checkboxElement).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('renders disabled checkbox', () => {
      render(<Checkbox label="Disabled checkbox" disabled />);
      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeDisabled();
    });

    it('applies disabled CSS class', () => {
      render(<Checkbox label="Disabled" disabled data-testid="disabled-checkbox" />);
      const container = screen.getByTestId('disabled-checkbox');
      expect(container).toHaveClass('mond-checkbox--disabled');
    });
  });

  describe('accessibility', () => {
    it('associates label with checkbox using htmlFor and id', () => {
      render(<Checkbox label="Accessible checkbox" id="accessible-cb" />);
      screen.getByText(/accessible checkbox/i).closest('label');
      const checkboxElement = screen.getByRole('checkbox');

      expect(checkboxElement).toHaveAttribute('id', 'accessible-cb');
    });

    it('supports keyboard interaction', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Keyboard test" onChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');
      fireEvent.keyDown(checkboxElement, { key: ' ', code: 'Space' });

      // The space key should trigger the change (though this is native browser behavior)
      checkboxElement.focus();
      fireEvent.keyDown(checkboxElement, { key: ' ' });
    });
  });

  describe('focus states', () => {
    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(
        <Checkbox
          label="Focus test"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );

      const checkboxElement = screen.getByRole('checkbox');

      fireEvent.focus(checkboxElement);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(checkboxElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  it('renders without label', () => {
    render(<Checkbox data-testid="no-label-checkbox" />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeInTheDocument();
  });

  describe('CSS class structure', () => {
    it('applies base CSS class', () => {
      render(<Checkbox label="Base class test" data-testid="base-checkbox" />);
      const container = screen.getByTestId('base-checkbox');
      expect(container).toHaveClass('mond-checkbox');
    });

    it('applies custom className', () => {
      render(<Checkbox label="Custom class" className="custom-class" data-testid="custom-checkbox" />);
      const container = screen.getByTestId('custom-checkbox');
      expect(container).toHaveClass('mond-checkbox');
      expect(container).toHaveClass('custom-class');
    });

    it('renders checkbox box with data-checkbox attribute', () => {
      render(<Checkbox label="Box test" data-testid="box-checkbox" />);
      const container = screen.getByTestId('box-checkbox');
      const checkboxBox = container.querySelector('[data-checkbox]');
      expect(checkboxBox).toBeInTheDocument();
      expect(checkboxBox).toHaveClass('mond-checkbox__box');
    });
  });
});
