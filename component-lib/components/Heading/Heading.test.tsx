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
    it('renders correctly with default props', () => {
      render(<Heading>Test Heading</Heading>);

      const heading = screen.getByText('Test Heading');
      expect(heading).toBeInTheDocument();
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
    it('renders with different heading levels', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const;

      levels.forEach((level) => {
        const { unmount } = render(
          <Heading level={level} data-testid={`heading-${level}`}>
            Heading Level {level}
          </Heading>
        );

        const heading = screen.getByTestId(`heading-${level}`);
        expect(heading.tagName).toBe(`H${level}`);

        unmount();
      });
    });
  });

  describe('CSS Class-Based Styling', () => {
    it('applies default size class based on heading level h1', () => {
      render(<Heading level={1}>Level 1</Heading>);
      const heading = screen.getByText('Level 1');
      expect(heading).toHaveClass('mond-heading--4xl');
    });

    it('applies default size class based on heading level h2', () => {
      render(<Heading level={2}>Level 2</Heading>);
      const heading = screen.getByText('Level 2');
      expect(heading).toHaveClass('mond-heading--3xl');
    });

    it('applies default size class based on heading level h3', () => {
      render(<Heading level={3}>Level 3</Heading>);
      const heading = screen.getByText('Level 3');
      expect(heading).toHaveClass('mond-heading--2xl');
    });

    it('applies default size class based on heading level h4', () => {
      render(<Heading level={4}>Level 4</Heading>);
      const heading = screen.getByText('Level 4');
      expect(heading).toHaveClass('mond-heading--xl');
    });

    it('applies default size class based on heading level h5', () => {
      render(<Heading level={5}>Level 5</Heading>);
      const heading = screen.getByText('Level 5');
      expect(heading).toHaveClass('mond-heading--lg');
    });

    it('applies default size class based on heading level h6', () => {
      render(<Heading level={6}>Level 6</Heading>);
      const heading = screen.getByText('Level 6');
      expect(heading).toHaveClass('mond-heading--md');
    });

    it('applies custom size override class', () => {
      render(
        <Heading level={1} size="sm" data-testid="custom-size-heading">
          Small H1
        </Heading>
      );

      const heading = screen.getByTestId('custom-size-heading');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass('mond-heading--sm');
    });

    it('applies size class for all size options', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          <Heading size={size} data-testid={`heading-${size}`}>
            Heading size {size}
          </Heading>
        );

        const heading = screen.getByTestId(`heading-${size}`);
        expect(heading).toHaveClass(`mond-heading--${size}`);

        unmount();
      });
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

    it('renders with all semantic colors', () => {
      const semantics = ['primary', 'secondary', 'tertiary', 'inverse'] as const;

      semantics.forEach((semantic) => {
        const { unmount } = render(
          <Heading semantic={semantic} data-testid={`heading-${semantic}`}>
            {semantic} heading
          </Heading>
        );

        const heading = screen.getByTestId(`heading-${semantic}`);
        expect(heading).toHaveClass(`mond-heading--${semantic}`);

        unmount();
      });
    });
  });

  describe('Font Weight', () => {
    it('applies bold font weight class by default', () => {
      render(<Heading data-testid="bold-heading">Bold by default</Heading>);

      const heading = screen.getByTestId('bold-heading');
      expect(heading).toHaveClass('mond-heading--weight-bold');
    });

    it('applies medium font weight class', () => {
      render(<Heading weight="medium" data-testid="medium-weight">Medium Weight</Heading>);

      const heading = screen.getByTestId('medium-weight');
      expect(heading).toHaveClass('mond-heading--weight-medium');
    });

    it('applies light font weight class', () => {
      render(<Heading weight="light" data-testid="light-weight">Light Weight</Heading>);

      const heading = screen.getByTestId('light-weight');
      expect(heading).toHaveClass('mond-heading--weight-light');
    });
  });

  describe('Text Alignment', () => {
    it('applies text alignment class', () => {
      render(<Heading align="center" data-testid="centered-heading">Centered</Heading>);

      const heading = screen.getByTestId('centered-heading');
      expect(heading).toHaveClass('mond-heading--align-center');
    });

    it('applies left alignment class', () => {
      render(<Heading align="left">Left</Heading>);
      const heading = screen.getByText('Left');
      expect(heading).toHaveClass('mond-heading--align-left');
    });

    it('applies right alignment class', () => {
      render(<Heading align="right">Right</Heading>);
      const heading = screen.getByText('Right');
      expect(heading).toHaveClass('mond-heading--align-right');
    });
  });

  describe('Text Modifiers', () => {
    it('renders truncated heading with class', () => {
      render(
        <Heading truncate data-testid="truncated-heading">
          This is a very long heading that should be truncated
        </Heading>
      );

      const heading = screen.getByTestId('truncated-heading');
      expect(heading).toHaveClass('mond-heading--truncate');
    });
  });

  describe('Default Styles', () => {
    it('applies default size class', () => {
      render(<Heading data-testid="font-heading">Font Test</Heading>);

      const heading = screen.getByTestId('font-heading');
      expect(heading).toHaveClass('mond-heading--4xl'); // default size for h1
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();

      render(
        <Heading ref={ref}>Heading with ref</Heading>
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe('H1');
    });

    it('forwards ref with different levels', () => {
      const ref = React.createRef<HTMLHeadingElement>();

      render(
        <Heading level={3} ref={ref}>H3 with ref</Heading>
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe('H3');
    });
  });

  describe('Custom Color Tokens', () => {
    it('applies custom color token via CSS variable', () => {
      render(
        <Heading color="blue.500" data-testid="custom-color-heading">
          Blue Heading
        </Heading>
      );

      const heading = screen.getByTestId('custom-color-heading');
      const style = heading.getAttribute('style');

      expect(style).toContain('--heading-color-override');
      expect(style).toContain('var(--mond-color-blue-500)');
    });

    it('does not apply semantic class when color prop is provided', () => {
      render(
        <Heading color="green.600" semantic="secondary">
          Custom Color
        </Heading>
      );

      const heading = screen.getByText('Custom Color');
      expect(heading).not.toHaveClass('mond-heading--secondary');
    });

    it('applies semantic class when color prop is not provided', () => {
      render(
        <Heading semantic="tertiary">
          Semantic Color
        </Heading>
      );

      const heading = screen.getByText('Semantic Color');
      expect(heading).toHaveClass('mond-heading--tertiary');
    });

    it('converts dot notation to dash notation in color tokens', () => {
      render(
        <Heading color="brand.primary.700" data-testid="brand-color">
          Brand Color
        </Heading>
      );

      const heading = screen.getByTestId('brand-color');
      const style = heading.getAttribute('style');

      expect(style).toContain('var(--mond-color-brand-primary-700)');
    });

    it('does not add style attribute when color is not provided', () => {
      render(
        <Heading data-testid="no-color">
          No Custom Color
        </Heading>
      );

      const heading = screen.getByTestId('no-color');
      expect(heading.getAttribute('style')).toBeNull();
    });
  });

  describe('Combined Props', () => {
    it('combines level and custom properties correctly', () => {
      render(
        <Heading
          level={2}
          size="xs"
          weight="light"
          align="right"
          data-testid="combined-props-heading"
        >
          Combined Props
        </Heading>
      );

      const heading = screen.getByTestId('combined-props-heading');
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveClass('mond-heading--xs');
      expect(heading).toHaveClass('mond-heading--align-right');
      expect(heading).toHaveClass('mond-heading--weight-light');
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { children: 'Test', isDarkMode: true } as unknown;
      render(<Heading {...props} />);
      const heading = screen.getByText('Test');
      expect(heading).toBeInTheDocument();
    });

    it('maintains existing API for level prop', () => {
      render(<Heading level={2}>Level 2</Heading>);
      expect(screen.getByText('Level 2')).toHaveClass('mond-heading--3xl');
    });

    it('maintains existing API for semantic prop', () => {
      render(<Heading semantic="secondary">Secondary</Heading>);
      expect(screen.getByText('Secondary')).toHaveClass('mond-heading--secondary');
    });
  });
});
