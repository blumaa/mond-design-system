import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Icon, IconSize } from './Icon';

const TestSvg = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="currentColor"
    />
  </svg>
);

describe('Icon', () => {
  it('renders correctly with default props', () => {
    render(
      <Icon>
        <TestSvg />
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
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('mond-icon--lg');
  });

  it('applies correct sizes for all size variants', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Icon size={size}>
          <TestSvg />
        </Icon>
      );

      const icon = screen.getByRole('img');
      expect(icon).toHaveClass(`mond-icon--${size}`);

      unmount();
    });
  });

  it('renders with accessibility label', () => {
    render(
      <Icon label="Test icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Test icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('renders as decorative when specified', () => {
    render(
      <Icon decorative data-testid="decorative-icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('decorative-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('role', 'presentation');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  it('renders with custom color via inline style', () => {
    render(
      <Icon color="red" data-testid="colored-icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('colored-icon');
    expect(icon).toHaveStyle({ color: 'red' });
  });

  it('passes through additional props', () => {
    render(
      <Icon className="custom-class" data-testid="custom-icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveClass('custom-class');
    expect(icon).toHaveClass('mond-icon');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();

    render(
      <Icon ref={ref}>
        <TestSvg />
      </Icon>
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has proper CSS classes applied', () => {
    render(
      <Icon data-testid="icon" size="md">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('mond-icon');
    expect(icon).toHaveClass('mond-icon--md');
  });

  it('renders children SVG correctly', () => {
    render(
      <Icon data-testid="icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('icon');
    const svg = icon.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
