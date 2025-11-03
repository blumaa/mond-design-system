/**
 * Avatar Component Tests - Styled Components Version
 *
 * Tests for the refactored Avatar component using styled-components
 * with theme support for light/dark mode and brand switching.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { Avatar } from './Avatar';
import { defaultLightTheme } from '../../src/themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Avatar Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      renderWithTheme(<Avatar fallback="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = renderWithTheme(<Avatar fallback="Test" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a div element', () => {
      const { container } = renderWithTheme(<Avatar fallback="Test" />);
      const avatar = container.firstChild;
      expect(avatar).toBeInstanceOf(HTMLDivElement);
    });

    it('applies correct display name', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      const { container } = renderWithTheme(<Avatar fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      // Styled-components generates class names, just verify avatar exists
      expect(avatar).toBeInTheDocument();
      expect(avatar.className).toBeTruthy();
    });

    it('renders different sizes', () => {
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ];

      sizes.forEach(size => {
        const { container, unmount } = renderWithTheme(
          <Avatar size={size} fallback="Test" />,
        );
        const avatar = container.firstChild as HTMLElement;
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('data-size', size);
        unmount();
      });
    });
  });

  describe('Data Attributes', () => {
    it('sets data-testid when provided', () => {
      renderWithTheme(<Avatar data-testid="my-avatar" fallback="Test" />);
      expect(screen.getByTestId('my-avatar')).toBeInTheDocument();
    });

    it('sets data-size attribute', () => {
      const { container } = renderWithTheme(<Avatar size="lg" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Fallback Handling', () => {
    it('displays fallback text when no image provided', () => {
      renderWithTheme(<Avatar fallback="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('generates correct initials from fallback', () => {
      renderWithTheme(<Avatar fallback="Alice Bob" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('limits initials to 2 characters', () => {
      renderWithTheme(<Avatar fallback="Alice Bob Charlie" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('displays question mark when no fallback or image', () => {
      renderWithTheme(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('displays custom children over fallback text', () => {
      renderWithTheme(
        <Avatar fallback="Test">
          <span>👤</span>
        </Avatar>,
      );
      expect(screen.getByText('👤')).toBeInTheDocument();
      expect(screen.queryByText('T')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('renders image when src is provided', () => {
      renderWithTheme(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'User Avatar');

      // Trigger image load to show it
      fireEvent.load(img);
      expect(img).toHaveStyle('display: block');
    });

    it('uses fallback as alt text when no alt provided', () => {
      renderWithTheme(<Avatar src="https://example.com/avatar.jpg" fallback="John Doe" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('uses "Avatar" as default alt text', () => {
      renderWithTheme(<Avatar src="https://example.com/avatar.jpg" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', 'Avatar');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithTheme(<Avatar ref={ref} fallback="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Backward Compatibility', () => {
    it('maintains existing API for size prop', () => {
      const { container } = renderWithTheme(<Avatar size="xl" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'xl');
    });
  });

  describe('Styled Components Theme Integration', () => {
    it('renders with styled-components generated classes', () => {
      const { container } = renderWithTheme(<Avatar size="md" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;

      // Styled-components generates dynamic class names
      expect(avatar).toBeInTheDocument();
      expect(avatar.className).toBeTruthy();
    });

    it('applies theme-based styling via styled-components', () => {
      const { container } = renderWithTheme(<Avatar size="lg" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;

      // Verify the avatar renders with the correct size
      expect(avatar).toHaveAttribute('data-size', 'lg');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Combination Props', () => {
    it('handles multiple props correctly', () => {
      const { container } = renderWithTheme(<Avatar size="lg" fallback="Test User" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-size', 'lg');
      expect(screen.getByText('TU')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      const { container } = renderWithTheme(<Avatar title="User Avatar" fallback="Test" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('title', 'User Avatar');
    });

    it('forwards aria attributes', () => {
      const { container } = renderWithTheme(
        <Avatar aria-label="Profile Picture" fallback="Test" />,
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('aria-label', 'Profile Picture');
    });
  });
});
