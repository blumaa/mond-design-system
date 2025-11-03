/**
 * Heading Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { Heading } from './Heading';
import { defaultLightTheme } from '../../src/themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Heading Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      const { container } = renderWithTheme(<Heading>Test</Heading>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works with ThemeProvider context', () => {
      renderWithTheme(<Heading>With Provider</Heading>);
      expect(screen.getByText('With Provider')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as h1 element by default', () => {
      renderWithTheme(<Heading>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe('H1');
    });

    it('renders children content', () => {
      renderWithTheme(<Heading>Hello Heading</Heading>);
      expect(screen.getByText('Hello Heading')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Heading.displayName).toBe('Heading');
    });
  });

  describe('Heading Levels', () => {
    it('renders as h1 when level is 1', () => {
      renderWithTheme(<Heading level={1}>H1</Heading>);
      const heading = screen.getByText('H1');
      expect(heading.tagName).toBe('H1');
    });

    it('renders as h2 when level is 2', () => {
      renderWithTheme(<Heading level={2}>H2</Heading>);
      const heading = screen.getByText('H2');
      expect(heading.tagName).toBe('H2');
    });

    it('renders as h3 when level is 3', () => {
      renderWithTheme(<Heading level={3}>H3</Heading>);
      const heading = screen.getByText('H3');
      expect(heading.tagName).toBe('H3');
    });

    it('renders as h4 when level is 4', () => {
      renderWithTheme(<Heading level={4}>H4</Heading>);
      const heading = screen.getByText('H4');
      expect(heading.tagName).toBe('H4');
    });

    it('renders as h5 when level is 5', () => {
      renderWithTheme(<Heading level={5}>H5</Heading>);
      const heading = screen.getByText('H5');
      expect(heading.tagName).toBe('H5');
    });

    it('renders as h6 when level is 6', () => {
      renderWithTheme(<Heading level={6}>H6</Heading>);
      const heading = screen.getByText('H6');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      renderWithTheme(<Heading>Test</Heading>);
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
      expect(element.className).toBeTruthy();
    });
  });

  describe('Size Variants with Data Attributes', () => {
    it('applies default size based on level 1 (4xl)', () => {
      renderWithTheme(<Heading level={1}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('data-size', '4xl');
    });

    it('applies default size based on level 2 (3xl)', () => {
      renderWithTheme(<Heading level={2}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('data-size', '3xl');
    });

    it('applies default size based on level 3 (2xl)', () => {
      renderWithTheme(<Heading level={3}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('data-size', '2xl');
    });

    it('applies custom size overriding level default', () => {
      renderWithTheme(<Heading level={1} size="sm">Small H1</Heading>);
      const heading = screen.getByText('Small H1');
      expect(heading).toHaveAttribute('data-size', 'sm');
    });

    it('applies xs size', () => {
      renderWithTheme(<Heading size="xs">XS</Heading>);
      const heading = screen.getByText('XS');
      expect(heading).toHaveAttribute('data-size', 'xs');
    });

    it('applies sm size', () => {
      renderWithTheme(<Heading size="sm">SM</Heading>);
      const heading = screen.getByText('SM');
      expect(heading).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size', () => {
      renderWithTheme(<Heading size="md">MD</Heading>);
      const heading = screen.getByText('MD');
      expect(heading).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size', () => {
      renderWithTheme(<Heading size="lg">LG</Heading>);
      const heading = screen.getByText('LG');
      expect(heading).toHaveAttribute('data-size', 'lg');
    });

    it('applies xl size', () => {
      renderWithTheme(<Heading size="xl">XL</Heading>);
      const heading = screen.getByText('XL');
      expect(heading).toHaveAttribute('data-size', 'xl');
    });

    it('applies 2xl size', () => {
      renderWithTheme(<Heading size="2xl">2XL</Heading>);
      const heading = screen.getByText('2XL');
      expect(heading).toHaveAttribute('data-size', '2xl');
    });

    it('applies 3xl size', () => {
      renderWithTheme(<Heading size="3xl">3XL</Heading>);
      const heading = screen.getByText('3XL');
      expect(heading).toHaveAttribute('data-size', '3xl');
    });

    it('applies 4xl size', () => {
      renderWithTheme(<Heading size="4xl">4XL</Heading>);
      const heading = screen.getByText('4XL');
      expect(heading).toHaveAttribute('data-size', '4xl');
    });

    it('applies 5xl size', () => {
      renderWithTheme(<Heading size="5xl">5XL</Heading>);
      const heading = screen.getByText('5XL');
      expect(heading).toHaveAttribute('data-size', '5xl');
    });

    it('applies 6xl size', () => {
      renderWithTheme(<Heading size="6xl">6XL</Heading>);
      const heading = screen.getByText('6XL');
      expect(heading).toHaveAttribute('data-size', '6xl');
    });
  });

  describe('Semantic Colors', () => {
    it('applies primary semantic by default', () => {
      renderWithTheme(<Heading>Primary</Heading>);
      const heading = screen.getByText('Primary');
      expect(heading).toHaveAttribute('data-semantic', 'primary');
    });

    it('applies secondary semantic', () => {
      renderWithTheme(<Heading semantic="secondary">Secondary</Heading>);
      const heading = screen.getByText('Secondary');
      expect(heading).toHaveAttribute('data-semantic', 'secondary');
    });

    it('applies tertiary semantic', () => {
      renderWithTheme(<Heading semantic="tertiary">Tertiary</Heading>);
      const heading = screen.getByText('Tertiary');
      expect(heading).toHaveAttribute('data-semantic', 'tertiary');
    });

    it('applies inverse semantic', () => {
      renderWithTheme(<Heading semantic="inverse">Inverse</Heading>);
      const heading = screen.getByText('Inverse');
      expect(heading).toHaveAttribute('data-semantic', 'inverse');
    });
  });

  describe('Font Weight', () => {
    it('applies bold weight by default', () => {
      renderWithTheme(<Heading>Bold</Heading>);
      const heading = screen.getByText('Bold');
      expect(heading).toHaveStyle('font-weight: 700');
    });

    it('applies normal weight', () => {
      renderWithTheme(<Heading weight="normal">Normal</Heading>);
      const heading = screen.getByText('Normal');
      expect(heading).toHaveStyle('font-weight: 400');
    });

    it('applies medium weight', () => {
      renderWithTheme(<Heading weight="medium">Medium</Heading>);
      const heading = screen.getByText('Medium');
      expect(heading).toHaveStyle('font-weight: 500');
    });

    it('applies semibold weight', () => {
      renderWithTheme(<Heading weight="semibold">Semibold</Heading>);
      const heading = screen.getByText('Semibold');
      expect(heading).toHaveStyle('font-weight: 600');
    });
  });

  describe('Text Alignment', () => {
    it('applies left alignment', () => {
      renderWithTheme(<Heading align="left">Left</Heading>);
      const heading = screen.getByText('Left');
      expect(heading).toHaveStyle('text-align: left');
    });

    it('applies center alignment', () => {
      renderWithTheme(<Heading align="center">Center</Heading>);
      const heading = screen.getByText('Center');
      expect(heading).toHaveStyle('text-align: center');
    });

    it('applies right alignment', () => {
      renderWithTheme(<Heading align="right">Right</Heading>);
      const heading = screen.getByText('Right');
      expect(heading).toHaveStyle('text-align: right');
    });
  });

  describe('Text Truncation', () => {
    it('applies truncate styles when enabled', () => {
      renderWithTheme(<Heading truncate>Truncated heading</Heading>);
      const heading = screen.getByText('Truncated heading');
      expect(heading).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    it('does not apply truncate styles by default', () => {
      renderWithTheme(<Heading>Normal heading</Heading>);
      const heading = screen.getByText('Normal heading');
      expect(heading).not.toHaveStyle('overflow: hidden');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      renderWithTheme(<Heading className="custom-class">Custom</Heading>);
      const heading = screen.getByText('Custom');
      expect(heading).toHaveClass('custom-class');
    });
  });

  describe('Custom Color', () => {
    it('applies custom color override', () => {
      renderWithTheme(<Heading color="rgb(255, 0, 0)">Red Heading</Heading>);
      const heading = screen.getByText('Red Heading');
      expect(heading).toHaveStyle('color: rgb(255, 0, 0)');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to heading element', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      renderWithTheme(<Heading ref={ref}>Ref Test</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      renderWithTheme(<Heading title="Heading Title">Test</Heading>);
      const heading = screen.getByText('Test');
      expect(heading).toHaveAttribute('title', 'Heading Title');
    });

    it('forwards aria attributes', () => {
      renderWithTheme(<Heading aria-label="Main Heading">Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('aria-label', 'Main Heading');
    });

    it('forwards data attributes', () => {
      renderWithTheme(<Heading data-testid="test-heading">Test</Heading>);
      expect(screen.getByTestId('test-heading')).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('sets data-size attribute', () => {
      renderWithTheme(<Heading size="lg">Test</Heading>);
      expect(screen.getByText('Test')).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-semantic attribute', () => {
      renderWithTheme(<Heading semantic="secondary">Test</Heading>);
      expect(screen.getByText('Test')).toHaveAttribute('data-semantic', 'secondary');
    });
  });
});
