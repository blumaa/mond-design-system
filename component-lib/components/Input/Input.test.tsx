import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders with label and placeholder', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    const labelElement = screen.getByText(/email/i);
    const inputElement = screen.getByLabelText(/email/i);
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it('displays helper, error, and success messages', () => {
    const { rerender } = render(<Input helperText="This is helper text" />);
    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();

    rerender(<Input error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();

    rerender(<Input success="Looks good!" />);
    expect(screen.getByText(/looks good!/i)).toBeInTheDocument();
  });

  it('handles onChange, onFocus, and onBlur events', () => {
    const handleChange = jest.fn();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Event test"
      />
    );

    const inputElement = screen.getByPlaceholderText(/event test/i);

    fireEvent.change(inputElement, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);

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

  it('applies size and variant styles using rerender', () => {
    const { rerender } = render(<Input inputSize="sm" data-testid="input" />);
    let inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('mond-input--sm');

    rerender(<Input inputSize="lg" data-testid="input" />);
    inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('mond-input--lg');

    rerender(<Input variant="error" error="Error" data-testid="input" />);
    inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('mond-input--error');

    rerender(<Input variant="success" success="Success" data-testid="input" />);
    inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('mond-input--success');
  });
});
