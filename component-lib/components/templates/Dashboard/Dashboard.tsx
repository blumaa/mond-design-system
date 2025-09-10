'use client';
import React, { useState } from 'react';
import { Box } from '../../layout/Box/Box';
import { Card } from '../../layout/Card/Card';
import { Grid } from '../../layout/Grid/Grid';
import { Stack } from '../../layout/Stack/Stack';
import { Header } from '../../organisms/Header/Header';
import { Sidebar, SidebarSection } from '../../organisms/Sidebar/Sidebar';
import { Tabs, TabItem } from '../../organisms/Tabs/Tabs';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';
import { Badge } from '../../atoms/Badge/Badge';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Divider } from '../../atoms/Divider/Divider';
import { FormField } from '../../molecules/FormField/FormField';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { useTheme } from '../../../utils/theme';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export interface DashboardUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

export interface DashboardActivity {
  id: string;
  type: 'user_joined' | 'document_updated' | 'task_completed' | 'comment_added';
  user: DashboardUser;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DashboardProps {
  /**
   * Dashboard title
   * @default 'Dashboard'
   */
  title?: string;
  
  /**
   * Current user information
   */
  currentUser?: DashboardUser;
  
  /**
   * Key metrics to display
   */
  metrics?: DashboardMetric[];
  
  /**
   * Recent activities
   */
  activities?: DashboardActivity[];
  
  /**
   * Team members
   */
  teamMembers?: DashboardUser[];
  
  /**
   * Whether to show the sidebar
   * @default true
   */
  showSidebar?: boolean;
  
  /**
   * Sidebar collapsed state
   * @default false
   */
  sidebarCollapsed?: boolean;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom navigation items
   */
  navigationItems?: SidebarSection[];
  
  /**
   * Header actions
   */
  headerActions?: React.ReactNode;
  
  /**
   * Custom content for the main area
   */
  children?: React.ReactNode;
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigationClick?: (itemId: string) => void;
  
  /**
   * Callback when sidebar toggle is clicked
   */
  onSidebarToggle?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

const defaultMetrics: DashboardMetric[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: '👥',
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$48,291',
    change: '+8.2%',
    changeType: 'positive',
    icon: '💰',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-0.3%',
    changeType: 'negative',
    icon: '📈',
  },
  {
    id: 'support-tickets',
    title: 'Support Tickets',
    value: '47',
    change: '+5',
    changeType: 'neutral',
    icon: '🎫',
  },
];

const defaultActivities: DashboardActivity[] = [
  {
    id: '1',
    type: 'user_joined',
    user: { id: '1', name: 'Sarah Chen', role: 'Designer', status: 'online' },
    description: 'joined the Design Team',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: '2',
    type: 'document_updated',
    user: { id: '2', name: 'Mike Johnson', role: 'Developer', status: 'online' },
    description: 'updated the API Documentation',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
  {
    id: '3',
    type: 'task_completed',
    user: { id: '3', name: 'Emma Davis', role: 'Product Manager', status: 'away' },
    description: 'completed the User Research task',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];

const defaultTeamMembers: DashboardUser[] = [
  { id: '1', name: 'Sarah Chen', role: 'UI/UX Designer', status: 'online', avatar: '👩‍🎨' },
  { id: '2', name: 'Mike Johnson', role: 'Frontend Developer', status: 'online', avatar: '👨‍💻' },
  { id: '3', name: 'Emma Davis', role: 'Product Manager', status: 'away', avatar: '👩‍💼' },
  { id: '4', name: 'Alex Thompson', role: 'Backend Developer', status: 'offline', lastActive: '2 hours ago', avatar: '👨‍🔧' },
  { id: '5', name: 'Lisa Wang', role: 'Data Analyst', status: 'online', avatar: '👩‍🔬' },
];

const defaultNavigationItems: SidebarSection[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠', active: true },
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'projects', label: 'Projects', icon: '📁' },
      { id: 'tasks', label: 'Tasks', icon: '✅', badge: '12' },
    ],
  },
  {
    id: 'team',
    title: 'Team',
    items: [
      { id: 'members', label: 'Team Members', icon: '👥' },
      { id: 'calendar', label: 'Calendar', icon: '📅' },
      { id: 'messages', label: 'Messages', icon: '💬', badge: '3' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'preferences', label: 'Preferences', icon: '⚙️' },
      { id: 'integrations', label: 'Integrations', icon: '🔗' },
      { id: 'billing', label: 'Billing', icon: '💳' },
    ],
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  title = 'Dashboard',
  currentUser,
  metrics = defaultMetrics,
  activities = defaultActivities,
  teamMembers = defaultTeamMembers,
  showSidebar = true,
  sidebarCollapsed = false,
  isDarkMode = false,
  navigationItems = defaultNavigationItems,
  headerActions,
  children,
  onNavigationClick,
  onSidebarToggle,
  className,
}) => {
  const theme = useTheme(isDarkMode);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status: DashboardUser['status']) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const tabItems: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <Stack spacing={24}>
          {/* Metrics */}
          <Box>
            <Heading level={3} style={{ marginBottom: '16px' }}>
              Key Metrics
            </Heading>
            <Grid columns={4} gap={16}>
              {metrics.map((metric) => (
                <Card key={metric.id} padding={20} isDarkMode={isDarkMode}>
                  <Stack spacing={8}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text variant="body-sm" semantic="secondary" isDarkMode={isDarkMode}>
                        {metric.title}
                      </Text>
                      {metric.icon && (
                        <Box style={{ fontSize: '18px' }}>
                          {metric.icon}
                        </Box>
                      )}
                    </Box>
                    <Text variant="body-lg" semantic="primary" isDarkMode={isDarkMode} style={{ fontWeight: 'bold' }}>
                      {metric.value}
                    </Text>
                    {metric.change && (
                      <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Badge 
                          variant={
                            metric.changeType === 'positive' ? 'success' : 
                            metric.changeType === 'negative' ? 'error' : 'default'
                          }
                          size="sm"
                          isDarkMode={isDarkMode}
                        >
                          {metric.change}
                        </Badge>
                        <Text variant="caption" semantic="tertiary" isDarkMode={isDarkMode}>
                          from last month
                        </Text>
                      </Box>
                    )}
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Box>

          {/* Recent Activity */}
          <Box>
            <Heading level={3} style={{ marginBottom: '16px' }}>
              Recent Activity
            </Heading>
            <Card padding={0} isDarkMode={isDarkMode}>
              <Stack spacing={0}>
                {activities.map((activity, index) => (
                  <Box key={activity.id}>
                    <Box style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar
                        alt={activity.user.name}
                        fallback={activity.user.name}
                        size="sm"
                        isDarkMode={isDarkMode}
                        style={{ flexShrink: 0 }}
                      />
                      <Box style={{ flex: 1 }}>
                        <Text variant="body-md" semantic="primary" isDarkMode={isDarkMode}>
                          <strong>{activity.user.name}</strong> {activity.description}
                        </Text>
                        <Text variant="caption" semantic="tertiary" isDarkMode={isDarkMode}>
                          {formatTimeAgo(activity.timestamp)}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(activity.user.status),
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    {index < activities.length - 1 && <Divider isDarkMode={isDarkMode} />}
                  </Box>
                ))}
              </Stack>
            </Card>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <Stack spacing={24}>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Heading level={3}>
              Analytics Dashboard
            </Heading>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FormField label="Time Period">
                <Select
                  size="sm"
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  options={[
                    { value: '1d', label: 'Last 24 Hours' },
                    { value: '7d', label: 'Last 7 Days' },
                    { value: '30d', label: 'Last 30 Days' },
                    { value: '90d', label: 'Last 90 Days' },
                  ]}
                  isDarkMode={isDarkMode}
                />
              </FormField>
            </Box>
          </Box>
          
          <Grid columns={2} gap={20}>
            <Card padding={24} isDarkMode={isDarkMode}>
              <Stack spacing={16}>
                <Heading level={4}>User Growth</Heading>
                <Box style={{ 
                  height: '200px', 
                  backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
                    📈 Chart Placeholder
                  </Text>
                </Box>
              </Stack>
            </Card>
            
            <Card padding={24} isDarkMode={isDarkMode}>
              <Stack spacing={16}>
                <Heading level={4}>Revenue Trends</Heading>
                <Box style={{ 
                  height: '200px', 
                  backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
                    💹 Chart Placeholder
                  </Text>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      ),
    },
    {
      id: 'team',
      label: 'Team',
      content: (
        <Stack spacing={24}>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Heading level={3}>
              Team Members
            </Heading>
            <Button isDarkMode={isDarkMode}>
              Invite Member
            </Button>
          </Box>
          
          <Grid columns={3} gap={16}>
            {teamMembers.map((member) => (
              <Card key={member.id} padding={20} isDarkMode={isDarkMode}>
                <Stack spacing={12} align="center">
                  <Box style={{ position: 'relative' }}>
                    <Avatar
                      alt={member.name}
                      fallback={member.name}
                      size="lg"
                      isDarkMode={isDarkMode}
                    />
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(member.status),
                        border: `2px solid ${isDarkMode ? '#1f2937' : '#ffffff'}`,
                      }}
                    />
                  </Box>
                  <Stack spacing={4} align="center">
                    <Text variant="body-lg" semantic="primary" isDarkMode={isDarkMode} style={{ fontWeight: 'semibold' }}>
                      {member.name}
                    </Text>
                    <Text variant="body-sm" semantic="secondary" isDarkMode={isDarkMode}>
                      {member.role}
                    </Text>
                    <Badge 
                      variant={member.status === 'online' ? 'success' : member.status === 'away' ? 'warning' : 'default'}
                      size="sm"
                      isDarkMode={isDarkMode}
                    >
                      {member.status}
                    </Badge>
                    {member.status === 'offline' && member.lastActive && (
                      <Text variant="caption" semantic="tertiary" isDarkMode={isDarkMode}>
                        Last active {member.lastActive}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: theme('surface.primary'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Header
        title={title}
        rightContent={
          headerActions || (
            <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FormField>
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  inputSize="sm"
                  isDarkMode={isDarkMode}
                />
              </FormField>
              {currentUser && (
                <Avatar
                  alt={currentUser.name}
                  fallback={currentUser.name}
                  size="sm"
                  isDarkMode={isDarkMode}
                />
              )}
            </Box>
          )
        }
        isDarkMode={isDarkMode}
        onMobileMenuToggle={onSidebarToggle}
      />

      <Box style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            sections={navigationItems}
            collapsed={sidebarCollapsed}
            isDarkMode={isDarkMode}
            onItemClick={(item) => onNavigationClick?.(item.id)}
            footer={
              currentUser && (
                <Box style={{ padding: '16px', textAlign: 'center' }}>
                  <Avatar
                    alt={currentUser.name}
                    fallback={currentUser.name}
                    size="md"
                    isDarkMode={isDarkMode}
                    style={{ marginBottom: '8px' }}
                  />
                  <Text variant="body-sm" semantic="primary" isDarkMode={isDarkMode} style={{ fontWeight: 'medium' }}>
                    {currentUser.name}
                  </Text>
                  <Text variant="caption" semantic="secondary" isDarkMode={isDarkMode}>
                    {currentUser.role}
                  </Text>
                </Box>
              )
            }
          />
        )}

        {/* Main Content */}
        <Box
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {children || (
            <Stack spacing={24}>
              <Box>
                <Heading level={2} style={{ marginBottom: '8px' }}>
                  Welcome back{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}! 👋
                </Heading>
                <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
                  Here&apos;s what&apos;s happening with your projects today.
                </Text>
              </Box>

              <Tabs
                tabs={tabItems}
                defaultActiveTab={activeTab}
                onChange={setActiveTab}
                isDarkMode={isDarkMode}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;