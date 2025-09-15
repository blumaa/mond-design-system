'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Text, Badge, Heading, Input, Select, Switch, Divider, Avatar, Checkbox, Tag, Modal, Tabs, Grid } from '@mond-design-system/theme';

// Mock data for settings
const userProfile = {
  username: 'admin@cypher.sys',
  fullName: 'System Administrator',
  role: 'Root Access',
  lastLogin: '2024-01-15 23:42:18',
  sessionTimeout: 60, // minutes
  twoFactorEnabled: true,
  apiKeysCount: 3
};

const terminalSettings = {
  theme: 'matrix-green',
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  cursorStyle: 'block',
  blinkingCursor: true,
  soundEnabled: true,
  autoComplete: true,
  historySize: 1000
};

const notificationSettings = {
  systemAlerts: true,
  deploymentNotifications: true,
  securityWarnings: true,
  performanceAlerts: false,
  emailNotifications: true,
  slackIntegration: false,
  pushNotifications: true
};

const apiKeys = [
  { id: 'API-001', name: 'Production Deploy Key', permissions: ['deploy', 'read'], created: '2024-01-10', lastUsed: '2 hours ago', status: 'active' },
  { id: 'API-002', name: 'Analytics Dashboard', permissions: ['read'], created: '2024-01-08', lastUsed: '5 minutes ago', status: 'active' },
  { id: 'API-003', name: 'CI/CD Pipeline', permissions: ['deploy', 'read', 'write'], created: '2024-01-05', lastUsed: '1 day ago', status: 'inactive' }
];

