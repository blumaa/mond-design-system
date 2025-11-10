'use client';
import { useState, useEffect } from 'react';
import { Box, Text, Badge, Heading, Divider } from '@mond-design-system/theme';

interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const mockEvents: SystemEvent[] = [
  { id: '1', timestamp: '23:47:12', type: 'info', message: 'Neural network sync completed' },
  { id: '2', timestamp: '23:47:08', type: 'success', message: 'Authentication token renewed' },
  { id: '3', timestamp: '23:46:55', type: 'warning', message: 'High CPU usage detected on Node-7' },
  { id: '4', timestamp: '23:46:42', type: 'info', message: 'Data backup initiated' },
  { id: '5', timestamp: '23:46:30', type: 'error', message: 'Connection timeout to neural.io' },
];

export function LiveSystemStatus() {
  const [events, setEvents] = useState<SystemEvent[]>(mockEvents);
  const [uptime, setUptime] = useState(172391); // seconds

  useEffect(() => {
    // Update uptime every second
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    // Add new system events periodically
    const eventInterval = setInterval(() => {
      const newEvent: SystemEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: Math.random() > 0.7 ? 'warning' : 'info',
        message: Math.random() > 0.5
          ? 'System health check completed'
          : 'Network traffic within normal parameters'
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
    }, 5000);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(eventInterval);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getBadgeVariant = (type: SystemEvent['type']) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Box bg="surface.elevated" p="xl" borderRadius={8}>
      <Box display="flex" flexDirection="column" gap="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" semantic="primary">
            LIVE SYSTEM LOG
          </Heading>
          <Box display="flex" gap="md" alignItems="center">
            <Text variant="caption" semantic="secondary">
              Uptime: {formatUptime(uptime)}
            </Text>
            <Badge variant="success" size="sm">
              LIVE
            </Badge>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column" gap="sm" maxHeight="300px" overflow="auto">
          {events.map((event) => (
            <Box key={event.id} display="flex" justifyContent="space-between" alignItems="center" p="sm">
              <Box display="flex" gap="md" alignItems="center">
                <Text variant="caption" semantic="secondary">
                  {event.timestamp}
                </Text>
                <Badge variant={getBadgeVariant(event.type)} size="sm">
                  {event.type.toUpperCase()}
                </Badge>
                <Text variant="body-sm">{event.message}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}