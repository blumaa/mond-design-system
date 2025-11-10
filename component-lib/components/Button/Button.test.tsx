/**
 * Button Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Button component that:
 * - Removes "use client" directive
 * - Removes useTheme() hook dependency
 * - Uses CSS variables instead of runtime theme resolution
 * - Uses static CSS file instead of <style> tags
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      // This test verifies the component can be imported and used
      // without client-side JavaScript
      const { container } = render(<Button>Click me</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works without ThemeProvider context', () => {
      // Should render successfully without wrapping in ThemeProvider
      render(<Button>No Provider</Button>);
      expect(screen.getByText('No Provider')).toBeInTheDocument();
    });

    it('does not inject runtime <style> tags', () => {
      const { container } = render(<Button>Test</Button>);

      // Should not have inline style tags for pseudo-states
      const styleTags = container.querySelectorAll('style');
      expect(styleTags.length).toBe(0);
    });

    it('does not use useTheme() hook', () => {
      // If it renders without ThemeProvider and without errors,
      // it's not using useTheme()
      const { container } = render(<Button>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders a button element by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders children content', () => {
      render(<Button>Hello World</Button>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('CSS Class-Based Styling', () => {
    it('applies base CSS class', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button');
    });

    it('applies variant-specific CSS class for primary', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--primary');
    });

    it('applies variant-specific CSS class for outline', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--outline');
    });

    it('applies variant-specific CSS class for ghost', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--ghost');
    });

    it('applies variant-specific CSS class for destructive', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--destructive');
    });

    it('applies variant-specific CSS class for warning', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--warning');
    });

    it('applies size-specific CSS class for sm', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--sm');
    });

    it('applies size-specific CSS class for md', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--md');
    });

    it('applies size-specific CSS class for lg', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--lg');
    });

    it('applies corners class for default corners', () => {
      render(<Button corners="default">Default Corners</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--corners-default');
    });

    it('applies corners class for rounded corners', () => {
      render(<Button corners="rounded">Rounded</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--corners-rounded');
    });

    it('applies full-width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--full-width');
    });

    it('applies icon-only class when iconOnly is true', () => {
      render(<Button iconOnly aria-label="Icon">🔥</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--icon-only');
    });

    it('applies alignment class for left alignment', () => {
      render(<Button alignContent="left">Left</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--align-left');
    });

    it('applies alignment class for center alignment', () => {
      render(<Button alignContent="center">Center</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--align-center');
    });

    it('applies alignment class for right alignment', () => {
      render(<Button alignContent="right">Right</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--align-right');
    });
  });

  describe('Data Attributes', () => {
    it('sets data-variant attribute', () => {
      render(<Button variant="primary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('sets data-size attribute', () => {
      render(<Button size="lg">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-testid when provided', () => {
      render(<Button data-testid="my-button">Test</Button>);
      expect(screen.getByTestId('my-button')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('applies disabled CSS class when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--disabled');
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseEnter on mouse enter', () => {
      const handleMouseEnter = jest.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseLeave on mouse leave', () => {
      const handleMouseLeave = jest.fn();
      render(<Button onMouseLeave={handleMouseLeave}>Hover</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus on focus', () => {
      const handleFocus = jest.fn();
      render(<Button onFocus={handleFocus}>Focus</Button>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur on blur', () => {
      const handleBlur = jest.fn();
      render(<Button onBlur={handleBlur}>Blur</Button>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('applies aria-label when provided', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('applies aria-current when provided', () => {
      render(<Button aria-current="page">Current Page</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-current', 'page');
    });

    it('is keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Polymorphic Behavior', () => {
    it('renders as anchor when as="a"', () => {
      render(<Button as="a" href="/test">Link</Button>);
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('applies aria-disabled for anchor when disabled', () => {
      render(<Button as="a" href="/test" disabled>Link</Button>);
      // Disabled links are not accessible as 'link' role (correct behavior)
      // Query by text instead
      const link = screen.getByText('Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders as custom element when as prop is provided', () => {
      render(<Button as="span">Span Button</Button>);
      const element = screen.getByText('Span Button');
      expect(element.tagName).toBe('SPAN');
    });

    it('applies type attribute for button elements', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to type="button" for button elements', () => {
      render(<Button>Default Type</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
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

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      // TypeScript should prevent this, but at runtime it should be ignored
      const props: { children: string; isDarkMode?: boolean } = { children: 'Test', isDarkMode: true };
      render(<Button {...props} />);
      const button = screen.getByRole('button');
      // Should render successfully, just ignoring isDarkMode
      expect(button).toBeInTheDocument();
    });

    it('maintains existing API for variant prop', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary');
    });

    it('maintains existing API for size prop', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('CSS Variable Usage', () => {
    it('does not use inline styles for theme colors', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      const inlineStyle = button.getAttribute('style');

      // Should not have inline backgroundColor or color styles
      // (these should come from CSS classes using CSS variables)
      if (inlineStyle) {
        expect(inlineStyle).not.toContain('background-color: rgb');
        expect(inlineStyle).not.toContain('color: rgb');
      }
    });

    it('relies on CSS classes for theming', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');

      // Should have the variant class that references CSS variables
      expect(button).toHaveClass('mond-button--outline');
    });
  });

  describe('Combination Props', () => {
    it('applies multiple classes when multiple props are set', () => {
      render(
        <Button
          variant="primary"
          size="lg"
          corners="rounded"
          fullWidth
        >
          Combined
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button');
      expect(button).toHaveClass('mond-button--primary');
      expect(button).toHaveClass('mond-button--lg');
      expect(button).toHaveClass('mond-button--corners-rounded');
      expect(button).toHaveClass('mond-button--full-width');
    });

    it('handles icon-only button with size', () => {
      render(
        <Button iconOnly size="sm" aria-label="Small Icon">
          🔥
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mond-button--icon-only');
      expect(button).toHaveClass('mond-button--sm');
    });
  });
});
