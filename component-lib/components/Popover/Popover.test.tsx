import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import { Popover } from './Popover';
import { Button } from '../Button/Button';

describe('Popover Component', () => {
  it('renders trigger element', () => {
    render(
      <Popover content="Popover content" data-testid="popover">
        <Button>Click me</Button>
      </Popover>
    );

    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(
      <Popover content="Popover content" data-testid="popover">
        <Button>Click me</Button>
      </Popover>
    );

    const content = screen.queryByTestId('popover-content');
    expect(content).not.toBeInTheDocument();
  });

  it('shows content when defaultOpen is true', () => {
    render(
      <Popover content="Popover content" defaultOpen data-testid="popover">
        <Button>Click me</Button>
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
          <Button>Click me</Button>
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
          <Button>Click me</Button>
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
      const { rerender } = render(
        <Popover
          content="Controlled content"
          isOpen={false}
          onOpenChange={handleOpenChange}
          data-testid="popover"
        >
          <Button>Click me</Button>
        </Popover>
      );

      // Initially closed
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      // Click should call onOpenChange
      fireEvent.click(screen.getByText('Click me'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      // Manually control the state
      rerender(
        <Popover
          content="Controlled content"
          isOpen={true}
          onOpenChange={handleOpenChange}
          data-testid="popover"
        >
          <Button>Click me</Button>
        </Popover>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('click outside', () => {
    it('closes popover when clicking outside', async () => {
      render(
        <div>
          <Popover content="Popover content" defaultOpen data-testid="popover">
            <Button>Click me</Button>
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
            <Button>Click me</Button>
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
          <Button>Click me</Button>
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
          <Button>Click me</Button>
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
    it('applies top placement class', () => {
      render(
        <Popover content="Popover content" placement="top" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-top');
    });

    it('applies top-start placement class', () => {
      render(
        <Popover content="Popover content" placement="top-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-top-start');
    });

    it('applies top-end placement class', () => {
      render(
        <Popover content="Popover content" placement="top-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-top-end');
    });

    it('applies bottom placement class', () => {
      render(
        <Popover content="Popover content" placement="bottom" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-bottom');
    });

    it('applies bottom-start placement class', () => {
      render(
        <Popover content="Popover content" placement="bottom-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-bottom-start');
    });

    it('applies bottom-end placement class', () => {
      render(
        <Popover content="Popover content" placement="bottom-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-bottom-end');
    });

    it('applies left placement class', () => {
      render(
        <Popover content="Popover content" placement="left" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-left');
    });

    it('applies left-start placement class', () => {
      render(
        <Popover content="Popover content" placement="left-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-left-start');
    });

    it('applies left-end placement class', () => {
      render(
        <Popover content="Popover content" placement="left-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-left-end');
    });

    it('applies right placement class', () => {
      render(
        <Popover content="Popover content" placement="right" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-right');
    });

    it('applies right-start placement class', () => {
      render(
        <Popover content="Popover content" placement="right-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-right-start');
    });

    it('applies right-end placement class', () => {
      render(
        <Popover content="Popover content" placement="right-end" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'placement-right-end');
    });
  });

  describe('offset', () => {
    it('applies custom offset via CSS variable', () => {
      render(
        <Popover content="Popover content" placement="top" offset={16} defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content.style.getPropertyValue('--popover-offset')).toBe('16px');
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
    it('renders in dark mode context', () => {
      renderWithDarkMode(
        <Popover content="Dark popover" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('popover-content');
    });

    it('renders in light mode by default', () => {
      render(
        <Popover content="Light popover" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('popover-content');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Popover content="Accessible popover" aria-label="User menu" defaultOpen data-testid="popover">
          <Button>Button</Button>
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
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Last</Button>
            </div>
          }
          defaultOpen
          data-testid="popover"
        >
          <Button>Trigger</Button>
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
    it('applies correct base class', () => {
      render(
        <Popover content="Styled popover" defaultOpen data-testid="popover">
          <Button>Button</Button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content');
    });

    it('applies custom className to container', () => {
      render(
        <Popover content="Content" className="custom-class" data-testid="popover">
          <Button>Button</Button>
        </Popover>
      );

      const container = screen.getByTestId('popover');
      expect(container).toHaveClass('custom-class');
    });

    it('applies custom className to content', () => {
      render(
        <Popover content="Content" contentClassName="custom-content" defaultOpen data-testid="popover">
          <Button>Button</Button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('popover-content', 'custom-content');
    });
  });

  it('preserves child element click handlers', () => {
    const handleClick = jest.fn();

    render(
      <Popover content="Popover content" data-testid="popover">
        <Button onClick={handleClick}>Button</Button>
      </Popover>
    );

    const button = screen.getByText('Button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
