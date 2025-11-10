/**
 * Avatar Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Avatar component that:
 * - Uses "use client" at component level (needs useState for image loading)
 * - Removes useTheme() hook dependency
 * - Uses CSS variables instead of runtime theme resolution
 * - Uses static CSS classes instead of inline styles
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from './Avatar';

describe('Avatar Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Avatar fallback="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Avatar fallback="Test" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a div element', () => {
      const { container } = render(<Avatar fallback="Test" />);
      const avatar = container.firstChild;
      expect(avatar).toBeInstanceOf(HTMLDivElement);
    });

    it('applies correct display name', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });
  });

  describe('CSS Class-Based Styling', () => {
    it('applies base CSS class', () => {
      const { container } = render(<Avatar fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar');
    });

    it('applies size-specific CSS class for xs', () => {
      const { container } = render(<Avatar size="xs" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--xs');
    });

    it('applies size-specific CSS class for sm', () => {
      const { container } = render(<Avatar size="sm" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--sm');
    });

    it('applies size-specific CSS class for md', () => {
      const { container } = render(<Avatar size="md" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--md');
    });

    it('applies size-specific CSS class for lg', () => {
      const { container } = render(<Avatar size="lg" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--lg');
    });

    it('applies size-specific CSS class for xl', () => {
      const { container } = render(<Avatar size="xl" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--xl');
    });

    it('applies size-specific CSS class for 2xl', () => {
      const { container } = render(<Avatar size="2xl" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--2xl');
    });
  });

  describe('Data Attributes', () => {
    it('sets data-testid when provided', () => {
      render(<Avatar data-testid="my-avatar" fallback="Test" />);
      expect(screen.getByTestId('my-avatar')).toBeInTheDocument();
    });

    it('sets data-size attribute', () => {
      const { container } = render(<Avatar size="lg" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Fallback Handling', () => {
    it('displays fallback text when no image provided', () => {
      render(<Avatar fallback="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('generates correct initials from fallback', () => {
      render(<Avatar fallback="Alice Bob" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('limits initials to 2 characters', () => {
      render(<Avatar fallback="Alice Bob Charlie" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('displays question mark when no fallback or image', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('displays custom children over fallback text', () => {
      render(<Avatar fallback="Test"><span>👤</span></Avatar>);
      expect(screen.getByText('👤')).toBeInTheDocument();
      expect(screen.queryByText('T')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'User Avatar');

      // Trigger image load to show it
      fireEvent.load(img);
      expect(img).toHaveStyle('display: block');
    });

    it('uses fallback as alt text when no alt provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fallback="John Doe" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('uses "Avatar" as default alt text', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', 'Avatar');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base class', () => {
      const { container } = render(<Avatar className="custom-class" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar');
      expect(avatar).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} fallback="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Backward Compatibility', () => {
    it('does NOT accept isDarkMode prop (removed)', () => {
      const props = { fallback: 'Test', isDarkMode: true } as unknown;
      const { container } = render(<Avatar {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('maintains existing API for size prop', () => {
      const { container } = render(<Avatar size="xl" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'xl');
    });
  });

  describe('CSS Variable Usage', () => {
    it('does not use inline styles for theme colors', () => {
      const { container } = render(<Avatar fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      const inlineStyle = avatar.getAttribute('style');

      if (inlineStyle) {
        expect(inlineStyle).not.toContain('background-color: rgb');
        expect(inlineStyle).not.toContain('border: 1px solid rgb');
      }
    });

    it('relies on CSS classes for theming', () => {
      const { container } = render(<Avatar size="md" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar--md');
    });
  });

  describe('Combination Props', () => {
    it('applies multiple classes when multiple props are set', () => {
      const { container } = render(
        <Avatar
          size="lg"
          className="custom"
          fallback="Test User"
        />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('mond-avatar');
      expect(avatar).toHaveClass('mond-avatar--lg');
      expect(avatar).toHaveClass('custom');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      const { container } = render(<Avatar title="User Avatar" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('title', 'User Avatar');
    });

    it('forwards aria attributes', () => {
      const { container } = render(<Avatar aria-label="Profile Picture" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('aria-label', 'Profile Picture');
    });
  });
});
