import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Heading } from './Heading';

describe('Heading Component', () => {
  describe('Basic Rendering', () => {
    it('renders as h1 by default', () => {
      render(<Heading>Heading</Heading>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe('H1');
    });

    it('renders different heading levels', () => {
      const { rerender } = render(<Heading level={2}>H2</Heading>);
      expect(screen.getByText('H2').tagName).toBe('H2');

      rerender(<Heading level={4}>H4</Heading>);
      expect(screen.getByText('H4').tagName).toBe('H4');
    });

    it('applies size classes based on level', () => {
      render(<Heading level={1}>Large</Heading>);
      expect(screen.getByText('Large')).toHaveClass('mond-heading--4xl');
    });
  });

  describe('Semantic Colors', () => {
    it('applies semantic color classes', () => {
      const { rerender } = render(<Heading semantic="primary">Primary</Heading>);
      expect(screen.getByText('Primary')).toHaveClass('mond-heading--primary');

      rerender(<Heading semantic="secondary">Secondary</Heading>);
      expect(screen.getByText('Secondary')).toHaveClass('mond-heading--secondary');
    });
  });

  describe('Font Weight', () => {
    it('applies weight classes', () => {
      const { rerender } = render(<Heading weight="bold">Bold</Heading>);
      expect(screen.getByText('Bold')).toHaveClass('mond-heading--weight-bold');

      rerender(<Heading weight="light">Light</Heading>);
      expect(screen.getByText('Light')).toHaveClass('mond-heading--weight-light');
    });
  });

  describe('Text Alignment', () => {
    it('applies alignment classes', () => {
      const { rerender } = render(<Heading align="center">Center</Heading>);
      expect(screen.getByText('Center')).toHaveClass('mond-heading--align-center');

      rerender(<Heading align="right">Right</Heading>);
      expect(screen.getByText('Right')).toHaveClass('mond-heading--align-right');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<Heading ref={ref}>Ref Test</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('forwards HTML attributes', () => {
      render(<Heading aria-label="Label">Test</Heading>);
      const heading = screen.getByText('Test');
      expect(heading).toHaveAttribute('aria-label', 'Label');
    });
  });
});
