/**
 * Checkbox Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Checkbox } from './Checkbox';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Checkbox Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      const { container } = renderWithTheme(<Checkbox />);
      expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    it('uses styled-components theming', () => {
      const { container } = renderWithTheme(<Checkbox size="md" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders checkbox input element', () => {
      renderWithTheme(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Checkbox.displayName).toBe('Checkbox');
    });

    it('renders with label', () => {
      renderWithTheme(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders as unchecked by default', () => {
      renderWithTheme(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      renderWithTheme(<Checkbox checked data-testid="checkbox" onChange={() => {}} />);
      expect(screen.getByTestId('checkbox')).toBeChecked();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size data attribute', () => {
      const { container } = renderWithTheme(<Checkbox size="sm" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      const { container } = renderWithTheme(<Checkbox size="md" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      const { container } = renderWithTheme(<Checkbox size="lg" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Error State', () => {
    it('applies error data attribute when error message provided', () => {
      const { container } = renderWithTheme(<Checkbox error="Field is required" />);
      expect(container.firstChild).toHaveAttribute('data-error', 'true');
    });

    it('displays error message', () => {
      renderWithTheme(<Checkbox label="Accept" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('error message renders correctly', () => {
      renderWithTheme(<Checkbox label="Accept" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      renderWithTheme(<Checkbox label="Accept" helperText="Check to continue" />);
      expect(screen.getByText('Check to continue')).toBeInTheDocument();
    });

    it('helper text renders correctly', () => {
      renderWithTheme(<Checkbox label="Accept" helperText="Helper" />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });

    it('error takes precedence over helper text', () => {
      renderWithTheme(<Checkbox label="Accept" error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      renderWithTheme(<Checkbox disabled data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toBeDisabled();
    });

    it('applies disabled data attribute', () => {
      const { container } = renderWithTheme(<Checkbox disabled />);
      expect(container.firstChild).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('Indeterminate State', () => {
    it('sets indeterminate property on input element', () => {
      renderWithTheme(<Checkbox indeterminate data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('applies indeterminate data attribute', () => {
      const { container } = renderWithTheme(<Checkbox indeterminate />);
      expect(container.firstChild).toHaveAttribute('data-indeterminate', 'true');
    });

    it('updates indeterminate property when prop changes', () => {
      const { rerender } = renderWithTheme(<Checkbox indeterminate={false} data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(
        <ThemeProvider theme={defaultLightTheme}>
          <Checkbox indeterminate={true} data-testid="checkbox" />
        </ThemeProvider>
      );
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithTheme(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('supports indeterminate via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithTheme(<Checkbox ref={ref} indeterminate />);
      expect(ref.current?.indeterminate).toBe(true);
    });
  });

  describe('Label Association', () => {
    it('associates label with checkbox via id', () => {
      renderWithTheme(<Checkbox label="Accept terms" id="custom-id" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('generates unique IDs when not provided', () => {
      renderWithTheme(
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
      renderWithTheme(<Checkbox onChange={handleChange} data-testid="checkbox" />);

      await user.click(screen.getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithTheme(<Checkbox disabled onChange={handleChange} data-testid="checkbox" />);

      await user.click(screen.getByTestId('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to container', () => {
      const { container } = renderWithTheme(<Checkbox className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
