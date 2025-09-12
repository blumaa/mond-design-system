import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dashboard, DashboardUser, DashboardMetric, DashboardActivity } from './Dashboard';
import { SidebarSection } from '../../organisms/Sidebar/Sidebar';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

const meta: Meta<typeof Dashboard> = {
  title: 'Templates/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Dashboard } from '@mond-design-system/theme';

function MyApp() {
  const currentUser = {
    id: '1',
    name: 'John Doe',
    role: 'Product Manager',
    status: 'online' as const,
    avatar: '👨‍💼',
  };

  return (
    <Dashboard
      title="My Dashboard"
      currentUser={currentUser}
      onNavigationClick={(itemId) => console.log('Navigate to:', itemId)}
    />
  );
}
\`\`\`

A comprehensive dashboard template that showcases the design system's capabilities. Perfect for admin interfaces, analytics dashboards, and team management applications.

**Key Features:**
- 🏠 Complete dashboard layout with header, sidebar, and main content
- 📊 Metrics cards with change indicators and status badges
- 👥 Team member management with status indicators
- 📈 Analytics tab with chart placeholders
- 🔍 Search functionality in the header
- 📱 Responsive design that works on all screen sizes
- 🌙 Full dark mode support
- ♿ Accessible navigation and interactions
- 🧩 Uses all major design system components
- 🎨 Customizable content areas and navigation

**Component Showcase:**
This template demonstrates the usage of:
- Header, Sidebar, Tabs organisms
- Card, Grid, Stack, Box layout components  
- Button, Avatar, Badge, Text, Heading atoms
- FormField, Input, Select molecules
- Proper dark mode theming throughout
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Dashboard title displayed in header',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Whether to show the sidebar navigation',
    },
    sidebarCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Enable dark mode theme',
    },
    currentUser: {
      control: false,
      description: 'Current user information for avatar and personalization',
    },
    metrics: {
      control: false,
      description: 'Array of key metrics to display',
    },
    activities: {
      control: false,
      description: 'Recent activities for the activity feed',
    },
    teamMembers: {
      control: false,
      description: 'Team members to display in the team tab',
    },
    navigationItems: {
      control: false,
      description: 'Custom navigation items for sidebar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleCurrentUser: DashboardUser = {
  id: 'current-user',
  name: 'Alex Johnson',
  role: 'Product Manager',
  status: 'online',
  avatar: '👨‍💼',
};

const sampleMetrics: DashboardMetric[] = [
  {
    id: 'active-users',
    title: 'Active Users',
    value: '12,847',
    change: '+15.3%',
    changeType: 'positive',
    icon: '👥',
  },
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: '$284,291',
    change: '+23.1%',
    changeType: 'positive',
    icon: '💰',
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '4.67%',
    change: '-0.8%',
    changeType: 'negative',
    icon: '📈',
  },
  {
    id: 'avg-session',
    title: 'Avg. Session',
    value: '2m 34s',
    change: '+12s',
    changeType: 'positive',
    icon: '⏱️',
  },
];

const sampleActivities: DashboardActivity[] = [
  {
    id: '1',
    type: 'user_joined',
    user: { id: '1', name: 'Sarah Chen', role: 'UI Designer', status: 'online', avatar: '👩‍🎨' },
    description: 'joined the Design System Team',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
  },
  {
    id: '2',
    type: 'document_updated',
    user: { id: '2', name: 'Mike Rodriguez', role: 'Frontend Dev', status: 'online', avatar: '👨‍💻' },
    description: 'updated the Component Library documentation',
    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
  },
  {
    id: '3',
    type: 'task_completed',
    user: { id: '3', name: 'Emma Thompson', role: 'QA Engineer', status: 'away', avatar: '👩‍🔬' },
    description: 'completed testing for Button component variants',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
  },
  {
    id: '4',
    type: 'comment_added',
    user: { id: '4', name: 'David Kim', role: 'Backend Dev', status: 'online', avatar: '👨‍🔧' },
    description: 'commented on the API integration ticket',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
];

const sampleTeamMembers: DashboardUser[] = [
  { id: '1', name: 'Sarah Chen', role: 'Senior UI/UX Designer', status: 'online', avatar: '👩‍🎨' },
  { id: '2', name: 'Mike Rodriguez', role: 'Frontend Developer', status: 'online', avatar: '👨‍💻' },
  { id: '3', name: 'Emma Thompson', role: 'QA Engineer', status: 'away', avatar: '👩‍🔬' },
  { id: '4', name: 'David Kim', role: 'Backend Developer', status: 'offline', lastActive: '1 hour ago', avatar: '👨‍🔧' },
  { id: '5', name: 'Lisa Wang', role: 'Data Analyst', status: 'online', avatar: '👩‍📊' },
  { id: '6', name: 'James Wilson', role: 'DevOps Engineer', status: 'online', avatar: '👨‍⚙️' },
  { id: '7', name: 'Anna Martinez', role: 'Product Designer', status: 'away', avatar: '👩‍🎯' },
  { id: '8', name: 'Tom Brown', role: 'Full Stack Developer', status: 'offline', lastActive: '3 hours ago', avatar: '👨‍🚀' },
];

const customNavigationItems: SidebarSection[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: '🏠', active: true },
      { id: 'projects', label: 'Projects', icon: '📁', badge: '8' },
      { id: 'tasks', label: 'Tasks', icon: '✅', badge: '23' },
      { id: 'documents', label: 'Documents', icon: '📄' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'reports', label: 'Reports', icon: '📈' },
      { id: 'insights', label: 'Insights', icon: '💡', badge: 'New' },
    ],
  },
  {
    id: 'team',
    title: 'Team Management',
    items: [
      { id: 'members', label: 'Members', icon: '👥' },
      { id: 'roles', label: 'Roles & Permissions', icon: '🔐' },
      { id: 'calendar', label: 'Calendar', icon: '📅' },
      { id: 'chat', label: 'Team Chat', icon: '💬', badge: '5' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'preferences', label: 'Preferences', icon: '⚙️' },
      { id: 'integrations', label: 'Integrations', icon: '🔗' },
      { id: 'billing', label: 'Billing', icon: '💳' },
      { id: 'support', label: 'Support', icon: '🆘' },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Design System Dashboard',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
  },
};

export const WithCustomNavigation: Story = {
  args: {
    title: 'Project Management Dashboard',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
    navigationItems: customNavigationItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with custom navigation items showcasing different sections and badge variants.',
      },
    },
  },
};

export const CollapsedSidebar: Story = {
  args: {
    title: 'Compact Dashboard',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
    sidebarCollapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with collapsed sidebar for more content space.',
      },
    },
  },
};

export const NoSidebar: Story = {
  args: {
    title: 'Full-width Dashboard',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
    showSidebar: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard without sidebar navigation for maximum content width.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    title: 'Dark Theme Dashboard',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
    isDarkMode: true,
  },
  parameters: {
    theme: 'dark',
    docs: {
      description: {
        story: 'Dashboard with full dark mode theme applied to all components.',
      },
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    title: 'Dashboard with Custom Actions',
    currentUser: sampleCurrentUser,
    metrics: sampleMetrics,
    activities: sampleActivities,
    teamMembers: sampleTeamMembers,
    headerActions: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="outline" size="sm">
          Export Data
        </Button>
        <Button size="sm">
          Create Report
        </Button>
        <Badge variant="error" size="sm">
          3 alerts
        </Badge>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with custom header actions including buttons and notification badge.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');

    return (
      <div style={{ height: '100vh' }}>
        <Dashboard
          title="Interactive Dashboard"
          currentUser={sampleCurrentUser}
          metrics={sampleMetrics}
          activities={sampleActivities}
          teamMembers={sampleTeamMembers}
          sidebarCollapsed={sidebarCollapsed}
          isDarkMode={isDarkMode}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigationClick={(itemId) => setCurrentView(itemId)}
          headerActions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? 'Light' : 'Dark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? 'Expand' : 'Collapse'}
              </Button>
              <Badge variant="primary" size="sm">
                View: {currentView}
              </Badge>
            </div>
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive dashboard with theme toggle, sidebar collapse, and navigation tracking.',
      },
    },
  },
};

export const MinimalConfiguration: Story = {
  args: {
    title: 'Simple Dashboard',
    // Minimal props - uses all defaults
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with minimal configuration using default data and settings.',
      },
    },
  },
};