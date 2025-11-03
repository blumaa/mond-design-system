/**
 * Divider Component Tests - Styled-Components Version
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Divider } from './Divider';

const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Divider Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders with ThemeProvider context', () => {
      const { container } = renderWithTheme(<Divider />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as hr element by default', () => {
      const { container } = renderWithTheme(<Divider />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Divider.displayName).toBe('Divider');
    });
  });

  describe('Orientation', () => {
    it('applies horizontal data attribute by default', () => {
      const { container } = renderWithTheme(<Divider />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('applies vertical data attribute when specified', () => {
      const { container } = renderWithTheme(<Divider orientation="vertical" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('Variant Styles', () => {
    it('applies default variant data attribute', () => {
      const { container } = renderWithTheme(<Divider variant="default" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-variant', 'default');
    });

    it('applies subtle variant data attribute', () => {
      const { container } = renderWithTheme(<Divider variant="subtle" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-variant', 'subtle');
    });

    it('applies strong variant data attribute', () => {
      const { container } = renderWithTheme(<Divider variant="strong" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-variant', 'strong');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size data attribute', () => {
      const { container } = renderWithTheme(<Divider size="sm" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-size', 'sm');
    });

    it('applies md size data attribute', () => {
      const { container } = renderWithTheme(<Divider size="md" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-size', 'md');
    });

    it('applies lg size data attribute', () => {
      const { container } = renderWithTheme(<Divider size="lg" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = renderWithTheme(<Divider className="custom-class" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('custom-class');
      expect(divider).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to hr element', () => {
      const ref = React.createRef<HTMLHRElement>();
      renderWithTheme(<Divider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLHRElement);
    });
  });
});
