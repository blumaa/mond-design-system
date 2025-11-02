import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Icon, IconSize } from './Icon';
import { colors } from '../../tokens';

// Mock SVG component (simulating Heroicons)
const TestSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

describe('Icon', () => {
  it('renders correctly with default props', () => {
    render(
      <Icon>
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('mond-icon');
    expect(icon).toHaveClass('mond-icon--md');
  });

  it('renders with custom size', () => {
    render(
      <Icon size="lg">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('mond-icon');
    expect(icon).toHaveClass('mond-icon--lg');
  });

  it('applies correct sizes for all size variants', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Icon size={size}>
          <TestSVG />
        </Icon>
      );

      const icon = screen.getByRole('img');
      expect(icon).toHaveClass('mond-icon');
      expect(icon).toHaveClass(`mond-icon--${size}`);

      unmount();
    });
  });

  it('renders with accessibility label', () => {
    render(
      <Icon label="Test icon">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Test icon');
    // Icon with a label is not decorative, so aria-hidden should be false or not present
    const ariaHidden = icon.getAttribute('aria-hidden');
    expect(ariaHidden === null || ariaHidden === 'false').toBe(true);
  });

  it('renders as decorative when specified', () => {
    render(
      <Icon decorative data-testid="decorative-icon">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByTestId('decorative-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('role', 'presentation');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  it('renders with custom color from design tokens', () => {
    render(
      <Icon color={colors.red["500"]}>
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByRole('img');
    // Color is applied via inline style
    expect(icon).toHaveStyle({ color: colors.red["500"] });
  });

  it('passes through additional props', () => {
    render(
      <Icon className="custom-class" data-testid="custom-icon">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();

    render(
      <Icon ref={ref}>
        <TestSVG />
      </Icon>
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders as a span element', () => {
    render(
      <Icon data-testid="icon">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByTestId('icon');
    expect(icon.tagName).toBe('SPAN');
    expect(icon).toHaveClass('mond-icon');
  });

  it('wraps SVG children correctly', () => {
    render(
      <Icon data-testid="icon">
        <TestSVG />
      </Icon>
    );

    const icon = screen.getByTestId('icon');
    const svg = icon.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});