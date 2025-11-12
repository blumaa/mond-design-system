import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Link } from './Link';

describe('Link Component', () => {
  describe('Basic Rendering', () => {
    it('renders as an anchor element', () => {
      render(<Link href="/test">Link</Link>);
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Link href="/test" size="small">Small</Link>);
      expect(screen.getByText('Small')).toHaveClass('mond-link--small');

      rerender(<Link href="/test" size="large">Large</Link>);
      expect(screen.getByText('Large')).toHaveClass('mond-link--large');
    });

    it('renders icon-only link', () => {
      const icon = <span>Icon</span>;
      render(<Link href="/test" iconOnly icon={icon} />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('mond-link--icon-only');
    });

    it('renders with icon', () => {
      const icon = <span data-testid="icon">Icon</span>;
      render(<Link href="/test" icon={icon}>Link with Icon</Link>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Link with Icon')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Link href="/test" onClick={handleClick}>Click me</Link>);
      fireEvent.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseEnter and onMouseLeave', () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      render(
        <Link href="/test" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover me
        </Link>
      );
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      fireEvent.mouseLeave(link);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(<Link href="/test" ref={ref}>Ref Test</Link>);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it('forwards HTML attributes', () => {
      render(
        <Link href="/test" target="_blank" rel="noopener" aria-label="Label">
          External
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
      expect(link).toHaveAttribute('aria-label', 'Label');
    });
  });
});
