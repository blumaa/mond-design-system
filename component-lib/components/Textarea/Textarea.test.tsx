/**
 * Textarea Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from './Textarea';

describe('Textarea Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Textarea />);
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('uses CSS classes instead of inline styles', () => {
      const { container } = render(<Textarea textareaSize="md" />);
      const wrapper = container.querySelector('.mond-textarea-container');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Textarea.displayName).toBe('Textarea');
    });

    it('renders with label', () => {
      render(<Textarea label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders with default rows', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('renders with custom rows', () => {
      render(<Textarea rows={8} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '8');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<Textarea textareaSize="sm" />);
      expect(container.querySelector('.mond-textarea--sm')).toBeInTheDocument();
    });

    it('applies md size class (default)', () => {
      const { container } = render(<Textarea textareaSize="md" />);
      expect(container.querySelector('.mond-textarea--md')).toBeInTheDocument();
    });

    it('applies lg size class', () => {
      const { container } = render(<Textarea textareaSize="lg" />);
      expect(container.querySelector('.mond-textarea--lg')).toBeInTheDocument();
    });
  });

  describe('Variant States', () => {
    it('applies default variant class', () => {
      const { container } = render(<Textarea variant="default" />);
      expect(container.querySelector('.mond-textarea--default')).toBeInTheDocument();
    });

    it('applies error variant when error message provided', () => {
      const { container } = render(<Textarea error="Field is required" />);
      expect(container.querySelector('.mond-textarea--error')).toBeInTheDocument();
    });

    it('applies success variant when success message provided', () => {
      const { container } = render(<Textarea success="Looks good!" />);
      expect(container.querySelector('.mond-textarea--success')).toBeInTheDocument();
    });

    it('error takes precedence over success', () => {
      const { container } = render(<Textarea error="Error" success="Success" />);
      expect(container.querySelector('.mond-textarea--error')).toBeInTheDocument();
      expect(container.querySelector('.mond-textarea--success')).not.toBeInTheDocument();
    });
  });

  describe('Messages', () => {
    it('displays error message', () => {
      render(<Textarea error="Field is required" />);
      expect(screen.getByText('Field is required')).toBeInTheDocument();
    });

    it('displays success message', () => {
      render(<Textarea success="Looks good!" />);
      expect(screen.getByText('Looks good!')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      render(<Textarea helperText="Max 500 characters" />);
      expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('error message has error styling class', () => {
      const { container } = render(<Textarea error="Error" />);
      const message = container.querySelector('.mond-textarea__message--error');
      expect(message).toBeInTheDocument();
    });

    it('success message has success styling class', () => {
      const { container } = render(<Textarea success="Success" />);
      const message = container.querySelector('.mond-textarea__message--success');
      expect(message).toBeInTheDocument();
    });

    it('helper text has helper styling class', () => {
      const { container } = render(<Textarea helperText="Helper" />);
      const message = container.querySelector('.mond-textarea__message--helper');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Textarea disabled data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('applies disabled class to wrapper', () => {
      const { container } = render(<Textarea disabled />);
      expect(container.querySelector('.mond-textarea--disabled')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Label Association', () => {
    it('associates label with textarea via id', () => {
      render(<Textarea label="Description" id="custom-id" />);
      const label = screen.getByText('Description');
      const textarea = screen.getByLabelText('Description');
      expect(label).toHaveAttribute('for', 'custom-id');
      expect(textarea).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique IDs when not provided', () => {
      render(
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
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('mond-textarea__field');
    });
  });
});
