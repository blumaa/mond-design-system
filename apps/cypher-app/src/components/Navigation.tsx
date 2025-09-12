'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Text, Badge } from '@mond-design-system/theme';

const navigationItems = [
  { href: '/', label: 'DASHBOARD', icon: '⚡' },
  { href: '/terminal', label: 'TERMINAL', icon: '💻' },
  { href: '/team', label: 'TEAM', icon: '👥' },
  { href: '/projects', label: 'PROJECTS', icon: '📂' },
  { href: '/monitor', label: 'MONITOR', icon: '📊' },
  { href: '/analytics', label: 'ANALYTICS', icon: '📈' },
  { href: '/settings', label: 'SETTINGS', icon: '⚙️' },
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

  const navigationStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(10, 10, 11, 0.95)',
    borderBottom: '1px solid #00ff41',
    backdropFilter: 'blur(10px)',
    padding: '1rem 2rem',
  };

  const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const brandStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const logoStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00ff41',
    textShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
    fontFamily: 'monospace',
  };

  const versionStyles = {
    fontSize: '0.75rem',
    color: '#00d4ff',
    fontFamily: 'monospace',
  };

  const navLinksStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  };

  const linkBaseStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    fontFamily: 'monospace',
    transition: 'all 150ms ease',
    border: '1px solid transparent',
    borderRadius: '4px',
  };

  const getLinkStyles = (isActive: boolean) => ({
    ...linkBaseStyles,
    color: isActive ? '#0a0a0a' : '#ffffff',
    backgroundColor: isActive ? '#00ff41' : 'transparent',
    borderColor: isActive ? '#00ff41' : '#333',
    boxShadow: isActive ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none',
  });

  const statusStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <Box as="nav" style={navigationStyles}>
      <Box style={containerStyles}>
        {/* Brand */}
        <Box style={brandStyles}>
          <Text style={logoStyles}>CYPHER.SYS</Text>
          <Text style={versionStyles}>v2.1.7</Text>
          <Badge 
            variant="success" 
            style={{
              backgroundColor: '#00ff41',
              color: '#0a0a0a',
              fontSize: '0.75rem',
              boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)'
            }}
          >
            ONLINE
          </Badge>
        </Box>

        {/* Navigation Links */}
        <Box style={navLinksStyles}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                style={getLinkStyles(isActive)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </Box>

        {/* Status */}
        <Box style={statusStyles}>
          <Text 
            variant="caption" 
            style={{ 
              color: '#00d4ff',
              fontFamily: 'monospace',
              fontSize: '0.75rem' 
            }}
          >
            UTC: {currentTime}
          </Text>
          <Badge 
            variant="primary" 
            style={{
              backgroundColor: '#00d4ff',
              color: '#0a0a0a',
              fontSize: '0.75rem',
              animation: 'pulse 2s infinite'
            }}
          >
            SECURE
          </Badge>
        </Box>
      </Box>
    </Box>
  );
}