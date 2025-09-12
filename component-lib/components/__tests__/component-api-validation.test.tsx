/**
 * Component API Validation Tests - Phase 3.1
 * 
 * Validates that all components follow the brand-agnostic architecture:
 * - No arbitrary style props accepted
 * - Only semantic variants allowed
 * - TypeScript prevents style prop abuse
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { mondTheme } from '../../brands/mond';

// Import key components for API validation
import { Badge } from '../atoms/Badge/Badge';
import { Button } from '../atoms/Button/Button';
import { Input } from '../atoms/Input/Input';
import { Text } from '../atoms/Text/Text';
import { Heading } from '../atoms/Heading/Heading';
import { Switch } from '../atoms/Switch/Switch';
import { Modal } from '../organisms/Modal/Modal';
import { Card } from '../layout/Card/Card';

// Helper to render with theme context
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider brandTheme={mondTheme} colorScheme="light">
      {component}
    </ThemeProvider>
  );
};

describe('Component API Validation - Phase 3.1', () => {
  describe('Badge Component API', () => {
    it('should only accept semantic variant props, not arbitrary styles', () => {
      // ✅ Valid semantic props should work
      expect(() => {
        renderWithTheme(<Badge variant="success">Success</Badge>);
      }).not.toThrow();

      expect(() => {
        renderWithTheme(<Badge variant="primary" size="md">Primary</Badge>);
      }).not.toThrow();

      // TypeScript should prevent style props (tested at compile time)
      // At runtime, we test that the component renders with proper semantic styling
      const { getByText } = renderWithTheme(
        <Badge variant="success" data-testid="semantic-badge">
          Success Badge
        </Badge>
      );

      const badge = getByText('Success Badge');
      const computedStyle = window.getComputedStyle(badge);
      
      // Should have brand-appropriate styling applied
      expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(computedStyle.backgroundColor).not.toBe('transparent');
      expect(computedStyle.borderRadius).not.toBe('0px');
    });

    it('should use brand-appropriate colors for success variant', () => {
      const { getByText } = renderWithTheme(
        <Badge variant="success">Success</Badge>
      );

      const badge = getByText('Success');
      const style = window.getComputedStyle(badge);
      
      // Should use MOND brand colors (blue primary)
      expect(style.backgroundColor).toContain('2, 132, 199'); // Actual MOND blue from theme
    });
  });

  describe('Button Component API', () => {
    it('should only accept semantic variant props', () => {
      const validVariants: Array<'primary' | 'secondary' | 'ghost'> = [
        'primary', 'secondary', 'ghost'
      ];

      validVariants.forEach(variant => {
        expect(() => {
          renderWithTheme(<Button variant={variant}>Test</Button>);
        }).not.toThrow();
      });
    });

    it('should apply appropriate styling through semantic tokens', () => {
      const { getByRole } = renderWithTheme(
        <Button variant="primary">Primary Button</Button>
      );

      const button = getByRole('button');
      const style = window.getComputedStyle(button);
      
      // Should have proper interactive styling
      expect(style.cursor).toBe('pointer');
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(style.transition).toContain('all');
    });
  });

  describe('Input Component API', () => {
    it('should render with semantic styling without style props', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <Input placeholder="Test input" />
      );

      const input = getByPlaceholderText('Test input');
      const style = window.getComputedStyle(input);
      
      // Should have proper form styling
      expect(style.borderWidth).not.toBe('0px');
      expect(style.borderRadius).not.toBe('0px');
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  describe('Typography Components API', () => {
    it('should render Text with semantic variants only', () => {
      const semanticVariants = ['primary', 'secondary', 'tertiary'] as const;
      
      semanticVariants.forEach(semantic => {
        expect(() => {
          renderWithTheme(
            <Text semantic={semantic}>Test text</Text>
          );
        }).not.toThrow();
      });
    });

    it('should render Heading with semantic levels only', () => {
      const headingLevels = [1, 2, 3, 4, 5, 6] as const;
      
      headingLevels.forEach(level => {
        expect(() => {
          renderWithTheme(
            <Heading level={level}>Test heading</Heading>
          );
        }).not.toThrow();
      });
    });

    it('should apply appropriate typography styles', () => {
      const { getByText } = renderWithTheme(
        <Heading level={1}>Main Heading</Heading>
      );

      const heading = getByText('Main Heading');
      const style = window.getComputedStyle(heading);
      
      // Should have heading-appropriate styling
      expect(style.fontWeight).not.toBe('400'); // Should be bold
      expect(style.fontFamily).toContain('DM Sans'); // Should use design system font
    });
  });

  describe('Layout Components API', () => {
    it('should render Card with semantic props only', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <Text>Card content</Text>
        </Card>
      );

      const cardText = getByText('Card content');
      const card = cardText.closest('div');
      
      if (card) {
        const style = window.getComputedStyle(card);
        // Card should have appropriate container styling
        expect(style.borderRadius).not.toBe('0px');
      }
    });
  });

  describe('Interactive Components API', () => {
    it('should render Switch with controlled state only', () => {
      const mockOnChange = jest.fn();
      
      expect(() => {
        renderWithTheme(
          <Switch checked={false} onChange={mockOnChange} />
        );
      }).not.toThrow();

      expect(() => {
        renderWithTheme(
          <Switch checked={true} onChange={mockOnChange} />
        );
      }).not.toThrow();
    });
  });

  describe('Complex Components API', () => {
    it('should render Modal with semantic size variants only', () => {
      const mockOnClose = jest.fn();
      const validSizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = [
        'sm', 'md', 'lg', 'xl', 'full'
      ];

      validSizes.forEach(size => {
        expect(() => {
          renderWithTheme(
            <Modal 
              isOpen={true} 
              onClose={mockOnClose} 
              size={size}
              title="Test Modal"
            >
              Content
            </Modal>
          );
        }).not.toThrow();
      });
    });
  });

  describe('Brand-Agnostic Behavior Validation', () => {
    it('should render consistently without explicit brand styling', () => {
      // Components should automatically get brand styling without manual intervention
      const { getByText, getByRole } = renderWithTheme(
        <div>
          <Badge variant="success">Auto-styled Badge</Badge>
          <Button variant="primary">Auto-styled Button</Button>
          <Text semantic="primary">Auto-styled Text</Text>
        </div>
      );

      // All components should render with appropriate styling
      const badge = getByText('Auto-styled Badge');
      const button = getByRole('button');
      const text = getByText('Auto-styled Text');

      // Badge should have brand colors
      expect(window.getComputedStyle(badge).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      
      // Button should have interactive styling
      expect(window.getComputedStyle(button).cursor).toBe('pointer');
      
      // Text should have proper typography
      expect(window.getComputedStyle(text).color).not.toBe('rgba(0, 0, 0, 0)');
    });

    it('should prevent common style prop abuse patterns', () => {
      // These would be caught at compile time by TypeScript
      // At runtime, we test that components work correctly with semantic props only
      
      const { getByText } = renderWithTheme(
        <Badge variant="primary" size="md">
          Properly Configured Badge
        </Badge>
      );

      const badge = getByText('Properly Configured Badge');
      
      // Should have proper semantic styling applied
      const style = window.getComputedStyle(badge);
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(style.color).not.toBe('rgba(0, 0, 0, 0)');
      expect(style.borderRadius).toBe('9999px'); // Should use full radius from tokens
      expect(style.fontFamily).toContain('DM Sans'); // Should use design system font
    });
  });

  describe('Component Consistency Across Render Cycles', () => {
    it('should maintain consistent styling across re-renders', () => {
      const TestComponent = ({ variant }: { variant: 'primary' | 'secondary' }) => (
        <Button variant={variant}>Test Button</Button>
      );

      const { rerender, getByRole } = renderWithTheme(
        <TestComponent variant="primary" />
      );

      const button = getByRole('button');
      const initialStyle = window.getComputedStyle(button);
      const initialBackgroundColor = initialStyle.backgroundColor;

      // Re-render with same props
      rerender(
        <ThemeProvider brandTheme={mondTheme} colorScheme="light">
          <TestComponent variant="primary" />
        </ThemeProvider>
      );

      // Style should remain consistent
      const newStyle = window.getComputedStyle(button);
      expect(newStyle.backgroundColor).toBe(initialBackgroundColor);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing required props gracefully', () => {
      // Components with required props should be defined properly
      const mockOnClose = jest.fn();
      
      // Modal with minimal required props
      expect(() => {
        renderWithTheme(
          <Modal isOpen={true} onClose={mockOnClose}>
            Minimal Modal
          </Modal>
        );
      }).not.toThrow();

      // Switch with required controlled props
      expect(() => {
        renderWithTheme(
          <Switch checked={false} onChange={() => {}} />
        );
      }).not.toThrow();
    });

    it('should render empty states appropriately', () => {
      // Components should handle empty/minimal content
      expect(() => {
        renderWithTheme(<Badge variant="default"></Badge>);
      }).not.toThrow();

      expect(() => {
        renderWithTheme(<Button variant="primary"></Button>);
      }).not.toThrow();
    });
  });
});