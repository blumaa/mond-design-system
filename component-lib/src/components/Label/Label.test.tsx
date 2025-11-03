/**
 * Label Component Tests - Styled-Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Label } from './Label';

const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Label Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      renderWithTheme(<Label>Label Text</Label>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('uses styled-components with theme', () => {
      const { container } = renderWithTheme(<Label>Test</Label>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as a label element', () => {
      renderWithTheme(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label.tagName).toBe('LABEL');
    });

    it('renders children content', () => {
      renderWithTheme(<Label>Form Label</Label>);
      expect(screen.getByText('Form Label')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Label.displayName).toBe('Label');
    });
  });

  describe('htmlFor Attribute', () => {
    it('applies htmlFor attribute when provided', () => {
      renderWithTheme(<Label htmlFor="input-id">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('for', 'input-id');
    });

    it('does not have htmlFor attribute when not provided', () => {
      renderWithTheme(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).not.toHaveAttribute('for');
    });
  });

  describe('Size Variants with CSS Classes', () => {
    it('applies sm size data attribute', () => {
      renderWithTheme(<Label size="sm">Small</Label>);
      const label = screen.getByText('Small');
      expect(label).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute (default)', () => {
      renderWithTheme(<Label size="md">Medium</Label>);
      const label = screen.getByText('Medium');
      expect(label).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      renderWithTheme(<Label size="lg">Large</Label>);
      const label = screen.getByText('Large');
      expect(label).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Semantic Colors', () => {
    it('applies default semantic data attribute', () => {
      renderWithTheme(<Label semantic="default">Default</Label>);
      const label = screen.getByText('Default');
      expect(label).toHaveAttribute('data-semantic', 'default');
    });

    it('applies error semantic data attribute', () => {
      renderWithTheme(<Label semantic="error">Error</Label>);
      const label = screen.getByText('Error');
      expect(label).toHaveAttribute('data-semantic', 'error');
    });

    it('applies success semantic data attribute', () => {
      renderWithTheme(<Label semantic="success">Success</Label>);
      const label = screen.getByText('Success');
      expect(label).toHaveAttribute('data-semantic', 'success');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled data attribute when disabled', () => {
      renderWithTheme(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveAttribute('data-disabled');
    });

    it('applies disabled cursor style when disabled', () => {
      renderWithTheme(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveStyle('cursor: not-allowed');
    });

    it('does not apply disabled data attribute when not disabled', () => {
      renderWithTheme(<Label>Normal</Label>);
      const label = screen.getByText('Normal');
      expect(label).not.toHaveAttribute('data-disabled');
    });
  });

  describe('Required Indicator', () => {
    it('does not show required indicator by default', () => {
      renderWithTheme(<Label>Label</Label>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('shows required indicator when required is true', () => {
      renderWithTheme(<Label required>Required Label</Label>);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });

    it('uses custom required indicator', () => {
      renderWithTheme(<Label required requiredIndicator="(required)">Custom</Label>);
      expect(screen.getByText('(required)')).toBeInTheDocument();
    });

    it('renders required indicator', () => {
      renderWithTheme(<Label required>Required</Label>);
      const indicator = screen.getByText('*');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Font Weight', () => {
    it('applies medium weight by default', () => {
      renderWithTheme(<Label>Medium</Label>);
      const label = screen.getByText('Medium');
      expect(label).toHaveStyle('font-weight: 500');
    });

    it('applies normal weight', () => {
      renderWithTheme(<Label weight="normal">Normal</Label>);
      const label = screen.getByText('Normal');
      expect(label).toHaveStyle('font-weight: 400');
    });

    it('applies semibold weight', () => {
      renderWithTheme(<Label weight="semibold">Semibold</Label>);
      const label = screen.getByText('Semibold');
      expect(label).toHaveStyle('font-weight: 600');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      renderWithTheme(<Label className="custom-class">Custom</Label>);
      const label = screen.getByText('Custom');
      expect(label).toHaveAttribute('data-size', 'md'); // default size
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to label element', () => {
      const ref = React.createRef<HTMLLabelElement>();
      renderWithTheme(<Label ref={ref}>Ref Test</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current?.textContent).toContain('Ref Test');
    });
  });

  describe('Combined Props', () => {
    it('applies multiple props correctly', () => {
      renderWithTheme(
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
      expect(label).toHaveAttribute('data-size', 'lg');
      expect(label).toHaveAttribute('data-semantic', 'error');
      expect(label).toHaveAttribute('data-disabled');
      expect(label).toHaveAttribute('for', 'test-input');
      expect(label).toHaveStyle('font-weight: 600');
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('forwards standard HTML attributes', () => {
      renderWithTheme(<Label title="Label Title">Test</Label>);
      const label = screen.getByText('Test');
      expect(label).toHaveAttribute('title', 'Label Title');
    });

    it('forwards aria attributes', () => {
      renderWithTheme(<Label aria-describedby="helper-text">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('forwards data attributes', () => {
      renderWithTheme(<Label data-testid="test-label">Test</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });

  describe('Cursor Styles', () => {
    it('applies pointer cursor by default', () => {
      renderWithTheme(<Label>Clickable</Label>);
      const label = screen.getByText('Clickable');
      expect(label).toHaveStyle('cursor: pointer');
    });

    it('applies not-allowed cursor when disabled', () => {
      renderWithTheme(<Label disabled>Disabled</Label>);
      const label = screen.getByText('Disabled');
      expect(label).toHaveStyle('cursor: not-allowed');
    });
  });
});
