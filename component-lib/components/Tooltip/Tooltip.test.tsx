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
      expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');

      // Hover over button
      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
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
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
      });

      // Hide tooltip
      fireEvent.mouseLeave(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');
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
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
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
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
      });

      // Hide tooltip
      fireEvent.blur(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');
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
      expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');

      // Show tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
      });

      // Hide tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');
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
        expect(tooltipContent).toHaveClass('mond-tooltip--visible');
      });

      // Click outside
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');
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
      expect(tooltipContent).toHaveClass('mond-tooltip--top');
    });

    it('applies bottom placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="bottom" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );


      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip--bottom');
    });

    it('applies left placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="left" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip--left');
    });

    it('applies right placement styles', () => {
      render(
        <Tooltip content="Tooltip content" placement="right" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('mond-tooltip--right');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling (SSR-compatible)', () => {
      renderWithDarkMode(
        <Tooltip content="Dark tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // CSS variables handle theming automatically
      expect(tooltipContent).toHaveClass('mond-tooltip');
    });

    it('applies light mode styling by default (SSR-compatible)', () => {
      render(
        <Tooltip content="Light tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // CSS variables handle theming automatically
      expect(tooltipContent).toHaveClass('mond-tooltip');
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
      expect(tooltipContent).not.toHaveClass('mond-tooltip--visible');
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
      // CSS classes handle all styling
      expect(tooltipContent).toHaveClass('mond-tooltip');
    });

    it('applies font family via CSS', () => {
      render(
        <Tooltip content="Font test" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // CSS variables handle font-family
      expect(tooltipContent).toHaveClass('mond-tooltip');
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
});
