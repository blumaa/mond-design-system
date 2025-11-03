/**
 * Textarea Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Textarea } from './Textarea';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Textarea Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      const { container } = renderWithTheme(<Textarea />);
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('uses styled-components theming', () => {
      const { container } = renderWithTheme(<Textarea textareaSize="md" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders textarea element', () => {
      renderWithTheme(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Textarea.displayName).toBe('Textarea');
    });

    it('renders with label', () => {
      renderWithTheme(<Textarea label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders with default rows', () => {
      renderWithTheme(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('renders with custom rows', () => {
      renderWithTheme(<Textarea rows={8} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '8');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size data attribute', () => {
      renderWithTheme(<Textarea textareaSize="sm" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      renderWithTheme(<Textarea textareaSize="md" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      renderWithTheme(<Textarea textareaSize="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Variant States', () => {
    it('applies default variant data attribute', () => {
      renderWithTheme(<Textarea variant="default" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-variant', 'default');
    });

    it('applies error variant when error message provided', () => {
      renderWithTheme(<Textarea error="Field is required" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-variant', 'error');
    });

    it('applies success variant when success message provided', () => {
      renderWithTheme(<Textarea success="Looks good!" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-variant', 'success');
    });

    it('error takes precedence over success', () => {
      renderWithTheme(<Textarea error="Error" success="Success" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-variant', 'error');
    });
  });

  describe('Messages', () => {
    it('displays error message', () => {
      renderWithTheme(<Textarea error="Field is required" />);
      expect(screen.getByText('Field is required')).toBeInTheDocument();
    });

    it('displays success message', () => {
      renderWithTheme(<Textarea success="Looks good!" />);
      expect(screen.getByText('Looks good!')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      renderWithTheme(<Textarea helperText="Max 500 characters" />);
      expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('error message renders correctly', () => {
      renderWithTheme(<Textarea error="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('success message renders correctly', () => {
      renderWithTheme(<Textarea success="Success" />);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('helper text renders correctly', () => {
      renderWithTheme(<Textarea helperText="Helper" />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      renderWithTheme(<Textarea disabled data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('maintains data attributes when disabled', () => {
      renderWithTheme(<Textarea disabled textareaSize="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      renderWithTheme(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Label Association', () => {
    it('associates label with textarea via id', () => {
      renderWithTheme(<Textarea label="Description" id="custom-id" />);
      const label = screen.getByText('Description');
      const textarea = screen.getByLabelText('Description');
      expect(label).toHaveAttribute('for', 'custom-id');
      expect(textarea).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique IDs when not provided', () => {
      renderWithTheme(
        <div>
          <Textarea label="First" data-testid="textarea-1" />
          <Textarea label="Second" data-testid="textarea-2" />
        </div>
      );
      const id1 = screen.getByTestId('textarea-1').id;
      const id2 = screen.getByTestId('textarea-2').id;
      expect(id1).not.toBe(id2);
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to textarea field', () => {
      renderWithTheme(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
    });
  });
});
