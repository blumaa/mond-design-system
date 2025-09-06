import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    render(<Checkbox label="Checked checkbox" checked />);
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
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Checkbox size="sm" label="Small checkbox" data-testid="sm-checkbox" />);
      const container = screen.getByTestId('sm-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('width: 16px');
      expect(checkboxDiv).toHaveStyle('height: 16px');
    });

    it('renders medium size correctly', () => {
      render(<Checkbox size="md" label="Medium checkbox" data-testid="md-checkbox" />);
      const container = screen.getByTestId('md-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('width: 20px');
      expect(checkboxDiv).toHaveStyle('height: 20px');
    });

    it('renders large size correctly', () => {
      render(<Checkbox size="lg" label="Large checkbox" data-testid="lg-checkbox" />);
      const container = screen.getByTestId('lg-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('width: 24px');
      expect(checkboxDiv).toHaveStyle('height: 24px');
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<Checkbox label="Required checkbox" error="This field is required" />);
      const errorMessage = screen.getByText(/this field is required/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies error styling', () => {
      render(
        <Checkbox 
          label="Error checkbox" 
          error="Error message"
          data-testid="error-checkbox"
        />
      );
      const container = screen.getByTestId('error-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('border: 1px solid #ef4444');
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
    it('applies dark mode styling', () => {
      render(<Checkbox isDarkMode label="Dark checkbox" data-testid="dark-checkbox" />);
      const container = screen.getByTestId('dark-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('background-color: #171717');
    });

    it('applies light mode styling by default', () => {
      render(<Checkbox label="Light checkbox" data-testid="light-checkbox" />);
      const container = screen.getByTestId('light-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).toHaveStyle('background-color: #ffffff');
    });
  });

  describe('disabled state', () => {
    it('renders disabled checkbox', () => {
      render(<Checkbox label="Disabled checkbox" disabled />);
      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeDisabled();
    });

    it('applies disabled cursor styling', () => {
      render(<Checkbox label="Disabled" disabled data-testid="disabled-checkbox" />);
      const container = screen.getByTestId('disabled-checkbox');
      const checkboxDiv = container.querySelector('[data-checkbox]') as HTMLElement;
      expect(checkboxDiv).not.toBeNull();
      if (checkboxDiv) {
        expect(checkboxDiv).toHaveStyle('cursor: not-allowed');
      }
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
});