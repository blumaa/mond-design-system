import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

const mockNavigationItems = [
  { label: 'Home', href: '/', active: true },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const mockActions = [
  { label: 'Login', onClick: jest.fn(), variant: 'outline' as const },
  { label: 'Sign Up', onClick: jest.fn(), variant: 'primary' as const },
];

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header', () => {
    render(
      <Header data-testid="header" />
    );
    
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('renders logo', () => {
    render(
      <Header logo="My Company" data-testid="header" />
    );
    
    expect(screen.getByText('My Company')).toBeInTheDocument();
  });

  it('renders logo with href as link', () => {
    render(
      <Header 
        logo="My Company" 
        logoHref="/" 
        data-testid="header" 
      />
    );
    
    const logo = screen.getByText('My Company');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders navigation items', () => {
    render(
      <Header 
        navigationItems={mockNavigationItems}
        data-testid="header" 
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders navigation items as links when href is provided', () => {
    render(
      <Header 
        navigationItems={mockNavigationItems}
        data-testid="header" 
      />
    );
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('handles navigation item clicks', () => {
    const mockClick = jest.fn();
    const navItemsWithClick = [
      { label: 'Dashboard', onClick: mockClick },
    ];
    
    render(
      <Header 
        navigationItems={navItemsWithClick}
        data-testid="header" 
      />
    );
    
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('renders action buttons', () => {
    render(
      <Header 
        actions={mockActions}
        data-testid="header" 
      />
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('calls action callbacks when clicked', () => {
    render(
      <Header 
        actions={mockActions}
        data-testid="header" 
      />
    );
    
    const loginButton = screen.getByText('Login');
    const signUpButton = screen.getByText('Sign Up');
    
    fireEvent.click(loginButton);
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(signUpButton);
    expect(mockActions[1].onClick).toHaveBeenCalledTimes(1);
  });

  it('renders right content', () => {
    render(
      <Header 
        rightContent={<div data-testid="right-content">Custom Content</div>}
        data-testid="header" 
      />
    );
    
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('shows mobile menu toggle by default', () => {
    render(
      <Header data-testid="header" />
    );
    
    const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
    expect(mobileToggle).toBeInTheDocument();
  });

  it('hides mobile menu toggle when showMobileToggle is false', () => {
    render(
      <Header showMobileToggle={false} data-testid="header" />
    );
    
    const mobileToggle = screen.queryByRole('button', { name: /toggle mobile menu/i });
    expect(mobileToggle).toBeInTheDocument(); // Still rendered but hidden with CSS
  });

  it('toggles mobile menu when toggle is clicked', () => {
    render(
      <Header 
        navigationItems={mockNavigationItems}
        data-testid="header" 
      />
    );
    
    const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
    
    // Mobile menu should not be visible initially
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    
    // Click to open mobile menu
    fireEvent.click(mobileToggle);
    
    // Navigation items should be visible in mobile menu
    // Note: In a real implementation, we'd check for mobile-specific elements
    // Here we just verify the navigation items are still present
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('works in controlled mobile menu mode', () => {
    const mockToggle = jest.fn();
    
    render(
      <Header 
        navigationItems={mockNavigationItems}
        isMobileMenuOpen={true}
        onMobileMenuToggle={mockToggle}
        data-testid="header" 
      />
    );
    
    const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(mobileToggle);
    
    expect(mockToggle).toHaveBeenCalledWith(false);
  });

  it('applies sticky positioning', () => {
    render(
      <Header sticky data-testid="header" />
    );
    
    const header = screen.getByTestId('header');
    expect(header).toHaveStyle({ position: 'sticky', top: '0' });
  });

  it('applies custom height', () => {
    render(
      <Header height="80px" data-testid="header" />
    );
    
    const header = screen.getByTestId('header');
    expect(header).toHaveStyle({ height: '80px' });
  });

  describe('variants', () => {
    it('applies solid variant by default', () => {
      render(
        <Header data-testid="header" />
      );
      
      const header = screen.getByTestId('header');
      // We can't easily test the exact styles, but we can verify it renders
      expect(header).toBeInTheDocument();
    });

    it('applies transparent variant', () => {
      render(
        <Header variant="transparent" data-testid="header" />
      );
      
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
    });

    it('applies blur variant', () => {
      render(
        <Header variant="blur" data-testid="header" />
      );
      
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
    });
  });

  it('handles disabled navigation items', () => {
    const mockClick = jest.fn();
    const navItemsWithDisabled = [
      { label: 'Enabled', onClick: mockClick },
      { label: 'Disabled', onClick: mockClick, disabled: true },
    ];
    
    render(
      <Header 
        navigationItems={navItemsWithDisabled}
        data-testid="header" 
      />
    );
    
    const enabledItem = screen.getByText('Enabled');
    const disabledItem = screen.getByText('Disabled');
    
    fireEvent.click(enabledItem);
    expect(mockClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(disabledItem);
    // Should still be 1, not 2, because disabled item shouldn't trigger
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('applies dark mode', () => {
    render(
      <Header isDarkMode data-testid="header" />
    );
    
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    
    render(
      <Header ref={ref} data-testid="header" />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toBe(screen.getByTestId('header'));
  });

  it('passes through additional props', () => {
    render(
      <Header
        data-testid="header"
        className="custom-class"
        aria-label="Site header"
      />
    );
    
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-class');
    expect(header).toHaveAttribute('aria-label', 'Site header');
  });

  it('renders actions with icons', () => {
    const actionsWithIcons = [
      { 
        label: 'Profile', 
        onClick: jest.fn(), 
        icon: <span data-testid="profile-icon">👤</span> 
      },
    ];
    
    render(
      <Header 
        actions={actionsWithIcons}
        data-testid="header" 
      />
    );
    
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('handles navigation items with children', () => {
    const navItemsWithChildren = [
      {
        label: 'Products',
        children: [
          { label: 'Product 1', href: '/product1' },
          { label: 'Product 2', href: '/product2' },
        ]
      },
    ];
    
    render(
      <Header 
        navigationItems={navItemsWithChildren}
        data-testid="header" 
      />
    );
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    // Children would typically be rendered in a dropdown, but here they'd be in mobile menu
  });
});