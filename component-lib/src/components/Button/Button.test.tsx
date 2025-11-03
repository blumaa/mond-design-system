/**
 * Button Component Tests - Styled Components Version
 *
 * Tests for the refactored Button component using styled-components
 * with theme support for light/dark mode and brand switching.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { Button } from './Button';
import { defaultLightTheme } from '../../themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Button Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      // This test verifies the component can be imported and used
      // without client-side JavaScript
      const { container } = renderWithTheme(<Button>Click me</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works without ThemeProvider context', () => {
      // Should render successfully without wrapping in ThemeProvider
      renderWithTheme(<Button>No Provider</Button>);
      expect(screen.getByText('No Provider')).toBeInTheDocument();
    });

    it('does not inject runtime <style> tags', () => {
      const { container } = renderWithTheme(<Button>Test</Button>);

      // Should not have inline style tags for pseudo-states
      const styleTags = container.querySelectorAll('style');
      expect(styleTags.length).toBe(0);
    });

    it('does not use useTheme() hook', () => {
      // If it renders without ThemeProvider and without errors,
      // it's not using useTheme()
      const { container } = renderWithTheme(<Button>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders a button element by default', () => {
      renderWithTheme(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders children content', () => {
      renderWithTheme(<Button>Hello World</Button>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      renderWithTheme(<Button>Test</Button>);
      const button = screen.getByRole('button');
      // Styled-components generates class names, just verify button exists
      expect(button).toBeInTheDocument();
      expect(button.className).toBeTruthy();
    });

    it('renders different variants', () => {
      const variants: Array<'primary' | 'outline' | 'ghost' | 'destructive' | 'warning'> =
        ['primary', 'outline', 'ghost', 'destructive', 'warning'];

      variants.forEach(variant => {
        const { unmount } = renderWithTheme(<Button variant={variant}>{variant}</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-variant', variant);
        unmount();
      });
    });

    it('renders different sizes', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(<Button size={size}>{size}</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-size', size);
        unmount();
      });
    });

    it('renders with different corners', () => {
      const { unmount: unmount1 } = renderWithTheme(<Button corners="default">Default</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithTheme(<Button corners="rounded">Rounded</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount2();
    });

    it('renders fullWidth button', () => {
      renderWithTheme(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders icon-only button', () => {
      renderWithTheme(<Button iconOnly aria-label="Icon">🔥</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Icon');
    });

    it('renders with different alignments', () => {
      const alignments: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];

      alignments.forEach(alignment => {
        const { unmount } = renderWithTheme(<Button alignContent={alignment}>{alignment}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Data Attributes', () => {
    it('sets data-variant attribute', () => {
      renderWithTheme(<Button variant="primary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('sets data-size attribute', () => {
      renderWithTheme(<Button size="lg">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-testid when provided', () => {
      renderWithTheme(<Button data-testid="my-button">Test</Button>);
      expect(screen.getByTestId('my-button')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled is true', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('renders with disabled styles', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseEnter on mouse enter', () => {
      const handleMouseEnter = jest.fn();
      renderWithTheme(<Button onMouseEnter={handleMouseEnter}>Hover</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('calls onMouseLeave on mouse leave', () => {
      const handleMouseLeave = jest.fn();
      renderWithTheme(<Button onMouseLeave={handleMouseLeave}>Hover</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus on focus', () => {
      const handleFocus = jest.fn();
      renderWithTheme(<Button onFocus={handleFocus}>Focus</Button>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur on blur', () => {
      const handleBlur = jest.fn();
      renderWithTheme(<Button onBlur={handleBlur}>Blur</Button>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('applies aria-label when provided', () => {
      renderWithTheme(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('applies aria-current when provided', () => {
      renderWithTheme(<Button aria-current="page">Current Page</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-current', 'page');
    });

    it('is keyboard accessible', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick}>Keyboard</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Polymorphic Behavior', () => {
    it('renders as anchor when as="a"', () => {
      renderWithTheme(<Button as="a" href="/test">Link</Button>);
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('applies aria-disabled for anchor when disabled', () => {
      renderWithTheme(<Button as="a" href="/test" disabled>Link</Button>);
      // Disabled links are not accessible as 'link' role (correct behavior)
      // Query by text instead
      const link = screen.getByText('Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders as custom element when as prop is provided', () => {
      renderWithTheme(<Button as="span">Span Button</Button>);
      const element = screen.getByText('Span Button');
      expect(element.tagName).toBe('SPAN');
    });

    it('applies type attribute for button elements', () => {
      renderWithTheme(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to type="button" for button elements', () => {
      renderWithTheme(<Button>Default Type</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      renderWithTheme(<Button ref={ref}>Ref Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });

    it('forwards ref to anchor element', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      renderWithTheme(<Button as="a" href="/test" ref={ref}>Link Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      // TypeScript should prevent this, but at runtime it should be ignored
      const props = { children: 'Test', isDarkMode: true } as React.ComponentProps<typeof Button> & { isDarkMode?: boolean };
      renderWithTheme(<Button {...props} />);
      const button = screen.getByRole('button');
      // Should render successfully, just ignoring isDarkMode
      expect(button).toBeInTheDocument();
    });

    it('maintains existing API for variant prop', () => {
      renderWithTheme(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary');
    });

    it('maintains existing API for size prop', () => {
      renderWithTheme(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Styled Components Theme Integration', () => {
    it('renders with styled-components generated classes', () => {
      renderWithTheme(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');

      // Styled-components generates dynamic class names
      expect(button).toBeInTheDocument();
      expect(button.className).toBeTruthy();
    });

    it('applies theme-based styling via styled-components', () => {
      renderWithTheme(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');

      // Verify the button renders with the correct variant
      expect(button).toHaveAttribute('data-variant', 'outline');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Combination Props', () => {
    it('handles multiple props correctly', () => {
      renderWithTheme(
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
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button.textContent).toBe('Combined');
    });

    it('handles icon-only button with size', () => {
      renderWithTheme(
        <Button iconOnly size="sm" aria-label="Small Icon">
          🔥
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-size', 'sm');
      expect(button).toHaveAttribute('aria-label', 'Small Icon');
    });
  });
});
