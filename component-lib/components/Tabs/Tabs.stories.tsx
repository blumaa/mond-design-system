import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabItem } from './Tabs';
import { useState } from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'card'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicTabs: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div>
        <h3>Overview</h3>
        <p>This is the overview content. Here you can see a summary of all the key information and metrics.</p>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    content: (
      <div>
        <h3>Analytics</h3>
        <p>View detailed analytics and reports. Track your performance with comprehensive data visualization.</p>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
          <strong>Key Metrics:</strong>
          <ul>
            <li>Page views: 1,234</li>
            <li>Unique visitors: 567</li>
            <li>Bounce rate: 23%</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    content: (
      <div>
        <h3>Settings</h3>
        <p>Configure your preferences and account settings.</p>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" style={{ marginRight: '0.5rem' }} />
            Enable notifications
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" style={{ marginRight: '0.5rem' }} defaultChecked />
            Auto-save changes
          </label>
        </div>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Line Variant</h4>
        <Tabs tabs={basicTabs} variant="line" />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Card Variant</h4>
        <Tabs tabs={basicTabs} variant="card" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Small</h4>
        <Tabs tabs={basicTabs} size="sm" />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Medium</h4>
        <Tabs tabs={basicTabs} size="md" />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Large</h4>
        <Tabs tabs={basicTabs} size="lg" />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    tabs: [
      {
        id: 'home',
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏠 Home
          </span>
        ),
        content: (
          <div>
            <h3>🏠 Welcome Home</h3>
            <p>This is your home dashboard where you can see everything at a glance.</p>
          </div>
        ),
      },
      {
        id: 'profile',
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👤 Profile
          </span>
        ),
        content: (
          <div>
            <h3>👤 User Profile</h3>
            <p>Manage your personal information and account preferences.</p>
          </div>
        ),
      },
      {
        id: 'messages',
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📧 Messages
            <span style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              borderRadius: '10px', 
              padding: '2px 6px', 
              fontSize: '0.75rem',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              3
            </span>
          </span>
        ),
        content: (
          <div>
            <h3>📧 Messages</h3>
            <p>You have 3 new messages waiting for your attention.</p>
          </div>
        ),
      },
      {
        id: 'archive',
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📦 Archive
          </span>
        ),
        content: (
          <div>
            <h3>📦 Archived Items</h3>
            <p>View and manage your archived content.</p>
          </div>
        ),
        disabled: true,
      },
    ],
  },
};

export const WithDisabledTabs: Story = {
  args: {
    tabs: [
      {
        id: 'general',
        label: 'General',
        content: <div><h3>General Settings</h3><p>Basic configuration options.</p></div>,
      },
      {
        id: 'security',
        label: 'Security',
        content: <div><h3>Security Settings</h3><p>Manage your security preferences.</p></div>,
      },
      {
        id: 'billing',
        label: 'Billing',
        content: <div><h3>Billing Information</h3><p>View and update billing details.</p></div>,
        disabled: true,
      },
      {
        id: 'advanced',
        label: 'Advanced',
        content: <div><h3>Advanced Settings</h3><p>Advanced configuration options.</p></div>,
        disabled: true,
      },
    ],
  },
};

export const ControlledTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const controlledTabs: TabItem[] = [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: <div><p>Content for Tab 1. Current active: {activeTab}</p></div>,
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: <div><p>Content for Tab 2. Current active: {activeTab}</p></div>,
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: <div><p>Content for Tab 3. Current active: {activeTab}</p></div>,
      },
    ];
    
    return (
      <div>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('tab1')}
            style={{ padding: '4px 8px', fontSize: '0.875rem' }}
          >
            External: Set Tab 1
          </button>
          <button 
            onClick={() => setActiveTab('tab2')}
            style={{ padding: '4px 8px', fontSize: '0.875rem' }}
          >
            External: Set Tab 2
          </button>
          <button 
            onClick={() => setActiveTab('tab3')}
            style={{ padding: '4px 8px', fontSize: '0.875rem' }}
          >
            External: Set Tab 3
          </button>
        </div>
        
        <Tabs 
          tabs={controlledTabs} 
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
          <strong>Controlled State:</strong> Active tab is "{activeTab}"
        </div>
      </div>
    );
  },
};

export const NavigationTabs: Story = {
  args: {
    tabs: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        content: (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h2>📊 Dashboard</h2>
            <p>Welcome to your dashboard! Here's an overview of your activity.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px', minWidth: '100px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7' }}>47</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Projects</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px', minWidth: '100px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>23</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'projects',
        label: 'Projects',
        content: (
          <div>
            <h3>🚀 Your Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <h4>Design System v2</h4>
                <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>Building the next version of our design system</p>
                <span style={{ padding: '2px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '0.75rem' }}>
                  In Progress
                </span>
              </div>
              <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <h4>Mobile App Redesign</h4>
                <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>Complete overhaul of the mobile experience</p>
                <span style={{ padding: '2px 8px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '12px', fontSize: '0.75rem' }}>
                  Planning
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'team',
        label: 'Team',
        content: (
          <div>
            <h3>👥 Team Members</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>
                  AS
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>Alice Smith</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lead Designer</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>
                  BJ
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>Bob Johnson</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Frontend Developer</div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    variant: 'card',
    size: 'lg',
  },
};

export const DarkMode: Story = {
  args: {
    tabs: basicTabs,
    variant: 'line',
  },
  parameters: {
    theme: 'dark',
  },
};