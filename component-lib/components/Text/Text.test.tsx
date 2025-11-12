import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Text } from './Text';

describe('Text Component', () => {
  describe('Basic Rendering', () => {
    it('renders as a span element by default', () => {
      render(<Text>Text</Text>);
      const text = screen.getByText('Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Text variant="headline">Headline</Text>);
      expect(screen.getByText('Headline')).toHaveClass('mond-text--headline');

      rerender(<Text variant="body-sm">Body Small</Text>);
      expect(screen.getByText('Body Small')).toHaveClass('mond-text--body-sm');
    });

    it('renders as custom element', () => {
      render(<Text as="p">Paragraph</Text>);
      const text = screen.getByText('Paragraph');
      expect(text.tagName).toBe('P');
    });
  });

  describe('Semantic Colors', () => {
    it('applies semantic color classes', () => {
      const { rerender } = render(<Text semantic="primary">Primary</Text>);
      expect(screen.getByText('Primary')).toHaveClass('mond-text--primary');

      rerender(<Text semantic="error">Error</Text>);
      expect(screen.getByText('Error')).toHaveClass('mond-text--error');
    });

    it('applies custom color via CSS custom property', () => {
      render(<Text color="text-accent">Custom</Text>);
      const text = screen.getByText('Custom');
      expect(text).toHaveStyle({ color: 'var(--mond-text-accent)' });
    });
  });

  describe('Text Modifiers', () => {
    it('applies italic class', () => {
      render(<Text italic>Italic</Text>);
      expect(screen.getByText('Italic')).toHaveClass('mond-text--italic');
    });

    it('applies underline class', () => {
      render(<Text underline>Underline</Text>);
      expect(screen.getByText('Underline')).toHaveClass('mond-text--underline');
    });

    it('applies truncate class', () => {
      render(<Text truncate>Truncated text</Text>);
      expect(screen.getByText('Truncated text')).toHaveClass('mond-text--truncate');
    });

    it('combines multiple modifiers', () => {
      render(<Text italic underline>Combined</Text>);
      const text = screen.getByText('Combined');
      expect(text).toHaveClass('mond-text--italic', 'mond-text--underline');
    });
  });

  describe('Font Weight', () => {
    it('applies weight classes', () => {
      const { rerender } = render(<Text weight="bold">Bold</Text>);
      expect(screen.getByText('Bold')).toHaveClass('mond-text--weight-bold');

      rerender(<Text weight="medium">Medium</Text>);
      expect(screen.getByText('Medium')).toHaveClass('mond-text--weight-medium');
    });
  });

  describe('Text Alignment', () => {
    it('applies alignment classes', () => {
      const { rerender } = render(<Text align="center">Center</Text>);
      expect(screen.getByText('Center')).toHaveClass('mond-text--align-center');

      rerender(<Text align="right">Right</Text>);
      expect(screen.getByText('Right')).toHaveClass('mond-text--align-right');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Text ref={ref}>Ref Test</Text>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });

    it('forwards HTML attributes', () => {
      render(<Text title="Text Title" aria-label="Label">Test</Text>);
      const text = screen.getByText('Test');
      expect(text).toHaveAttribute('title', 'Text Title');
      expect(text).toHaveAttribute('aria-label', 'Label');
    });
  });
});
