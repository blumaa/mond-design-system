import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent, waitFor, act } from '../../test-utils';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

// Mock timers for delay testing
jest.useFakeTimers();

describe('Tooltip Component', () => {
  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
  });

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
    it('shows tooltip on mouse enter with delay', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="hover" delay={100} data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      // Initially hidden
      expect(tooltipContent).toHaveStyle('opacity: 0');
      
      // Hover over button
      fireEvent.mouseEnter(buttonElement);
      
      // Still hidden before delay
      expect(tooltipContent).toHaveStyle('opacity: 0');
      
      // Advance timers and check visibility
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
        expect(tooltipContent).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('hides tooltip on mouse leave', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="hover" delay={100} data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      // Show tooltip
      fireEvent.mouseEnter(buttonElement);
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
      
      // Hide tooltip
      fireEvent.mouseLeave(buttonElement);
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 0');
      });
    });
  });

  describe('focus trigger', () => {
    it('shows tooltip on focus', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="focus" delay={100} data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      fireEvent.focus(buttonElement);
      
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
    });

    it('hides tooltip on blur', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="focus" delay={100} data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      // Show tooltip
      fireEvent.focus(buttonElement);
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
      
      // Hide tooltip
      fireEvent.blur(buttonElement);
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 0');
      });
    });
  });

  describe('click trigger', () => {
    it('toggles tooltip on click', async () => {
      render(
        <Tooltip content="Tooltip content" trigger="click" delay={100} data-testid="tooltip">
          <button>Click me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Click me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      // Initially hidden
      expect(tooltipContent).toHaveStyle('opacity: 0');
      
      // Show tooltip
      fireEvent.click(buttonElement);
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
      
      // Hide tooltip
      fireEvent.click(buttonElement);
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 0');
      });
    });

    it('hides tooltip when clicking outside', async () => {
      render(
        <div>
          <Tooltip content="Tooltip content" trigger="click" delay={100} data-testid="tooltip">
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
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
      
      // Click outside
      fireEvent.mouseDown(outsideElement);
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 0');
      });
    });
  });

  describe('placement', () => {
    it('applies top placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="top" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('bottom: 100%');
      expect(tooltipContent).toHaveStyle('left: 50%');
      expect(tooltipContent).toHaveStyle('transform: translateX(-50%)');
    });

    it('applies bottom placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="bottom" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('top: 100%');
      expect(tooltipContent).toHaveStyle('left: 50%');
      expect(tooltipContent).toHaveStyle('transform: translateX(-50%)');
    });

    it('applies left placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="left" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('right: 100%');
      expect(tooltipContent).toHaveStyle('top: 50%');
      expect(tooltipContent).toHaveStyle('transform: translateY(-50%)');
    });

    it('applies right placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="right" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('left: 100%');
      expect(tooltipContent).toHaveStyle('top: 50%');
      expect(tooltipContent).toHaveStyle('transform: translateY(-50%)');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      renderWithDarkMode(
        <Tooltip content="Dark tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('background-color: #171717');
      expect(tooltipContent).toHaveStyle('color: #f1f5f9');
    });

    it('applies light mode styling by default', () => {
      render(
        <Tooltip content="Light tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle('background-color: #ffffff');
      expect(tooltipContent).toHaveStyle('color: #0f172a');
    });
  });

  describe('disabled state', () => {
    it('does not show tooltip when disabled', async () => {
      render(
        <Tooltip content="Tooltip content" disabled trigger="hover" delay={100} data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      fireEvent.mouseEnter(buttonElement);
      
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      // Should remain hidden
      expect(tooltipContent).toHaveStyle('opacity: 0');
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

  describe('styling', () => {
    it('applies correct base styles', () => {
      render(
        <Tooltip content="Styled tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      expect(tooltipContent).toHaveStyle('position: absolute');
      expect(tooltipContent).toHaveStyle('z-index: 1000');
      expect(tooltipContent).toHaveStyle('border-radius: 0.25rem');
      expect(tooltipContent).toHaveStyle('font-size: 0.875rem');
      expect(tooltipContent).toHaveStyle('max-width: 200px');
      expect(tooltipContent).toHaveStyle('word-wrap: break-word');
      expect(tooltipContent).toHaveStyle('pointer-events: none');
    });

    it('applies font family', () => {
      render(
        <Tooltip content="Font test" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveStyle("font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif");
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

  describe('delay', () => {
    it('respects custom delay', async () => {
      render(
        <Tooltip content="Delayed tooltip" trigger="hover" delay={500} data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');
      
      fireEvent.mouseEnter(buttonElement);
      
      // Should not be visible after 400ms
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(tooltipContent).toHaveStyle('opacity: 0');
      
      // Should be visible after 500ms
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      await waitFor(() => {
        expect(tooltipContent).toHaveStyle('opacity: 1');
      });
    });
  });
});
