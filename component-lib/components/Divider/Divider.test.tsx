/**
 * Divider Component Tests - SSR-Compatible Version
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Divider } from './Divider';

describe('Divider Component - SSR Compatible', () => {
  describe('SSR Compatibility', () => {
    it('renders without ThemeProvider context', () => {
      const { container } = render(<Divider />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders as hr element by default', () => {
      const { container } = render(<Divider />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Divider.displayName).toBe('Divider');
    });
  });

  describe('Orientation', () => {
    it('applies horizontal class by default', () => {
      const { container } = render(<Divider />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--horizontal');
    });

    it('applies vertical class when specified', () => {
      const { container } = render(<Divider orientation="vertical" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--vertical');
    });
  });

  describe('Variant Styles', () => {
    it('applies default variant class', () => {
      const { container } = render(<Divider variant="default" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--default');
    });

    it('applies subtle variant class', () => {
      const { container } = render(<Divider variant="subtle" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--subtle');
    });

    it('applies strong variant class', () => {
      const { container } = render(<Divider variant="strong" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--strong');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      const { container } = render(<Divider size="sm" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--sm');
    });

    it('applies md size class', () => {
      const { container } = render(<Divider size="md" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--md');
    });

    it('applies lg size class', () => {
      const { container } = render(<Divider size="lg" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--lg');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className alongside base classes', () => {
      const { container } = render(<Divider className="custom-class" />);
      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('mond-divider--horizontal');
      expect(divider).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to hr element', () => {
      const ref = React.createRef<HTMLHRElement>();
      render(<Divider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLHRElement);
    });
  });
});
