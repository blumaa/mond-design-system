'use client';
import React, { useState, useEffect } from 'react';
import { Box, Text, Card, Stack, Badge, Button, Tag, Divider, Spinner, Switch } from '@mond-design-system/theme';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#00ff41';
      case 'warning': return '#ff9500';
      case 'critical': case 'error': return '#ff0055';
      case 'info': return '#00d4ff';
      default: return '#666';
    }
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

  const renderMiniChart = (history: number[], color: string) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <Box style={{ 
        display: 'flex', 
        alignItems: 'end', 
        gap: '2px', 
        height: '40px',
        marginTop: '0.5rem'
      }}>
        {history.map((value, index) => (
          <Box
            key={index}
            style={{
              width: '8px',
              height: `${((value - min) / range) * 40}px`,
              backgroundColor: color,
              minHeight: '2px',
              borderRadius: '1px',
              opacity: index === history.length - 1 ? 1 : 0.7
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 100%)',
        padding: '2rem',
      }}
    >
      <Stack gap={4}>
        {/* Header */}
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Text 
              variant="body-lg" 
              weight="bold" 
              style={{ 
                color: '#00ff41',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
                fontSize: '1.5rem'
              }}
            >
              SYSTEM MONITOR
            </Text>
            <Text variant="body-sm" style={{ color: '#00d4ff', marginTop: '0.25rem' }}>
              Real-time metrics • Performance analysis • Alert management • UTC: {currentTime}
            </Text>
          </Box>
          <Box style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Switch 
                checked={isLiveMode}
                onChange={(e) => setIsLiveMode((e.target as HTMLInputElement).checked)}
              />
              <Text variant="body-sm" style={{ color: '#ffffff' }}>Live Mode</Text>
              {isLiveMode && <Spinner size="sm" style={{ color: '#00ff41' }} />}
            </Box>
            <Badge 
              variant="success" 
              style={{
                backgroundColor: '#00ff41',
                color: '#0a0a0a',
                animation: isLiveMode ? 'pulse 2s infinite' : 'none'
              }}
            >
              {isLiveMode ? 'MONITORING' : 'PAUSED'}
            </Badge>
          </Box>
        </Box>

        {/* Metrics Grid */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {metrics.map((metric) => (
            <Card key={metric.id} style={{
              backgroundColor: 'rgba(26, 26, 30, 0.8)',
              border: `1px solid ${getStatusColor(metric.status)}`,
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: `0 0 20px ${getStatusColor(metric.status)}20`,
            }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <Box>
                  <Text variant="body-sm" style={{ color: '#888', marginBottom: '0.25rem' }}>
                    {metric.label.toUpperCase()}
                  </Text>
                  <Text 
                    variant="body-lg" 
                    weight="bold" 
                    style={{ 
                      color: '#ffffff',
                      fontFamily: 'monospace',
                      fontSize: '2rem'
                    }}
                  >
                    {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                    <span style={{ fontSize: '1rem', color: '#888', marginLeft: '0.5rem' }}>
                      {metric.unit}
                    </span>
                  </Text>
                </Box>
                <Badge 
                  style={{
                    backgroundColor: getStatusColor(metric.status),
                    color: metric.status === 'critical' ? '#ffffff' : '#0a0a0a',
                  }}
                >
                  {metric.status.toUpperCase()}
                </Badge>
              </Box>
              
              <Box style={{ marginBottom: '0.5rem' }}>
                <Text variant="caption" style={{ color: '#888', marginBottom: '0.25rem' }}>
                  TREND (LAST 7 INTERVALS)
                </Text>
                {renderMiniChart(metric.history, getStatusColor(metric.status))}
              </Box>
            </Card>
          ))}
        </Box>

        {/* Alerts Section */}
        <Card style={{
          backgroundColor: 'rgba(26, 26, 30, 0.8)',
          border: '1px solid #ff0055',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 0 20px rgba(255, 0, 85, 0.1)',
        }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Text weight="bold" style={{ color: '#ff0055' }}>
              SYSTEM ALERTS
            </Text>
            <Box style={{ display: 'flex', gap: '1rem' }}>
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

          <Stack gap={2}>
            {alerts.map((alert) => (
              <Box
                key={alert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: alert.acknowledged ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                  border: `1px solid ${getStatusColor(alert.level)}`,
                  borderRadius: '4px',
                  opacity: alert.acknowledged ? 0.6 : 1,
                }}
              >
                <Text style={{ marginRight: '1rem', fontSize: '1.25rem' }}>
                  {getAlertIcon(alert.level)}
                </Text>
                <Box style={{ flex: 1 }}>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                    <Text variant="body-sm" style={{ color: '#00d4ff', fontFamily: 'monospace' }}>
                      [{alert.timestamp}]
                    </Text>
                    <Tag 
                      style={{
                        backgroundColor: getStatusColor(alert.level),
                        color: alert.level === 'critical' || alert.level === 'error' ? '#ffffff' : '#0a0a0a',
                        fontSize: '0.75rem'
                      }}
                    >
                      {alert.system}
                    </Tag>
                    <Tag 
                      variant="filled"
                      semantic={alert.level === 'critical' ? 'error' : alert.level === 'warning' ? 'warning' : alert.level === 'error' ? 'error' : 'info'}
                      style={{
                        backgroundColor: getStatusColor(alert.level),
                        color: alert.level === 'critical' || alert.level === 'error' ? '#ffffff' : '#0a0a0a',
                        fontSize: '0.75rem'
                      }}
                    >
                      {alert.level.toUpperCase()}
                    </Tag>
                  </Box>
                  <Text variant="body-sm" style={{ color: alert.acknowledged ? '#888' : '#ffffff' }}>
                    {alert.message}
                  </Text>
                </Box>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#00d4ff',
                      border: '1px solid #00d4ff',
                      fontSize: '0.75rem',
                      marginLeft: '1rem'
                    }}
                  >
                    ACK
                  </Button>
                )}
                {alert.acknowledged && (
                  <Text variant="caption" style={{ color: '#888', marginLeft: '1rem' }}>
                    ACKNOWLEDGED
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        </Card>

        {/* System Status Overview */}
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00ff41',
            borderRadius: '8px',
            padding: '1rem',
          }}>
            <Text weight="bold" style={{ color: '#00ff41', marginBottom: '0.5rem' }}>
              SERVICES STATUS
            </Text>
            <Stack gap={2}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: '0.875rem' }}>Neural Interface</Text>
                <Badge variant="success" size="sm">
                  ONLINE
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: '0.875rem' }}>Security Core</Text>
                <Badge variant="success" size="sm">
                  ONLINE
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: '0.875rem' }}>Data Mining</Text>
                <Badge variant="warning" size="sm">
                  DEGRADED
                </Badge>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: '0.875rem' }}>CDN Network</Text>
                <Badge variant="error" size="sm">
                  DOWN
                </Badge>
              </Box>
            </Stack>
          </Card>

          <Card style={{
            backgroundColor: 'rgba(26, 26, 30, 0.8)',
            border: '1px solid #00d4ff',
            borderRadius: '8px',
            padding: '1rem',
          }}>
            <Text weight="bold" style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>
              QUICK ACTIONS
            </Text>
            <Stack gap={2}>
              <Button 
                size="sm" 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#00ff41',
                  border: '1px solid #00ff41',
                  justifyContent: 'flex-start'
                }}
              >
                🔄 RESTART SERVICES
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ff9500',
                  border: '1px solid #ff9500',
                  justifyContent: 'flex-start'
                }}
              >
                🚨 EMERGENCY MODE
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#00d4ff',
                  border: '1px solid #00d4ff',
                  justifyContent: 'flex-start'
                }}
              >
                📊 GENERATE REPORT
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ff0055',
                  border: '1px solid #ff0055',
                  justifyContent: 'flex-start'
                }}
              >
                🔒 LOCKDOWN SYSTEM
              </Button>
            </Stack>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}