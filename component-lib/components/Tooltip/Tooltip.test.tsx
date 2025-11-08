import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {

  it('renders trigger element', () => {
    render(
      <Tooltip content="Tooltip content" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const buttonElement = screen.getByText('Hover me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders tooltip content when visible', () => {
    render(
      <Tooltip content="Tooltip content" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltipContent = screen.getByTestId('tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveAttribute('aria-hidden', 'true');
  });

  describe('hover trigger', () => {
    it('shows tooltip on mouse enter', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Initially hidden
      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');

      // Hover over button
      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
        expect(tooltipContent).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('hides tooltip on mouse leave', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Show tooltip
      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      // Hide tooltip
      fireEvent.mouseLeave(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('focus trigger', () => {
    it('shows tooltip on focus', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="focus" data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      fireEvent.focus(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });
    });

    it('hides tooltip on blur', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="focus" data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Show tooltip
      fireEvent.focus(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      // Hide tooltip
      fireEvent.blur(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('click trigger', () => {
    it('toggles tooltip on click', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="click" data-testid="tooltip">
          <button>Click me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Click me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Initially hidden
      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');

      // Show tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      // Hide tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });

    it('hides tooltip when clicking outside', async () => {
      render(
        <div>
          <Tooltip content="Tooltip content" trigger="click" data-testid="tooltip">
            <button>Click me</button>
          </Tooltip>
          <div data-testid="outside">Outside</div>
        </div>
      );

      const buttonElement = screen.getByText('Click me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      const outsideElement = screen.getByTestId('outside');

      // Show tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      // Click outside
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('placement', () => {
    it('applies top placement class', () => {
      render(
        <Tooltip content="Tooltip content" placement="top" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--top');
    });

    it('applies bottom placement class', () => {
      render(
        <Tooltip content="Tooltip content" placement="bottom" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--bottom');
    });

    it('applies left placement class', () => {
      render(
        <Tooltip content="Tooltip content" placement="left" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--left');
    });

    it('applies right placement class', () => {
      render(
        <Tooltip content="Tooltip content" placement="right" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--right');
    });
  });

  describe('theme support', () => {
    it('applies correct base classes', () => {
      render(
        <Tooltip content="Tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content');
    });

    it('works in dark mode', () => {
      renderWithDarkMode(
        <Tooltip content="Dark tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content');
    });
  });

  describe('disabled state', () => {
    it('does not show tooltip when disabled', () => {
      render(
        <Tooltip content="Tooltip content" disabled trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      fireEvent.mouseEnter(buttonElement);

      // Should remain hidden
      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
    });
  });

  describe('content variations', () => {
    it('renders text content', () => {
      render(
        <Tooltip content="Simple text tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent('Simple text tooltip');
    });

    it('renders JSX content', () => {
      render(
        <Tooltip
          content={
            <div>
              <strong>Bold text</strong>
              <br />
              <span>Regular text</span>
            </div>
          }
          data-testid="tooltip"
        >
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toContainHTML('<strong>Bold text</strong>');
      expect(tooltipContent).toContainHTML('<span>Regular text</span>');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Tooltip content="Accessible tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('role', 'tooltip');
      expect(tooltipContent).toHaveAttribute('aria-hidden', 'true');
    });

    it('preserves child element event handlers', () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();

      render(
        <Tooltip content="Tooltip content" data-testid="tooltip">
          <button onClick={handleClick} onMouseEnter={handleMouseEnter}>
            Button
          </button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Button');

      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalled();

      fireEvent.mouseEnter(buttonElement);
      expect(handleMouseEnter).toHaveBeenCalled();
    });
  });

  describe('arrow', () => {
    it('renders arrow element', () => {
      render(
        <Tooltip content="Tooltip with arrow" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const arrowElement = screen.getByTestId('tooltip-arrow');
      expect(arrowElement).toBeInTheDocument();
    });

    it('applies correct arrow placement class', () => {
      render(
        <Tooltip content="Tooltip" placement="top" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const arrowElement = screen.getByTestId('tooltip-arrow');
      expect(arrowElement).toHaveClass('mond-tooltip-arrow--top');
    });
  });

  it('applies custom className', () => {
    render(
      <Tooltip content="Tooltip content" className="custom-class" data-testid="tooltip">
        <button>Button</button>
      </Tooltip>
    );

    const tooltipContainer = screen.getByTestId('tooltip');
    expect(tooltipContainer).toHaveClass('custom-class');
  });
});
