import React from 'react';
import { render, screen } from '@testing-library/react';
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
  it('renders correctly with default size', () => {
    render(
      <Icon>
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('mond-icon', 'mond-icon--md');
  });

  it('applies all size variants using rerender', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    const { rerender } = render(
      <Icon size="xs">
        <TestSvg />
      </Icon>
    );

    sizes.forEach((size) => {
      rerender(
        <Icon size={size}>
          <TestSvg />
        </Icon>
      );
      const icon = screen.getByRole('img');
      expect(icon).toHaveClass(`mond-icon--${size}`);
    });
  });

  it('renders with accessibility label or as decorative', () => {
    const { rerender } = render(
      <Icon label="Test icon">
        <TestSvg />
      </Icon>
    );

    let icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Test icon');
    expect(icon).not.toHaveAttribute('aria-hidden');

    rerender(
      <Icon decorative data-testid="decorative-icon">
        <TestSvg />
      </Icon>
    );

    icon = screen.getByTestId('decorative-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('role', 'presentation');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  it('renders with custom color and custom className', () => {
    render(
      <Icon color="red" className="custom-class" data-testid="colored-icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('colored-icon');
    expect(icon).toHaveStyle({ color: 'red' });
    expect(icon).toHaveClass('custom-class', 'mond-icon');
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

  describe('Badge', () => {
    it('renders badge with number', () => {
      render(
        <Icon badge={5} data-testid="icon-with-badge">
          <TestSvg />
        </Icon>
      );

      const icon = screen.getByTestId('icon-with-badge');
      const badge = screen.getByText('5');

      expect(icon).toHaveClass('mond-icon--with-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('mond-icon__badge');
    });

    it('renders badge with text', () => {
      render(
        <Icon badge="NEW" data-testid="icon-with-badge">
          <TestSvg />
        </Icon>
      );

      const badge = screen.getByText('NEW');
      expect(badge).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      const { container } = render(
        <Icon data-testid="icon-without-badge">
          <TestSvg />
        </Icon>
      );

      const icon = screen.getByTestId('icon-without-badge');
      const badge = container.querySelector('.mond-icon__badge');

      expect(icon).not.toHaveClass('mond-icon--with-badge');
      expect(badge).not.toBeInTheDocument();
    });

    it('shows "99+" for numbers exceeding default badgeMax', () => {
      render(
        <Icon badge={150}>
          <TestSvg />
        </Icon>
      );

      const badge = screen.getByText('99+');
      expect(badge).toBeInTheDocument();
    });

    it('respects custom badgeMax prop', () => {
      render(
        <Icon badge={25} badgeMax={20}>
          <TestSvg />
        </Icon>
      );

      const badge = screen.getByText('20+');
      expect(badge).toBeInTheDocument();
    });

    it('shows exact number when below badgeMax', () => {
      render(
        <Icon badge={50} badgeMax={99}>
          <TestSvg />
        </Icon>
      );

      const badge = screen.getByText('50');
      expect(badge).toBeInTheDocument();
    });

    it('has accessible label for badge', () => {
      render(
        <Icon badge={5}>
          <TestSvg />
        </Icon>
      );

      const badge = screen.getByLabelText('5 notifications');
      expect(badge).toBeInTheDocument();
    });
  });
});
