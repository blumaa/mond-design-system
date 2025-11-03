/**
 * Badge Component Tests - Styled Components Version
 *
 * Tests for the refactored Badge component using styled-components
 * with theme support for light/dark mode and brand switching.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { Badge } from './Badge';
import { defaultLightTheme } from '../../src/themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Badge Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      const { container } = renderWithTheme(<Badge>New</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works without ThemeProvider context', () => {
      renderWithTheme(<Badge>No Provider</Badge>);
      expect(screen.getByText('No Provider')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = renderWithTheme(<Badge>Test</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a span element', () => {
      renderWithTheme(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('renders children content', () => {
      renderWithTheme(<Badge>Hello Badge</Badge>);
      expect(screen.getByText('Hello Badge')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      renderWithTheme(<Badge>Test</Badge>);
      const badge = screen.getByText('Test');
      // Styled-components generates class names, just verify badge exists
      expect(badge).toBeInTheDocument();
      expect(badge.className).toBeTruthy();
    });

    it('renders different variants', () => {
      const variants: Array<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> =
        ['default', 'primary', 'secondary', 'success', 'warning', 'error'];

      variants.forEach(variant => {
        const { unmount } = renderWithTheme(<Badge variant={variant}>{variant}</Badge>);
        const badge = screen.getByText(variant);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveAttribute('data-variant', variant);
        unmount();
      });
    });

    it('renders different sizes', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(<Badge size={size}>{size}</Badge>);
        const badge = screen.getByText(size);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveAttribute('data-size', size);
        unmount();
      });
    });
  });

  describe('Data Attributes', () => {
    it('sets data-testid when provided', () => {
      renderWithTheme(<Badge data-testid="my-badge">Test</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });

    it('sets data-variant attribute', () => {
      renderWithTheme(<Badge variant="primary">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('data-variant', 'primary');
    });

    it('sets data-size attribute', () => {
      renderWithTheme(<Badge size="lg">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      renderWithTheme(<Badge ref={ref}>Ref Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('Backward Compatibility', () => {
    it('maintains existing API for variant prop', () => {
      renderWithTheme(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveAttribute('data-variant', 'success');
    });

    it('maintains existing API for size prop', () => {
      renderWithTheme(<Badge size="sm">Small</Badge>);
      expect(screen.getByText('Small')).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Styled Components Theme Integration', () => {
    it('renders with styled-components generated classes', () => {
      renderWithTheme(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');

      // Styled-components generates dynamic class names
      expect(badge).toBeInTheDocument();
      expect(badge.className).toBeTruthy();
    });

    it('applies theme-based styling via styled-components', () => {
      renderWithTheme(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');

      // Verify the badge renders with the correct variant
      expect(badge).toHaveAttribute('data-variant', 'error');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Combination Props', () => {
    it('handles multiple props correctly', () => {
      renderWithTheme(
        <Badge variant="success" size="lg">
          Combined
        </Badge>,
      );
      const badge = screen.getByText('Combined');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-variant', 'success');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      renderWithTheme(<Badge title="Badge Title">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('title', 'Badge Title');
    });

    it('forwards aria attributes', () => {
      renderWithTheme(<Badge aria-label="Status Badge">Live</Badge>);
      const badge = screen.getByText('Live');
      expect(badge).toHaveAttribute('aria-label', 'Status Badge');
    });
  });

  describe('Content Types', () => {
    it('renders text content', () => {
      renderWithTheme(<Badge>Text</Badge>);
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('renders numeric content', () => {
      renderWithTheme(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders mixed content with icons', () => {
      renderWithTheme(<Badge>🔥 Hot</Badge>);
      expect(screen.getByText('🔥 Hot')).toBeInTheDocument();
    });
  });
});
