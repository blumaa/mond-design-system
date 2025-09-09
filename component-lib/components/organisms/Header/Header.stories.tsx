import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from './Header';
import { Button } from '../../atoms/Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['solid', 'transparent', 'blur'],
    },
    sticky: {
      control: 'boolean',
    },
    showMobileToggle: {
      control: 'boolean',
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicNavigation = [
  { label: 'Home', href: '/', active: true },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

const basicActions = [
  { label: 'Sign In', onClick: () => console.log('Sign in clicked'), variant: 'ghost' as const },
  { label: 'Get Started', onClick: () => console.log('Get started clicked'), variant: 'primary' as const },
];

export const Default: Story = {
  render: () => (
    <div>
      <Header
        logo="Acme Corp"
        logoHref="/"
        navigationItems={basicNavigation}
        actions={basicActions}
      />
      <div style={{ padding: '2rem', height: '200vh' }}>
        <h1>Page Content</h1>
        <p>This is the main content area. Resize the window to see mobile navigation.</p>
        <p>Scroll down to see more content...</p>
      </div>
    </div>
  ),
};

export const WithLogo: Story = {
  render: () => (
    <div>
      <Header
        logo={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#4f46e5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              A
            </div>
            <span style={{ fontWeight: 600, fontSize: '18px' }}>Acme Design</span>
          </div>
        }
        logoHref="/"
        navigationItems={basicNavigation}
        actions={basicActions}
      />
      <div style={{ padding: '2rem', height: '100vh' }}>
        <h1>Custom Logo Example</h1>
        <p>The header shows how to use a custom logo with icon and text.</p>
      </div>
    </div>
  ),
};

export const ComplexNavigation: Story = {
  render: () => {
    const complexNav = [
      { label: 'Dashboard', href: '/dashboard', active: true },
      { 
        label: 'Products', 
        children: [
          { label: 'Web Apps', href: '/products/web' },
          { label: 'Mobile Apps', href: '/products/mobile' },
          { label: 'Desktop Apps', href: '/products/desktop' },
        ]
      },
      { 
        label: 'Resources', 
        children: [
          { label: 'Documentation', href: '/docs' },
          { label: 'API Reference', href: '/api' },
          { label: 'Examples', href: '/examples' },
          { label: 'Blog', href: '/blog' },
        ]
      },
      { label: 'Support', href: '/support' },
    ];

    return (
      <div>
        <Header
          logo="DevTools"
          logoHref="/"
          navigationItems={complexNav}
          actions={basicActions}
        />
        <div style={{ padding: '2rem', height: '100vh' }}>
          <h1>Complex Navigation</h1>
          <p>Navigation items can have nested children for dropdown menus.</p>
        </div>
      </div>
    );
  },
};

export const WithUserProfile: Story = {
  render: () => {
    const profileActions = [
      { 
        label: '', 
        onClick: () => console.log('Notifications'), 
        variant: 'ghost' as const,
        icon: <span style={{ fontSize: '18px' }}>🔔</span>
      },
    ];

    const profileDropdown = (
      <Dropdown
        options={[
          { value: 'profile', label: 'View Profile', icon: '👤' },
          { value: 'settings', label: 'Settings', icon: '⚙️' },
          { value: 'billing', label: 'Billing', icon: '💳' },
          { value: 'divider', label: '', divider: true },
          { value: 'logout', label: 'Sign Out', icon: '🚪' },
        ]}
        trigger={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'transparent'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600
            }}>
              JD
            </div>
            <span style={{ fontSize: '14px' }}>▼</span>
          </div>
        }
        onSelect={(value) => console.log('Profile action:', value)}
      />
    );

    return (
      <div>
        <Header
          logo="Dashboard"
          logoHref="/"
          navigationItems={[
            { label: 'Overview', href: '/overview', active: true },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Projects', href: '/projects' },
            { label: 'Team', href: '/team' },
          ]}
          actions={profileActions}
          rightContent={profileDropdown}
        />
        <div style={{ padding: '2rem', height: '100vh' }}>
          <h1>User Profile Header</h1>
          <p>Shows a header with user profile dropdown and notification icon.</p>
        </div>
      </div>
    );
  },
};

export const StickyHeader: Story = {
  render: () => (
    <div>
      <Header
        logo="Sticky Header"
        logoHref="/"
        navigationItems={basicNavigation}
        actions={basicActions}
        sticky
        variant="blur"
      />
      <div style={{ padding: '2rem', height: '200vh' }}>
        <h1>Sticky Header Demo</h1>
        <p>This header will stick to the top when you scroll down.</p>
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h2>Scroll down to see the sticky behavior</h2>
          <p>The header uses a blur background effect when sticky.</p>
        </div>
        <div style={{ marginTop: '100vh' }}>
          <h2>More Content</h2>
          <p>Keep scrolling to see how the header behaves...</p>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 2rem', fontSize: '16px', fontWeight: 600 }}>Solid (Default)</h3>
        <Header
          logo="Solid Header"
          navigationItems={basicNavigation.slice(0, 3)}
          actions={[basicActions[1]]}
          variant="solid"
        />
      </div>
      
      <div style={{ 
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '120px',
        position: 'relative'
      }}>
        <h3 style={{ 
          margin: 0, 
          padding: '1rem 2rem', 
          fontSize: '16px', 
          fontWeight: 600,
          color: 'white'
        }}>
          Transparent
        </h3>
        <Header
          logo={<span style={{ color: 'white' }}>Transparent</span>}
          navigationItems={basicNavigation.slice(0, 3).map(item => ({
            ...item,
            style: { color: 'white' }
          }))}
          actions={[{ ...basicActions[1], variant: 'outline' }]}
          variant="transparent"
        />
      </div>
      
      <div style={{ 
        backgroundImage: 'url(data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)',
        minHeight: '120px',
        position: 'relative'
      }}>
        <h3 style={{ margin: '0 0 1rem 2rem', fontSize: '16px', fontWeight: 600 }}>Blur</h3>
        <Header
          logo="Blur Header"
          navigationItems={basicNavigation.slice(0, 3)}
          actions={[basicActions[1]]}
          variant="blur"
        />
      </div>
    </div>
  ),
};

