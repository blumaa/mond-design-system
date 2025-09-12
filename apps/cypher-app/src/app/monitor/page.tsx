'use client';
import React, { useState, useEffect } from 'react';
import { Box, Text, Card, Stack, Badge, Button, Tag, Divider, Spinner, Switch, Grid } from '@mond-design-system/theme';

interface MetricData {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  history: number[];
}

interface SystemAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  system: string;
  message: string;
  acknowledged: boolean;
}

export default function Monitor() {
  const [currentTime, setCurrentTime] = useState('');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      timestamp: '23:47:32',
      level: 'critical',
      system: 'SECURITY',
      message: 'Unauthorized access attempt detected from IP 192.168.1.100',
      acknowledged: false
    },
    {
      id: '2',
      timestamp: '23:46:15',
      level: 'warning',
      system: 'PERFORMANCE',
      message: 'CPU usage above 85% for extended period',
      acknowledged: false
    },
    {
      id: '3',
      timestamp: '23:45:01',
      level: 'error',
      system: 'NETWORK',
      message: 'Connection timeout to cdn.neural.io',
      acknowledged: true
    },
    {
      id: '4',
      timestamp: '23:44:22',
      level: 'info',
      system: 'SYSTEM',
      message: 'Scheduled backup completed successfully',
      acknowledged: true
    },
    {
      id: '5',
      timestamp: '23:43:45',
      level: 'warning',
      system: 'DATABASE',
      message: 'Connection pool nearing capacity limit',
      acknowledged: false
    }
  ]);

  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      id: 'cpu',
      label: 'CPU Usage',
      value: 73.2,
      unit: '%',
      status: 'normal',
      history: [65, 70, 68, 73, 75, 78, 73]
    },
    {
      id: 'memory',
      label: 'Memory',
      value: 45.8,
      unit: '%',
      status: 'normal',
      history: [42, 44, 46, 45, 47, 46, 45]
    },
    {
      id: 'network',
      label: 'Network I/O',
      value: 892.1,
      unit: 'KB/s',
      status: 'normal',
      history: [800, 850, 920, 880, 890, 875, 892]
    },
    {
      id: 'disk',
      label: 'Disk Usage',
      value: 67.4,
      unit: '%',
      status: 'warning',
      history: [60, 62, 64, 65, 66, 67, 67]
    },
    {
      id: 'connections',
      label: 'Active Connections',
      value: 247,
      unit: '',
      status: 'normal',
      history: [220, 235, 240, 245, 250, 248, 247]
    },
    {
      id: 'response',
      label: 'Response Time',
      value: 12.3,
      unit: 'ms',
      status: 'normal',
      history: [15, 13, 14, 12, 11, 13, 12]
    }
  ]);

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

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 0.1;
        const newValue = Math.max(0, metric.value + metric.value * variation);
        const newHistory = [...metric.history.slice(-6), newValue];
        
        let newStatus: MetricData['status'] = 'normal';
        if (metric.id === 'cpu' && newValue > 80) newStatus = 'warning';
        if (metric.id === 'cpu' && newValue > 90) newStatus = 'critical';
        if (metric.id === 'memory' && newValue > 75) newStatus = 'warning';
        if (metric.id === 'memory' && newValue > 85) newStatus = 'critical';
        if (metric.id === 'disk' && newValue > 80) newStatus = 'critical';
        if (metric.id === 'response' && newValue > 20) newStatus = 'warning';
        if (metric.id === 'response' && newValue > 30) newStatus = 'critical';

        return {
          ...metric,
          value: newValue,
          status: newStatus,
          history: newHistory
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };

  return (
    <Box minHeight="100vh" bg="surface.terminal" p="spacing.lg">
      <Box maxWidth="1200px" mx="auto">
        <Stack spacing="spacing.lg">
          
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="spacing.lg">
            <Box gap={30} display="flex">
              <Text 
                variant="title" 
                weight="bold" 
                semantic="accent"
                fontFamily="monospace"
              >
                SYSTEM MONITOR
              </Text>
              <Text variant="caption" semantic="secondary" mt="spacing.xs">
                Real-time metrics • Performance analysis • Alert management • UTC: {currentTime}
              </Text>
            </Box>
            
            <Box display="flex" alignItems="center" gap={16}>
              <Box display="flex" alignItems="center" gap={8}>
                <Switch 
                  checked={isLiveMode}
                  onChange={(e) => setIsLiveMode((e.target as HTMLInputElement).checked)}
                />
                <Text variant="body-sm" semantic="inverse">Live Mode</Text>
                {isLiveMode && <Spinner size="sm" />}
              </Box>
              <Badge variant="success">
                {isLiveMode ? 'MONITORING' : 'PAUSED'}
              </Badge>
            </Box>
          </Box>

          {/* Metrics Grid */}
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={24} mb="spacing.lg">
            {metrics.map((metric) => (
              <Card key={metric.id} p="spacing.lg">
                <Box display="flex" justifyContent="space-between" alignItems="start" mb="spacing.md">
                  <Box>
                    <Text variant="overline" semantic="tertiary">
                      {metric.label}
                    </Text>
                    <Text 
                      variant="headline" 
                      weight="bold" 
                      semantic="primary"
                      fontFamily="monospace"
                    >
                      {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                      <Text as="span" variant="body" semantic="tertiary" ml="spacing.sm">
                        {metric.unit}
                      </Text>
                    </Text>
                  </Box>
                  <Badge 
                    variant={metric.status === 'critical' ? 'error' : metric.status === 'warning' ? 'warning' : 'success'}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </Box>
                
                <Box mb="spacing.sm">
                  <Text variant="overline" semantic="tertiary">
                    Trend (Last 7 Intervals)
                  </Text>
                  <Text variant="caption" semantic="tertiary">
                    Chart visualization would be here
                  </Text>
                </Box>
              </Card>
            ))}
          </Grid>

          {/* Alerts Section */}
          <Card p="spacing.lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="spacing.lg">
              <Text variant="subtitle" weight="bold" semantic="error">
                SYSTEM ALERTS
              </Text>
              <Box display="flex" gap={16}>
                <Badge variant="error">
                  {alerts.filter(a => a.level === 'critical' && !a.acknowledged).length} CRITICAL
                </Badge>
                <Badge variant="warning">
                  {alerts.filter(a => a.level === 'warning' && !a.acknowledged).length} WARNING
                </Badge>
                <Badge variant="error">
                  {alerts.filter(a => a.level === 'error' && !a.acknowledged).length} ERROR
                </Badge>
              </Box>
            </Box>

            <Stack spacing={16}>
              {alerts.map((alert) => (
                <Box
                  key={alert.id}
                  display="flex"
                  alignItems="center"
                  p="spacing.md"
                  opacity={alert.acknowledged ? 0.6 : 1}
                >
                  <Text variant="title" mr="spacing.md">
                    {getAlertIcon(alert.level)}
                  </Text>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={16} mb="spacing.xs">
                      <Text variant="code" semantic="link">
                        [{alert.timestamp}]
                      </Text>
                      <Tag>
                        {alert.system}
                      </Tag>
                      <Tag variant="filled">
                        {alert.level.toUpperCase()}
                      </Tag>
                    </Box>
                    <Text variant="body-sm" semantic={alert.acknowledged ? "tertiary" : "inverse"}>
                      {alert.message}
                    </Text>
                  </Box>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      ACK
                    </Button>
                  )}
                  {alert.acknowledged && (
                    <Text variant="overline" semantic="tertiary" ml="spacing.md">
                      Acknowledged
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          </Card>

          {/* System Status Overview */}
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={16}>
            <Card p="spacing.md">
              <Text variant="subtitle" weight="bold" semantic="success" mb="spacing.sm">
                SERVICES STATUS
              </Text>
              <Stack spacing={16}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text variant="body-sm" semantic="inverse">Neural Interface</Text>
                  <Badge variant="success" size="sm">ONLINE</Badge>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text variant="body-sm" semantic="inverse">Security Core</Text>
                  <Badge variant="success" size="sm">ONLINE</Badge>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text variant="body-sm" semantic="inverse">Data Mining</Text>
                  <Badge variant="warning" size="sm">DEGRADED</Badge>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text variant="body-sm" semantic="inverse">CDN Network</Text>
                  <Badge variant="error" size="sm">DOWN</Badge>
                </Box>
              </Stack>
            </Card>

            <Card p="spacing.md">
              <Text variant="subtitle" weight="bold" semantic="link" mb="spacing.sm">
                QUICK ACTIONS
              </Text>
              <Stack spacing={16}>
                <Button size="sm" variant="outline">
                  🔄 RESTART SERVICES
                </Button>
                <Button size="sm" variant="outline">
                  🚨 EMERGENCY MODE
                </Button>
                <Button size="sm" variant="outline">
                  📊 GENERATE REPORT
                </Button>
                <Button size="sm" variant="outline">
                  🔒 LOCKDOWN SYSTEM
                </Button>
              </Stack>
            </Card>
          </Grid>
          
        </Stack>
      </Box>
    </Box>
  );
}
