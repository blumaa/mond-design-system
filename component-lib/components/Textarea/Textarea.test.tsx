import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renders with label and placeholder', () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    const labelElement = screen.getByText(/description/i);
    const textareaElement = screen.getByPlaceholderText(/enter description/i);

    expect(labelElement).toBeInTheDocument();
    expect(textareaElement).toBeInTheDocument();
  });

  it('handles value changes, focus, and blur events', () => {
    const handleChange = jest.fn();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Textarea
        placeholder="Enter text"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="textarea-input"
      />
    );

    const textareaElement = screen.getByTestId('textarea-input');

    fireEvent.change(textareaElement, { target: { value: 'Hello world' } });
    expect(handleChange).toHaveBeenCalled();

    fireEvent.focus(textareaElement);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(textareaElement);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('applies size variants using rerender', () => {
    const { rerender } = render(<Textarea textareaSize="sm" data-testid="textarea" />);
    let textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveClass('mond-textarea--sm');

    rerender(<Textarea textareaSize="md" data-testid="textarea" />);
    textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveClass('mond-textarea--md');

    rerender(<Textarea textareaSize="lg" data-testid="textarea" />);
    textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveClass('mond-textarea--lg');
  });

  it('renders error and success variants', () => {
    const { rerender } = render(
      <Textarea
        variant="error"
        error="Error message"
        data-testid="textarea"
      />
    );
    let textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveClass('mond-textarea--error');
    expect(screen.getByText(/error message/i)).toBeInTheDocument();

    rerender(
      <Textarea
        variant="success"
        success="Success message"
        data-testid="textarea"
      />
    );
    textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveClass('mond-textarea--success');
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
  });

  it('associates label with textarea and supports helper text', () => {
    render(<Textarea label="Message" id="message-textarea" helperText="This is helper text" />);
    const labelElement = screen.getByText(/message/i);
    const textareaElement = screen.getByRole('textbox');

    expect(labelElement).toHaveAttribute('for', 'message-textarea');
    expect(textareaElement).toHaveAttribute('id', 'message-textarea');
    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();
  });

  it('supports custom rows and disabled state', () => {
    const { rerender } = render(<Textarea rows={6} data-testid="textarea" />);
    let textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toHaveAttribute('rows', '6');

    rerender(<Textarea disabled data-testid="textarea" />);
    textareaElement = screen.getByTestId('textarea');
    expect(textareaElement).toBeDisabled();
  });
});
