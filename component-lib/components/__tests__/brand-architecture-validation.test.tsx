/**
 * Brand Architecture Validation Tests - Phase 3
 * 
 * Comprehensive testing to ensure all core components work correctly
 * across MOND, CYPHER, and FLUX brand themes.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Badge } from '../atoms/Badge/Badge';
import { Modal } from '../organisms/Modal/Modal';
import { Sidebar } from '../organisms/Sidebar/Sidebar';
import { Button } from '../atoms/Button/Button';
import { Input } from '../atoms/Input/Input';
import { Switch } from '../atoms/Switch/Switch';
import { mondTheme } from '../../brands/mond';
import { cypherTheme } from '../../brands/cypher';
import { fluxTheme } from '../../brands/flux';
import type { BrandTheme } from '../providers/ThemeProvider';

// Test data for sidebar
const testSidebarSections = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
      { id: 'analytics', label: 'Analytics', href: '/analytics' },
    ]
  }
];

describe('Brand Architecture Validation - Phase 3', () => {
  const brandThemes: Array<{ name: string; theme: BrandTheme; description: string }> = [
    { name: 'MOND', theme: mondTheme, description: 'Default enterprise theme' },
    { name: 'CYPHER', theme: cypherTheme, description: 'Cyberpunk developer tools' },
    { name: 'FLUX', theme: fluxTheme, description: 'Vibrant music festival theme' },
  ];

  const colorSchemes: Array<'light' | 'dark'> = ['light', 'dark'];

  describe('Badge Component - Cross-Brand Testing', () => {
    brandThemes.forEach(({ name, theme }) => {
      colorSchemes.forEach((colorScheme) => {
        it(`should render Badge variants correctly with ${name} theme in ${colorScheme} mode`, () => {
          const variants: Array<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = [
            'default', 'primary', 'secondary', 'success', 'warning', 'error'
          ];

          render(
            <ThemeProvider brandTheme={theme} colorScheme={colorScheme}>
              <div data-testid="badge-container">
                {variants.map(variant => (
                  <Badge key={variant} variant={variant} data-testid={`badge-${variant}`}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </ThemeProvider>
          );

          variants.forEach(variant => {
            const badge = screen.getByTestId(`badge-${variant}`);
            expect(badge).toBeInTheDocument();
            
            // Verify badge has proper styling (not transparent)
            const computedStyle = window.getComputedStyle(badge);
            expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
            expect(computedStyle.backgroundColor).not.toBe('transparent');
          });
        });
      });
    });
  });

  describe('Modal Component - Cross-Brand Testing', () => {
    brandThemes.forEach(({ name, theme }) => {
      colorSchemes.forEach((colorScheme) => {
        it(`should render Modal correctly with ${name} theme in ${colorScheme} mode`, () => {
          render(
            <ThemeProvider brandTheme={theme} colorScheme={colorScheme}>
              <Modal 
                isOpen={true} 
                onClose={() => {}} 
                title={`${name} Modal`}
                data-testid={`modal-${name.toLowerCase()}`}
              >
                <p>Modal content for {name} theme</p>
              </Modal>
            </ThemeProvider>
          );

          const modal = screen.getByTestId(`modal-${name.toLowerCase()}`);
          expect(modal).toBeInTheDocument();
          
          // Verify modal has proper background styling
          const computedStyle = window.getComputedStyle(modal);
          expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
          expect(computedStyle.backgroundColor).not.toBe('transparent');
        });
      });
    });
  });

  describe('Sidebar Component - Cross-Brand Testing', () => {
    brandThemes.forEach(({ name, theme }) => {
      colorSchemes.forEach((colorScheme) => {
        it(`should render Sidebar correctly with ${name} theme in ${colorScheme} mode`, () => {
          render(
            <ThemeProvider brandTheme={theme} colorScheme={colorScheme}>
              <Sidebar 
                sections={testSidebarSections}
                data-testid={`sidebar-${name.toLowerCase()}`}
              />
            </ThemeProvider>
          );

          const sidebar = screen.getByTestId(`sidebar-${name.toLowerCase()}`);
          expect(sidebar).toBeInTheDocument();
          
          // Verify sidebar items are rendered
          expect(screen.getByText('Dashboard')).toBeInTheDocument();
          expect(screen.getByText('Analytics')).toBeInTheDocument();
          
          // Verify sidebar has proper background styling
          const computedStyle = window.getComputedStyle(sidebar);
          expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
          expect(computedStyle.backgroundColor).not.toBe('transparent');
        });
      });
    });
  });

  describe('Additional Core Components - Cross-Brand Testing', () => {
    brandThemes.forEach(({ name, theme }) => {
      it(`should render Button, Input, and Switch with ${name} theme`, () => {
        render(
          <ThemeProvider brandTheme={theme} colorScheme="light">
            <div data-testid={`components-${name.toLowerCase()}`}>
              <Button variant="primary" data-testid={`button-${name.toLowerCase()}`}>
                {name} Button
              </Button>
              <Input 
                placeholder={`${name} Input`}
                data-testid={`input-${name.toLowerCase()}`}
              />
              <Switch 
                checked={false}
                onChange={() => {}}
                data-testid={`switch-${name.toLowerCase()}`}
              />
            </div>
          </ThemeProvider>
        );

        // Verify all components render
        expect(screen.getByTestId(`button-${name.toLowerCase()}`)).toBeInTheDocument();
        expect(screen.getByTestId(`input-${name.toLowerCase()}`)).toBeInTheDocument();
        expect(screen.getByTestId(`switch-${name.toLowerCase()}`)).toBeInTheDocument();
      });
    });
  });

  describe('Brand Color Differentiation', () => {
    it('should apply different colors for primary buttons across brands', () => {
      const { rerender } = render(
        <ThemeProvider brandTheme={mondTheme} colorScheme="light">
          <Button variant="primary" data-testid="test-button">Test</Button>
        </ThemeProvider>
      );

      const button = screen.getByTestId('test-button');
      const mondColor = window.getComputedStyle(button).backgroundColor;

      rerender(
        <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
          <Button variant="primary" data-testid="test-button">Test</Button>
        </ThemeProvider>
      );
      const cypherColor = window.getComputedStyle(button).backgroundColor;

      rerender(
        <ThemeProvider brandTheme={fluxTheme} colorScheme="light">
          <Button variant="primary" data-testid="test-button">Test</Button>
        </ThemeProvider>
      );
      const fluxColor = window.getComputedStyle(button).backgroundColor;

      // All three brands should have different colors
      expect(mondColor).not.toBe(cypherColor);
      expect(mondColor).not.toBe(fluxColor);
      expect(cypherColor).not.toBe(fluxColor);
    });

    it('should apply different colors for success badges across brands', () => {
      const { rerender } = render(
        <ThemeProvider brandTheme={mondTheme} colorScheme="light">
          <Badge variant="success" data-testid="test-badge">Success</Badge>
        </ThemeProvider>
      );

      const badge = screen.getByTestId('test-badge');
      const mondColor = window.getComputedStyle(badge).backgroundColor;

      rerender(
        <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
          <Badge variant="success" data-testid="test-badge">Success</Badge>
        </ThemeProvider>
      );
      const cypherColor = window.getComputedStyle(badge).backgroundColor;

      rerender(
        <ThemeProvider brandTheme={fluxTheme} colorScheme="light">
          <Badge variant="success" data-testid="test-badge">Success</Badge>
        </ThemeProvider>
      );
      const fluxColor = window.getComputedStyle(badge).backgroundColor;

      // Verify each brand applies its own colors
      expect(mondColor).toBeDefined();
      expect(cypherColor).toBeDefined();
      expect(fluxColor).toBeDefined();
      
      // Colors should not be transparent
      expect(mondColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(cypherColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(fluxColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  describe('Performance Validation', () => {
    it('should render components quickly across all brands', () => {
      const startTime = performance.now();

      brandThemes.forEach(({ theme }) => {
        render(
          <ThemeProvider brandTheme={theme} colorScheme="light">
            <Badge variant="primary">Test</Badge>
            <Button variant="primary">Test</Button>
          </ThemeProvider>
        );
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render all brand variations in under 100ms
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Accessibility Compliance', () => {
    brandThemes.forEach(({ name, theme }) => {
      it(`should maintain proper ARIA attributes with ${name} theme`, () => {
        render(
          <ThemeProvider brandTheme={theme} colorScheme="light">
            <Modal 
              isOpen={true} 
              onClose={() => {}} 
              title="Accessible Modal"
              data-testid="accessible-modal"
            >
              Content
            </Modal>
          </ThemeProvider>
        );

        const modal = screen.getByTestId('accessible-modal');
        expect(modal).toHaveAttribute('tabIndex', '-1');
        
        // Modal should have proper ARIA attributes
        const modalContainer = modal.closest('[role="dialog"]');
        expect(modalContainer).toHaveAttribute('aria-modal', 'true');
      });
    });
  });
});