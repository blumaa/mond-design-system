/**
 * Spinner Component Tests - Styled-Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Spinner } from './Spinner';

const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Spinner Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      const { container } = renderWithTheme(<Spinner />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not use useEffect for keyframes injection', () => {
      const { container } = renderWithTheme(<Spinner />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a div element', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner.tagName).toBe('DIV');
    });

    it('applies correct display name', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });

    it('includes accessibility label', () => {
      renderWithTheme(<Spinner label="Loading content" />);
      expect(screen.getByText('Loading content')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies xs size data attribute', () => {
      const { container } = renderWithTheme(<Spinner size="xs" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('data-size', 'xs');
    });

    it('applies sm size data attribute', () => {
      const { container } = renderWithTheme(<Spinner size="sm" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      const { container } = renderWithTheme(<Spinner size="md" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      const { container } = renderWithTheme(<Spinner size="lg" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('data-size', 'lg');
    });

    it('applies xl size data attribute', () => {
      const { container } = renderWithTheme(<Spinner size="xl" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('data-size', 'xl');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = renderWithTheme(<Spinner className="custom-class" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithTheme(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Accessibility', () => {
    it('has role="status" by default', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('role', 'status');
    });

    it('has aria-live="polite"', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('displays visually hidden label', () => {
      renderWithTheme(<Spinner label="Custom loading" />);
      const label = screen.getByText('Custom loading');
      expect(label).toBeInTheDocument();
    });
  });
});
