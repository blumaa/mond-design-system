import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('Badge Component', () => {
  describe('Basic Rendering', () => {
    it('renders as a span element', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Badge variant="primary">Primary</Badge>);
      expect(screen.getByText('Primary')).toHaveAttribute('data-variant', 'primary');

      rerender(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveAttribute('data-variant', 'success');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);
      expect(screen.getByText('Small')).toHaveAttribute('data-size', 'sm');

      rerender(<Badge size="lg">Large</Badge>);
      expect(screen.getByText('Large')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });

    it('forwards HTML attributes', () => {
      render(<Badge title="Badge Title" aria-label="Label">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveAttribute('title', 'Badge Title');
      expect(badge).toHaveAttribute('aria-label', 'Label');
    });
  });
});
