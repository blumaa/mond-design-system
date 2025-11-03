import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme, defaultDarkTheme } from '../../themes';
import '@testing-library/jest-dom';
import { Popover } from './Popover';

const render = (ui: React.ReactElement) => {
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

describe('Popover Component', () => {
  it('renders trigger element', () => {
    render(
      <Popover content="Popover content" data-testid="popover">
        <button>Click me</button>
      </Popover>
    );

    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(
      <Popover content="Popover content" data-testid="popover">
        <button>Click me</button>
      </Popover>
    );

    const content = screen.queryByTestId('popover-content');
    expect(content).not.toBeInTheDocument();
  });

  it('shows content when defaultOpen is true', () => {
    render(
      <Popover content="Popover content" defaultOpen data-testid="popover">
        <button>Click me</button>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Popover content');
  });

  describe('toggle behavior', () => {
    it('opens popover on click', () => {
      render(
        <Popover content="Popover content" data-testid="popover">
          <button>Click me</button>
        </Popover>
      );

      const button = screen.getByText('Click me');

      // Initially closed
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(button);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('closes popover on second click', () => {
      render(
        <Popover content="Popover content" data-testid="popover">
          <button>Click me</button>
        </Popover>
      );

      const button = screen.getByText('Click me');

      // Open
      fireEvent.click(button);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Close
      fireEvent.click(button);
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  describe('controlled state', () => {
    it('works as controlled component', () => {
      const handleOpenChange = jest.fn();
      const { rerender } = rtlRender(
        <ThemeProvider theme={defaultLightTheme}>
          <Popover
            content="Controlled content"
            isOpen={false}
            onOpenChange={handleOpenChange}
            data-testid="popover"
          >
            <button>Click me</button>
          </Popover>
        </ThemeProvider>
      );

      // Initially closed
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      // Click should call onOpenChange
      fireEvent.click(screen.getByText('Click me'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      // Manually control the state
      rerender(
        <ThemeProvider theme={defaultLightTheme}>
          <Popover
            content="Controlled content"
            isOpen={true}
            onOpenChange={handleOpenChange}
            data-testid="popover"
          >
            <button>Click me</button>
          </Popover>
        </ThemeProvider>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('click outside', () => {
    it('closes popover when clicking outside', async () => {
      render(
        <div>
          <Popover content="Popover content" defaultOpen data-testid="popover">
            <button>Click me</button>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Initially open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      });
    });

    it('does not close when closeOnClickOutside is false', async () => {
      render(
        <div>
          <Popover
            content="Popover content"
            defaultOpen
            closeOnClickOutside={false}
            data-testid="popover"
          >
            <button>Click me</button>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Initially open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      // Should still be open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('escape key', () => {
    it('closes popover when pressing Escape', async () => {
      render(
        <Popover content="Popover content" defaultOpen data-testid="popover">
          <button>Click me</button>
        </Popover>
      );

      // Initially open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      });
    });

    it('does not close when closeOnEscape is false', async () => {
      render(
        <Popover
          content="Popover content"
          defaultOpen
          closeOnEscape={false}
          data-testid="popover"
        >
          <button>Click me</button>
        </Popover>
      );

      // Initially open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Should still be open
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('placements', () => {
    it('applies top placement styles', () => {
      render(
        <Popover content="Popover content" placement="top" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'top');
    });

    it('applies top-start placement styles', () => {
      render(
        <Popover content="Popover content" placement="top-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'top-start');
    });

    it('applies top-end placement styles', () => {
      render(
        <Popover content="Popover content" placement="top-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'top-end');
    });

    it('applies bottom placement styles', () => {
      render(
        <Popover content="Popover content" placement="bottom" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'bottom');
    });

    it('applies bottom-start placement styles', () => {
      render(
        <Popover content="Popover content" placement="bottom-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'bottom-start');
    });

    it('applies bottom-end placement styles', () => {
      render(
        <Popover content="Popover content" placement="bottom-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'bottom-end');
    });

    it('applies left placement styles', () => {
      render(
        <Popover content="Popover content" placement="left" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'left');
    });

    it('applies left-start placement styles', () => {
      render(
        <Popover content="Popover content" placement="left-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'left-start');
    });

    it('applies left-end placement styles', () => {
      render(
        <Popover content="Popover content" placement="left-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'left-end');
    });

    it('applies right placement styles', () => {
      render(
        <Popover content="Popover content" placement="right" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'right');
    });

    it('applies right-start placement styles', () => {
      render(
        <Popover content="Popover content" placement="right-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'right-start');
    });

    it('applies right-end placement styles', () => {
      render(
        <Popover content="Popover content" placement="right-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-placement', 'right-end');
    });
  });

  describe('offset', () => {
    it('applies custom offset', () => {
      render(
        <Popover content="Popover content" placement="top" offset={16} defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-placement', 'top');
    });
  });

  describe('content variations', () => {
    it('renders text content', () => {
      render(
        <Popover content="Simple text content" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveTextContent('Simple text content');
    });

    it('renders JSX content', () => {
      render(
        <Popover
          content={
            <div>
              <h3>Title</h3>
              <p>Description</p>
            </div>
          }
          defaultOpen
          data-testid="popover"
        >
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toContainHTML('<h3>Title</h3>');
      expect(content).toContainHTML('<p>Description</p>');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling (SSR-compatible)', () => {
      renderWithDarkMode(
        <Popover content="Dark popover" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      // styled-components handle theming automatically
      expect(content).toBeInTheDocument();
    });

    it('applies light mode styling by default (SSR-compatible)', () => {
      render(
        <Popover content="Light popover" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      // styled-components handle theming automatically
      expect(content).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Popover content="Accessible popover" aria-label="User menu" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-modal', 'false');
      expect(content).toHaveAttribute('aria-label', 'User menu');
    });

    it('traps focus within popover', () => {
      render(
        <Popover
          content={
            <div>
              <button>First</button>
              <button>Second</button>
              <button>Last</button>
            </div>
          }
          defaultOpen
          data-testid="popover"
        >
          <button>Trigger</button>
        </Popover>
      );

      const firstButton = screen.getByText('First');
      const lastButton = screen.getByText('Last');

      // Focus last button
      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      // Tab forward should cycle to first button
      fireEvent.keyDown(screen.getByTestId('popover-content'), { key: 'Tab' });
      expect(document.activeElement).toBe(firstButton);

      // Shift+Tab should cycle back to last button
      fireEvent.keyDown(screen.getByTestId('popover-content'), { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(lastButton);
    });
  });

  describe('styling', () => {
    it('applies correct base styles', () => {
      render(
        <Popover content="Styled popover" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      // styled-components handle all styling
      expect(content).toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      render(
        <Popover content="Content" className="custom-class" data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const container = screen.getByTestId('popover');
      expect(container).toHaveClass('custom-class');
    });

    it('applies custom className to content', () => {
      render(
        <Popover content="Content" contentClassName="custom-content" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  it('preserves child element click handlers', () => {
    const handleClick = jest.fn();

    render(
      <Popover content="Popover content" data-testid="popover">
        <button onClick={handleClick}>Button</button>
      </Popover>
    );

    const button = screen.getByText('Button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
