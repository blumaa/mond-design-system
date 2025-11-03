/**
 * Text Component Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { Text } from './Text';
import { defaultLightTheme } from '../../themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Text Component - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      const { container } = renderWithTheme(<Text>Test</Text>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works with ThemeProvider context', () => {
      renderWithTheme(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a span element by default', () => {
      renderWithTheme(<Text>Text</Text>);
      const text = screen.getByText('Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders children content', () => {
      renderWithTheme(<Text>Hello Text</Text>);
      expect(screen.getByText('Hello Text')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Text.displayName).toBe('Text');
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      renderWithTheme(<Text>Test</Text>);
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
      expect(element.className).toBeTruthy();
    });
  });

  describe('Variant Styles with Data Attributes', () => {
    it('applies display variant', () => {
      renderWithTheme(<Text variant="display">Display</Text>);
      const text = screen.getByText('Display');
      expect(text).toHaveAttribute('data-variant', 'display');
    });

    it('applies headline variant', () => {
      renderWithTheme(<Text variant="headline">Headline</Text>);
      const text = screen.getByText('Headline');
      expect(text).toHaveAttribute('data-variant', 'headline');
    });

    it('applies title variant', () => {
      renderWithTheme(<Text variant="title">Title</Text>);
      const text = screen.getByText('Title');
      expect(text).toHaveAttribute('data-variant', 'title');
    });

    it('applies subtitle variant', () => {
      renderWithTheme(<Text variant="subtitle">Subtitle</Text>);
      const text = screen.getByText('Subtitle');
      expect(text).toHaveAttribute('data-variant', 'subtitle');
    });

    it('applies body variant', () => {
      renderWithTheme(<Text variant="body">Body</Text>);
      const text = screen.getByText('Body');
      expect(text).toHaveAttribute('data-variant', 'body');
    });

    it('applies body-sm variant', () => {
      renderWithTheme(<Text variant="body-sm">Small Body</Text>);
      const text = screen.getByText('Small Body');
      expect(text).toHaveAttribute('data-variant', 'body-sm');
    });

    it('applies caption variant', () => {
      renderWithTheme(<Text variant="caption">Caption</Text>);
      const text = screen.getByText('Caption');
      expect(text).toHaveAttribute('data-variant', 'caption');
    });

    it('applies overline variant', () => {
      renderWithTheme(<Text variant="overline">Overline</Text>);
      const text = screen.getByText('Overline');
      expect(text).toHaveAttribute('data-variant', 'overline');
    });

    it('applies code variant', () => {
      renderWithTheme(<Text variant="code">Code</Text>);
      const text = screen.getByText('Code');
      expect(text).toHaveAttribute('data-variant', 'code');
    });

    it('applies body-md variant (legacy)', () => {
      renderWithTheme(<Text variant="body-md">Body MD</Text>);
      const text = screen.getByText('Body MD');
      expect(text).toHaveAttribute('data-variant', 'body-md');
    });

    it('applies body-lg variant (legacy)', () => {
      renderWithTheme(<Text variant="body-lg">Body LG</Text>);
      const text = screen.getByText('Body LG');
      expect(text).toHaveAttribute('data-variant', 'body-lg');
    });
  });

  describe('Semantic Colors', () => {
    it('applies primary semantic', () => {
      renderWithTheme(<Text semantic="primary">Primary</Text>);
      const text = screen.getByText('Primary');
      expect(text).toHaveAttribute('data-semantic', 'primary');
    });

    it('applies secondary semantic', () => {
      renderWithTheme(<Text semantic="secondary">Secondary</Text>);
      const text = screen.getByText('Secondary');
      expect(text).toHaveAttribute('data-semantic', 'secondary');
    });

    it('applies tertiary semantic', () => {
      renderWithTheme(<Text semantic="tertiary">Tertiary</Text>);
      const text = screen.getByText('Tertiary');
      expect(text).toHaveAttribute('data-semantic', 'tertiary');
    });

    it('applies disabled semantic', () => {
      renderWithTheme(<Text semantic="disabled">Disabled</Text>);
      const text = screen.getByText('Disabled');
      expect(text).toHaveAttribute('data-semantic', 'disabled');
    });

    it('applies inverse semantic', () => {
      renderWithTheme(<Text semantic="inverse">Inverse</Text>);
      const text = screen.getByText('Inverse');
      expect(text).toHaveAttribute('data-semantic', 'inverse');
    });

    it('applies link semantic', () => {
      renderWithTheme(<Text semantic="link">Link</Text>);
      const text = screen.getByText('Link');
      expect(text).toHaveAttribute('data-semantic', 'link');
    });

    it('applies success semantic', () => {
      renderWithTheme(<Text semantic="success">Success</Text>);
      const text = screen.getByText('Success');
      expect(text).toHaveAttribute('data-semantic', 'success');
    });

    it('applies warning semantic', () => {
      renderWithTheme(<Text semantic="warning">Warning</Text>);
      const text = screen.getByText('Warning');
      expect(text).toHaveAttribute('data-semantic', 'warning');
    });

    it('applies error semantic', () => {
      renderWithTheme(<Text semantic="error">Error</Text>);
      const text = screen.getByText('Error');
      expect(text).toHaveAttribute('data-semantic', 'error');
    });

    it('applies accent semantic', () => {
      renderWithTheme(<Text semantic="accent">Accent</Text>);
      const text = screen.getByText('Accent');
      expect(text).toHaveAttribute('data-semantic', 'accent');
    });
  });

  describe('Custom Element Types', () => {
    it('renders as p element when specified', () => {
      renderWithTheme(<Text as="p">Paragraph</Text>);
      const text = screen.getByText('Paragraph');
      expect(text.tagName).toBe('P');
    });

    it('renders as h1 element when specified', () => {
      renderWithTheme(<Text as="h1">Heading</Text>);
      const text = screen.getByText('Heading');
      expect(text.tagName).toBe('H1');
    });

    it('renders as div element when specified', () => {
      renderWithTheme(<Text as="div">Div</Text>);
      const text = screen.getByText('Div');
      expect(text.tagName).toBe('DIV');
    });
  });

  describe('Text Modifiers', () => {
    it('applies italic style', () => {
      renderWithTheme(<Text italic>Italic</Text>);
      const text = screen.getByText('Italic');
      expect(text).toHaveStyle('font-style: italic');
    });

    it('applies underline decoration', () => {
      renderWithTheme(<Text underline>Underline</Text>);
      const text = screen.getByText('Underline');
      expect(text).toHaveStyle('text-decoration: underline');
    });

    it('applies strikethrough decoration', () => {
      renderWithTheme(<Text strikethrough>Strikethrough</Text>);
      const text = screen.getByText('Strikethrough');
      expect(text).toHaveStyle('text-decoration: line-through');
    });

    it('applies both underline and strikethrough', () => {
      renderWithTheme(<Text underline strikethrough>Both</Text>);
      const text = screen.getByText('Both');
      expect(text).toHaveStyle('text-decoration: underline line-through');
    });

    it('applies truncate styles', () => {
      renderWithTheme(<Text truncate>Truncated text</Text>);
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
      renderWithTheme(<Text>Normal</Text>);
      const text = screen.getByText('Normal');
      expect(text).toHaveStyle('font-weight: 400');
    });

    it('applies bold weight', () => {
      renderWithTheme(<Text weight="bold">Bold</Text>);
      const text = screen.getByText('Bold');
      expect(text).toHaveStyle('font-weight: 700');
    });

    it('applies medium weight', () => {
      renderWithTheme(<Text weight="medium">Medium</Text>);
      const text = screen.getByText('Medium');
      expect(text).toHaveStyle('font-weight: 500');
    });

    it('applies semibold weight', () => {
      renderWithTheme(<Text weight="semibold">Semibold</Text>);
      const text = screen.getByText('Semibold');
      expect(text).toHaveStyle('font-weight: 600');
    });
  });

  describe('Text Alignment', () => {
    it('applies left alignment', () => {
      renderWithTheme(<Text align="left">Left</Text>);
      const text = screen.getByText('Left');
      expect(text).toHaveStyle('text-align: left');
    });

    it('applies center alignment', () => {
      renderWithTheme(<Text align="center">Center</Text>);
      const text = screen.getByText('Center');
      expect(text).toHaveStyle('text-align: center');
    });

    it('applies right alignment', () => {
      renderWithTheme(<Text align="right">Right</Text>);
      const text = screen.getByText('Right');
      expect(text).toHaveStyle('text-align: right');
    });

    it('applies justify alignment', () => {
      renderWithTheme(<Text align="justify">Justify</Text>);
      const text = screen.getByText('Justify');
      expect(text).toHaveStyle('text-align: justify');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      renderWithTheme(<Text className="custom-class">Custom</Text>);
      const text = screen.getByText('Custom');
      expect(text).toHaveClass('custom-class');
    });
  });

  describe('Custom Color', () => {
    it('applies custom color override', () => {
      renderWithTheme(<Text color="rgb(255, 0, 0)">Red Text</Text>);
      const text = screen.getByText('Red Text');
      expect(text).toHaveStyle('color: rgb(255, 0, 0)');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the element', () => {
      const ref = React.createRef<HTMLElement>();
      renderWithTheme(<Text ref={ref}>Ref Test</Text>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      renderWithTheme(<Text title="Text Title">Test</Text>);
      const text = screen.getByText('Test');
      expect(text).toHaveAttribute('title', 'Text Title');
    });

    it('forwards aria attributes', () => {
      renderWithTheme(<Text aria-label="Descriptive Text">Text</Text>);
      const text = screen.getByText('Text');
      expect(text).toHaveAttribute('aria-label', 'Descriptive Text');
    });

    it('forwards data attributes', () => {
      renderWithTheme(<Text data-testid="test-text">Test</Text>);
      expect(screen.getByTestId('test-text')).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('sets data-variant attribute', () => {
      renderWithTheme(<Text variant="headline">Test</Text>);
      expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'headline');
    });

    it('sets data-semantic attribute', () => {
      renderWithTheme(<Text semantic="error">Test</Text>);
      expect(screen.getByText('Test')).toHaveAttribute('data-semantic', 'error');
    });
  });
});
