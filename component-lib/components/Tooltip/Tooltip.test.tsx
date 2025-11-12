import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  it('renders trigger element and content', () => {
    render(
      <Tooltip content="Tooltip content" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const buttonElement = screen.getByText('Hover me');
    const tooltipContent = screen.getByTestId('tooltip-content');

    expect(buttonElement).toBeInTheDocument();
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveAttribute('aria-hidden', 'true');
  });

  describe('Hover trigger', () => {
    it('shows and hides tooltip on mouse enter/leave', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');

      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
        expect(tooltipContent).toHaveAttribute('aria-hidden', 'false');
      });

      fireEvent.mouseLeave(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('Focus trigger', () => {
    it('shows and hides tooltip on focus/blur', async () => {
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

      fireEvent.blur(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('Click trigger', () => {
    it('toggles tooltip on click and closes when clicking outside', async () => {
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

      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');

      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });

      fireEvent.click(buttonElement);
      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--visible');
      });

      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
      });
    });
  });

  describe('Placements', () => {
    it('applies placement classes correctly', () => {
      const { rerender } = render(
        <Tooltip content="Tooltip content" placement="top" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      let tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--top');

      rerender(
        <Tooltip content="Tooltip content" placement="bottom" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip-content--bottom');
    });
  });

  describe('Disabled state', () => {
    it('does not show tooltip when disabled', () => {
      render(
        <Tooltip content="Tooltip content" disabled trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      fireEvent.mouseEnter(buttonElement);

      expect(tooltipContent).toHaveClass('mond-tooltip-content--hidden');
    });
  });

  describe('Content variations', () => {
    it('renders text and JSX content', () => {
      const { rerender } = render(
        <Tooltip content="Simple text tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      let tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent('Simple text tooltip');

      rerender(
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

      tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toContainHTML('<strong>Bold text</strong>');
      expect(tooltipContent).toContainHTML('<span>Regular text</span>');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes and preserves child handlers', () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();

      render(
        <Tooltip content="Accessible tooltip" data-testid="tooltip">
          <button onClick={handleClick} onMouseEnter={handleMouseEnter}>
            Button
          </button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('role', 'tooltip');
      expect(tooltipContent).toHaveAttribute('aria-hidden', 'true');

      const buttonElement = screen.getByText('Button');

      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalled();

      fireEvent.mouseEnter(buttonElement);
      expect(handleMouseEnter).toHaveBeenCalled();
    });
  });

  it('renders arrow element with placement class and applies custom className', () => {
    render(
      <Tooltip content="Tooltip with arrow" placement="top" className="custom-class" data-testid="tooltip">
        <button>Button</button>
      </Tooltip>
    );

    const arrowElement = screen.getByTestId('tooltip-arrow');
    expect(arrowElement).toBeInTheDocument();
    expect(arrowElement).toHaveClass('mond-tooltip-arrow--top');

    const tooltipContainer = screen.getByTestId('tooltip');
    expect(tooltipContainer).toHaveClass('custom-class');
  });
});