export default function SettingsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [localTerminalSettings, setLocalTerminalSettings] = useState(terminalSettings);
  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);
  const [activeTab, setActiveTab] = useState('system');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'brand.interactive.background';
      case 'inactive': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        timeZone: 'UTC'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const generateApiKey = () => {
    setShowApiKeyModal(false);
    // In real app, this would generate a new API key
    console.log('Generating new API key...');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box
      bg="surface.background"
      p="2xl"
      fontFamily="mono"
      maxWidth="1280px"
      mx="auto"
    >
      <Stack spacing="xl">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center" borderBottom="1px solid" borderColor="brand.interactive.background" pb="lg">
          <Stack spacing="xs">
            <Heading 
              level={1}
              size="2xl" 
              weight="bold" 
              color="brand.interactive.background"
              fontFamily="mono"
            >
              SYSTEM CONFIGURATION
            </Heading>
            <Text variant="body-sm" color="text.accent">
              USER PREFERENCES & SECURITY SETTINGS // UTC: {currentTime}
            </Text>
          </Stack>
          <Button 
            variant="primary"
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </Stack>

        {/* Main Settings Content */}
        <Tabs
          tabs={[
            { id: 'system', label: 'SYSTEM', content: <div>System settings content</div> },
            { id: 'terminal', label: 'TERMINAL', content: <div>Terminal settings content</div> },
            { id: 'security', label: 'SECURITY', content: <div>Security settings content</div> },
            { id: 'notifications', label: 'NOTIFICATIONS', content: <div>Notifications settings content</div> }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        >
          {/* System Preferences Tab */}
          {activeTab === 'system' && (
            <Stack spacing="xl">
              <Grid 
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap="xl"
                
              >
                {/* User Profile */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    USER PROFILE
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" spacing="lg">
                      <Avatar
                        src=""
                        alt="User Avatar"
                        size="lg"
                      />
                      <Stack spacing="xs" flex="1">
                        <Text weight="bold" color="text.primary">
                          {userProfile.fullName}
                        </Text>
                        <Text variant="body-sm" color="text.accent">
                          {userProfile.username}
                        </Text>
                        <Badge variant="success">
                          {userProfile.role}
                        </Badge>
                      </Stack>
                    </Stack>
                    <Divider borderColor="brand.interactive.background" opacity="0.3" />
                    <Stack spacing="md">
                      <Stack spacing="sm">
                        <Text variant="body-sm" color="text.secondary">
                          Full Name
                        </Text>
                        <Input
                          value={userProfile.fullName}
                        />
                      </Stack>
                      <Stack spacing="sm">
                        <Text variant="body-sm" color="text.secondary">
                          Session Timeout (minutes)
                        </Text>
                        <Select 
                          options={[
                            { value: '15', label: '15 minutes' },
                            { value: '30', label: '30 minutes' },
                            { value: '60', label: '1 hour' },
                            { value: '120', label: '2 hours' },
                            { value: '0', label: 'Never' }
                          ]}
                          value={userProfile.sessionTimeout.toString()}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>

                {/* Theme & Display */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    THEME & DISPLAY
                  </Text>
                  <Stack spacing="lg">
                    <Stack spacing="sm">
                      <Text variant="body-sm" color="text.secondary">
                        Color Scheme
                      </Text>
                      <Select 
                        options={[
                          { value: 'matrix-green', label: 'Matrix Green (Default)' },
                          { value: 'electric-blue', label: 'Electric Blue' },
                          { value: 'neon-purple', label: 'Neon Purple' },
                          { value: 'amber-glow', label: 'Amber Glow' }
                        ]}
                        value="matrix-green"
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Scan Line Effects:</Text>
                      <Switch defaultChecked />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Glow Effects:</Text>
                      <Switch defaultChecked />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Matrix Rain Background:</Text>
                      <Switch />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Reduced Motion:</Text>
                      <Switch />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Stack>
          )}

          {/* Terminal Preferences Tab */}
          {activeTab === 'terminal' && (
            <Stack spacing="xl">
              <Grid 
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap="xl"
                
              >
                {/* Terminal Appearance */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    TERMINAL APPEARANCE
                  </Text>
                  <Stack spacing="lg">
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Font Family
                      </Text>
                      <Select 
                        options={[
                          { value: 'JetBrains Mono', label: 'JetBrains Mono' },
                          { value: 'Fira Code', label: 'Fira Code' },
                          { value: 'Source Code Pro', label: 'Source Code Pro' },
                          { value: 'Consolas', label: 'Consolas' },
                          { value: 'Monaco', label: 'Monaco' }
                        ]}
                        value={localTerminalSettings.fontFamily}
                        onChange={(value) => setLocalTerminalSettings({...localTerminalSettings, fontFamily: value})}
                      />
                    </Grid>
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Font Size
                      </Text>
                      <Select 
                        options={[
                          { value: '12', label: '12px' },
                          { value: '14', label: '14px' },
                          { value: '16', label: '16px' },
                          { value: '18', label: '18px' },
                          { value: '20', label: '20px' }
                        ]}
                        value={localTerminalSettings.fontSize.toString()}
                        onChange={(value) => setLocalTerminalSettings({...localTerminalSettings, fontSize: parseInt(value)})}
                      />
                    </Grid>
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Cursor Style
                      </Text>
                      <Select 
                        options={[
                          { value: 'block', label: 'Block' },
                          { value: 'underline', label: 'Underline' },
                          { value: 'bar', label: 'Bar' }
                        ]}
                        value={localTerminalSettings.cursorStyle}
                        onChange={(value) => setLocalTerminalSettings({...localTerminalSettings, cursorStyle: value})}
                      />
                    </Grid>
                  </Stack>
                </Card>

                {/* Terminal Behavior */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    TERMINAL BEHAVIOR
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Blinking Cursor:</Text>
                      <Switch 
                        checked={localTerminalSettings.blinkingCursor}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, blinkingCursor: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Sound Effects:</Text>
                      <Switch 
                        checked={localTerminalSettings.soundEnabled}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, soundEnabled: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Auto-complete:</Text>
                      <Switch 
                        checked={localTerminalSettings.autoComplete}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, autoComplete: e.target.checked})}
                      />
                    </Stack>
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Command History Size
                      </Text>
                      <Select 
                        options={[
                          { value: '100', label: '100 commands' },
                          { value: '500', label: '500 commands' },
                          { value: '1000', label: '1000 commands' },
                          { value: '2000', label: '2000 commands' },
                          { value: '-1', label: 'Unlimited' }
                        ]}
                        value={localTerminalSettings.historySize.toString()}
                        onChange={(value) => setLocalTerminalSettings({...localTerminalSettings, historySize: parseInt(value)})}
                      />
                    </Grid>
                  </Stack>
                </Card>
              </Grid>

              {/* Terminal Preview */}
              <Card bg="surface.overlay" borderColor="brand.interactive.background" p="xl">
                <Text weight="bold" color="brand.interactive.background" mb="lg">
                  TERMINAL PREVIEW
                </Text>
                <Grid 
                  fontFamily={localTerminalSettings.fontFamily}
                  fontSize={`${localTerminalSettings.fontSize}px`}
                  lineHeight="1.4"
                  color="text.accent"
                  whiteSpace="pre-wrap"
                  bg="surface.secondary"
                  p="lg"
                  borderRadius="4px"
                  border="1px solid"
                  borderColor="border.default"
                >
                  <Text color="brand.interactive.background">cypher@matrix:~$ </Text>
                  <Text color="text.primary">system-status --verbose</Text>
                  {'\n'}
                  <Text color="text.secondary">[2024-01-15 23:47:32] </Text>
                  <Text color="text.accent">Checking system configuration...</Text>
                  {'\n'}
                  <Text color="text.secondary">[2024-01-15 23:47:33] </Text>
                  <Text color="brand.interactive.background">Terminal settings applied successfully</Text>
                  {'\n'}
                  <Text color="brand.interactive.background">
                    {localTerminalSettings.cursorStyle === 'block' ? '█' : 
                     localTerminalSettings.cursorStyle === 'underline' ? '_' : '|'}
                  </Text>
                </Grid>
              </Card>
            </Stack>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <Stack spacing="xl">
              <Grid 
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap="xl"
                
              >
                {/* Authentication */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    AUTHENTICATION
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Two-Factor Authentication:</Text>
                      <Badge variant="success">
                        ENABLED
                      </Badge>
                    </Stack>
                    <Button variant="outline">
                      REGENERATE BACKUP CODES
                    </Button>
                    <Divider borderColor="brand.interactive.background" opacity="0.3" />
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Current Password
                      </Text>
                      <Input
                        type="password"
                        placeholder="Enter current password..."
                      />
                    </Grid>
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        New Password
                      </Text>
                      <Input
                        type="password"
                        placeholder="Enter new password..."
                      />
                    </Grid>
                    <Button variant="outline">
                      UPDATE PASSWORD
                    </Button>
                  </Stack>
                </Card>

                {/* Access Control */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    ACCESS CONTROL
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Require VPN:</Text>
                      <Switch defaultChecked />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">IP Whitelist:</Text>
                      <Switch />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Auto-logout on Idle:</Text>
                      <Switch defaultChecked />
                    </Stack>
                    <Divider borderColor="brand.interactive.background" opacity="0.3" />
                    <Grid>
                      <Text variant="body-sm" color="text.primary">
                        Last Login: {userProfile.lastLogin}
                      </Text>
                      <Text variant="caption" color="text.secondary">
                        From: 192.168.1.100 (Trusted Network)
                      </Text>
                    </Grid>
                    <Button variant="outline">
                      VIEW AUDIT LOGS
                    </Button>
                  </Stack>
                </Card>
              </Grid>

              {/* API Keys Management */}
              <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                <Stack direction="horizontal" justify="between" align="center" mb="lg">
                  <Text weight="bold" color="brand.interactive.background">
                    API KEYS MANAGEMENT
                  </Text>
                  <Button 
                    variant="primary"
                    onClick={() => setShowApiKeyModal(true)}
                  >
                    GENERATE NEW KEY
                  </Button>
                </Stack>
                <Stack spacing="lg">
                  {apiKeys.map((key) => (
                    <Grid key={key.id} p="lg" bg="surface.secondary" borderRadius="4px" border="1px solid" borderColor={getStatusColor(key.status)}>
                      <Stack direction="horizontal" justify="between" align="start" mb="sm">
                        <Stack spacing="xs" flex="1">
                          <Text weight="bold" color="text.primary">
                            {key.name}
                          </Text>
                          <Text variant="caption" color="text.accent">
                            {key.id}
                          </Text>
                        </Stack>
                        <Stack direction="horizontal" spacing="sm" align="center">
                          <Badge 
                            variant={getStatusVariant(key.status)}
                          >
                            {key.status.toUpperCase()}
                          </Badge>
                          <Button 
                             
                            size="sm"
                          >
                            REVOKE
                          </Button>
                        </Stack>
                      </Stack>
                      <Stack direction="horizontal" spacing="sm" mb="sm">
                        {key.permissions.map((permission) => (
                          <Tag
                            key={permission}
                            
                            semantic="info"
                                                      >
                            {permission.toUpperCase()}
                          </Tag>
                        ))}
                      </Stack>
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="caption" color="text.secondary">
                          Created: {key.created}
                        </Text>
                        <Text variant="caption" color="text.secondary">
                          Last used: {key.lastUsed}
                        </Text>
                      </Stack>
                    </Grid>
                  ))}
                </Stack>
              </Card>
            </Stack>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Stack spacing="xl">
              <Grid 
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap="xl"
                
              >
                {/* System Notifications */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    SYSTEM NOTIFICATIONS
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">System Alerts:</Text>
                      <Switch
                        checked={localNotificationSettings.systemAlerts}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, systemAlerts: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Deployment Notifications:</Text>
                      <Switch
                        checked={localNotificationSettings.deploymentNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, deploymentNotifications: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Security Warnings:</Text>
                      <Switch
                        checked={localNotificationSettings.securityWarnings}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, securityWarnings: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Performance Alerts:</Text>
                      <Switch 
                        checked={localNotificationSettings.performanceAlerts}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, performanceAlerts: e.target.checked})}
                      />
                    </Stack>
                  </Stack>
                </Card>

                {/* Delivery Methods */}
                <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                  <Text weight="bold" color="brand.interactive.background" mb="lg">
                    DELIVERY METHODS
                  </Text>
                  <Stack spacing="lg">
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Email Notifications:</Text>
                      <Switch 
                        checked={localNotificationSettings.emailNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, emailNotifications: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Slack Integration:</Text>
                      <Switch 
                        checked={localNotificationSettings.slackIntegration}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, slackIntegration: e.target.checked})}
                      />
                    </Stack>
                    <Stack direction="horizontal" align="center" justify="between">
                      <Text color="text.primary">Push Notifications:</Text>
                      <Switch 
                        checked={localNotificationSettings.pushNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, pushNotifications: e.target.checked})}
                      />
                    </Stack>
                    <Divider borderColor="brand.interactive.background" opacity="0.3" />
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Email Address
                      </Text>
                      <Input
                        value="admin@cypher.sys"
                      />
                    </Grid>
                    <Grid>
                      <Text variant="body-sm" color="text.secondary">
                        Slack Webhook URL
                      </Text>
                      <Input
                        placeholder="https://hooks.slack.com/services/..."
                        disabled={!localNotificationSettings.slackIntegration}
                        
                      />
                    </Grid>
                  </Stack>
                </Card>
              </Grid>

              {/* Test Notifications */}
              <Card bg="surface.secondary" borderColor="brand.interactive.background" p="xl">
                <Text weight="bold" color="brand.interactive.background" mb="lg">
                  TEST NOTIFICATIONS
                </Text>
                <Stack direction="horizontal" spacing="lg">
                  <Button
                    
                  >
                    SEND TEST EMAIL
                  </Button>
                  <Button
                    
                    disabled={!localNotificationSettings.slackIntegration}
                  >
                    SEND TEST SLACK MESSAGE
                  </Button>
                  <Button
                    
                  >
                    TRIGGER PUSH NOTIFICATION
                  </Button>
                </Stack>
              </Card>
            </Stack>
          )}
        </Tabs>
      </Stack>

      {/* API Key Generation Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        title="Generate New API Key"
        size="md"
      >
        <Stack gap={3}>
          <Box>
            <Text variant="body-sm" color="text.secondary" mb="sm">
              Key Name
            </Text>
            <Input
              placeholder="Enter a descriptive name..."
              
            />
          </Box>
          <Box>
            <Text variant="body-sm" color="text.secondary" mb="sm">
              Permissions
            </Text>
            <Stack spacing="sm">
              <Stack direction="horizontal" align="center" spacing="sm">
                <Checkbox id="perm-read" />
                <Text color="text.primary">Read Access</Text>
              </Stack>
              <Stack direction="horizontal" align="center" spacing="sm">
                <Checkbox id="perm-write" />
                <Text color="text.primary">Write Access</Text>
              </Stack>
              <Stack direction="horizontal" align="center" spacing="sm">
                <Checkbox id="perm-deploy" />
                <Text color="text.primary">Deploy Access</Text>
              </Stack>
            </Stack>
          </Box>
          <Stack direction="horizontal" spacing="lg" justify="end" mt="lg">
            <Button
              
              onClick={() => setShowApiKeyModal(false)}
            >
              CANCEL
            </Button>
            <Button
              variant="primary"
              onClick={generateApiKey}
            >
              GENERATE KEY
            </Button>
          </Stack>
        </Stack>
      </Modal>

    </Box>
  );
}