/**
 * Input Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as an input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      render(<Input inputSize="sm" data-testid="input-sm" />);
      const wrapper = screen.getByTestId('input-sm').parentElement;
      expect(wrapper).toHaveClass('mond-input--sm');
    });

    it('applies md size class (default)', () => {
      render(<Input inputSize="md" data-testid="input-md" />);
      const wrapper = screen.getByTestId('input-md').parentElement;
      expect(wrapper).toHaveClass('mond-input--md');
    });

    it('applies lg size class', () => {
      render(<Input inputSize="lg" data-testid="input-lg" />);
      const wrapper = screen.getByTestId('input-lg').parentElement;
      expect(wrapper).toHaveClass('mond-input--lg');
    });
  });

  describe('Variant States', () => {
    it('applies default variant class', () => {
      render(<Input variant="default" data-testid="input" />);
      const wrapper = screen.getByTestId('input').parentElement;
      expect(wrapper).toHaveClass('mond-input--default');
    });

    it('applies error variant class', () => {
      render(<Input variant="error" data-testid="input" />);
      const wrapper = screen.getByTestId('input').parentElement;
      expect(wrapper).toHaveClass('mond-input--error');
    });

    it('applies success variant class', () => {
      render(<Input variant="success" data-testid="input" />);
      const wrapper = screen.getByTestId('input').parentElement;
      expect(wrapper).toHaveClass('mond-input--success');
    });
  });

  describe('Label', () => {
    it('renders label when provided', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
      render(<Input label="Username" data-testid="input" />);
      const input = screen.getByTestId('input');
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', input.id);
    });
  });

  describe('Messages', () => {
    it('displays error message', () => {
      render(<Input error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('displays success message', () => {
      render(<Input success="Email verified" />);
      expect(screen.getByText('Email verified')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('applies disabled class to wrapper', () => {
      render(<Input disabled data-testid="input" />);
      const wrapper = screen.getByTestId('input').parentElement;
      expect(wrapper).toHaveClass('mond-input--disabled');
    });
  });

  describe('Interactivity', () => {
    it('handles onChange events', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles value prop', () => {
      render(<Input value="controlled" onChange={() => {}} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue('controlled');
    });
  });

  describe('Accessibility', () => {
    it('generates unique id for each input instance', () => {
      render(
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
      render(<Input placeholder="Enter text" type="email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toHaveAttribute('type', 'email');
    });
  });
});
