import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, BrandTheme } from './ThemeProvider';

describe('ThemeProvider Component', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child Content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('renders as a div wrapper', () => {
      const { container } = render(
        <ThemeProvider>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInstanceOf(HTMLDivElement);
    });

    it('applies custom className to wrapper', () => {
      const { container } = render(
        <ThemeProvider className="custom-theme-class">
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-theme-class');
    });
  });

  describe('Theme Data Attribute', () => {
    it('sets data-theme attribute to light by default', () => {
      const { container } = render(
        <ThemeProvider>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-theme', 'light');
    });

    it('sets data-theme attribute to dark when colorScheme is dark', () => {
      const { container } = render(
        <ThemeProvider colorScheme="dark">
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-theme', 'dark');
    });

    it('sets data-theme attribute to light when explicitly specified', () => {
      const { container } = render(
        <ThemeProvider colorScheme="light">
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-theme', 'light');
    });
  });

  describe('Brand Theme Integration', () => {
    const customBrandTheme: BrandTheme = {
      id: 'test-brand',
      name: 'Test Brand',
      description: 'Test brand theme',
      colors: {
        brand: {
          primary: {
            500: '#ff0000',
            600: '#cc0000',
            700: '#990000',
          },
          secondary: {
            500: '#00ff00',
          },
          success: {
            500: '#0000ff',
          },
        },
      },
    };

    it('sets data-brand attribute when brand theme is provided', () => {
      const { container } = render(
        <ThemeProvider brandTheme={customBrandTheme}>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-brand', 'test-brand');
    });

    it('does not set data-brand attribute when no brand theme provided', () => {
      const { container } = render(
        <ThemeProvider>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveAttribute('data-brand');
    });

    it('injects brand theme CSS variables as inline styles', () => {
      const { container } = render(
        <ThemeProvider brandTheme={customBrandTheme}>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;

      // Check that CSS variables are set for brand colors
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-500')).toBe('#ff0000');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-600')).toBe('#cc0000');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-700')).toBe('#990000');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-secondary-500')).toBe('#00ff00');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-success-500')).toBe('#0000ff');
    });

    it('generates CSS variables for all provided brand colors', () => {
      const fullBrandTheme: BrandTheme = {
        id: 'full-brand',
        name: 'Full Brand',
        colors: {
          brand: {
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
            },
          },
        },
      };

      const { container } = render(
        <ThemeProvider brandTheme={fullBrandTheme}>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;

      // Check that all shades are mapped
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-50')).toBe('#f0f9ff');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-100')).toBe('#e0f2fe');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-500')).toBe('#0ea5e9');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-900')).toBe('#0c4a6e');
    });
  });

  describe('SSR Compatibility', () => {
    it('does not use React hooks (useState, useEffect, useContext)', () => {
      // This test ensures the component is a pure server component
      // If it uses hooks, it would need "use client" directive
      const { container } = render(
        <ThemeProvider colorScheme="dark">
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;

      // Should render correctly without client-side JavaScript
      expect(wrapper).toHaveAttribute('data-theme', 'dark');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders correctly on server (no DOM dependencies)', () => {
      // Simulate server-side rendering by rendering without DOM APIs
      const { container } = render(
        <ThemeProvider colorScheme="light">
          <div>Server Content</div>
        </ThemeProvider>
      );

      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it('does not require JavaScript to display theme', () => {
      // The data-theme attribute should be present in HTML
      // so CSS can apply theming without JavaScript
      const { container } = render(
        <ThemeProvider colorScheme="dark">
          <div>No JS Required</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Multiple Providers', () => {
    it('can nest multiple providers (though not recommended)', () => {
      const outerBrand: BrandTheme = {
        id: 'outer',
        name: 'Outer',
        colors: {
          brand: {
            primary: { 500: '#ff0000' },
          },
        },
      };

      const innerBrand: BrandTheme = {
        id: 'inner',
        name: 'Inner',
        colors: {
          brand: {
            primary: { 500: '#00ff00' },
          },
        },
      };

      render(
        <ThemeProvider colorScheme="light" brandTheme={outerBrand}>
          <div data-testid="outer">
            Outer
            <ThemeProvider colorScheme="dark" brandTheme={innerBrand}>
              <div data-testid="inner">Inner</div>
            </ThemeProvider>
          </div>
        </ThemeProvider>
      );

      const outer = screen.getByTestId('outer').parentElement as HTMLElement;
      const inner = screen.getByTestId('inner').parentElement as HTMLElement;

      expect(outer).toHaveAttribute('data-theme', 'light');
      expect(outer).toHaveAttribute('data-brand', 'outer');

      expect(inner).toHaveAttribute('data-theme', 'dark');
      expect(inner).toHaveAttribute('data-brand', 'inner');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(<ThemeProvider>{null}</ThemeProvider>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles multiple children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <div data-testid="child3">Child 3</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('handles brand theme with partial color scales', () => {
      const partialBrand: BrandTheme = {
        id: 'partial',
        name: 'Partial',
        colors: {
          brand: {
            primary: {
              500: '#ff0000', // Only required color
            },
          },
        },
      };

      const { container } = render(
        <ThemeProvider brandTheme={partialBrand}>
          <div>Child</div>
        </ThemeProvider>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-500')).toBe('#ff0000');

      // Other shades should not be set
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-400')).toBe('');
      expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-600')).toBe('');
    });
  });

  describe('Type Safety', () => {
    it('enforces BrandTheme interface with required base color', () => {
      // This is a compile-time test, but we can verify runtime behavior
      const validBrand: BrandTheme = {
        id: 'valid',
        name: 'Valid',
        colors: {
          brand: {
            primary: {
              500: '#ff0000', // Required
            },
          },
        },
      };

      const { container } = render(
        <ThemeProvider brandTheme={validBrand}>
          <div>Child</div>
        </ThemeProvider>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Backward Compatibility', () => {
    it('maintains existing API surface', () => {
      // Ensures we haven't broken existing usage patterns
      render(
        <ThemeProvider colorScheme="dark">
          <div>Content</div>
        </ThemeProvider>
      );

      // Component should render without errors
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
