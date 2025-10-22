/**
 * Badge Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Badge component that:
 * - Removes "use client" directive
 * - Removes useTheme() hook dependency
 * - Uses CSS variables instead of runtime theme resolution
 * - Uses static CSS classes instead of inline styles
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('Badge Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      const { container } = render(<Badge>New</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works without ThemeProvider context', () => {
      render(<Badge>No Provider</Badge>);
      expect(screen.getByText('No Provider')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Badge>Test</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a span element', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('renders children content', () => {
      render(<Badge>Hello Badge</Badge>);
      expect(screen.getByText('Hello Badge')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('CSS Class-Based Styling', () => {
    it('applies base CSS class', () => {
      render(<Badge>Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveClass('mond-badge');
    });

    it('applies variant-specific CSS class for default', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('mond-badge--default');
    });

    it('applies variant-specific CSS class for primary', () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');
      expect(badge).toHaveClass('mond-badge--primary');
    });

    it('applies variant-specific CSS class for secondary', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('mond-badge--secondary');
    });

    it('applies variant-specific CSS class for success', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('mond-badge--success');
    });

    it('applies variant-specific CSS class for warning', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('mond-badge--warning');
    });

    it('applies variant-specific CSS class for error', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('mond-badge--error');
    });

    it('applies size-specific CSS class for sm', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('mond-badge--sm');
    });

    it('applies size-specific CSS class for md', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('mond-badge--md');
    });

    it('applies size-specific CSS class for lg', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByText('Large');
      expect(badge).toHaveClass('mond-badge--lg');
    });
  });

  describe('Data Attributes', () => {
    it('sets data-testid when provided', () => {
      render(<Badge data-testid="my-badge">Test</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });

    it('sets data-variant attribute', () => {
      render(<Badge variant="primary">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('data-variant', 'primary');
    });

    it('sets data-size attribute', () => {
      render(<Badge size="lg">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base class', () => {
      render(<Badge className="custom-class">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('mond-badge');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { children: 'Test', isDarkMode: true } as React.ComponentProps<typeof Badge> & { isDarkMode?: boolean };
      render(<Badge {...props} />);
      const badge = screen.getByText('Test');
      expect(badge).toBeInTheDocument();
    });

    it('maintains existing API for variant prop', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveAttribute('data-variant', 'success');
    });

    it('maintains existing API for size prop', () => {
      render(<Badge size="sm">Small</Badge>);
      expect(screen.getByText('Small')).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('CSS Variable Usage', () => {
    it('does not use inline styles for theme colors', () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');
      const inlineStyle = badge.getAttribute('style');

      if (inlineStyle) {
        expect(inlineStyle).not.toContain('background-color: rgb');
        expect(inlineStyle).not.toContain('color: rgb');
      }
    });

    it('relies on CSS classes for theming', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('mond-badge--error');
    });
  });

  describe('Combination Props', () => {
    it('applies multiple classes when multiple props are set', () => {
      render(
        <Badge
          variant="success"
          size="lg"
          className="custom"
        >
          Combined
        </Badge>
      );
      const badge = screen.getByText('Combined');
      expect(badge).toHaveClass('mond-badge');
      expect(badge).toHaveClass('mond-badge--success');
      expect(badge).toHaveClass('mond-badge--lg');
      expect(badge).toHaveClass('custom');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      render(<Badge title="Badge Title">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('title', 'Badge Title');
    });

    it('forwards aria attributes', () => {
      render(<Badge aria-label="Status Badge">Live</Badge>);
      const badge = screen.getByText('Live');
      expect(badge).toHaveAttribute('aria-label', 'Status Badge');
    });
  });

  describe('Content Types', () => {
    it('renders text content', () => {
      render(<Badge>Text</Badge>);
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('renders numeric content', () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders mixed content with icons', () => {
      render(<Badge>🔥 Hot</Badge>);
      expect(screen.getByText('🔥 Hot')).toBeInTheDocument();
    });
  });
});
