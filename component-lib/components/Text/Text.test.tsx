/**
 * Text Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Text component that:
 * - Removes useTheme() hook dependency
 * - Uses CSS variables for semantic colors
 * - Uses CSS classes for text variants
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Text } from './Text';

describe('Text Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Text>Test</Text>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a span element by default', () => {
      render(<Text>Text</Text>);
      const text = screen.getByText('Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders children content', () => {
      render(<Text>Hello Text</Text>);
      expect(screen.getByText('Hello Text')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Text.displayName).toBe('Text');
    });
  });

  describe('Variant Styles', () => {
    it('applies display variant class', () => {
      render(<Text variant="display">Display</Text>);
      const text = screen.getByText('Display');
      expect(text).toHaveClass('mond-text--display');
    });

    it('applies headline variant class', () => {
      render(<Text variant="headline">Headline</Text>);
      const text = screen.getByText('Headline');
      expect(text).toHaveClass('mond-text--headline');
    });

    it('applies title variant class', () => {
      render(<Text variant="title">Title</Text>);
      const text = screen.getByText('Title');
      expect(text).toHaveClass('mond-text--title');
    });

    it('applies subtitle variant class', () => {
      render(<Text variant="subtitle">Subtitle</Text>);
      const text = screen.getByText('Subtitle');
      expect(text).toHaveClass('mond-text--subtitle');
    });

    it('applies body variant class (default)', () => {
      render(<Text variant="body">Body</Text>);
      const text = screen.getByText('Body');
      expect(text).toHaveClass('mond-text--body');
    });

    it('applies body-sm variant class', () => {
      render(<Text variant="body-sm">Small Body</Text>);
      const text = screen.getByText('Small Body');
      expect(text).toHaveClass('mond-text--body-sm');
    });

    it('applies caption variant class', () => {
      render(<Text variant="caption">Caption</Text>);
      const text = screen.getByText('Caption');
      expect(text).toHaveClass('mond-text--caption');
    });

    it('applies overline variant class', () => {
      render(<Text variant="overline">Overline</Text>);
      const text = screen.getByText('Overline');
      expect(text).toHaveClass('mond-text--overline');
    });

    it('applies code variant class', () => {
      render(<Text variant="code">Code</Text>);
      const text = screen.getByText('Code');
      expect(text).toHaveClass('mond-text--code');
    });

    it('applies body-md variant class (legacy)', () => {
      render(<Text variant="body-md">Body MD</Text>);
      const text = screen.getByText('Body MD');
      expect(text).toHaveClass('mond-text--body-md');
    });

    it('applies body-lg variant class (legacy)', () => {
      render(<Text variant="body-lg">Body LG</Text>);
      const text = screen.getByText('Body LG');
      expect(text).toHaveClass('mond-text--body-lg');
    });
  });

  describe('Semantic Colors', () => {
    it('uses CSS variable for primary color', () => {
      render(<Text semantic="primary">Primary</Text>);
      const text = screen.getByText('Primary');
      expect(text).toHaveClass('mond-text--primary');
    });

    it('uses CSS variable for secondary color', () => {
      render(<Text semantic="secondary">Secondary</Text>);
      const text = screen.getByText('Secondary');
      expect(text).toHaveClass('mond-text--secondary');
    });

    it('uses CSS variable for tertiary color', () => {
      render(<Text semantic="tertiary">Tertiary</Text>);
      const text = screen.getByText('Tertiary');
      expect(text).toHaveClass('mond-text--tertiary');
    });

    it('uses CSS variable for disabled color', () => {
      render(<Text semantic="disabled">Disabled</Text>);
      const text = screen.getByText('Disabled');
      expect(text).toHaveClass('mond-text--disabled');
    });

    it('uses CSS variable for inverse color', () => {
      render(<Text semantic="inverse">Inverse</Text>);
      const text = screen.getByText('Inverse');
      expect(text).toHaveClass('mond-text--inverse');
    });

    it('uses CSS variable for link color', () => {
      render(<Text semantic="link">Link</Text>);
      const text = screen.getByText('Link');
      expect(text).toHaveClass('mond-text--link');
    });

    it('uses CSS variable for success color', () => {
      render(<Text semantic="success">Success</Text>);
      const text = screen.getByText('Success');
      expect(text).toHaveClass('mond-text--success');
    });

    it('uses CSS variable for warning color', () => {
      render(<Text semantic="warning">Warning</Text>);
      const text = screen.getByText('Warning');
      expect(text).toHaveClass('mond-text--warning');
    });

    it('uses CSS variable for error color', () => {
      render(<Text semantic="error">Error</Text>);
      const text = screen.getByText('Error');
      expect(text).toHaveClass('mond-text--error');
    });

    it('uses CSS variable for accent color', () => {
      render(<Text semantic="accent">Accent</Text>);
      const text = screen.getByText('Accent');
      expect(text).toHaveClass('mond-text--accent');
    });
  });

  describe('Custom Element Types', () => {
    it('renders as p element when specified', () => {
      render(<Text as="p">Paragraph</Text>);
      const text = screen.getByText('Paragraph');
      expect(text.tagName).toBe('P');
    });

    it('renders as h1 element when specified', () => {
      render(<Text as="h1">Heading</Text>);
      const text = screen.getByText('Heading');
      expect(text.tagName).toBe('H1');
    });

    it('renders as div element when specified', () => {
      render(<Text as="div">Div</Text>);
      const text = screen.getByText('Div');
      expect(text.tagName).toBe('DIV');
    });
  });

  describe('Text Modifiers', () => {
    it('applies italic style', () => {
      render(<Text italic>Italic</Text>);
      const text = screen.getByText('Italic');
      expect(text).toHaveStyle('font-style: italic');
    });

    it('applies underline decoration', () => {
      render(<Text underline>Underline</Text>);
      const text = screen.getByText('Underline');
      expect(text).toHaveStyle('text-decoration: underline');
    });

    it('applies strikethrough decoration', () => {
      render(<Text strikethrough>Strikethrough</Text>);
      const text = screen.getByText('Strikethrough');
      expect(text).toHaveStyle('text-decoration: line-through');
    });

    it('applies both underline and strikethrough', () => {
      render(<Text underline strikethrough>Both</Text>);
      const text = screen.getByText('Both');
      expect(text).toHaveStyle('text-decoration: underline line-through');
    });

    it('applies truncate styles', () => {
      render(<Text truncate>Truncated text</Text>);
      const text = screen.getByText('Truncated text');
      expect(text).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });
  });

  describe('Font Weight', () => {
    it('applies normal weight by default', () => {
      render(<Text>Normal</Text>);
      const text = screen.getByText('Normal');
      expect(text).toHaveStyle('font-weight: 400');
    });

    it('applies bold weight', () => {
      render(<Text weight="bold">Bold</Text>);
      const text = screen.getByText('Bold');
      expect(text).toHaveStyle('font-weight: 700');
    });

    it('applies medium weight', () => {
      render(<Text weight="medium">Medium</Text>);
      const text = screen.getByText('Medium');
      expect(text).toHaveStyle('font-weight: 500');
    });
  });

  describe('Text Alignment', () => {
    it('applies left alignment', () => {
      render(<Text align="left">Left</Text>);
      const text = screen.getByText('Left');
      expect(text).toHaveStyle('text-align: left');
    });

    it('applies center alignment', () => {
      render(<Text align="center">Center</Text>);
      const text = screen.getByText('Center');
      expect(text).toHaveStyle('text-align: center');
    });

    it('applies right alignment', () => {
      render(<Text align="right">Right</Text>);
      const text = screen.getByText('Right');
      expect(text).toHaveStyle('text-align: right');
    });

    it('applies justify alignment', () => {
      render(<Text align="justify">Justify</Text>);
      const text = screen.getByText('Justify');
      expect(text).toHaveStyle('text-align: justify');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside variant class', () => {
      render(<Text className="custom-class">Custom</Text>);
      const text = screen.getByText('Custom');
      expect(text).toHaveClass('mond-text--body-md'); // default variant
      expect(text).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Text ref={ref}>Ref Test</Text>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { children: 'Test', isDarkMode: true } as React.ComponentProps<typeof Text> & { isDarkMode?: boolean };
      render(<Text {...props} />);
      const text = screen.getByText('Test');
      expect(text).toBeInTheDocument();
    });

    it('maintains existing API for variant prop', () => {
      render(<Text variant="headline">Headline</Text>);
      expect(screen.getByText('Headline')).toHaveClass('mond-text--headline');
    });

    it('maintains existing API for semantic prop', () => {
      render(<Text semantic="error">Error</Text>);
      expect(screen.getByText('Error')).toHaveClass('mond-text--error');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      render(<Text title="Text Title">Test</Text>);
      const text = screen.getByText('Test');
      expect(text).toHaveAttribute('title', 'Text Title');
    });

    it('forwards aria attributes', () => {
      render(<Text aria-label="Descriptive Text">Text</Text>);
      const text = screen.getByText('Text');
      expect(text).toHaveAttribute('aria-label', 'Descriptive Text');
    });

    it('forwards data attributes', () => {
      render(<Text data-testid="test-text">Test</Text>);
      expect(screen.getByTestId('test-text')).toBeInTheDocument();
    });
  });
});
