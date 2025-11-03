/**
 * Radio Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../src/themes';
import { Radio } from './Radio';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Radio Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      const { container } = renderWithTheme(<Radio />);
      expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
    });

    it('uses styled-components theming', () => {
      const { container } = renderWithTheme(<Radio size="md" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders radio input element', () => {
      renderWithTheme(<Radio data-testid="radio" />);
      expect(screen.getByTestId('radio')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Radio.displayName).toBe('Radio');
    });

    it('renders with label', () => {
      renderWithTheme(<Radio label="Option A" />);
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('renders as unchecked by default', () => {
      renderWithTheme(<Radio data-testid="radio" />);
      expect(screen.getByTestId('radio')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      renderWithTheme(<Radio checked data-testid="radio" onChange={() => {}} />);
      expect(screen.getByTestId('radio')).toBeChecked();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size data attribute', () => {
      const { container } = renderWithTheme(<Radio size="sm" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      const { container } = renderWithTheme(<Radio size="md" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      const { container } = renderWithTheme(<Radio size="lg" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Error State', () => {
    it('applies error data attribute when error message provided', () => {
      const { container } = renderWithTheme(<Radio error="Selection required" />);
      expect(container.firstChild).toHaveAttribute('data-error', 'true');
    });

    it('displays error message', () => {
      renderWithTheme(<Radio label="Option" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('error message renders correctly', () => {
      renderWithTheme(<Radio label="Option" error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      renderWithTheme(<Radio label="Option" helperText="Select one option" />);
      expect(screen.getByText('Select one option')).toBeInTheDocument();
    });

    it('helper text renders correctly', () => {
      renderWithTheme(<Radio label="Option" helperText="Helper" />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });

    it('error takes precedence over helper text', () => {
      renderWithTheme(<Radio label="Option" error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      renderWithTheme(<Radio disabled data-testid="radio" />);
      expect(screen.getByTestId('radio')).toBeDisabled();
    });

    it('applies disabled data attribute', () => {
      const { container } = renderWithTheme(<Radio disabled />);
      expect(container.firstChild).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithTheme(<Radio ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });
  });

  describe('Label Association', () => {
    it('associates label with radio via id', () => {
      renderWithTheme(<Radio label="Option A" id="custom-id" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('id', 'custom-id');
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('generates unique IDs when not provided', () => {
      renderWithTheme(
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
      renderWithTheme(<Radio onChange={handleChange} data-testid="radio" />);

      await user.click(screen.getByTestId('radio'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithTheme(<Radio disabled onChange={handleChange} data-testid="radio" />);

      await user.click(screen.getByTestId('radio'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to container', () => {
      const { container } = renderWithTheme(<Radio className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
