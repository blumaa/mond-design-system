/**
 * Input Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../src/themes';
import { Input } from './Input';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Input Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('uses styled-components theming', () => {
      const { container } = renderWithTheme(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as an input element', () => {
      renderWithTheme(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size data attribute', () => {
      renderWithTheme(<Input inputSize="sm" data-testid="input-sm" />);
      const input = screen.getByTestId('input-sm');
      expect(input).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      renderWithTheme(<Input inputSize="md" data-testid="input-md" />);
      const input = screen.getByTestId('input-md');
      expect(input).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      renderWithTheme(<Input inputSize="lg" data-testid="input-lg" />);
      const input = screen.getByTestId('input-lg');
      expect(input).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Variant States', () => {
    it('applies default variant data attribute', () => {
      renderWithTheme(<Input variant="default" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-variant', 'default');
    });

    it('applies error variant data attribute', () => {
      renderWithTheme(<Input variant="error" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-variant', 'error');
    });

    it('applies success variant data attribute', () => {
      renderWithTheme(<Input variant="success" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-variant', 'success');
    });
  });

  describe('Label', () => {
    it('renders label when provided', () => {
      renderWithTheme(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
      renderWithTheme(<Input label="Username" data-testid="input" />);
      const input = screen.getByTestId('input');
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', input.id);
    });
  });

  describe('Messages', () => {
    it('displays error message', () => {
      renderWithTheme(<Input error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('displays success message', () => {
      renderWithTheme(<Input success="Email verified" />);
      expect(screen.getByText('Email verified')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      renderWithTheme(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      renderWithTheme(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('maintains data attributes when disabled', () => {
      renderWithTheme(<Input disabled inputSize="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Interactivity', () => {
    it('handles onChange events', () => {
      const handleChange = jest.fn();
      renderWithTheme(<Input onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles value prop', () => {
      renderWithTheme(<Input value="controlled" onChange={() => {}} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue('controlled');
    });
  });

  describe('Accessibility', () => {
    it('generates unique id for each input instance', () => {
      renderWithTheme(
        <div>
          <Input data-testid="input-1" />
          <Input data-testid="input-2" />
        </div>
      );
      const id1 = screen.getByTestId('input-1').id;
      const id2 = screen.getByTestId('input-2').id;

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('forwards standard input attributes', () => {
      renderWithTheme(<Input placeholder="Enter text" type="email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toHaveAttribute('type', 'email');
    });
  });
});
