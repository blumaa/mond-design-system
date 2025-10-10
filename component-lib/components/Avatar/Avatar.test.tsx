import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import { Avatar } from './Avatar';

// Mock image loading
const mockImage = {
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
};

beforeAll(() => {
  // Mock Image constructor
  global.Image = class implements Partial<HTMLImageElement> {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = '';
    
    constructor() {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 100);
      return mockImage as unknown as HTMLImageElement;
    }
  } as typeof Image;
});

describe('Avatar Component', () => {
  it('renders avatar container', () => {
    render(<Avatar data-testid="avatar" />);
    const avatarElement = screen.getByTestId('avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('displays fallback when no src provided', () => {
    render(<Avatar fallback="John Doe" data-testid="avatar" />);
    const fallbackElement = screen.getByTestId('avatar-fallback');
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement).toHaveTextContent('JD');
  });

  it('generates initials from fallback text', () => {
    render(<Avatar fallback="Alice Bob Charlie" data-testid="avatar" />);
    const fallbackElement = screen.getByTestId('avatar-fallback');
    expect(fallbackElement).toHaveTextContent('AB');
  });

  it('shows question mark when no fallback provided', () => {
    render(<Avatar data-testid="avatar" />);
    const fallbackElement = screen.getByTestId('avatar-fallback');
    expect(fallbackElement).toHaveTextContent('?');
  });

  it('displays custom children as fallback', () => {
    render(
      <Avatar data-testid="avatar">
        <span data-testid="custom-fallback">👤</span>
      </Avatar>
    );
    const customFallback = screen.getByTestId('custom-fallback');
    expect(customFallback).toBeInTheDocument();
    expect(customFallback).toHaveTextContent('👤');
  });

  describe('image handling', () => {
    it('renders image when src is provided', () => {
      render(
        <Avatar 
          src="https://example.com/avatar.jpg" 
          alt="User avatar" 
          data-testid="avatar" 
        />
      );
      
      const imageElement = screen.getByAltText('User avatar');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('shows fallback when image fails to load', async () => {
      render(
        <Avatar 
          src="https://example.com/broken-image.jpg" 
          fallback="John Doe"
          data-testid="avatar" 
        />
      );

      const imageElement = screen.getByAltText('John Doe');
      
      // Simulate image error
      fireEvent.error(imageElement);
      
      await waitFor(() => {
        const fallbackElement = screen.getByTestId('avatar-fallback');
        expect(fallbackElement).toBeInTheDocument();
        expect(fallbackElement).toHaveTextContent('JD');
      });
    });

    it('uses fallback text as alt when no alt provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fallback="John Doe" />);
      const imageElement = screen.getByAltText('John Doe');
      expect(imageElement).toBeInTheDocument();
    });

    it('defaults to "Avatar" alt text when no alt or fallback provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />);
      const imageElement = screen.getByAltText('Avatar');
      expect(imageElement).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders extra small size correctly', () => {
      render(<Avatar size="xs" data-testid="xs-avatar" />);
      const avatarElement = screen.getByTestId('xs-avatar');
      expect(avatarElement).toHaveStyle('width: 24px');
      expect(avatarElement).toHaveStyle('height: 24px');
    });

    it('renders small size correctly', () => {
      render(<Avatar size="sm" data-testid="sm-avatar" />);
      const avatarElement = screen.getByTestId('sm-avatar');
      expect(avatarElement).toHaveStyle('width: 32px');
      expect(avatarElement).toHaveStyle('height: 32px');
    });

    it('renders medium size correctly', () => {
      render(<Avatar size="md" data-testid="md-avatar" />);
      const avatarElement = screen.getByTestId('md-avatar');
      expect(avatarElement).toHaveStyle('width: 40px');
      expect(avatarElement).toHaveStyle('height: 40px');
    });

    it('renders large size correctly', () => {
      render(<Avatar size="lg" data-testid="lg-avatar" />);
      const avatarElement = screen.getByTestId('lg-avatar');
      expect(avatarElement).toHaveStyle('width: 48px');
      expect(avatarElement).toHaveStyle('height: 48px');
    });

    it('renders extra large size correctly', () => {
      render(<Avatar size="xl" data-testid="xl-avatar" />);
      const avatarElement = screen.getByTestId('xl-avatar');
      expect(avatarElement).toHaveStyle('width: 64px');
      expect(avatarElement).toHaveStyle('height: 64px');
    });

    it('renders 2xl size correctly', () => {
      render(<Avatar size="2xl" data-testid="2xl-avatar" />);
      const avatarElement = screen.getByTestId('2xl-avatar');
      expect(avatarElement).toHaveStyle('width: 80px');
      expect(avatarElement).toHaveStyle('height: 80px');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      renderWithDarkMode(<Avatar fallback="Dark" data-testid="dark-avatar" />);
      const avatarElement = screen.getByTestId('dark-avatar');
      expect(avatarElement).toHaveStyle('background-color: #171717');
    });

    it('applies light mode styling by default', () => {
      render(<Avatar fallback="Light" data-testid="light-avatar" />);
      const avatarElement = screen.getByTestId('light-avatar');
      expect(avatarElement).toHaveStyle('background-color: #ffffff');
    });
  });

  describe('styling', () => {
    it('applies correct base styles', () => {
      render(<Avatar data-testid="styled-avatar" />);
      const avatarElement = screen.getByTestId('styled-avatar');
      
      expect(avatarElement).toHaveStyle('display: inline-flex');
      expect(avatarElement).toHaveStyle('align-items: center');
      expect(avatarElement).toHaveStyle('justify-content: center');
      expect(avatarElement).toHaveStyle('border-radius: 9999px');
      expect(avatarElement).toHaveStyle('overflow: hidden');
      expect(avatarElement).toHaveStyle('flex-shrink: 0');
    });

    it('applies correct fallback text styles', () => {
      render(<Avatar fallback="AB" data-testid="avatar" />);
      const fallbackElement = screen.getByTestId('avatar-fallback');
      
      expect(fallbackElement).toHaveStyle('display: flex');
      expect(fallbackElement).toHaveStyle('align-items: center');
      expect(fallbackElement).toHaveStyle('justify-content: center');
      expect(fallbackElement).toHaveStyle('text-transform: uppercase');
      expect(fallbackElement).toHaveStyle('user-select: none');
      expect(fallbackElement).toHaveStyle('font-weight: 500');
    });

    it('applies font family to fallback', () => {
      render(<Avatar fallback="Test" data-testid="avatar" />);
      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveStyle("font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
    });
  });

  describe('accessibility', () => {
    it('supports custom props', () => {
      render(
        <Avatar 
          data-testid="custom-avatar"
          role="img"
          aria-label="User profile picture"
        />
      );
      
      const avatarElement = screen.getByTestId('custom-avatar');
      expect(avatarElement).toHaveAttribute('role', 'img');
      expect(avatarElement).toHaveAttribute('aria-label', 'User profile picture');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-class" data-testid="class-avatar" />);
    const avatarElement = screen.getByTestId('class-avatar');
    expect(avatarElement).toHaveClass('custom-class');
  });

  describe('edge cases', () => {
    it('handles empty fallback text', () => {
      render(<Avatar fallback="" data-testid="avatar" />);
      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveTextContent('?');
    });

    it('handles single character fallback', () => {
      render(<Avatar fallback="A" data-testid="avatar" />);
      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveTextContent('A');
    });

    it('handles fallback with special characters', () => {
      render(<Avatar fallback="John-Paul O'Connor" data-testid="avatar" />);
      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveTextContent('JO');
    });
  });
});
