import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renders the textarea with correct placeholder', () => {
    render(<Textarea placeholder="Enter text" />);
    const textareaElement = screen.getByPlaceholderText(/enter text/i);
    expect(textareaElement).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    const labelElement = screen.getByText(/description/i);
    const textareaElement = screen.getByPlaceholderText(/enter description/i);
    
    expect(labelElement).toBeInTheDocument();
    expect(textareaElement).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(
      <Textarea 
        placeholder="Enter text" 
        onChange={handleChange}
        data-testid="textarea-input"
      />
    );
    
    const textareaElement = screen.getByTestId('textarea-input');
    fireEvent.change(textareaElement, { target: { value: 'Hello world' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Textarea textareaSize="sm" data-testid="sm-textarea" />);
      const textareaElement = screen.getByTestId('sm-textarea');
      expect(textareaElement).toHaveStyle('font-size: 0.875rem');
    });

    it('renders medium size correctly', () => {
      render(<Textarea textareaSize="md" data-testid="md-textarea" />);
      const textareaElement = screen.getByTestId('md-textarea');
      expect(textareaElement).toHaveStyle('font-size: 1rem');
    });

    it('renders large size correctly', () => {
      render(<Textarea textareaSize="lg" data-testid="lg-textarea" />);
      const textareaElement = screen.getByTestId('lg-textarea');
      expect(textareaElement).toHaveStyle('font-size: 1.125rem');
    });
  });

  describe('variants', () => {
    it('renders error variant with error styling', () => {
      render(
        <Textarea 
          variant="error" 
          error="Error message"
          data-testid="error-textarea" 
        />
      );
      const textareaElement = screen.getByTestId('error-textarea');
      const errorMessage = screen.getByText(/error message/i);
      
      expect(textareaElement).toHaveStyle('border: 1px solid #ef4444');
      expect(errorMessage).toBeInTheDocument();
    });

    it('renders success variant with success styling', () => {
      render(
        <Textarea 
          variant="success" 
          success="Success message"
          data-testid="success-textarea" 
        />
      );
      const textareaElement = screen.getByTestId('success-textarea');
      const successMessage = screen.getByText(/success message/i);
      
      expect(textareaElement).toHaveStyle('border: 1px solid #22c55e');
      expect(successMessage).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling when isDarkMode is true', () => {
      render(<Textarea isDarkMode={true} data-testid="dark-textarea" />);
      const textareaElement = screen.getByTestId('dark-textarea');
      
      expect(textareaElement).toHaveStyle('background-color: #171717');
    });

    it('applies light mode styling by default', () => {
      render(<Textarea data-testid="light-textarea" />);
      const textareaElement = screen.getByTestId('light-textarea');
      
      expect(textareaElement).toHaveStyle('background-color: #ffffff');
    });
  });

  describe('accessibility', () => {
    it('associates label with textarea using htmlFor and id', () => {
      render(<Textarea label="Message" id="message-textarea" />);
      const labelElement = screen.getByText(/message/i);
      const textareaElement = screen.getByRole('textbox');
      
      expect(labelElement).toHaveAttribute('for', 'message-textarea');
      expect(textareaElement).toHaveAttribute('id', 'message-textarea');
    });

    it('supports helper text', () => {
      render(<Textarea helperText="This is helper text" />);
      const helperText = screen.getByText(/this is helper text/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('focus states', () => {
    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(
        <Textarea 
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid="focus-textarea"
        />
      );
      
      const textareaElement = screen.getByTestId('focus-textarea');
      
      fireEvent.focus(textareaElement);
      expect(handleFocus).toHaveBeenCalled();
      
      fireEvent.blur(textareaElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  it('supports custom rows prop', () => {
    render(<Textarea rows={6} data-testid="custom-rows" />);
    const textareaElement = screen.getByTestId('custom-rows');
    expect(textareaElement).toHaveAttribute('rows', '6');
  });

  it('supports disabled state', () => {
    render(<Textarea disabled data-testid="disabled-textarea" />);
    const textareaElement = screen.getByTestId('disabled-textarea');
    expect(textareaElement).toBeDisabled();
  });
});