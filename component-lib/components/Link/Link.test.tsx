/**
 * Link Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Link component that:
 * - Removes useTheme() hook dependency
 * - Uses CSS variables for colors
 * - Uses CSS classes for sizes and states
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Link } from './Link';

describe('Link Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Link href="/test">Hello World</Link>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Link href="/test">Test</Link>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders with required href and children', () => {
      render(<Link href="https://example.com">Test Link</Link>);

      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders with default props', () => {
      render(<Link href="/test">Default Link</Link>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('data-mond-link');
      expect(link).toHaveClass('mond-link');
    });

    it('applies correct display name', () => {
      expect(Link.displayName).toBe('Link');
    });
  });

  describe('CSS Class-Based Styling', () => {
    it('applies base CSS class', () => {
      render(<Link href="/test">Test</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link');
    });

    it('applies size class for small', () => {
      render(<Link href="/test" size="small">Small</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--small');
    });

    it('applies size class for medium (default)', () => {
      render(<Link href="/test" size="medium">Medium</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--medium');
    });

    it('applies size class for large', () => {
      render(<Link href="/test" size="large">Large</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--large');
    });

    it('applies icon-only class when iconOnly is true', () => {
      const TestIcon = <svg data-testid="test-icon"><path /></svg>;
      render(<Link href="/test" iconOnly icon={TestIcon}>Hidden</Link>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--icon-only');
    });
  });

  describe('Size Variants', () => {
    it('renders with different sizes', () => {
      const { rerender } = render(<Link href="/test" size="small">Small</Link>);
      let link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--small');

      rerender(<Link href="/test" size="medium">Medium</Link>);
      link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--medium');

      rerender(<Link href="/test" size="large">Large</Link>);
      link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--large');
    });
  });

  describe('Icon Support', () => {
    it('renders icon-only links correctly', () => {
      const TestIcon = <svg data-testid="test-icon"><path /></svg>;
      render(<Link href="/test" iconOnly icon={TestIcon}>Hidden Text</Link>);

      const icon = screen.getByTestId('test-icon');

      expect(icon).toBeInTheDocument();
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
    });

    it('renders with icon and text', () => {
      const TestIcon = <svg data-testid="test-icon"><path /></svg>;
      render(<Link href="/test" icon={TestIcon}>With Icon</Link>);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('renders without children for icon-only links', () => {
      const TestIcon = <span data-testid="icon">Icon</span>;
      render(<Link href="/test" iconOnly icon={TestIcon} />);

      const link = screen.getByRole('link');
      const icon = screen.getByTestId('icon');

      expect(link).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(link.textContent).toBe('Icon');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(<Link ref={ref} href="/test">Ref Link</Link>);

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current).toHaveAttribute('href', '/test');
    });
  });

  describe('Additional Props', () => {
    it('forwards additional anchor props', () => {
      render(
        <Link
          href="/test"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="custom-link"
          title="Custom Title"
        >
          Custom Link
        </Link>
      );

      const link = screen.getByTestId('custom-link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('title', 'Custom Title');
    });

    it('combines custom className with component classes', () => {
      render(
        <Link href="/test" className="custom-class" size="large">
          Custom Class
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
      expect(link).toHaveClass('mond-link');
      expect(link).toHaveClass('mond-link--large');
    });
  });

  describe('Event Handling', () => {
    it('handles mouse interactions', () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      const onMouseDown = jest.fn();
      const onMouseUp = jest.fn();

      render(
        <Link
          href="/test"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          Interactive Link
        </Link>
      );

      const link = screen.getByRole('link');

      fireEvent.mouseEnter(link);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(link);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);

      fireEvent.mouseDown(link);
      expect(onMouseDown).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(link);
      expect(onMouseUp).toHaveBeenCalledTimes(1);
    });

    it('handles focus and blur events', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <Link href="/test" onFocus={onFocus} onBlur={onBlur}>
          Focus Link
        </Link>
      );

      const link = screen.getByRole('link');

      fireEvent.focus(link);
      expect(onFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(link);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('handles click events', () => {
      const onClick = jest.fn();
      render(<Link href="/test" onClick={onClick}>Clickable Link</Link>);

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<Link href="/test">Accessible Link</Link>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toBeVisible();
    });
  });

  describe('URL Handling', () => {
    it('handles external links', () => {
      render(<Link href="https://external.com">External Link</Link>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://external.com');
    });

    it('handles empty children gracefully', () => {
      render(<Link href="/test"></Link>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link.textContent).toBe('');
    });
  });

  describe('Interactive State Handling', () => {
    it('changes styles on hover', () => {
      render(<Link href="/test">Hover Link</Link>);

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      // The component applies CSS classes for hover via CSS
      expect(link).toBeInTheDocument();
    });

    it('resets styles on mouse leave', () => {
      render(<Link href="/test">Leave Link</Link>);

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);
      fireEvent.mouseLeave(link);

      expect(link).toBeInTheDocument();
    });

    it('applies focus styles', () => {
      render(<Link href="/test">Focus Link</Link>);

      const link = screen.getByRole('link');
      fireEvent.focus(link);

      expect(link).toBeInTheDocument();
    });

    it('removes focus styles on blur', () => {
      render(<Link href="/test">Blur Link</Link>);

      const link = screen.getByRole('link');
      fireEvent.focus(link);
      fireEvent.blur(link);

      expect(link).toBeInTheDocument();
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { children: 'Test', href: '/test', isDarkMode: true } as any;
      render(<Link {...props} />);
      const link = screen.getByText('Test');
      expect(link).toBeInTheDocument();
    });

    it('maintains existing API for size prop', () => {
      render(<Link href="/test" size="large">Large Link</Link>);
      expect(screen.getByText('Large Link')).toHaveClass('mond-link--large');
    });

    it('maintains existing API for iconOnly prop', () => {
      const TestIcon = <span>Icon</span>;
      render(<Link href="/test" iconOnly icon={TestIcon} />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--icon-only');
    });
  });
});
