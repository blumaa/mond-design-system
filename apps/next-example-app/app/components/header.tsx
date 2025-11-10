'use client';

import { Heading, Button } from '@mond-design-system/theme';
import { useTheme } from '../providers/theme-provider';

/**
 * Header Component
 *
 * App header with title and theme toggle light switch.
 * The toggle switches between light and dark modes using the violet brand theme.
 */
export function Header() {
  const { colorScheme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--mond-border-default)',
        backgroundColor: 'var(--mond-surface-base)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Heading level={1} size="xl">
            Mond Design System
          </Heading>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              backgroundColor: 'var(--mond-color-brand-primary-500)',
              color: 'white',
            }}
          >
            POC
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--mond-text-secondary)' }}>
            {colorScheme === 'light' ? '☀️ Light' : '🌙 Dark'}
          </span>
          <Button
            variant="ghost"
            size="md"
            onClick={toggleTheme}
            aria-label={`Switch to ${colorScheme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: colorScheme === 'dark' ? 'var(--mond-color-brand-primary-500)' : 'var(--mond-border-default)',
                position: 'relative',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: colorScheme === 'dark' ? '26px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
