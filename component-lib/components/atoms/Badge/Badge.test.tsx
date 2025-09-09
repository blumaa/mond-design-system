import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders badge with text content', () => {
    render(<Badge>New</Badge>);
    const badgeElement = screen.getByText('New');
    expect(badgeElement).toBeInTheDocument();
  });

  it('renders with custom content', () => {
    render(<Badge>🚀 Launch</Badge>);
    const badgeElement = screen.getByText('🚀 Launch');
    expect(badgeElement).toBeInTheDocument();
  });

  describe('variants', () => {
    it('renders default variant correctly', () => {
      render(<Badge variant="default" data-testid="default-badge">Default</Badge>);
      const badgeElement = screen.getByTestId('default-badge');
      expect(badgeElement).toHaveStyle('border: 1px solid #cbd5e1');
    });

    it('renders primary variant correctly', () => {
      render(<Badge variant="primary" data-testid="primary-badge">Primary</Badge>);
      const badgeElement = screen.getByTestId('primary-badge');
      expect(badgeElement).toHaveStyle('background-color: #0284c7');
      expect(badgeElement).toHaveStyle('color: #ffffff');
    });

    it('renders secondary variant correctly', () => {
      render(<Badge variant="secondary" data-testid="secondary-badge">Secondary</Badge>);
      const badgeElement = screen.getByTestId('secondary-badge');
      expect(badgeElement).toHaveStyle('border: 1px solid #cbd5e1');
    });

    it('renders success variant correctly', () => {
      render(<Badge variant="success" data-testid="success-badge">Success</Badge>);
      const badgeElement = screen.getByTestId('success-badge');
      expect(badgeElement).toHaveStyle('background-color: #f0fdf4');
      expect(badgeElement).toHaveStyle('color: #166534');
    });

    it('renders warning variant correctly', () => {
      render(<Badge variant="warning" data-testid="warning-badge">Warning</Badge>);
      const badgeElement = screen.getByTestId('warning-badge');
      expect(badgeElement).toHaveStyle('background-color: #fffbeb');
      expect(badgeElement).toHaveStyle('color: #92400e');
    });

    it('renders error variant correctly', () => {
      render(<Badge variant="error" data-testid="error-badge">Error</Badge>);
      const badgeElement = screen.getByTestId('error-badge');
      expect(badgeElement).toHaveStyle('background-color: #fef2f2');
      expect(badgeElement).toHaveStyle('color: #991b1b');
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Badge size="sm" data-testid="sm-badge">Small</Badge>);
      const badgeElement = screen.getByTestId('sm-badge');
      expect(badgeElement).toHaveStyle('font-size: 0.75rem');
      expect(badgeElement).toHaveStyle('height: 20px');
    });

    it('renders medium size correctly', () => {
      render(<Badge size="md" data-testid="md-badge">Medium</Badge>);
      const badgeElement = screen.getByTestId('md-badge');
      expect(badgeElement).toHaveStyle('font-size: 0.875rem');
      expect(badgeElement).toHaveStyle('height: 24px');
    });

    it('renders large size correctly', () => {
      render(<Badge size="lg" data-testid="lg-badge">Large</Badge>);
      const badgeElement = screen.getByTestId('lg-badge');
      expect(badgeElement).toHaveStyle('font-size: 1rem');
      expect(badgeElement).toHaveStyle('height: 32px');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      render(<Badge isDarkMode data-testid="dark-badge">Dark</Badge>);
      const badgeElement = screen.getByTestId('dark-badge');
      expect(badgeElement).toHaveStyle('background-color: #171717');
      expect(badgeElement).toHaveStyle('color: #94a3b8');
    });

    it('applies light mode styling by default', () => {
      render(<Badge data-testid="light-badge">Light</Badge>);
      const badgeElement = screen.getByTestId('light-badge');
      expect(badgeElement).toHaveStyle('background-color: #ffffff');
      expect(badgeElement).toHaveStyle('color: #475569');
    });
  });

  describe('styling', () => {
    it('applies correct base styles', () => {
      render(<Badge data-testid="styled-badge">Styled</Badge>);
      const badgeElement = screen.getByTestId('styled-badge');
      
      expect(badgeElement).toHaveStyle('display: inline-flex');
      expect(badgeElement).toHaveStyle('align-items: center');
      expect(badgeElement).toHaveStyle('justify-content: center');
      expect(badgeElement).toHaveStyle('border-radius: 9999px');
      expect(badgeElement).toHaveStyle('font-weight: 500');
      expect(badgeElement).toHaveStyle('white-space: nowrap');
      expect(badgeElement).toHaveStyle('user-select: none');
    });

    it('applies font family', () => {
      render(<Badge data-testid="font-badge">Font Test</Badge>);
      const badgeElement = screen.getByTestId('font-badge');
      expect(badgeElement).toHaveStyle("font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
    });
  });

  describe('accessibility', () => {
    it('supports custom props', () => {
      render(
        <Badge 
          data-testid="custom-badge"
          role="status"
          aria-label="Status indicator"
        >
          Status
        </Badge>
      );
      
      const badgeElement = screen.getByTestId('custom-badge');
      expect(badgeElement).toHaveAttribute('role', 'status');
      expect(badgeElement).toHaveAttribute('aria-label', 'Status indicator');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('content variations', () => {
    it('renders numeric badges', () => {
      render(<Badge variant="error">99+</Badge>);
      const badgeElement = screen.getByText('99+');
      expect(badgeElement).toBeInTheDocument();
    });

    it('renders icon badges', () => {
      render(
        <Badge variant="success">
          <span data-testid="check-icon">✓</span>
        </Badge>
      );
      const iconElement = screen.getByTestId('check-icon');
      expect(iconElement).toBeInTheDocument();
    });

    it('renders empty badges gracefully', () => {
      render(<Badge data-testid="empty-badge"></Badge>);
      const badgeElement = screen.getByTestId('empty-badge');
      expect(badgeElement).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class" data-testid="class-badge">Custom</Badge>);
    const badgeElement = screen.getByTestId('class-badge');
    expect(badgeElement).toHaveClass('custom-class');
  });
});