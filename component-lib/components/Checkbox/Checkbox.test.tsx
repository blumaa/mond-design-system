/**
 * Checkbox Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';

describe('Checkbox Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Checkbox />);
      expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    it('uses CSS classes instead of inline styles', () => {
      const { container } = render(<Checkbox size="md" />);
      const wrapper = container.querySelector('.mond-checkbox');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders checkbox input element', () => {
      render(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Checkbox.displayName).toBe('Checkbox');
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders as unchecked by default', () => {
      render(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      render(<Checkbox checked data-testid="checkbox" onChange={() => {}} />);
      expect(screen.getByTestId('checkbox')).toBeChecked();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<Checkbox size="sm" />);
      expect(container.querySelector('.mond-checkbox--sm')).toBeInTheDocument();
    });

    it('applies md size class (default)', () => {
      const { container } = render(<Checkbox size="md" />);
      expect(container.querySelector('.mond-checkbox--md')).toBeInTheDocument();
    });

    it('applies lg size class', () => {
      const { container } = render(<Checkbox size="lg" />);
      expect(container.querySelector('.mond-checkbox--lg')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('applies error class when error message provided', () => {
      const { container } = render(<Checkbox error="Field is required" />);
      expect(container.querySelector('.mond-checkbox--error')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<Checkbox label="Accept" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('error message has error styling class', () => {
      const { container } = render(<Checkbox label="Accept" error="Required" />);
      const message = container.querySelector('.mond-checkbox__message--error');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Checkbox label="Accept" helperText="Check to continue" />);
      expect(screen.getByText('Check to continue')).toBeInTheDocument();
    });

    it('helper text has helper styling class', () => {
      const { container } = render(<Checkbox label="Accept" helperText="Helper" />);
      const message = container.querySelector('.mond-checkbox__message--helper');
      expect(message).toBeInTheDocument();
    });

    it('error takes precedence over helper text', () => {
      render(<Checkbox label="Accept" error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Checkbox disabled data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toBeDisabled();
    });

    it('applies disabled class', () => {
      const { container } = render(<Checkbox disabled />);
      expect(container.querySelector('.mond-checkbox--disabled')).toBeInTheDocument();
    });
  });

  describe('Indeterminate State', () => {
    it('sets indeterminate property on input element', () => {
      render(<Checkbox indeterminate data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('applies indeterminate class', () => {
      const { container } = render(<Checkbox indeterminate />);
      expect(container.querySelector('.mond-checkbox--indeterminate')).toBeInTheDocument();
    });

    it('updates indeterminate property when prop changes', () => {
      const { rerender } = render(<Checkbox indeterminate={false} data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox indeterminate={true} data-testid="checkbox" />);
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('supports indeterminate via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} indeterminate />);
      expect(ref.current?.indeterminate).toBe(true);
    });
  });

  describe('Label Association', () => {
    it('associates label with checkbox via id', () => {
      render(<Checkbox label="Accept terms" id="custom-id" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('generates unique IDs when not provided', () => {
      render(
        <div>
          <Checkbox label="First" data-testid="checkbox-1" />
          <Checkbox label="Second" data-testid="checkbox-2" />
        </div>
      );
      const id1 = screen.getByTestId('checkbox-1').id;
      const id2 = screen.getByTestId('checkbox-2').id;
      expect(id1).not.toBe(id2);
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Checkbox onChange={handleChange} data-testid="checkbox" />);

      await user.click(screen.getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Checkbox disabled onChange={handleChange} data-testid="checkbox" />);

      await user.click(screen.getByTestId('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to container', () => {
      const { container } = render(<Checkbox className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
