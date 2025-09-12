'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Text, Badge, Heading, Input, Select, Switch, Divider, Link, Avatar, Checkbox, Spinner, Tag, Accordion, Modal, Tabs } from '@mond-design-system/theme';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff41';
      case 'inactive': return '#666';
      default: return '#666';
    }
  };

  return (
    <Box 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 100%)',
        padding: '2rem',
        fontFamily: 'var(--font-jetbrains-mono)',
      }}
    >
      <Stack gap={4}>
        {/* Header */}
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #00ff41',
          paddingBottom: '1rem',
        }}>
          <Box>
            <Heading 
              level={1}
              size="2xl" 
              weight="bold" 
              style={{ 
                color: '#00ff41', 
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
              }}
            >
              SYSTEM CONFIGURATION
            </Heading>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              USER PREFERENCES & SECURITY SETTINGS // UTC: {currentTime}
            </Text>
          </Box>
          <Button 
            variant="primary"
            onClick={saveSettings}
            disabled={isSaving}
            style={{
              backgroundColor: '#00ff41',
              color: '#0a0a0a',
              border: 'none',
              boxShadow: isSaving ? '0 0 25px rgba(0, 255, 65, 0.6)' : '0 0 15px rgba(0, 255, 65, 0.3)',
            }}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </Box>

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
            <Stack gap={4}>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* User Profile */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    USER PROFILE
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Avatar 
                        src="" 
                        alt="User Avatar" 
                        size="lg" 
                        style={{ backgroundColor: '#00ff41' }} 
                      />
                      <Box style={{ flex: 1 }}>
                        <Text weight="bold" style={{ color: '#ffffff' }}>
                          {userProfile.fullName}
                        </Text>
                        <Text variant="body-sm" style={{ color: '#00d4ff' }}>
                          {userProfile.username}
                        </Text>
                        <Badge 
                          variant="success" 
                          style={{ backgroundColor: '#00ff41', color: '#0a0a0a', marginTop: '0.25rem' }}
                        >
                          {userProfile.role}
                        </Badge>
                      </Box>
                    </Box>
                    <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
                    <Stack gap={2}>
                      <Box>
                        <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
                          Full Name
                        </Text>
                        <Input
                          value={userProfile.fullName}
                        />
                      </Box>
                      <Box>
                        <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                      </Box>
                    </Stack>
                  </Stack>
                </Card>

                {/* Theme & Display */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    THEME & DISPLAY
                  </Text>
                  <Stack gap={3}>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Scan Line Effects:</Text>
                      <Switch defaultChecked />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Glow Effects:</Text>
                      <Switch defaultChecked />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Matrix Rain Background:</Text>
                      <Switch />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Reduced Motion:</Text>
                      <Switch />
                    </Box>
                  </Stack>
                </Card>
              </Box>
            </Stack>
          )}

          {/* Terminal Preferences Tab */}
          {activeTab === 'terminal' && (
            <Stack gap={4}>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Terminal Appearance */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    TERMINAL APPEARANCE
                  </Text>
                  <Stack gap={3}>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                    </Box>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                    </Box>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                    </Box>
                  </Stack>
                </Card>

                {/* Terminal Behavior */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    TERMINAL BEHAVIOR
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Blinking Cursor:</Text>
                      <Switch 
                        checked={localTerminalSettings.blinkingCursor}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, blinkingCursor: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Sound Effects:</Text>
                      <Switch 
                        checked={localTerminalSettings.soundEnabled}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, soundEnabled: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Auto-complete:</Text>
                      <Switch 
                        checked={localTerminalSettings.autoComplete}
                        onChange={(e) => setLocalTerminalSettings({...localTerminalSettings, autoComplete: e.target.checked})}
                      />
                    </Box>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
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
                    </Box>
                  </Stack>
                </Card>
              </Box>

              {/* Terminal Preview */}
              <Card style={{
                backgroundColor: 'rgba(10, 10, 11, 0.95)',
                border: '1px solid #00ff41',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
              }}>
                <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                  TERMINAL PREVIEW
                </Text>
                <Box style={{
                  fontFamily: localTerminalSettings.fontFamily,
                  fontSize: `${localTerminalSettings.fontSize}px`,
                  lineHeight: '1.4',
                  color: '#00d4ff',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #333',
                }}>
                  <Text style={{ color: '#00ff41' }}>cypher@matrix:~$ </Text>
                  <Text style={{ color: '#ffffff' }}>system-status --verbose</Text>
                  {'\n'}
                  <Text style={{ color: '#888' }}>[2024-01-15 23:47:32] </Text>
                  <Text style={{ color: '#00d4ff' }}>Checking system configuration...</Text>
                  {'\n'}
                  <Text style={{ color: '#888' }}>[2024-01-15 23:47:33] </Text>
                  <Text style={{ color: '#00ff41' }}>Terminal settings applied successfully</Text>
                  {'\n'}
                  <Text style={{ color: '#00ff41', animation: localTerminalSettings.blinkingCursor ? 'blink 1s infinite' : 'none' }}>
                    {localTerminalSettings.cursorStyle === 'block' ? '█' : 
                     localTerminalSettings.cursorStyle === 'underline' ? '_' : '|'}
                  </Text>
                </Box>
              </Card>
            </Stack>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <Stack gap={4}>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Authentication */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    AUTHENTICATION
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Two-Factor Authentication:</Text>
                      <Badge 
                        variant="success" 
                        style={{ backgroundColor: '#00ff41', color: '#0a0a0a' }}
                      >
                        ENABLED
                      </Badge>
                    </Box>
                    <Button 
                      variant="outline"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#00d4ff',
                        border: '1px solid #00d4ff',
                      }}
                    >
                      REGENERATE BACKUP CODES
                    </Button>
                    <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
                        Current Password
                      </Text>
                      <Input
                        type="password"
                        placeholder="Enter current password..."
                      />
                    </Box>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
                        New Password
                      </Text>
                      <Input
                        type="password"
                        placeholder="Enter new password..."
                      />
                    </Box>
                    <Button 
                      variant="primary"
                      style={{
                        backgroundColor: '#ff9500',
                        color: '#0a0a0a',
                        border: 'none',
                      }}
                    >
                      UPDATE PASSWORD
                    </Button>
                  </Stack>
                </Card>

                {/* Access Control */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    ACCESS CONTROL
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Require VPN:</Text>
                      <Switch defaultChecked />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>IP Whitelist:</Text>
                      <Switch />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Auto-logout on Idle:</Text>
                      <Switch defaultChecked />
                    </Box>
                    <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
                    <Box>
                      <Text variant="body-sm" style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                        Last Login: {userProfile.lastLogin}
                      </Text>
                      <Text variant="caption" style={{ color: '#888' }}>
                        From: 192.168.1.100 (Trusted Network)
                      </Text>
                    </Box>
                    <Button 
                      variant="outline"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#ff0055',
                        border: '1px solid #ff0055',
                      }}
                    >
                      VIEW AUDIT LOGS
                    </Button>
                  </Stack>
                </Card>
              </Box>

              {/* API Keys Management */}
              <Card style={{
                backgroundColor: 'rgba(26, 26, 30, 0.8)',
                border: '1px solid #00ff41',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
              }}>
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Text weight="bold" style={{ color: '#00ff41' }}>
                    API KEYS MANAGEMENT
                  </Text>
                  <Button 
                    variant="primary"
                    onClick={() => setShowApiKeyModal(true)}
                    style={{
                      backgroundColor: '#00ff41',
                      color: '#0a0a0a',
                      border: 'none',
                    }}
                  >
                    GENERATE NEW KEY
                  </Button>
                </Box>
                <Stack gap={3}>
                  {apiKeys.map((key) => (
                    <Box key={key.id} style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '4px',
                      border: `1px solid ${getStatusColor(key.status)}`,
                    }}>
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <Box style={{ flex: 1 }}>
                          <Text weight="bold" style={{ color: '#ffffff', marginBottom: '0.25rem' }}>
                            {key.name}
                          </Text>
                          <Text variant="caption" style={{ color: '#00d4ff' }}>
                            {key.id}
                          </Text>
                        </Box>
                        <Box style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Badge 
                            style={{ 
                              backgroundColor: getStatusColor(key.status), 
                              color: key.status === 'active' ? '#0a0a0a' : '#ffffff',
                              fontSize: '0.75rem'
                            }}
                          >
                            {key.status.toUpperCase()}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            style={{
                              backgroundColor: 'transparent',
                              color: '#ff0055',
                              border: '1px solid #ff0055',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            REVOKE
                          </Button>
                        </Box>
                      </Box>
                      <Box style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {key.permissions.map((permission) => (
                          <Tag 
                            key={permission}
                            variant="filled" 
                            semantic="info" 
                            style={{ backgroundColor: '#00d4ff', color: '#0a0a0a', fontSize: '0.75rem' }}
                          >
                            {permission.toUpperCase()}
                          </Tag>
                        ))}
                      </Box>
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="caption" style={{ color: '#888' }}>
                          Created: {key.created}
                        </Text>
                        <Text variant="caption" style={{ color: '#888' }}>
                          Last used: {key.lastUsed}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Stack gap={4}>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* System Notifications */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    SYSTEM NOTIFICATIONS
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>System Alerts:</Text>
                      <Switch 
                        checked={localNotificationSettings.systemAlerts}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, systemAlerts: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Deployment Notifications:</Text>
                      <Switch 
                        checked={localNotificationSettings.deploymentNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, deploymentNotifications: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Security Warnings:</Text>
                      <Switch 
                        checked={localNotificationSettings.securityWarnings}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, securityWarnings: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Performance Alerts:</Text>
                      <Switch 
                        checked={localNotificationSettings.performanceAlerts}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, performanceAlerts: e.target.checked})}
                      />
                    </Box>
                  </Stack>
                </Card>

                {/* Delivery Methods */}
                <Card style={{
                  backgroundColor: 'rgba(26, 26, 30, 0.8)',
                  border: '1px solid #00ff41',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
                }}>
                  <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                    DELIVERY METHODS
                  </Text>
                  <Stack gap={3}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Email Notifications:</Text>
                      <Switch 
                        checked={localNotificationSettings.emailNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, emailNotifications: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Slack Integration:</Text>
                      <Switch 
                        checked={localNotificationSettings.slackIntegration}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, slackIntegration: e.target.checked})}
                      />
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#ffffff' }}>Push Notifications:</Text>
                      <Switch 
                        checked={localNotificationSettings.pushNotifications}
                        onChange={(e) => setLocalNotificationSettings({...localNotificationSettings, pushNotifications: e.target.checked})}
                      />
                    </Box>
                    <Divider style={{ borderColor: '#00ff41', opacity: 0.3 }} />
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
                        Email Address
                      </Text>
                      <Input
                        value="admin@cypher.sys"
                      />
                    </Box>
                    <Box>
                      <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
                        Slack Webhook URL
                      </Text>
                      <Input
                        placeholder="https://hooks.slack.com/services/..."
                        disabled={!localNotificationSettings.slackIntegration}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid #333',
                          color: '#ffffff',
                          opacity: localNotificationSettings.slackIntegration ? 1 : 0.5
                        }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Box>

              {/* Test Notifications */}
              <Card style={{
                backgroundColor: 'rgba(26, 26, 30, 0.8)',
                border: '1px solid #00ff41',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
              }}>
                <Text weight="bold" style={{ color: '#00ff41', marginBottom: '1rem' }}>
                  TEST NOTIFICATIONS
                </Text>
                <Box style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button 
                    variant="outline"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00d4ff',
                      border: '1px solid #00d4ff',
                    }}
                  >
                    SEND TEST EMAIL
                  </Button>
                  <Button 
                    variant="outline"
                    disabled={!localNotificationSettings.slackIntegration}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00d4ff',
                      border: '1px solid #00d4ff',
                      opacity: localNotificationSettings.slackIntegration ? 1 : 0.5
                    }}
                  >
                    SEND TEST SLACK MESSAGE
                  </Button>
                  <Button 
                    variant="outline"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00d4ff',
                      border: '1px solid #00d4ff',
                    }}
                  >
                    TRIGGER PUSH NOTIFICATION
                  </Button>
                </Box>
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
            <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
              Key Name
            </Text>
            <Input
              placeholder="Enter a descriptive name..."
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid #333',
                color: '#ffffff'
              }}
            />
          </Box>
          <Box>
            <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.5rem' }}>
              Permissions
            </Text>
            <Stack gap={2}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox id="perm-read" style={{ accentColor: '#00ff41' }} />
                <Text style={{ color: '#ffffff' }}>Read Access</Text>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox id="perm-write" style={{ accentColor: '#00ff41' }} />
                <Text style={{ color: '#ffffff' }}>Write Access</Text>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox id="perm-deploy" style={{ accentColor: '#00ff41' }} />
                <Text style={{ color: '#ffffff' }}>Deploy Access</Text>
              </Box>
            </Stack>
          </Box>
          <Box style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button 
              variant="outline"
              onClick={() => setShowApiKeyModal(false)}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #666',
              }}
            >
              CANCEL
            </Button>
            <Button 
              variant="primary"
              onClick={generateApiKey}
              style={{
                backgroundColor: '#00ff41',
                color: '#0a0a0a',
                border: 'none',
              }}
            >
              GENERATE KEY
            </Button>
          </Box>
        </Stack>
      </Modal>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}