/**
 * Switch Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Switch } from './Switch';

describe('Switch Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    it('uses CSS classes instead of inline styles', () => {
      const { container } = render(<Switch size="md" />);
      const wrapper = container.querySelector('.mond-switch');
      expect(wrapper).toBeInTheDocument();
    });

    it('does not inject styles via style tag', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('style')).not.toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders switch input element', () => {
      render(<Switch data-testid="switch" />);
      expect(screen.getByTestId('switch')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Switch.displayName).toBe('Switch');
    });

    it('renders with label', () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('renders as unchecked by default', () => {
      render(<Switch data-testid="switch" />);
      expect(screen.getByTestId('switch')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      render(<Switch checked data-testid="switch" onChange={() => {}} />);
      expect(screen.getByTestId('switch')).toBeChecked();
    });

    it('uses defaultChecked for uncontrolled component', () => {
      render(<Switch defaultChecked data-testid="switch" />);
      expect(screen.getByTestId('switch')).toBeChecked();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<Switch size="sm" />);
      expect(container.querySelector('.mond-switch--sm')).toBeInTheDocument();
    });

    it('applies md size class (default)', () => {
      const { container } = render(<Switch size="md" />);
      expect(container.querySelector('.mond-switch--md')).toBeInTheDocument();
    });

    it('applies lg size class', () => {
      const { container } = render(<Switch size="lg" />);
      expect(container.querySelector('.mond-switch--lg')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('applies error class when error message provided', () => {
      const { container } = render(<Switch error="Required" />);
      expect(container.querySelector('.mond-switch--error')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<Switch label="Enable" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('error message has error styling class', () => {
      const { container } = render(<Switch label="Enable" error="Required" />);
      const message = container.querySelector('.mond-switch__message--error');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Switch label="Enable" helperText="Toggle to enable feature" />);
      expect(screen.getByText('Toggle to enable feature')).toBeInTheDocument();
    });

    it('helper text has helper styling class', () => {
      const { container } = render(<Switch label="Enable" helperText="Helper" />);
      const message = container.querySelector('.mond-switch__message--helper');
      expect(message).toBeInTheDocument();
    });

    it('error takes precedence over helper text', () => {
      render(<Switch label="Enable" error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Switch disabled data-testid="switch" />);
      expect(screen.getByTestId('switch')).toBeDisabled();
    });

    it('applies disabled class', () => {
      const { container } = render(<Switch disabled />);
      expect(container.querySelector('.mond-switch--disabled')).toBeInTheDocument();
    });
  });

  describe('Checked State', () => {
    it('applies checked class when checked', () => {
      const { container } = render(<Switch checked onChange={() => {}} />);
      expect(container.querySelector('.mond-switch--checked')).toBeInTheDocument();
    });

    it('does not apply checked class when unchecked', () => {
      const { container } = render(<Switch checked={false} onChange={() => {}} />);
      expect(container.querySelector('.mond-switch--checked')).not.toBeInTheDocument();
    });
  });

  describe('ReadOnly State', () => {
    it('applies readOnly attribute', () => {
      render(<Switch readOnly data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('readonly');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Switch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  describe('Label Association', () => {
    it('associates label with switch via id', () => {
      render(<Switch label="Enable feature" id="custom-id" />);
      const switchInput = screen.getByRole('checkbox');
      expect(switchInput).toHaveAttribute('id', 'custom-id');
      expect(screen.getByText('Enable feature')).toBeInTheDocument();
    });

    it('generates unique IDs when not provided', () => {
      render(
        <div>
          <Switch label="First" data-testid="switch-1" />
          <Switch label="Second" data-testid="switch-2" />
        </div>
      );
      const id1 = screen.getByTestId('switch-1').id;
      const id2 = screen.getByTestId('switch-2').id;
      expect(id1).not.toBe(id2);
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Switch onChange={handleChange} data-testid="switch" />);

      await user.click(screen.getByTestId('switch'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('handles onClick events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Switch onClick={handleClick} data-testid="switch" />);

      await user.click(screen.getByTestId('switch'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Switch disabled onChange={handleChange} data-testid="switch" />);

      await user.click(screen.getByTestId('switch'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('applies readOnly but onChange still fires (browser behavior)', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Switch readOnly onChange={handleChange} data-testid="switch" />);

      await user.click(screen.getByTestId('switch'));
      // Note: readonly attribute on checkboxes doesn't prevent onChange in browsers
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
