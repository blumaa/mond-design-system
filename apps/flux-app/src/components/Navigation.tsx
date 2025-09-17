'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Text, Badge, Stack } from '@mond-design-system/theme';
import { ModernIcon } from './ModernIcon';

const navigationItems = [
  { href: '/', label: 'DISCOVER', icon: 'music' as const },
  { href: '/artists', label: 'ARTISTS', icon: 'crown' as const },
  { href: '/feed', label: 'FEED', icon: 'star' as const },
  { href: '/tickets', label: 'TICKETS', icon: 'diamond' as const },
  { href: '/profile', label: 'PROFILE', icon: 'rocket' as const },
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
        <Stack direction="horizontal" align="center" spacing="4">
          <Text
            variant="body-md"
            weight="bold"
            semantic="primary"
          >
            FLUX.FEST
          </Text>
          <Text
            variant="caption"
            semantic="primary"
          >
            v2.0.0
          </Text>
          <Badge variant="success" size="sm">
            LIVE
          </Badge>
        </Stack>

        {/* Navigation Links */}
        <Stack direction="horizontal" align="center" spacing="8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Stack
                  direction="horizontal"
                  align="center"
                  spacing="2"
                  p="md"
                >
                  <ModernIcon type={item.icon} size="sm" />
                  <Text variant="body" weight={isActive ? "bold" : "normal"}>
                    {item.label}
                  </Text>
                </Stack>
              </Link>
            );
          })}
        </Stack>

        {/* Status section */}
        <Stack direction="horizontal" align="center" spacing="4">
          <Text
            variant="caption"
            semantic="primary"
          >
            UTC: {currentTime}
          </Text>
          <Badge variant="primary" size="sm">
            FESTIVAL MODE
          </Badge>
        </Stack>

      </Stack>
    </Box>
  );
}