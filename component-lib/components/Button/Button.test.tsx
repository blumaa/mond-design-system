import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders a button element by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveTextContent('Click me');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('mond-button--primary');

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('mond-button--destructive');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
    });

    it('renders full-width button', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('mond-button--full-width');
    });

    it('renders icon-only button', () => {
      render(<Button iconOnly aria-label="Icon"><span>Icon</span></Button>);
      expect(screen.getByRole('button')).toHaveClass('mond-button--icon-only');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('disables button when loading is true', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const spinner = document.querySelector('.mond-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('replaces icon with spinner when iconOnly and loading', () => {
      render(
        <Button iconOnly loading aria-label="Loading icon">
          <span data-testid="icon">Icon</span>
        </Button>
      );
      const spinner = document.querySelector('.mond-spinner');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });

    it('shows spinner and content when loading but not iconOnly', () => {
      render(<Button loading>Loading Button</Button>);
      const spinner = document.querySelector('.mond-spinner');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading Button')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseEnter on mouse enter', () => {
      const handleMouseEnter = jest.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover me</Button>);
      fireEvent.mouseEnter(screen.getByRole('button'));
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus on focus', () => {
      const handleFocus = jest.fn();
      render(<Button onFocus={handleFocus}>Focus me</Button>);
      fireEvent.focus(screen.getByRole('button'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('applies aria-label when provided', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('is keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Polymorphic Behavior', () => {
    it('renders as anchor when as="a"', () => {
      render(<Button as="a" href="/test">Link Button</Button>);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('applies aria-disabled for anchor when disabled', () => {
      render(<Button as="a" href="/test" disabled>Disabled Link</Button>);
      const link = screen.getByText('Disabled Link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('removes href when loading on anchor element', () => {
      render(<Button as="a" href="/test" loading>Loading Link</Button>);
      const link = screen.getByText('Loading Link');
      expect(link).not.toHaveAttribute('href');
    });

    it('applies type attribute for button elements', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });

    it('forwards ref to anchor element', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(<Button as="a" href="/test" ref={ref}>Link Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });
});
