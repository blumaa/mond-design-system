/**
 * Spinner Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Spinner } from './Spinner';

describe('Spinner Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Spinner />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not use useEffect for keyframes injection', () => {
      const { container } = render(<Spinner />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a div element', () => {
      const { container } = render(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner.tagName).toBe('DIV');
    });

    it('applies correct display name', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });

    it('includes accessibility label', () => {
      render(<Spinner label="Loading content" />);
      expect(screen.getByText('Loading content')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies xs size class', () => {
      const { container } = render(<Spinner size="xs" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner--xs');
    });

    it('applies sm size class', () => {
      const { container } = render(<Spinner size="sm" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner--sm');
    });

    it('applies md size class (default)', () => {
      const { container } = render(<Spinner size="md" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner--md');
    });

    it('applies lg size class', () => {
      const { container } = render(<Spinner size="lg" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner--lg');
    });

    it('applies xl size class', () => {
      const { container } = render(<Spinner size="xl" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner--xl');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base class', () => {
      const { container } = render(<Spinner className="custom-class" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('mond-spinner');
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Accessibility', () => {
    it('has role="status" by default', () => {
      const { container } = render(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('role', 'status');
    });

    it('has aria-live="polite"', () => {
      const { container } = render(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('displays visually hidden label', () => {
      render(<Spinner label="Custom loading" />);
      const label = screen.getByText('Custom loading');
      expect(label).toHaveClass('mond-spinner__label');
    });
  });
});