export const MobileResponsive: Story = {
  render: () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    return (
      <div>
        <Header
          logo="Mobile Demo"
          logoHref="/"
          navigationItems={[
            ...basicNavigation,
            { label: 'Help', href: '/help' },
            { label: 'Contact', href: '/contact' },
          ]}
          actions={[
            ...basicActions,
            { label: 'Download', onClick: () => console.log('Download'), variant: 'outline' as const },
          ]}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={setIsMobileMenuOpen}
        />
        <div style={{ padding: '2rem', height: '100vh' }}>
          <h1>Mobile Responsive Header</h1>
          <p>Resize your browser window to see the mobile navigation.</p>
          <p>
            Current mobile menu state: <strong>{isMobileMenuOpen ? 'Open' : 'Closed'}</strong>
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ marginTop: '1rem' }}
          >
            Toggle Mobile Menu Programmatically
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const DarkMode: Story = {
  render: () => (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Header
        logo={<span style={{ color: 'white' }}>Dark Theme</span>}
        logoHref="/"
        navigationItems={basicNavigation}
        actions={[
          { label: 'Sign In', onClick: () => console.log('Sign in'), variant: 'ghost' as const },
          { label: 'Get Started', onClick: () => console.log('Get started'), variant: 'primary' as const },
        ]}
        isDarkMode
        variant="solid"
      />
      <div style={{ padding: '2rem', height: '100vh', color: 'white' }}>
        <h1>Dark Mode Header</h1>
        <p>This header is optimized for dark themes and backgrounds.</p>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const EcommerceExample: Story = {
  render: () => {
    const ecommerceNav = [
      { label: 'Shop All', href: '/shop' },
      { label: 'New Arrivals', href: '/new' },
      { label: 'Best Sellers', href: '/bestsellers' },
      { label: 'Sale', href: '/sale', active: true },
    ];

    const ecommerceActions = [
      { 
        label: '', 
        onClick: () => console.log('Search'), 
        variant: 'ghost' as const,
        icon: <span style={{ fontSize: '16px' }}>🔍</span>
      },
      { 
        label: '', 
        onClick: () => console.log('Wishlist'), 
        variant: 'ghost' as const,
        icon: <span style={{ fontSize: '16px' }}>❤️</span>
      },
      { 
        label: '', 
        onClick: () => console.log('Cart'), 
        variant: 'ghost' as const,
        icon: <span style={{ fontSize: '16px' }}>🛒</span>
      },
    ];

    return (
      <div>
        <Header
          logo={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🛍️</span>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>ShopCo</span>
            </div>
          }
          logoHref="/"
          navigationItems={ecommerceNav}
          actions={ecommerceActions}
          rightContent={
            <div style={{ fontSize: '12px', color: '#666' }}>
              Free shipping on orders $50+
            </div>
          }
        />
        <div style={{ padding: '2rem', height: '100vh' }}>
          <h1>E-commerce Header Example</h1>
          <p>A typical e-commerce header with search, wishlist, and cart icons.</p>
        </div>
      </div>
    );
  },
};

export const SaaSApplication: Story = {
  render: () => {
    const saasNav = [
      { label: 'Dashboard', href: '/dashboard', active: true },
      { label: 'Projects', href: '/projects' },
      { label: 'Team', href: '/team' },
      { label: 'Analytics', href: '/analytics' },
    ];

    const saasActions = [
      { 
        label: 'Upgrade', 
        onClick: () => console.log('Upgrade clicked'), 
        variant: 'primary' as const 
      },
    ];

    const userDropdown = (
      <Dropdown
        options={[
          { value: 'profile', label: 'Profile', icon: '👤' },
          { value: 'settings', label: 'Settings', icon: '⚙️' },
          { value: 'billing', label: 'Billing', icon: '💳' },
          { value: 'team', label: 'Team Settings', icon: '👥' },
          { value: 'divider', label: '', divider: true },
          { value: 'help', label: 'Help & Support', icon: '❓' },
          { value: 'logout', label: 'Sign Out', icon: '🚪' },
        ]}
        trigger={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600
            }}>
              AS
            </div>
            <div style={{ fontSize: '14px' }}>
              <div style={{ fontWeight: 500, lineHeight: 1.2 }}>Alex Smith</div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>alex@company.com</div>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>▼</span>
          </div>
        }
        placement="bottom-end"
        onSelect={(value) => console.log('User action:', value)}
      />
    );

    return (
      <div>
        <Header
          logo={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                S
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>SaaSify</span>
            </div>
          }
          logoHref="/"
          navigationItems={saasNav}
          actions={saasActions}
          rightContent={userDropdown}
        />
        <div style={{ padding: '2rem', height: '100vh' }}>
          <h1>SaaS Application Header</h1>
          <p>A typical SaaS application header with user profile and upgrade CTA.</p>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    logo: 'Playground',
    logoHref: '/',
    navigationItems: basicNavigation,
    actions: basicActions,
    height: '64px',
    variant: 'solid',
    sticky: false,
    showMobileToggle: true,
    isDarkMode: false,
  },
  render: (args) => (
    <div>
      <Header {...args} />
      <div style={{ padding: '2rem', height: '200vh' }}>
        <h1>Playground</h1>
        <p>Use the controls to customize the header appearance and behavior.</p>
      </div>
    </div>
  ),
};