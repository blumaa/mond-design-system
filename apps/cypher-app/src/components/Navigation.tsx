'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Text, Badge, Stack } from '@mond-design-system/theme';

const navigationItems = [
  { href: '/', label: 'DASHBOARD', icon: '⚡' },
  { href: '/terminal', label: 'TERMINAL', icon: '💻' },
  { href: '/monitor', label: 'MONITOR', icon: '📊' },
  { href: '/analytics', label: 'ANALYTICS', icon: '📈' },
];

export function Navigation() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');

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

  return (
    <Box
      as="nav"
      bg="surface.overlay"
      p="lg"
    >
      <Stack direction="horizontal" justify="between" align="center">

        {/* Brand section */}
        <Stack direction="horizontal" align="center" spacing="md">
          <Text
            variant="body-md"
            weight="bold"
            semantic="primary"
          >
            CYPHER.SYS
          </Text>
          <Text
            variant="caption"
            semantic="primary"
          >
            v3.0.0
          </Text>
          <Badge variant="success" size="sm">
            ONLINE
          </Badge>
        </Stack>

        {/* Navigation Links */}
        <Stack direction="horizontal" align="center" spacing="xl">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Stack
                  direction="horizontal"
                  align="center"
                  spacing="sm"
                  p="sm"
                >
                  <Text variant="body-sm">{item.icon}</Text>
                  <Text variant="body-sm" weight={isActive ? "bold" : "normal"}>
                    {item.label}
                  </Text>
                </Stack>
              </Link>
            );
          })}
        </Stack>

        {/* Status section */}
        <Stack direction="horizontal" align="center" spacing="md">
          <Text
            variant="caption"
            semantic="primary"
          >
            UTC: {currentTime}
          </Text>
          <Badge variant="primary" size="sm">
            SECURE
          </Badge>
        </Stack>

      </Stack>
    </Box>
  );
}