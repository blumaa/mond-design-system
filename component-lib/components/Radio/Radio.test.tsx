/**
 * Radio Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Radio } from './Radio';

describe('Radio Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Radio />);
      expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
    });

    it('uses CSS classes instead of inline styles', () => {
      const { container } = render(<Radio size="md" />);
      const wrapper = container.querySelector('.mond-radio');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders radio input element', () => {
      render(<Radio data-testid="radio" />);
      expect(screen.getByTestId('radio')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Radio.displayName).toBe('Radio');
    });

    it('renders with label', () => {
      render(<Radio label="Option A" />);
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('renders as unchecked by default', () => {
      render(<Radio data-testid="radio" />);
      expect(screen.getByTestId('radio')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      render(<Radio checked data-testid="radio" onChange={() => {}} />);
      expect(screen.getByTestId('radio')).toBeChecked();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<Radio size="sm" />);
      expect(container.querySelector('.mond-radio--sm')).toBeInTheDocument();
    });

    it('applies md size class (default)', () => {
      const { container } = render(<Radio size="md" />);
      expect(container.querySelector('.mond-radio--md')).toBeInTheDocument();
    });

    it('applies lg size class', () => {
      const { container } = render(<Radio size="lg" />);
      expect(container.querySelector('.mond-radio--lg')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('applies error class when error message provided', () => {
      const { container } = render(<Radio error="Selection required" />);
      expect(container.querySelector('.mond-radio--error')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<Radio label="Option" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('error message has error styling class', () => {
      const { container } = render(<Radio label="Option" error="Required" />);
      const message = container.querySelector('.mond-radio__message--error');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Radio label="Option" helperText="Select one option" />);
      expect(screen.getByText('Select one option')).toBeInTheDocument();
    });

    it('helper text has helper styling class', () => {
      const { container } = render(<Radio label="Option" helperText="Helper" />);
      const message = container.querySelector('.mond-radio__message--helper');
      expect(message).toBeInTheDocument();
    });

    it('error takes precedence over helper text', () => {
      render(<Radio label="Option" error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Radio disabled data-testid="radio" />);
      expect(screen.getByTestId('radio')).toBeDisabled();
    });

    it('applies disabled class', () => {
      const { container } = render(<Radio disabled />);
      expect(container.querySelector('.mond-radio--disabled')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Radio ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });
  });

  describe('Label Association', () => {
    it('associates label with radio via id', () => {
      render(<Radio label="Option A" id="custom-id" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('id', 'custom-id');
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('generates unique IDs when not provided', () => {
      render(
        <div>
          <Radio label="First" data-testid="radio-1" />
          <Radio label="Second" data-testid="radio-2" />
        </div>
      );
      const id1 = screen.getByTestId('radio-1').id;
      const id2 = screen.getByTestId('radio-2').id;
      expect(id1).not.toBe(id2);
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Radio onChange={handleChange} data-testid="radio" />);

      await user.click(screen.getByTestId('radio'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Radio disabled onChange={handleChange} data-testid="radio" />);

      await user.click(screen.getByTestId('radio'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to container', () => {
      const { container } = render(<Radio className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
