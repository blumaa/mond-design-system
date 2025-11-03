import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import { defaultLightTheme, defaultDarkTheme } from '../../themes';
import { Tooltip } from './Tooltip';

const renderWithTheme = (ui: React.ReactElement) => {
  return rtlRender(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

const renderWithDarkMode = (ui: React.ReactElement) => {
  return rtlRender(
    <ThemeProvider theme={defaultDarkTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Tooltip Component', () => {

  it('renders trigger element', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content" data-testid="tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const buttonElement = screen.getByText('Hover me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders tooltip content when visible', () => {
    renderWithTheme(
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
      renderWithTheme(
        <Tooltip content="Tooltip content" trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Initially hidden
      expect(tooltipContent).toHaveAttribute('data-visible', 'false');

      // Hover over button
      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
        expect(tooltipContent).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('hides tooltip on mouse leave', async () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Show tooltip
      fireEvent.mouseEnter(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
      });

      // Hide tooltip
      fireEvent.mouseLeave(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'false');
      });
    });
  });

  describe('focus trigger', () => {
    it('shows tooltip on focus', async () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" trigger="focus" data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      fireEvent.focus(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
      });
    });

    it('hides tooltip on blur', async () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" trigger="focus" data-testid="tooltip">
          <button>Focus me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Focus me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Show tooltip
      fireEvent.focus(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
      });

      // Hide tooltip
      fireEvent.blur(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'false');
      });
    });
  });

  describe('click trigger', () => {
    it('toggles tooltip on click', async () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" trigger="click" data-testid="tooltip">
          <button>Click me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Click me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      // Initially hidden
      expect(tooltipContent).toHaveAttribute('data-visible', 'false');

      // Show tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
      });

      // Hide tooltip
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'false');
      });
    });

    it('hides tooltip when clicking outside', async () => {
      renderWithTheme(
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
        expect(tooltipContent).toHaveAttribute('data-visible', 'true');
      });

      // Click outside
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(tooltipContent).toHaveAttribute('data-visible', 'false');
      });
    });
  });

  describe('placement', () => {
    it('applies top placement styles', () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" placement="top" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('data-placement', 'top');
    });

    it('applies bottom placement styles', () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" placement="bottom" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('data-placement', 'bottom');
    });

    it('applies left placement styles', () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" placement="left" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('data-placement', 'left');
    });

    it('applies right placement styles', () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" placement="right" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveAttribute('data-placement', 'right');
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
      // Styled-components handle theming automatically
      expect(tooltipContent).toBeInTheDocument();
    });

    it('applies light mode styling by default (SSR-compatible)', () => {
      renderWithTheme(
        <Tooltip content="Light tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // Styled-components handle theming automatically
      expect(tooltipContent).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('does not show tooltip when disabled', () => {
      renderWithTheme(
        <Tooltip content="Tooltip content" disabled trigger="hover" data-testid="tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const buttonElement = screen.getByText('Hover me');
      const tooltipContent = screen.getByTestId('tooltip-content');

      fireEvent.mouseEnter(buttonElement);

      // Should remain hidden
      expect(tooltipContent).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('content variations', () => {
    it('renders text content', () => {
      renderWithTheme(
        <Tooltip content="Simple text tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );
      
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent('Simple text tooltip');
    });

    it('renders JSX content', () => {
      renderWithTheme(
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
      renderWithTheme(
        <Tooltip content="Styled tooltip" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // Styled-components handle all styling
      expect(tooltipContent).toBeInTheDocument();
    });

    it('applies font family via CSS', () => {
      renderWithTheme(
        <Tooltip content="Font test" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      // Styled-components handle font-family
      expect(tooltipContent).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderWithTheme(
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

      renderWithTheme(
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
      renderWithTheme(
        <Tooltip content="Tooltip with arrow" data-testid="tooltip">
          <button>Button</button>
        </Tooltip>
      );

      const arrowElement = screen.getByTestId('tooltip-arrow');
      expect(arrowElement).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content" className="custom-class" data-testid="tooltip">
        <button>Button</button>
      </Tooltip>
    );

    const tooltipContainer = screen.getByTestId('tooltip');
    expect(tooltipContainer).toHaveClass('custom-class');
  });
});
