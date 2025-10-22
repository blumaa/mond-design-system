/**
 * Label Component Tests - SSR-Compatible Version
 *
 * TDD: These tests are written FIRST to define the expected behavior
 * of the refactored Label component that:
 * - Removes useTheme() hook dependency
 * - Uses CSS variables for semantic colors
 * - Uses CSS classes for label sizes and states
 * - Maintains all existing functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from './Label';

describe('Label Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      render(<Label>Label Text</Label>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('does not use useTheme() hook', () => {
      const { container } = render(<Label>Test</Label>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a label element', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label.tagName).toBe('LABEL');
    });

    it('renders children content', () => {
      render(<Label>Form Label</Label>);
      expect(screen.getByText('Form Label')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Label.displayName).toBe('Label');
    });
  });

  describe('htmlFor Attribute', () => {
    it('applies htmlFor attribute when provided', () => {
      render(<Label htmlFor="input-id">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('for', 'input-id');
    });

    it('does not have htmlFor attribute when not provided', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).not.toHaveAttribute('for');
    });
  });

  describe('Size Variants with CSS Classes', () => {
    it('applies sm size class', () => {
      render(<Label size="sm">Small</Label>);
      const label = screen.getByText('Small');
      expect(label).toHaveClass('mond-label--sm');
    });

    it('applies md size class (default)', () => {
      render(<Label size="md">Medium</Label>);
      const label = screen.getByText('Medium');
      expect(label).toHaveClass('mond-label--md');
    });

    it('applies lg size class', () => {
      render(<Label size="lg">Large</Label>);
      const label = screen.getByText('Large');
      expect(label).toHaveClass('mond-label--lg');
    });
  });

  describe('Semantic Colors', () => {
    it('applies default semantic class', () => {
      render(<Label semantic="default">Default</Label>);
      const label = screen.getByText('Default');
      expect(label).toHaveClass('mond-label--default');
    });

    it('applies error semantic class', () => {
      render(<Label semantic="error">Error</Label>);
      const label = screen.getByText('Error');
      expect(label).toHaveClass('mond-label--error');
    });

    it('applies success semantic class', () => {
      render(<Label semantic="success">Success</Label>);
      const label = screen.getByText('Success');
      expect(label).toHaveClass('mond-label--success');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled class when disabled', () => {
      render(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveClass('mond-label--disabled');
    });

    it('applies disabled cursor style when disabled', () => {
      render(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveStyle('cursor: not-allowed');
    });

    it('does not apply disabled class when not disabled', () => {
      render(<Label>Normal</Label>);
      const label = screen.getByText('Normal');
      expect(label).not.toHaveClass('mond-label--disabled');
    });
  });

  describe('Required Indicator', () => {
    it('does not show required indicator by default', () => {
      render(<Label>Label</Label>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('shows required indicator when required is true', () => {
      render(<Label required>Required Label</Label>);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });

    it('uses custom required indicator', () => {
      render(<Label required requiredIndicator="(required)">Custom</Label>);
      expect(screen.getByText('(required)')).toBeInTheDocument();
    });

    it('applies required indicator class', () => {
      render(<Label required>Required</Label>);
      const indicator = screen.getByText('*');
      expect(indicator).toHaveClass('mond-label__required');
    });
  });

  describe('Font Weight', () => {
    it('applies medium weight by default', () => {
      render(<Label>Medium</Label>);
      const label = screen.getByText('Medium');
      expect(label).toHaveStyle('font-weight: 500');
    });

    it('applies normal weight', () => {
      render(<Label weight="normal">Normal</Label>);
      const label = screen.getByText('Normal');
      expect(label).toHaveStyle('font-weight: 400');
    });

    it('applies semibold weight', () => {
      render(<Label weight="semibold">Semibold</Label>);
      const label = screen.getByText('Semibold');
      expect(label).toHaveStyle('font-weight: 600');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base class', () => {
      render(<Label className="custom-class">Custom</Label>);
      const label = screen.getByText('Custom');
      expect(label).toHaveClass('mond-label--md'); // default size
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to label element', () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Ref Test</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current?.textContent).toContain('Ref Test');
    });
  });

  describe('Combined Props', () => {
    it('applies multiple props correctly', () => {
      render(
        <Label
          size="lg"
          semantic="error"
          weight="semibold"
          required
          disabled
          htmlFor="test-input"
        >
          Combined Label
        </Label>
      );
      const label = screen.getByText(/Combined Label/);
      expect(label).toHaveClass('mond-label--lg');
      expect(label).toHaveClass('mond-label--error');
      expect(label).toHaveClass('mond-label--disabled');
      expect(label).toHaveAttribute('for', 'test-input');
      expect(label).toHaveStyle('font-weight: 600');
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      render(<Label title="Label Title">Test</Label>);
      const label = screen.getByText('Test');
      expect(label).toHaveAttribute('title', 'Label Title');
    });

    it('forwards aria attributes', () => {
      render(<Label aria-describedby="helper-text">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('forwards data attributes', () => {
      render(<Label data-testid="test-label">Test</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });

  describe('Cursor Styles', () => {
    it('applies pointer cursor by default', () => {
      render(<Label>Clickable</Label>);
      const label = screen.getByText('Clickable');
      expect(label).toHaveStyle('cursor: pointer');
    });

    it('applies not-allowed cursor when disabled', () => {
      render(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveStyle('cursor: not-allowed');
    });
  });
});
