'use client';
import React, { useState, useEffect } from 'react';
import { Box, Text, Card, Stack, Badge, Heading, Divider, Grid } from '@mond-design-system/theme';
import { MatrixRain } from '../../components/MatrixRain';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  history: number[];
}

interface NetworkConnection {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  status: 'active' | 'idle' | 'blocked';
  bandwidth: number;
}

interface SystemAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  source: string;
}

export default function Monitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { id: '1', name: 'CPU Usage', value: 73.2, unit: '%', status: 'warning', history: [65, 67, 70, 72, 73] },
    { id: '2', name: 'Memory Usage', value: 45.8, unit: '%', status: 'normal', history: [42, 44, 45, 46, 45] },
    { id: '3', name: 'Network I/O', value: 892.1, unit: 'KB/s', status: 'normal', history: [800, 850, 870, 890, 892] },
    { id: '4', name: 'Disk Usage', value: 67.4, unit: '%', status: 'normal', history: [65, 66, 67, 67, 67] },
    { id: '5', name: 'Temperature', value: 68.2, unit: '°C', status: 'normal', history: [66, 67, 68, 69, 68] },
    { id: '6', name: 'Power Draw', value: 245.7, unit: 'W', status: 'normal', history: [240, 242, 244, 246, 245] }
  ]);

  const [connections, setConnections] = useState<NetworkConnection[]>([
    { id: '1', source: 'Node-7', destination: 'neural.io', protocol: 'HTTPS', status: 'active', bandwidth: 156.7 },
    { id: '2', source: 'Terminal-3', destination: 'matrix.net', protocol: 'SSH', status: 'active', bandwidth: 23.4 },
    { id: '3', source: 'Core-9', destination: 'cypher.sys', protocol: 'TCP', status: 'idle', bandwidth: 0 },
    { id: '4', source: 'Gateway-1', destination: 'unknown', protocol: 'UDP', status: 'blocked', bandwidth: 0 }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: '1', timestamp: '23:47:15', level: 'warning', message: 'High CPU usage detected', source: 'Node-7' },
    { id: '2', timestamp: '23:47:08', level: 'info', message: 'Authentication successful', source: 'Gateway-1' },
    { id: '3', timestamp: '23:46:55', level: 'critical', message: 'Connection timeout detected', source: 'neural.io' },
    { id: '4', timestamp: '23:46:42', level: 'info', message: 'System backup completed', source: 'Core-9' }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with some randomness
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 10; // Random change between -5 and +5
        const newValue = Math.max(0, Math.min(100, metric.value + change));
        const newHistory = [...metric.history.slice(-4), newValue];

        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (metric.name === 'CPU Usage' || metric.name === 'Memory Usage') {
          if (newValue > 80) status = 'critical';
          else if (newValue > 70) status = 'warning';
        } else if (metric.name === 'Temperature') {
          if (newValue > 75) status = 'critical';
          else if (newValue > 70) status = 'warning';
        }

        return {
          ...metric,
          value: Math.round(newValue * 10) / 10,
          status,
          history: newHistory
        };
      }));

      // Occasionally add new alerts
      if (Math.random() > 0.8) {
        const alertMessages = [
          'Network traffic spike detected',
          'Authentication request from unknown source',
          'System performance optimal',
          'Firewall rule updated',
          'Data synchronization completed'
        ];

        const newAlert: SystemAlert = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: Math.random() > 0.7 ? 'warning' : 'info',
          message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
          source: `Node-${Math.floor(Math.random() * 10) + 1}`
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }

      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return { variant: 'error' as const, text: 'CRITICAL' };
      case 'warning': return { variant: 'warning' as const, text: 'WARNING' };
      case 'active': return { variant: 'success' as const, text: 'ACTIVE' };
      case 'blocked': return { variant: 'error' as const, text: 'BLOCKED' };
      case 'idle': return { variant: 'secondary' as const, text: 'IDLE' };
      default: return { variant: 'success' as const, text: 'NORMAL' };
    }
  };

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'critical': return { variant: 'error' as const, text: 'CRITICAL' };
      case 'warning': return { variant: 'warning' as const, text: 'WARNING' };
      default: return { variant: 'primary' as const, text: 'INFO' };
    }
  };

  return (
    <Box bg="surface.background" p="2xl" position="relative">
      <MatrixRain />

      <Stack spacing="xl">
        <Stack spacing="md">
          <Stack direction="horizontal" justify="between" align="center">
            <Heading size="4xl" semantic="primary">
              SYSTEM MONITOR
            </Heading>
            <Stack direction="horizontal" spacing="md" align="center">
              <Text variant="caption" semantic="secondary">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </Text>
              <Badge variant="success" size="sm">LIVE</Badge>
            </Stack>
          </Stack>
          <Text variant="body-lg" semantic="secondary">
            Real-time neural network monitoring • Quantum sensors active
          </Text>
        </Stack>

        {/* System Metrics Grid */}
        <Grid columns={3} gap="lg">
          {metrics.map((metric) => {
            const statusBadge = getStatusBadge(metric.status);
            return (
              <Card key={metric.id} variant="elevated" padding="lg">
                <Stack spacing="md">
                  <Stack direction="horizontal" justify="between" align="center">
                    <Text variant="body-md" weight="bold">{metric.name}</Text>
                    <Badge variant={statusBadge.variant} size="sm">
                      {statusBadge.text}
                    </Badge>
                  </Stack>

                  <Stack direction="horizontal" align="end" spacing="sm">
                    <Text variant="title" semantic="primary">
                      {metric.value}
                    </Text>
                    <Text variant="body-sm" semantic="secondary">
                      {metric.unit}
                    </Text>
                  </Stack>

                  <Stack spacing="xs">
                    <Text variant="caption" semantic="secondary">History (last 5 readings)</Text>
                    <Stack direction="horizontal" spacing="xs">
                      {metric.history.map((value, index) => (
                        <Box
                          key={index}
                          bg="brand.interactive.background"
                          height={`${(value / 100) * 40 + 10}px`}
                          width="8px"
                          borderRadius="sm"
                          opacity={index === metric.history.length - 1 ? 1 : 0.6}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Grid>

        {/* Network Connections and Alerts */}
        <Grid columns={2} gap="xl">

          {/* Network Connections */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                NETWORK CONNECTIONS
              </Heading>
              <Divider />

              <Stack spacing="md">
                {connections.map((connection) => {
                  const statusBadge = getStatusBadge(connection.status);
                  return (
                    <Stack key={connection.id} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text variant="body-sm" weight="bold">
                          {connection.source} → {connection.destination}
                        </Text>
                        <Badge variant={statusBadge.variant} size="sm">
                          {statusBadge.text}
                        </Badge>
                      </Stack>

                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">
                          Protocol: {connection.protocol}
                        </Text>
                        <Text variant="caption" semantic="primary">
                          {connection.bandwidth.toFixed(1)} KB/s
                        </Text>
                      </Stack>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

          {/* System Alerts */}
          <Card variant="elevated" padding="xl">
            <Stack spacing="lg">
              <Heading size="lg" semantic="primary">
                SYSTEM ALERTS
              </Heading>
              <Divider />

              <Stack spacing="md" maxHeight="300px" overflow="auto">
                {alerts.map((alert) => {
                  const alertBadge = getAlertBadge(alert.level);
                  return (
                    <Stack key={alert.id} spacing="sm">
                      <Stack direction="horizontal" justify="between" align="center">
                        <Badge variant={alertBadge.variant} size="sm">
                          {alertBadge.text}
                        </Badge>
                        <Text variant="caption" semantic="secondary">
                          {alert.timestamp}
                        </Text>
                      </Stack>

                      <Text variant="body-sm">{alert.message}</Text>
                      <Text variant="caption" semantic="secondary">
                        Source: {alert.source}
                      </Text>
                      <Divider />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Box>
  );
}