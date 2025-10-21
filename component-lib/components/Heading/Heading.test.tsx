/**
 * Heading Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Heading component that:
 * - Removes useTheme() hook dependency
 * - Uses CSS variables for semantic colors
 * - Uses CSS classes for heading sizes
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Heading } from './Heading';
import type { HeadingProps } from './Heading';

describe('Heading Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Heading>Hello World</Heading>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Heading>Test</Heading>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as h1 element by default', () => {
      render(<Heading>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe('H1');
    });

    it('renders children content', () => {
      render(<Heading>Hello Heading</Heading>);
      expect(screen.getByText('Hello Heading')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Heading.displayName).toBe('Heading');
    });
  });

  describe('Heading Levels', () => {
    it('renders as h1 when level is 1', () => {
      render(<Heading level={1}>H1</Heading>);
      const heading = screen.getByText('H1');
      expect(heading.tagName).toBe('H1');
    });

    it('renders as h2 when level is 2', () => {
      render(<Heading level={2}>H2</Heading>);
      const heading = screen.getByText('H2');
      expect(heading.tagName).toBe('H2');
    });

    it('renders as h3 when level is 3', () => {
      render(<Heading level={3}>H3</Heading>);
      const heading = screen.getByText('H3');
      expect(heading.tagName).toBe('H3');
    });

    it('renders as h4 when level is 4', () => {
      render(<Heading level={4}>H4</Heading>);
      const heading = screen.getByText('H4');
      expect(heading.tagName).toBe('H4');
    });

    it('renders as h5 when level is 5', () => {
      render(<Heading level={5}>H5</Heading>);
      const heading = screen.getByText('H5');
      expect(heading.tagName).toBe('H5');
    });

    it('renders as h6 when level is 6', () => {
      render(<Heading level={6}>H6</Heading>);
      const heading = screen.getByText('H6');
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Size Variants with CSS Classes', () => {
    it('applies default size class based on level 1 (4xl)', () => {
      render(<Heading level={1}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass('mond-heading--4xl');
    });

    it('applies default size class based on level 2 (3xl)', () => {
      render(<Heading level={2}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass('mond-heading--3xl');
    });

    it('applies default size class based on level 3 (2xl)', () => {
      render(<Heading level={3}>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass('mond-heading--2xl');
    });

    it('applies custom size class overriding level default', () => {
      render(<Heading level={1} size="sm">Small H1</Heading>);
      const heading = screen.getByText('Small H1');
      expect(heading).toHaveClass('mond-heading--sm');
    });

    it('applies xs size class', () => {
      render(<Heading size="xs">XS</Heading>);
      const heading = screen.getByText('XS');
      expect(heading).toHaveClass('mond-heading--xs');
    });

    it('applies sm size class', () => {
      render(<Heading size="sm">SM</Heading>);
      const heading = screen.getByText('SM');
      expect(heading).toHaveClass('mond-heading--sm');
    });

    it('applies md size class', () => {
      render(<Heading size="md">MD</Heading>);
      const heading = screen.getByText('MD');
      expect(heading).toHaveClass('mond-heading--md');
    });

    it('applies lg size class', () => {
      render(<Heading size="lg">LG</Heading>);
      const heading = screen.getByText('LG');
      expect(heading).toHaveClass('mond-heading--lg');
    });

    it('applies xl size class', () => {
      render(<Heading size="xl">XL</Heading>);
      const heading = screen.getByText('XL');
      expect(heading).toHaveClass('mond-heading--xl');
    });

    it('applies 2xl size class', () => {
      render(<Heading size="2xl">2XL</Heading>);
      const heading = screen.getByText('2XL');
      expect(heading).toHaveClass('mond-heading--2xl');
    });

    it('applies 3xl size class', () => {
      render(<Heading size="3xl">3XL</Heading>);
      const heading = screen.getByText('3XL');
      expect(heading).toHaveClass('mond-heading--3xl');
    });

    it('applies 4xl size class', () => {
      render(<Heading size="4xl">4XL</Heading>);
      const heading = screen.getByText('4XL');
      expect(heading).toHaveClass('mond-heading--4xl');
    });

    it('applies 5xl size class', () => {
      render(<Heading size="5xl">5XL</Heading>);
      const heading = screen.getByText('5XL');
      expect(heading).toHaveClass('mond-heading--5xl');
    });

    it('applies 6xl size class', () => {
      render(<Heading size="6xl">6XL</Heading>);
      const heading = screen.getByText('6XL');
      expect(heading).toHaveClass('mond-heading--6xl');
    });
  });

  describe('Semantic Colors', () => {
    it('applies primary semantic class by default', () => {
      render(<Heading>Primary</Heading>);
      const heading = screen.getByText('Primary');
      expect(heading).toHaveClass('mond-heading--primary');
    });

    it('applies secondary semantic class', () => {
      render(<Heading semantic="secondary">Secondary</Heading>);
      const heading = screen.getByText('Secondary');
      expect(heading).toHaveClass('mond-heading--secondary');
    });

    it('applies tertiary semantic class', () => {
      render(<Heading semantic="tertiary">Tertiary</Heading>);
      const heading = screen.getByText('Tertiary');
      expect(heading).toHaveClass('mond-heading--tertiary');
    });

    it('applies inverse semantic class', () => {
      render(<Heading semantic="inverse">Inverse</Heading>);
      const heading = screen.getByText('Inverse');
      expect(heading).toHaveClass('mond-heading--inverse');
    });
  });

  describe('Font Weight', () => {
    it('applies bold weight by default', () => {
      render(<Heading>Bold</Heading>);
      const heading = screen.getByText('Bold');
      expect(heading).toHaveStyle('font-weight: 700');
    });

    it('applies custom weight', () => {
      render(<Heading weight="normal">Normal</Heading>);
      const heading = screen.getByText('Normal');
      expect(heading).toHaveStyle('font-weight: 400');
    });

    it('applies semibold weight', () => {
      render(<Heading weight="semibold">Semibold</Heading>);
      const heading = screen.getByText('Semibold');
      expect(heading).toHaveStyle('font-weight: 600');
    });
  });

  describe('Text Alignment', () => {
    it('applies left alignment', () => {
      render(<Heading align="left">Left</Heading>);
      const heading = screen.getByText('Left');
      expect(heading).toHaveStyle('text-align: left');
    });

    it('applies center alignment', () => {
      render(<Heading align="center">Center</Heading>);
      const heading = screen.getByText('Center');
      expect(heading).toHaveStyle('text-align: center');
    });

    it('applies right alignment', () => {
      render(<Heading align="right">Right</Heading>);
      const heading = screen.getByText('Right');
      expect(heading).toHaveStyle('text-align: right');
    });
  });

  describe('Text Truncation', () => {
    it('applies truncate styles when enabled', () => {
      render(<Heading truncate>Truncated heading</Heading>);
      const heading = screen.getByText('Truncated heading');
      expect(heading).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    it('does not apply truncate styles by default', () => {
      render(<Heading>Normal heading</Heading>);
      const heading = screen.getByText('Normal heading');
      expect(heading).not.toHaveStyle('overflow: hidden');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base classes', () => {
      render(<Heading className="custom-class">Custom</Heading>);
      const heading = screen.getByText('Custom');
      expect(heading).toHaveClass('mond-heading--4xl'); // default size
      expect(heading).toHaveClass('mond-heading--primary'); // default semantic
      expect(heading).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to heading element', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<Heading ref={ref}>Ref Test</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { children: 'Test', isDarkMode: true } as any;
      render(<Heading {...props} />);
      const heading = screen.getByText('Test');
      expect(heading).toBeInTheDocument();
    });

    it('maintains existing API for level prop', () => {
      render(<Heading level={3}>H3</Heading>);
      const heading = screen.getByText('H3');
      expect(heading.tagName).toBe('H3');
    });

    it('maintains existing API for semantic prop', () => {
      render(<Heading semantic="secondary">Secondary</Heading>);
      expect(screen.getByText('Secondary')).toHaveClass('mond-heading--secondary');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      render(<Heading title="Heading Title">Test</Heading>);
      const heading = screen.getByText('Test');
      expect(heading).toHaveAttribute('title', 'Heading Title');
    });

    it('forwards aria attributes', () => {
      render(<Heading aria-label="Main Heading">Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('aria-label', 'Main Heading');
    });

    it('forwards data attributes', () => {
      render(<Heading data-testid="test-heading">Test</Heading>);
      expect(screen.getByTestId('test-heading')).toBeInTheDocument();
    });
  });
});
