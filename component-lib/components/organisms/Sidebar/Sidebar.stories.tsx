import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarSection } from './Sidebar';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Sidebar, SidebarSection } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [collapsed, setCollapsed] = useState(false);
  
  const sections: SidebarSection[] = [
    {
      id: 'main',
      title: 'Navigation',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          href: '/', 
          active: true,
          icon: <span>📊</span>
        },
        { 
          id: 'projects', 
          label: 'Projects', 
          href: '/projects',
          badge: '12',
          icon: <span>📁</span>
        },
        { 
          id: 'tasks', 
          label: 'Tasks', 
          href: '/tasks',
          badge: '5',
          icon: <span>✓</span>
        },
      ],
    },
  ];
  
  return (
    <Sidebar
      sections={sections}
      collapsed={collapsed}
      onCollapseChange={setCollapsed}
      header={<div>My App</div>}
      onItemClick={(item) => console.log('Clicked:', item.label)}
    />
  );
}
\`\`\`

A flexible navigation sidebar with collapsible sections, mobile support, badges, sub-items, and various customization options.

**Key Features:**
- 📱 Mobile-responsive with overlay support
- 🔄 Collapsible with smooth animations
- 📍 Active state management
- 🏷️ Badge support for notifications
- 📂 Nested sub-items with indentation
- 🎨 Dark mode compatibility
- ⚙️ Customizable header and footer
- ♿ Full accessibility with keyboard navigation
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    sections: {
      description: 'Sidebar sections with navigation items',
      control: 'object',
    },
    collapsed: {
      description: 'Whether the sidebar is collapsed',
      control: 'boolean',
    },
    collapsible: {
      description: 'Whether the sidebar can be collapsed',
      control: 'boolean',
    },
    width: {
      description: 'Sidebar width when expanded',
      control: 'text',
    },
    collapsedWidth: {
      description: 'Sidebar width when collapsed',
      control: 'text',
    },
    position: {
      description: 'Sidebar position',
      control: 'select',
      options: ['left', 'right'],
    },
    showToggle: {
      description: 'Show collapse toggle button',
      control: 'boolean',
    },
    isDarkMode: {
      description: 'Dark mode styling',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Sample data for stories
const basicSections: SidebarSection[] = [
  {
    id: 'main',
    title: 'Main Navigation',
    items: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        href: '/', 
        active: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        )
      },
      { 
        id: 'projects', 
        label: 'Projects', 
        href: '/projects',
        badge: '12',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        )
      },
      { 
        id: 'tasks', 
        label: 'Tasks', 
        href: '/tasks',
        badge: '5',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3 8-8"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.27 0 4.33.84 5.91 2.24"/>
          </svg>
        )
      },
      { 
        id: 'calendar', 
        label: 'Calendar', 
        href: '/calendar',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      },
    ],
  },
  {
    id: 'team',
    title: 'Team',
    items: [
      { 
        id: 'members', 
        label: 'Team Members', 
        href: '/team',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        )
      },
      { 
        id: 'departments', 
        label: 'Departments', 
        href: '/departments',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        )
      },
    ],
  },
];

const advancedSections: SidebarSection[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      { 
        id: 'overview', 
        label: 'Overview', 
        href: '/overview', 
        active: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
        )
      },
      { 
        id: 'analytics', 
        label: 'Analytics', 
        href: '/analytics',
        badge: 'NEW',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
          </svg>
        )
      },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    collapsible: true,
    items: [
      { 
        id: 'users', 
        label: 'User Management',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
        subItems: [
          { id: 'user-list', label: 'All Users', href: '/users' },
          { id: 'user-roles', label: 'Roles & Permissions', href: '/users/roles' },
          { id: 'user-groups', label: 'User Groups', href: '/users/groups' },
        ]
      },
      { 
        id: 'settings', 
        label: 'System Settings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        ),
        subItems: [
          { id: 'general', label: 'General', href: '/settings/general' },
          { id: 'security', label: 'Security', href: '/settings/security' },
          { id: 'integrations', label: 'Integrations', href: '/settings/integrations', disabled: true },
        ]
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      { id: 'help', label: 'Help Center', href: '/help' },
      { id: 'contact', label: 'Contact Support', onClick: () => console.log('Contact clicked') },
    ],
  },
];

export const Default: Story = {
  args: {
    sections: basicSections,
  },
};

export const WithAdvancedFeatures: Story = {
  args: {
    sections: advancedSections,
    header: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#007bff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          A
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Acme Corp</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Premium Plan</div>
        </div>
      </div>
    ),
    footer: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>Version 1.4.0</div>
        <Button variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    ),
  },
};

export const Collapsed: Story = {
  args: {
    sections: basicSections,
    collapsed: true,
    header: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#007bff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          A
        </div>
      </div>
    ),
  },
};

export const RightSidebar: Story = {
  args: {
    sections: basicSections,
    position: 'right',
    header: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Right Sidebar</div>,
  },
};

export const NoToggleButton: Story = {
  args: {
    sections: basicSections,
    showToggle: false,
    header: <div>Fixed Sidebar</div>,
  },
};

export const NotCollapsible: Story = {
  args: {
    sections: basicSections,
    collapsible: false,
    header: <div>Always Expanded</div>,
  },
};

export const CustomWidth: Story = {
  args: {
    sections: basicSections,
    width: '320px',
    collapsedWidth: '80px',
  },
};

export const DarkMode: Story = {
  args: {
    sections: advancedSections,
    isDarkMode: true,
    header: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          D
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Dark Mode</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Premium Plan</div>
        </div>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MobileView: Story = {
  args: {
    sections: advancedSections,
    mobileOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithBadgesAndIcons: Story = {
  args: {
    sections: [
      {
        id: 'notifications',
        title: 'Notifications',
        items: [
          { 
            id: 'inbox', 
            label: 'Inbox', 
            href: '/inbox',
            badge: '25',
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            )
          },
          { 
            id: 'alerts', 
            label: 'Alerts', 
            href: '/alerts',
            badge: '3',
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            )
          },
          { 
            id: 'archived', 
            label: 'Archived', 
            href: '/archived',
            disabled: true,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="21,8 21,21 3,21 3,8"/>
                <rect x="1" y="3" width="22" height="5"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
            )
          },
        ],
      },
    ],
  },
};

export const Playground: Story = {
  args: {
    sections: advancedSections,
    collapsed: false,
    collapsible: true,
    width: '280px',
    collapsedWidth: '60px',
    position: 'left',
    showToggle: true,
    isDarkMode: false,
    header: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#007bff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          P
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Playground</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Test all features</div>
        </div>
      </div>
    ),
    footer: (
      <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.7 }}>
        Footer content
      </div>
    ),
    onCollapseChange: (collapsed) => console.log('Collapsed:', collapsed),
    onItemClick: (item) => console.log('Item clicked:', item),
  },
};