import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Popover } from './Popover';
import { Button } from '../Button/Button';

describe('Popover Component', () => {
  it('renders trigger element and content', () => {
    render(
      <Popover content="Popover content" defaultOpen data-testid="popover">
        <Button>Click me</Button>
      </Popover>
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Popover content');
  });

  describe('Toggle behavior', () => {
    it('opens and closes popover on click', () => {
      render(
        <Popover content="Popover content" data-testid="popover">
          <Button>Click me</Button>
        </Popover>
      );

      const button = screen.getByText('Click me');

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  describe('Controlled state', () => {
    it('works as controlled component', () => {
      const handleOpenChange = jest.fn();
      const { rerender } = render(
        <Popover content="Controlled content" isOpen={false} onOpenChange={handleOpenChange} data-testid="popover">
          <Button>Click me</Button>
        </Popover>
      );

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Click me'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      rerender(
        <Popover content="Controlled content" isOpen={true} onOpenChange={handleOpenChange} data-testid="popover">
          <Button>Click me</Button>
        </Popover>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('Click outside and escape key', () => {
    it('closes popover when clicking outside', async () => {
      render(
        <div>
          <Popover content="Popover content" defaultOpen data-testid="popover">
            <Button>Click me</Button>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      });
    });

    it('does not close when closeOnClickOutside is false', async () => {
      render(
        <div>
          <Popover content="Popover content" defaultOpen closeOnClickOutside={false} data-testid="popover">
            <Button>Click me</Button>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      render(
        <Popover content="Popover content" defaultOpen data-testid="popover">
          <Button>Click me</Button>
        </Popover>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Placements', () => {
    it('applies placement classes', () => {
      const { rerender } = render(
        <Popover content="Popover content" placement="top" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      let content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('placement-top');

      rerender(
        <Popover content="Popover content" placement="bottom-start" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('placement-bottom-start');
    });

    it('applies custom offset', () => {
      render(
        <Popover content="Popover content" placement="top" offset={16} defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content.style.getPropertyValue('--popover-offset')).toBe('16px');
    });
  });

  describe('Content variations', () => {
    it('renders text and JSX content', () => {
      const { rerender } = render(
        <Popover content="Simple text content" defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      let content = screen.getByTestId('popover-content');
      expect(content).toHaveTextContent('Simple text content');

      rerender(
        <Popover content={<div><h3>Title</h3><p>Description</p></div>} defaultOpen data-testid="popover">
          <button>Button</button>
        </Popover>
      );

      content = screen.getByTestId('popover-content');
      expect(content).toContainHTML('<h3>Title</h3>');
      expect(content).toContainHTML('<p>Description</p>');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes and focus trap', () => {
      render(
        <Popover content={
          <div>
            <Button>First</Button>
            <Button>Second</Button>
            <Button>Last</Button>
          </div>
        } aria-label="User menu" defaultOpen data-testid="popover">
          <Button>Trigger</Button>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-modal', 'false');
      expect(content).toHaveAttribute('aria-label', 'User menu');

      const lastButton = screen.getByText('Last');
      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);
    });
  });

  describe('Styling', () => {
    it('applies custom classNames', () => {
      render(
        <Popover content="Content" className="custom-class" contentClassName="custom-content" defaultOpen data-testid="popover">
          <Button>Button</Button>
        </Popover>
      );

      const container = screen.getByTestId('popover');
      expect(container).toHaveClass('custom-class');

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

    fireEvent.click(screen.getByText('Button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
