import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent } from '../../test-utils';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders the input with correct placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText(/enter text/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('renders with a label when provided', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    const labelElement = screen.getByText(/email/i);
    const inputElement = screen.getByLabelText(/email/i);
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="This is helper text" />);
    const helperElement = screen.getByText(/this is helper text/i);
    expect(helperElement).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Input error="This field is required" />);
    const errorElement = screen.getByText(/this field is required/i);
    expect(errorElement).toBeInTheDocument();
  });

  it('displays success message when provided', () => {
    render(<Input success="Looks good!" />);
    const successElement = screen.getByText(/looks good!/i);
    expect(successElement).toBeInTheDocument();
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    const inputElement = screen.getByPlaceholderText(/type here/i);
    
    fireEvent.change(inputElement, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus and onBlur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus test" 
      />
    );
    
    const inputElement = screen.getByPlaceholderText(/focus test/i);
    
    fireEvent.focus(inputElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('applies disabled attribute correctly', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const inputElement = screen.getByPlaceholderText(/disabled input/i);
    expect(inputElement).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<Input inputSize="sm" data-testid="small-input" />);
      const inputElement = screen.getByTestId('small-input');
      expect(inputElement).toHaveClass('mond-input--sm');
    });

    it('applies medium size styles by default', () => {
      render(<Input data-testid="medium-input" />);
      const inputElement = screen.getByTestId('medium-input');
      expect(inputElement).toHaveClass('mond-input--md');
    });

    it('applies large size styles', () => {
      render(<Input inputSize="lg" data-testid="large-input" />);
      const inputElement = screen.getByTestId('large-input');
      expect(inputElement).toHaveClass('mond-input--lg');
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<Input variant="default" data-testid="default-input" />);
      const inputElement = screen.getByTestId('default-input');
      // Check that it has the base class (default variant doesn't add additional class)
      expect(inputElement).toHaveClass('mond-input');
      expect(inputElement).not.toHaveClass('mond-input--error');
      expect(inputElement).not.toHaveClass('mond-input--success');
    });

    it('renders error variant with error styling', () => {
      render(
        <Input
          variant="error"
          error="Error message"
          data-testid="error-input"
        />
      );
      const inputElement = screen.getByTestId('error-input');
      const errorMessage = screen.getByText(/error message/i);

      expect(inputElement).toHaveClass('mond-input--error');
      expect(errorMessage).toBeInTheDocument();
    });

    it('renders success variant with success styling', () => {
      render(
        <Input
          variant="success"
          success="Success message"
          data-testid="success-input"
        />
      );
      const inputElement = screen.getByTestId('success-input');
      const successMessage = screen.getByText(/success message/i);

      expect(inputElement).toHaveClass('mond-input--success');
      expect(successMessage).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling when is true', () => {
      const { container } = renderWithDarkMode(<Input data-testid="dark-input" />);
      const inputElement = screen.getByTestId('dark-input');

      // Check that the component renders and has base class
      expect(inputElement).toHaveClass('mond-input');
      // Dark mode is controlled by data-theme attribute on a parent element
      expect(container.querySelector('[data-theme="dark"]')).toBeInTheDocument();
    });

    it('applies light mode styling by default', () => {
      render(<Input data-testid="light-input" />);
      const inputElement = screen.getByTestId('light-input');

      // Check that it has the base class (light mode is default via CSS variables)
      expect(inputElement).toHaveClass('mond-input');
    });
  });
});
